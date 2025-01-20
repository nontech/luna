// We need to declare the loadPyodide function that will be available globally
declare global {
  interface Window {
    loadPyodide: any;
  }
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
    // Then, we get the dict() function from the pyodide object as a javascript function
    const namespace = pyodide.globals.get("dict")();

    // Capture output in a list
    await pyodide.runPythonAsync(`
import sys
from io import StringIO
output_buffer = StringIO()
sys.stdout = output_buffer
sys.stderr = output_buffer
    `);

    // Run the user's code
    await pyodide.runPythonAsync(code, { globals: namespace });

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
