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

interface Test {
  id: string;
  name: string;
  test_type: "includes" | "exact";
  expected_output: string;
  help_text: string;
}

interface EditTestModalProps {
  test: Test;
  onTestUpdated?: () => void;
}

export default function EditTestModal({
  test,
  onTestUpdated,
}: EditTestModalProps) {
  const [open, setOpen] = useState(false);
  const [testName, setTestName] = useState(test.name);
  const [testType, setTestType] = useState<"includes" | "exact">(
    test.test_type
  );
  const [expectedOutput, setExpectedOutput] = useState(
    test.expected_output
  );
  const [helpText, setHelpText] = useState(test.help_text);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetchFromDjangoClient(
        `api/tests/${test.id}/update/`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: testName,
            test_type: testType,
            expected_output: expectedOutput,
            help_text: helpText,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ||
            `Failed to update test: ${response.statusText}`
        );
      }

      await response.json();
      setOpen(false);
      onTestUpdated?.();
    } catch (error) {
      console.error("Error updating test:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Test</DialogTitle>
          <DialogDescription>
            Make changes to your test configuration below.
          </DialogDescription>
        </DialogHeader>
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
                  <RadioGroupItem value="includes" id="includes" />
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
            <Label htmlFor="expected_output" className="text-right">
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
              placeholder="Enter help text to show when test fails (optional)"
              rows={3}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleUpdate}
            disabled={
              isUpdating || !testName.trim() || !expectedOutput.trim()
            }
          >
            {isUpdating ? "Updating..." : "Update Test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
