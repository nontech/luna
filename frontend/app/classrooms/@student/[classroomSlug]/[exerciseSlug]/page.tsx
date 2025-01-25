"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import {
  runPythonCode,
  runPythonCodeWithTests,
  OutputItem,
  setOutputCallback,
  provideInput,
} from "@/services/pyodide";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  instructions: string;
  creator: {
    id: number;
    full_name: string;
    username: string;
  };
}

interface Submission {
  id: string;
  submitted_code: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Test {
  id: string;
  name: string;
  test_type: string;
  expected_output: string;
  help_text: string;
}

function OutputDisplay({ items }: { items: OutputItem[] }) {
  const [inputValues, setInputValues] = useState<
    Record<string, string>
  >({});

  const handleInputSubmit = (id: string) => {
    const value = inputValues[id];
    if (value !== undefined) {
      provideInput(id, value);
      setInputValues((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className="space-y-2 font-mono text-sm">
      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          {item.type === "output" ? (
            <pre className="whitespace-pre-wrap break-words">
              {item.content}
            </pre>
          ) : (
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

export default function StudentExercisePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("id");

  // Exercise data and form states
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(
    null
  );
  const [tests, setTests] = useState<Test[]>([]);
  const [code, setCode] = useState("");
  const [outputItems, setOutputItems] = useState<OutputItem[]>([]);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Fetch exercise details (name, instructions) and submission if exists
  useEffect(() => {
    async function fetchData() {
      if (!exerciseId) return;

      try {
        // Fetch exercise details
        const exerciseResponse = await fetch(
          `/api/exercise/${exerciseId}`,
          {
            credentials: "include",
          }
        );

        if (!exerciseResponse.ok) {
          throw new Error("Failed to fetch exercise");
        }

        const exerciseData = await exerciseResponse.json();
        setExercise(exerciseData);

        // Fetch tests for this exercise
        const testsResponse = await fetch(
          `/api/exercise/${exerciseId}/tests`
        );
        if (testsResponse.ok) {
          const { tests: testsData } = await testsResponse.json();
          setTests(testsData);
        }

        // Fetch submission for this exercise
        const submissionResponse = await fetch(
          `/api/exercise/${exerciseId}/submission`,
          {
            credentials: "include",
          }
        );

        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json();
          if (submissionData) {
            setSubmission(submissionData);
            setCode(submissionData.submitted_code || "");
          } else {
            // No submission exists yet
            setSubmission(null);
            setCode("");
          }
        } else {
          // Handle error
          console.error(
            "Error fetching submission:",
            submissionResponse.statusText
          );
          setCode("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [exerciseId]);

  useEffect(() => {
    const callback = (item: OutputItem | string) => {
      setOutputItems((prev) => [
        ...prev,
        typeof item === "string"
          ? { type: "output", content: item }
          : item,
      ]);
    };
    setOutputCallback(callback);
    return () => {
      setOutputCallback(null);
    };
  }, []);

  const handleSave = async () => {
    if (isSaving || !exercise) return;

    setIsSaving(true);

    try {
      let response;

      if (!submission) {
        // Create new submission
        response = await fetch(
          `/api/exercise/${exercise.id}/create-submission`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );
      } else {
        // Update existing submission
        response = await fetch(
          `/api/submission/${submission.id}/update`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save submission");
      }

      const data = await response.json();
      setSubmission(data);
    } catch (error) {
      console.error("Error saving submission:", error);
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

  if (!exercise) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{exercise.name}</h1>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="default"
        >
          {isSaving && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isSaving ? "Saving..." : "Save Solution"}
        </Button>
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
              <div className="prose max-w-none">
                {exercise.instructions}
              </div>
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
              <div className="min-h-[1200px]">
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
          {/* Test Results Card */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle>Tests</CardTitle>
            </CardHeader>
            <CardContent>
              {tests.length > 0 ? (
                <div className="space-y-4">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className="p-4 rounded-lg border"
                    >
                      <h3 className="font-medium mb-2">
                        {test.name}
                      </h3>
                      {test.help_text && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {test.help_text}
                        </p>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">
                          Expected:{" "}
                        </span>
                        <code className="bg-muted px-1 py-0.5 rounded">
                          {test.expected_output}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No tests available for this exercise.
                </div>
              )}
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
