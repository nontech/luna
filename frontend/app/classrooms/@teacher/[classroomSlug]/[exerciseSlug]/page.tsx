"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import {
  runPythonCodeWithTests,
  OutputItem,
  setOutputCallback,
  provideInput,
} from "@/services/pyodide";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { TestManager } from "./components/TestManager";

interface Exercise {
  id: string;
  name: string;
  instructions: string;
  code: string;
  output_instructions: string;
  creator: {
    id: number;
    full_name: string;
    username: string;
  };
}

function OutputDisplay({ items }: { items: OutputItem[] }) {
  // State to store user input values
  const [inputValues, setInputValues] = useState<
    Record<string, string>
  >({});

  // When the user types their input and clicks submit
  const handleInputSubmit = (id: string) => {
    const value = inputValues[id];
    if (value !== undefined) {
      // This will resolve the Promise we created earlier
      provideInput(id, value);
      // Clear the input field after submission
      setInputValues((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    // OutputDisplay component
    <div className="space-y-2 font-mono text-sm">
      {items.map((item, index) => (
        // For each item in the items array
        <div key={index} className="space-y-1">
          {item.type === "output" ? (
            // If the item is an output item
            <pre className="whitespace-pre-wrap break-words">
              {item.content}
            </pre>
          ) : (
            // If the item is an input item
            <div className="flex flex-col space-y-2 bg-gray-100 p-2 rounded">
              <div>{item.content}</div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValues[item.id!] || ""}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      [item.id!]: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleInputSubmit(item.id!);
                    }
                  }}
                  className="flex-1 px-2 py-1 border rounded"
                  placeholder="Enter your input..."
                />
                <Button
                  onClick={() => handleInputSubmit(item.id!)}
                  size="sm"
                  variant="secondary"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TeacherExercisePage() {
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("id");

  // Exercise data and form states
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [instructions, setInstructions] = useState("");
  const [code, setCode] = useState("");
  const [outputItems, setOutputItems] = useState<OutputItem[]>([]);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getExerciseDetails() {
      if (!exerciseId) return;
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/exercise/${exerciseId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Exercise not found"
              : "Failed to fetch exercise"
          );
        }

        const data = await response.json();
        setExercise(data);
        setInstructions(data.instructions);
        setCode(data.code);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    getExerciseDetails();
  }, [exerciseId]);

  // When the component mounts
  useEffect(() => {
    // This is the FIRST callback that gets created
    // It's a function that knows how to update the React component's state to display new output or input requests.
    // The actual value hasn't been called yet - it's just waiting to be used when Python code generates output or requests input
    const callback = (item: OutputItem | string) => {
      setOutputItems((prev) => [
        ...prev,
        // If item is a string, convert it to an OutputItem
        typeof item === "string"
          ? { type: "output", content: item }
          : item,
      ]);
    };
    // Store this callback in pyodide.ts
    setOutputCallback(callback);
    // Clean up the callback when the component unmounts
    return () => {
      setOutputCallback(null);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!exercise) {
    return null;
  }

  const handleSave = async () => {
    if (isSaving || !exercise) return;

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/exercise/${exercise.id}/update`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instructions,
            code,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save exercise");
      }

      const data = await response.json();
      // Update local state with saved data
      setExercise(data);
      setInstructions(data.instructions);
      setCode(data.code);
    } catch (error) {
      console.error("Error saving exercise:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunCode = async () => {
    if (isRunning || !exercise) return;

    setIsRunning(true);
    setOutputItems([]); // Clear previous output

    try {
      // Fetch tests for this exercise
      const testsResponse = await fetch(
        `/api/exercise/${exercise.id}/tests`
      );
      if (!testsResponse.ok) {
        throw new Error("Failed to fetch tests");
      }
      const { tests } = await testsResponse.json();

      // Run code with tests
      const result = await runPythonCodeWithTests(code, tests);

      // Only add test results if we have any
      if (tests && tests.length > 0) {
        const testResults = [
          "",
          "Test Results:",
          ...result.testResults.map(
            (test) =>
              `${test.name}: ${
                test.passed ? "✅ Passed" : "❌ Failed"
              }${!test.passed ? `\n   Help: ${test.feedback}` : ""}`
          ),
        ].join("\n");

        setOutputItems((prev) => [
          ...prev,
          {
            type: "output",
            content: testResults,
          },
        ]);
      }
    } catch (error) {
      setOutputItems((prev) => [
        ...prev,
        {
          type: "output",
          content:
            error instanceof Error
              ? error.message
              : "Error running code",
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{exercise.name}</h1>
        <div className="space-x-4">
          <Button
            onClick={() =>
              (window.location.href = `${window.location.pathname}/submissions?id=${exercise.id}`)
            }
            variant="secondary"
          >
            View Submissions
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="default"
          >
            {isSaving && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSaving ? "Saving..." : "Save Exercise"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6 order-1 lg:order-1">
          {/* Instructions Card*/}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="Write exercise instructions here..."
              />
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                size="sm"
              >
                {isRunning && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </CardHeader>
            <CardContent>
              <div>
                <CodeEditor
                  initialCode={code}
                  onChange={(newCode) => {
                    setCode(newCode);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 order-2 lg:order-2">
          {/* Test Manager Card */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle>Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <TestManager exerciseId={exercise.id} />
            </CardContent>
          </Card>

          {/* Output Card */}
          <Card className="order-4 lg:order-2">
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <OutputDisplay items={outputItems} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
