// We need to declare the loadPyodide function that will be available globally
declare global {
  interface Window {
    loadPyodide: () => Promise<{
      runPython: (code: string) => any;
      runPythonAsync: (code: string) => Promise<any>;
      globals: {
        set: (name: string, value: any) => void;
        delete: (name: string) => void;
        has: (name: string) => boolean;
      };
      loadPackage: (names: string | string[]) => Promise<void>;
      loadPackagesFromImports: (code: string) => Promise<void>;
      isPyProxy: (obj: any) => boolean;
    }>;
  }
}

interface Test {
  id: string;
  name: string;
  test_type: "includes" | "exact";
  expected_output: string;
  help_text: string;
}

interface TestResult {
  name: string;
  passed: boolean;
  feedback: string;
}

export interface OutputItem {
  type: "output" | "input-required";
  content: string;
  id?: string;
}

// Step 1: State Management
// Stores callbacks for pending input requests
// Keeps track of which input request corresponds to which response, allowing multiple input requests to be handled correctly.
let pendingInputResolvers: Map<string, (value: string) => void> =
  new Map();
// Callback to update UI with output/input prompts
let outputCallback: ((item: OutputItem) => void) | null = null;
// Pyodide instance
let pyodide: any = null;

// When the user types their response (input) & submits in the UI, this function is called
export function provideInput(id: string, value: string) {
  console.log("provideInput called with:", { id, value });
  // Get the resolver function we stored earlier
  const resolver = pendingInputResolvers.get(id);
  if (resolver) {
    console.log("Resolver found for input, calling with value");
    // Calling the resolver completes the Promise with the input value
    resolver(value);
    // Delete the resolver from the map
    pendingInputResolvers.delete(id);
  } else {
    console.log("No resolver found for input id:", id);
  }
}

// This function is called by the useEffect in the component that mounts
export function setOutputCallback(
  callback: ((item: OutputItem) => void) | null
) {
  outputCallback = callback;
}

// When Python code calls input(), it triggers this custom createInputFunction which creates a new Promise
// The _input_func inside Python code setup calls createInputFunction, where the Promise and resolver are created
// _input_func
async function createInputFunction(prompt: string): Promise<string> {
  console.log("createInputFunction called with prompt:", prompt);
  // Generate unique ID for input
  const inputId = Math.random().toString(36).substring(7);

  // Uses the callback we stored earlier
  if (outputCallback) {
    console.log("Calling outputCallback with input-required");

    // # Let's say we have the following Python code:
    //   name = input("What's your name? ")
    // Then, it calls this callback with type: "input-required", which tells the UI we need input
    outputCallback({
      type: "input-required",
      content: prompt, // e.g., "What's your name?"
      id: inputId,
    });
  } else {
    console.log("No outputCallback available!");
  }

  // This Promise will wait until the user provides input
  return new Promise((resolve) => {
    console.log("Setting up input resolver for id:", inputId);
    // The 'resolve' parameter is a function provided by the Promise constructor
    // The resolve function is stored in pendingInputResolvers with the inputId
    pendingInputResolvers.set(inputId, resolve);
  });
}

// Responsible for executing Python code in the browser using Pyodide
export async function runPythonCode(
  code: string
): Promise<{ output: string; error?: string }> {
  try {
    // 1. Load Pyodide (first time only)
    if (!pyodide) {
      pyodide = await window.loadPyodide();
      console.log("Pyodide loaded:", pyodide);
      console.log(
        "Available Pyodide properties:",
        Object.keys(pyodide)
      );
    }

    // Create a promise that will resolve when input is provided
    let inputResolved = false;
    const inputPromise = new Promise<void>((resolve) => {
      // Store the original callback
      const originalCallback = outputCallback;
      // Set up the new callback
      outputCallback = (item: OutputItem) => {
        // Call the original callback
        if (originalCallback) originalCallback(item);
        // If the item is an input-required item, we need to resolve the input promise
        if (item.type === "input-required") {
          // Get the original resolver for the input
          const originalResolver = pendingInputResolvers.get(
            item.id!
          );
          if (originalResolver) {
            // Set up a new resolver for the input
            pendingInputResolvers.set(
              item.id!,
              async (value: string) => {
                originalResolver(value);
                inputResolved = true;
                resolve();
              }
            );
          }
        }
      };
    });

    // 2. Set up input/output bridges between Python and JavaScript

    // Set up JS output handling function that Python can call
    // Handles Python print statements
    pyodide.globals.set("_outputCallback", (text: string) => {
      // This is the callback that updates the UI with the output
      // This is our stored setOutputItems function from [exerciseSlug]/page.tsx
      if (outputCallback) {
        // Calls the callback with an object with type: "output" and content: text
        outputCallback({
          type: "output",
          content: text,
        });
      } else {
        console.log("No JS outputCallback available!");
      }
    });

    // Set up JS input handling function that Python can call
    pyodide.globals.set("_input_func", async (prompt: string) => {
      // Handles Python input() calls
      // Create input function
      const result = await createInputFunction(prompt);
      return result;
    });

    // 3. Set up Python environment with our custom input and output handling functions created earlier

    // When Python code does this:
    // name = input("What's your name? ")
    // # The following happens:
    // # 1. sync_input is called
    // # 2. async_input is called
    // # 3. Prompt is written to stdout (appears in UI via _outputCallback)
    // # 4. _input_func is called (JavaScript shows input field)
    // # 5. User types "Alice" and submits in JS UI
    // # 6. "Alice" is written to stdout
    // # 7. "Alice" is returned to the Python code
    await pyodide.runPythonAsync(`
import sys
from io import StringIO
import traceback
import asyncio

# Store original stdout/stderr
_original_stdout = sys.stdout
_original_stderr = sys.stderr

# Custom IO class that inherits from StringIO
# Sends output to JavaScript, when Python tries to print or write output
class CallbackIO(StringIO):
    def write(self, text):
        # Don't use print for debugging as it causes recursion
        if text and not text.startswith('<'):
            try:
                # Send output to JavaScript
                # Calls _outputCallback (the JavaScript function we set up earlier)
                _outputCallback(text)  
                self.flush()
            except Exception as e:
                _original_stderr.write(f"Error in CallbackIO.write: {str(e)}\\n")
        # Returns text length as required by IO protocol
        return len(text)

    def flush(self):
        try:
            super().flush()
        except Exception as e:
            _original_stderr.write(f"Error in CallbackIO.flush: {str(e)}\\n")

try:
    # Creates an instance of our custom IO handler
    output_buffer = CallbackIO()
    # Redirects both stdout and stderr to our handler
    sys.stdout = output_buffer
    sys.stderr = output_buffer
except Exception as e:
    _original_stderr.write(f"Error setting up IO: {str(e)}\\n")
    raise

# Handles asynchronous input requests, when Python code calls input()
async def async_input(prompt=""):
    try:
        # Write prompt to stdout
        sys.stdout.write(prompt)
        sys.stdout.flush()
        
        # Get input value from the JavaScript function we set up earlier
        value = await _input_func('')
        
        if value is not None:
            # Echo the input value back to output
            sys.stdout.write(str(value) + '\\n')
            sys.stdout.flush()
            return str(value)
        return ""
    except Exception as e:
        _original_stderr.write(f"Error in async_input: {str(e)}\\n")
        raise

# We replace Python's built-in input() function with this custom version that allows Python to use input() normally
# Wraps the async input function to make it synchronous
def sync_input(prompt=""):
    try:
        # Get the event loop
        loop = asyncio.get_event_loop()
        # Run the async function to completion
        coro = async_input(prompt)
        result = loop.run_until_complete(coro)
        return result
    except Exception as e:
        _original_stderr.write(f"Error in sync_input: {str(e)}\\n")
        raise

# Replaces Python's built-in input() function with our custom version
input = sync_input
    `);

    // Indent the code to make it easier to read

    // # User's original code
    // print("Hello")
    // name = input("Name? ")
    // print(f"Hi {name}")

    // # After indentation
    //         print("Hello")
    //         name = input("Name? ")
    //         print(f"Hi {name}")
    const indentedCode = code
      .split("\n")
      .map((line) => (line.trim() ? "        " + line : line))
      .join("\n");

    // 4. Prepare user code
    // Wrap user code in an async function
    const wrappedCode = `
async def __run_code():
    # Makes our custom input function available to the user's code
    global input
    try:
# User's indented code goes here
${indentedCode}
    except Exception as e:
        _original_stderr.write(f"Error in user code: {str(e)}\\n")
        raise
`;
    // 5. First Call: Define the function
    await pyodide.runPythonAsync(wrappedCode);

    console.log("Running user code...");
    try {
      // 6. Second Call: Execute the function meaning run the user's code
      const runCodePromise = pyodide.runPythonAsync(
        "await __run_code()"
      );

      // Wait for either the code to finish or input to be resolved
      await Promise.race([runCodePromise, inputPromise]);

      // If input was resolved, wait for the code to finish
      if (inputResolved) {
        await runCodePromise;
      }

      // Get the captured output
      const output = await pyodide.runPythonAsync(
        "output_buffer.getvalue()"
      );
      console.log("Captured output:", output);

      // Make sure the final output is displayed
      if (outputCallback && output.trim()) {
        console.log("Processing output:", output);
        outputCallback({
          type: "output",
          content: output,
        });
      }

      return { output: output || "" };
    } catch (error: any) {
      console.error("Error during code execution:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Detailed error information:", {
      error,
      pyodideState: pyodide
        ? {
            globals: pyodide.globals
              ? Object.keys(pyodide.globals)
              : [],
          }
        : "Not initialized",
    });
    return {
      output: "",
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while running the code",
    };
  }
}

export async function runPythonCodeWithTests(
  code: string,
  tests: Test[]
): Promise<{ output: string; testResults: TestResult[] }> {
  // Run the code
  const { output, error } = await runPythonCode(code);

  // If there's an error, mark all tests as failed
  if (error) {
    return {
      output: error,
      testResults: tests.map((test) => ({
        name: test.name,
        passed: false,
        feedback: `Code execution failed: ${error}`,
      })),
    };
  }

  // Shows the code's output in the UI if not already displayed
  if (outputCallback && output.trim()) {
    outputCallback({
      type: "output",
      content: output,
    });
  }

  // Run tests
  const testResults = tests.map((test) => {
    let passed = false;
    if (test.test_type === "includes") {
      passed = output.includes(test.expected_output);
    } else if (test.test_type === "exact") {
      passed = output.trim() === test.expected_output.trim();
    }

    return {
      name: test.name,
      passed,
      feedback: passed ? "Test passed!" : test.help_text,
    };
  });

  return {
    output,
    testResults,
  };
}
