"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  runPythonCodeWithTests,
  OutputItem,
  setOutputCallback,
} from "@/services/pyodide";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ActionButtons,
  ExerciseCodeEditor,
  OutputDisplay,
  SubmitModal,
} from "./components";

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
  feedback?: string;
  created_at: string;
  updated_at: string;
}

interface Test {
  id: string;
  name: string;
  test_type: "includes" | "exact";
  expected_output: string;
  help_text: string;
}

export default function StudentExercisePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("id");

  // States
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      if (!exerciseId) return;

      try {
        const [exerciseRes, testsRes, submissionRes] =
          await Promise.all([
            fetch(`/api/exercise/${exerciseId}`),
            fetch(`/api/exercise/${exerciseId}/tests`),
            fetch(`/api/exercise/${exerciseId}/submission`),
          ]);

        if (!exerciseRes.ok)
          throw new Error("Failed to fetch exercise");

        const exerciseData = await exerciseRes.json();
        setExercise(exerciseData);

        if (testsRes.ok) {
          const { tests: testsData } = await testsRes.json();
          setTests(testsData);
        }

        if (submissionRes.ok) {
          const submissionData = await submissionRes.json();
          setSubmission(submissionData);
          setCode(submissionData?.submitted_code || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
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
    return () => setOutputCallback(null);
  }, []);

  const handleSave = async () => {
    if (isSaving || !exercise) return;
    setIsSaving(true);

    try {
      // Create new submission if none exists
      if (!submission) {
        const response = await fetch(
          `/api/exercise/${exercise.id}/create-submission`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok)
          throw new Error("Failed to create submission");
        const data = await response.json();
        setSubmission(data);
        return;
      }

      // Update existing submission with status assigned_to_student
      const response = await fetch(
        `/api/submission/${submission.id}/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            status: "assigned_to_student",
          }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to update submission");
      const data = await response.json();
      setSubmission(data);
    } catch (error) {
      console.error("Error saving code:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunCode = async () => {
    if (isRunning || !exercise) return;
    setIsRunning(true);
    setOutputItems([]);

    try {
      const result = await runPythonCodeWithTests(code, tests);
      if (tests.length > 0) {
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
          { type: "output", content: testResults },
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

  const handleSubmitForReview = async () => {
    if (!submission || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // First save the latest code and update status
      const response = await fetch(
        `/api/submission/${submission.id}/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            status: "submitted_by_student",
          }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to submit for review");

      const data = await response.json();
      setSubmission(data);
      setShowSubmitModal(false);
    } catch (error) {
      console.error("Error submitting for review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exercise) return null;

  const isSubmitted =
    submission?.status === "submitted_by_student" ||
    submission?.status === "reviewed_by_teacher";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{exercise.name}</h1>
        <ActionButtons
          isSubmitted={isSubmitted}
          isSaving={isSaving}
          onSave={handleSave}
          onSubmitClick={() => setShowSubmitModal(true)}
          submissionStatus={submission?.status}
        />
      </div>

      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitForReview}
        isSubmitting={isSubmitting}
      />

      {submission?.status === "reviewed_by_teacher" && (
        <Card>
          <CardHeader>
            <CardTitle>Teacher's Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {submission.feedback ? (
                submission.feedback
              ) : (
                <p className="text-muted-foreground">
                  No specific feedback given by the teacher. This
                  usually means everything went well. You completed
                  the exercise successfully.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6 order-1 lg:order-1">
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

          <ExerciseCodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRunCode}
            isRunning={isRunning}
            isSubmitted={isSubmitted}
          />
        </div>

        <div className="space-y-6 order-2 lg:order-2">
          <Card>
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

          <Card>
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
