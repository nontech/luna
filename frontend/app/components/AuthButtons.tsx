import Link from "next/link";

interface AuthButtonProps {
  className?: string;
}

export function CreateAccountButton({
  className = "",
}: AuthButtonProps) {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_API_URL}/auth/signup/`}
      className={`rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
    >
      Create Account
    </Link>
  );
}

export function SignInButton({ className = "" }: AuthButtonProps) {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`}
      className={`rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${className}`}
    >
      Sign In
    </Link>
  );
}

// For cases where you need both buttons together
export function AuthButtons({ className = "" }: AuthButtonProps) {
  return (
    <div className={`flex items-center gap-x-6 ${className}`}>
      <CreateAccountButton />
      <SignInButton />
    </div>
  );
}
