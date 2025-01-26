import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ActionButtonsProps {
  isSubmitted: boolean;
  isSaving: boolean;
  onSave: () => void;
  onSubmitClick: () => void;
  submissionStatus?: string;
}

export function ActionButtons({
  isSubmitted,
  isSaving,
  onSave,
  onSubmitClick,
  submissionStatus,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      {!isSubmitted && (
        <Button
          onClick={onSave}
          disabled={isSaving}
          variant="default"
        >
          {isSaving && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </Button>
      )}
      {!isSubmitted ? (
        <Button onClick={onSubmitClick} variant="secondary">
          Submit for Review
        </Button>
      ) : submissionStatus === "reviewed_by_teacher" ? (
        <Button disabled variant="secondary">
          Reviewed by Teacher
        </Button>
      ) : (
        <Button disabled variant="secondary">
          Waiting for Review
        </Button>
      )}
    </div>
  );
}
