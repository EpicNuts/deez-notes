import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Deez Notes</h1>
      <p className="text-lg text-gray-700 mb-8">
        Organize your thoughts and ideas with ease.
      </p>
      <div className="flex space-x-4">
        <Link href="/notes">
          <a className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Go to Notes
          </a>
        </Link>
        <Link href="/about">
          <a className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
            Learn More
          </a>
        </Link>
      </div>
    </div>
  );
}