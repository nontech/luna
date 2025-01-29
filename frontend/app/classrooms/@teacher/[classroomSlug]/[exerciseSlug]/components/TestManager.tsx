import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CreateTestModal from "./CreateTestModal";

interface Test {
  id: string;
  name: string;
  test_type: "includes" | "exact";
  expected_output: string;
  help_text: string;
  created_at: string;
  updated_at: string;
}

export function TestManager({ exerciseId }: { exerciseId: string }) {
  const [tests, setTests] = useState<Test[]>([]);

  const fetchTests = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/exercise/${exerciseId}/tests`
      );
      if (response.ok) {
        const data = await response.json();
        setTests(data.tests);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  }, [exerciseId]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tests</h2>
        <CreateTestModal
          exerciseId={exerciseId}
          onTestCreated={fetchTests}
        />
      </div>

      {/* Display existing tests */}
      <div className="space-y-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="border p-4 rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{test.name}</h3>
                <p className="text-sm text-gray-500">
                  Type: {test.test_type}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement edit functionality
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement delete functionality
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div>
                <h4 className="font-medium">Expected Output</h4>
                <pre className="bg-gray-50 p-2 rounded mt-1 text-sm">
                  {test.expected_output}
                </pre>
              </div>
              <div>
                <h4 className="font-medium">Help Text</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {test.help_text}
                </p>
              </div>
            </div>
          </div>
        ))}
        {tests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tests created yet. Click &quot;Create Test&quot; to add
            one.
          </div>
        )}
      </div>
    </div>
  );
}
