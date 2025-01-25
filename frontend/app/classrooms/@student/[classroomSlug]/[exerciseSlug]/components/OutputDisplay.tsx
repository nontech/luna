import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OutputItem, provideInput } from "@/services/pyodide";

export function OutputDisplay({ items }: { items: OutputItem[] }) {
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
