"use client";

import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="relative isolate">
        {/* Hero section */}
        <div className="relative pt-14">
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <div className="flex justify-center mb-12">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        <Image
                          src="/logo.png"
                          alt="Luna Logo"
                          width={48}
                          height={48}
                        />
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      Luna
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl tracking-tight text-gray-900 sm:text-6xl max-w-4xl mx-auto leading-tight">
                  The Modern Platform for Python Education
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                  Create, teach and learn Python programming with
                  interactive exercises and instant feedback. Perfect
                  for both educators and students.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 text-left">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-900">
                      For Teachers
                    </h3>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      <li>Create custom Python exercises</li>
                      <li>Manage classrooms easily</li>
                      <li>Automated grading & feedback</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-900">
                      For Students
                    </h3>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      <li>Code directly in your browser</li>
                      <li>Get instant feedback</li>
                      <li>Learn at your own pace</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="http://localhost:8000/signup/"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Create Account
                  </a>
                  <a
                    href="http://localhost:8000/accounts/login/"
                    className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
