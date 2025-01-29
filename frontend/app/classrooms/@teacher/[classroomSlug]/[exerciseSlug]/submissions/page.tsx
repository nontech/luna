"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import {
  runPythonCodeWithTests,
  OutputItem,
  setOutputCallback,
} from "@/services/pyodide";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface Test {
  id: string;
  name: string;
  test_type: "includes" | "exact";
  expected_output: string;
  help_text: string;
}

interface Exercise {
  id: string;
  name: string;
  instructions: string;
  code: string;
  creator: {
    id: number;
    username: string;
    full_name: string;
  };
}

interface Submission {
  id: string;
  student: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    date_joined: string;
    last_login: string | null;
  };
  exercise_id: string;
  status: string;
  submitted_code: string;
  feedback: string;
  created_at: string;
  updated_at: string;
}

function OutputDisplay({ items }: { items: OutputItem[] }) {
  return (
    <div className="space-y-2 font-mono text-sm">
      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          <pre className="whitespace-pre-wrap break-words">
            {item.content}
          </pre>
        </div>
      ))}
    </div>
  );
}

function TestList({ tests }: { tests: Test[] }) {
  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <div key={test.id} className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">{test.name}</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>Type: {test.test_type}</p>
            <p>Expected Output: {test.expected_output}</p>
            {test.help_text && <p>Help: {test.help_text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SubmissionsPage() {
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("id");

  // State
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [feedback, setFeedback] = useState("");
  const [outputItems, setOutputItems] = useState<OutputItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch exercise details
  useEffect(() => {
    async function fetchExercise() {
      if (!exerciseId) return;

      try {
        const response = await fetchFromDjangoClient(
          `exercise/${exerciseId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exercise");
        }

        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error("Error fetching exercise:", error);
      }
    }

    fetchExercise();
  }, [exerciseId]);

  // Fetch submissions
  useEffect(() => {
    async function fetchSubmissions() {
      if (!exerciseId) return;

      try {
        const response = await fetchFromDjangoClient(
          `exercise/${exerciseId}/submissions`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }

        const data = await response.json();
        setSubmissions(data.submissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    }

    fetchSubmissions();
  }, [exerciseId]);

  // Fetch tests
  useEffect(() => {
    async function fetchTests() {
      if (!exerciseId) return;

      try {
        const response = await fetchFromDjangoClient(
          `exercise/${exerciseId}/tests`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await response.json();
        setTests(data.tests);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    }

    fetchTests();
  }, [exerciseId]);

  // Set up output callback
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

  const handleRunCode = async (code: string) => {
    if (isRunning) return;

    setIsRunning(true);
    setOutputItems([]); // Clear previous output

    try {
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

  const handleSaveFeedback = async () => {
    if (isSaving || !selectedSubmission) return;

    setIsSaving(true);

    try {
      const response = await fetchFromDjangoClient(
        `submission/${selectedSubmission.id}/update`,
        {
          method: "PUT",
          body: JSON.stringify({
            feedback,
            status: "reviewed_by_teacher",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save feedback");
      }

      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id
            ? { ...sub, feedback, status: "reviewed_by_teacher" }
            : sub
        )
      );
    } catch (error) {
      console.error("Error saving feedback:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{exercise.name}</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Student Submissions */}
        <div className="col-span-3">
          <Card className="sticky top-6 h-[calc(100vh-8rem)]">
            <CardHeader>
              <CardTitle>Student Submissions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="divide-y">
                  {submissions.map((submission) => (
                    <button
                      key={submission.id}
                      className={`w-full text-left p-4 hover:bg-muted transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setFeedback(submission.feedback);
                        setOutputItems([]);
                      }}
                    >
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            {submission.student.email || "No Email"}
                          </div>
                        </div>
                        <div className="text-xs space-y-1 text-muted-foreground">
                          <div>
                            Username: {submission.student.username}
                          </div>

                          <div>
                            Submitted:{" "}
                            {new Date(
                              submission.created_at
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Content */}
        <div className="col-span-9 space-y-6">
          {/* Exercise Details */}
          <div className="grid grid-cols-2 gap-6">
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
            <Card>
              <CardHeader>
                <CardTitle>Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <TestList tests={tests} />
              </CardContent>
            </Card>
          </div>

          {selectedSubmission ? (
            <>
              {/* Code and Output */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Submitted Code</CardTitle>
                    <Button
                      onClick={() =>
                        handleRunCode(
                          selectedSubmission.submitted_code
                        )
                      }
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
                    <div className="h-[400px]">
                      <CodeEditor
                        initialCode={
                          selectedSubmission.submitted_code
                        }
                        readOnly={true}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] bg-muted p-4 rounded-md overflow-auto">
                      <OutputDisplay items={outputItems} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feedback */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Feedback</CardTitle>
                  <Button
                    onClick={handleSaveFeedback}
                    disabled={isSaving}
                    size="sm"
                  >
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSaving ? "Saving..." : "Save Feedback"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[150px]"
                    placeholder="Write your feedback here..."
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Select a submission to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
