import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";
import { Loader2 } from "lucide-react";

interface ExerciseCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  isRunning: boolean;
  isSubmitted: boolean;
}

export function ExerciseCodeEditor({
  code,
  onChange,
  onRun,
  isRunning,
  isSubmitted,
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
        <div>
          <CodeEditor
            initialCode={code}
            onChange={(newCode) => {
              if (!isSubmitted) {
                onChange(newCode);
              }
            }}
            readOnly={isSubmitted}
          />
        </div>
      </CardContent>
    </Card>
  );
}
