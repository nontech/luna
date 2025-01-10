"use client";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="relative isolate">
        {/* Hero section */}
        <div className="relative pt-14">
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Welcome to Project Luna
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Your platform for learning and teaching programming
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="http://localhost:8000/accounts/login/"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </a>
                  <a
                    href="http://localhost:8000/accounts/signup/"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Sign up <span aria-hidden="true">→</span>
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
