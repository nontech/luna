"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import {
  runPythonCode,
  runPythonCodeWithTests,
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

export default function TeacherExercisePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("id");

  // Exercise data and form states
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [instructions, setInstructions] = useState("");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function getExerciseDetails() {
      if (!exerciseId) return;

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
    }

    getExerciseDetails();
  }, [exerciseId]);

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
    console.log("Running code:", code);

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

      // Update output to show both code output and test results
      const outputText = [
        "Code Output:",
        result.output,
        "",
        "Test Results:",
        ...result.testResults.map(
          (test) =>
            `${test.name}: ${
              test.passed ? "✅ Passed" : "❌ Failed"
            }${!test.passed ? `\n   Help: ${test.feedback}` : ""}`
        ),
      ].join("\n");

      setOutput(outputText);
    } catch (error) {
      setOutput(
        error instanceof Error ? error.message : "Error running code"
      );
    } finally {
      setIsRunning(false);
    }
  };

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
          {isSaving ? "Saving..." : "Save Exercise"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
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

          {/* Output Card */}
          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap min-h-[100px]">
                {output || "Code output will appear here"}
              </div>
            </CardContent>
          </Card>

          {/* Test Manager Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <TestManager exerciseId={exercise.id} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
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
            <div className="h-[600px]">
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
    </div>
  );
}
