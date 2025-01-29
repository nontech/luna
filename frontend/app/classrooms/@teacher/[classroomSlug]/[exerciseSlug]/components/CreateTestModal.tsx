"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface CreateTestModalProps {
  exerciseId: string;
  onTestCreated?: () => void;
}

export default function CreateTestModal({
  exerciseId,
  onTestCreated,
}: CreateTestModalProps) {
  const [open, setOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [testType, setTestType] = useState<"includes" | "exact">(
    "includes"
  );
  const [expectedOutput, setExpectedOutput] = useState("");
  const [helpText, setHelpText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetchFromDjangoClient(
        `exercise/${exerciseId}/tests`,
        {
          method: "POST",
          body: JSON.stringify({
            name: testName,
            test_type: testType,
            expected_output: expectedOutput,
            help_text: helpText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create test");
      }

      setIsSuccess(true);

      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setTestName("");
        setTestType("includes");
        setExpectedOutput("");
        setHelpText("");
        onTestCreated?.();
      }, 1500);
    } catch (error) {
      console.error("Error creating test:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Test</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Test</DialogTitle>
          <DialogDescription>
            Create a test to verify student submissions. Click create
            when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {!isSuccess ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter test name"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <div className="col-span-3">
                  <RadioGroup
                    value={testType}
                    onValueChange={(value) =>
                      setTestType(value as "includes" | "exact")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="includes"
                        id="includes"
                      />
                      <Label htmlFor="includes">
                        Output includes expected output
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exact" id="exact" />
                      <Label htmlFor="exact">
                        Output matches expected output exactly
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="expected_output"
                  className="text-right"
                >
                  Expected Output
                </Label>
                <Textarea
                  id="expected_output"
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter expected output"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="help_text" className="text-right">
                  Help Text
                </Label>
                <Textarea
                  id="help_text"
                  value={helpText}
                  onChange={(e) => setHelpText(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter help text to show when test fails"
                  rows={3}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreate}
                disabled={
                  isCreating ||
                  !testName.trim() ||
                  !expectedOutput.trim() ||
                  !helpText.trim()
                }
              >
                {isCreating ? "Creating..." : "Create Test"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center text-green-600">
            <p className="text-lg font-semibold">
              Test Created Successfully!
            </p>
            <p className="mt-2">Closing...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
