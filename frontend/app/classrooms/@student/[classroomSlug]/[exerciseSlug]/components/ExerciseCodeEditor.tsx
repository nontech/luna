import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeEditor } from "@/app/components/CodeEditor";
import { Loader2 } from "lucide-react";

interface ExerciseCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  isRunning: boolean;
  isSubmitted: boolean;
  submissionId?: string;
}

export function ExerciseCodeEditor({
  code,
  onChange,
  onRun,
  isRunning,
  isSubmitted,
  submissionId,
}: ExerciseCodeEditorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Code Editor</CardTitle>
        <Button onClick={onRun} disabled={isRunning} size="sm">
          {isRunning && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isRunning ? "Running..." : "Run Code"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px]">
          <CodeEditor
            key={submissionId || "new"}
            initialCode={code}
            onChange={isSubmitted ? undefined : onChange}
            readOnly={isSubmitted}
          />
        </div>
      </CardContent>
    </Card>
  );
}
