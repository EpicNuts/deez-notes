import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-6 text-4xl font-bold">Welcome to Deez Notes</h1>
      <p className="mb-8 text-lg text-gray-700">
        Organize your thoughts and ideas with ease.
      </p>
      <div className="flex space-x-4">
        <Link href="/notes">
          <a className="rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-blue-600">
            Go to Notes
          </a>
        </Link>
        <Link href="/about">
          <a className="rounded-md bg-gray-300 px-6 py-3 text-gray-800 hover:bg-gray-400">
            Learn More
          </a>
        </Link>
      </div>
    </div>
  );
}
