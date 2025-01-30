import { AlertCircle } from "lucide-react";
import { AuthButtons } from "@/app/components/AuthButtons";

export default function UnauthorizedMessage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          You need to be a registered student or teacher to access
          this page.
        </p>
        <div className="pt-4">
          <AuthButtons className="justify-center" />
        </div>
      </div>
    </div>
  );
}
