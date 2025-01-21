// We need to declare the loadPyodide function that will be available globally
declare global {
  interface Window {
    loadPyodide: () => Promise<any>;
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

let pyodide: any = null;

export async function runPythonCode(
  code: string
): Promise<{ output: string; error?: string }> {
  try {
    // Initialize Pyodide if it hasn't been initialized yet
    if (!pyodide) {
      pyodide = await window.loadPyodide();
    }

    // Get the dictionary that will hold the variables and functions created by the user's code in the editor
    const namespace = pyodide.globals.get("dict")();

    // Capture output in a list
    await pyodide.runPythonAsync(`
import sys
from io import StringIO
import traceback

output_buffer = StringIO()
sys.stdout = output_buffer
sys.stderr = output_buffer

def format_error(error_type, error_msg, tb):
    lines = []
    for line in traceback.format_exception(error_type, error_msg, tb):
        if "pyodide.js" not in line and "<exec>" in line:
            # Clean up the file name in the traceback
            line = line.replace("File \"<exec>\",", "Line")
        lines.append(line)
    return ''.join(lines)
    `);

    // Run the user's code
    try {
      await pyodide.runPythonAsync(code, { globals: namespace });
    } catch (e: any) {
      // Get Python's formatted error message
      const errorMsg = await pyodide.runPythonAsync(`
error_type = sys.exc_info()[0]
error_msg = sys.exc_info()[1]
tb = sys.exc_info()[2]
format_error(error_type, error_msg, tb)
      `);
      throw new Error(errorMsg);
    }

    // Get the captured output
    const output = await pyodide.runPythonAsync(`
output_buffer.getvalue()
    `);

    // Restore stdout and stderr
    await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
    `);

    console.log("Python execution completed, output:", output);
    return { output: output || "" };
  } catch (error: any) {
    console.error("Pyodide error:", error);
    return {
      output: "",
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while running the code",
    };
  } finally {
    // Clean up
    try {
      await pyodide.runPythonAsync(`
del output_buffer
      `);
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }
}

export async function runPythonCodeWithTests(
  code: string,
  tests: Test[]
): Promise<{ output: string; testResults: TestResult[] }> {
  const { output, error } = await runPythonCode(code);

  if (error) {
    // If there's an error, mark all tests as failed
    return {
      output: error,
      testResults: tests.map((test) => ({
        name: test.name,
        passed: false,
        feedback: `Code execution failed: ${error}`,
      })),
    };
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
