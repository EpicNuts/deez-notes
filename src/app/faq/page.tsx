export default function FAQPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">What is Deez Notes?</h2>
          <p className="text-gray-700">
            Deez Notes is a simple and intuitive note-taking app designed to
            help you organize your thoughts and ideas.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">How do I create a new note?</h2>
          <p className="text-gray-700">
            To create a new note, click the "New Note" button in the sidebar.
            You must be logged in to create notes.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            Can I access my notes on multiple devices?
          </h2>
          <p className="text-gray-700">
            Yes, as long as you are logged in with the same account, your notes
            will be synced across all your devices.
          </p>
        </div>
      </div>
    </div>
  );
}
