export default function FeaturesPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Features</h1>
      <p className="mb-6">TripMaker offers a comprehensive set of features to make group travel planning easy:</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Group Management</h2>
          <p>Create and manage groups for different travel companions.</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Trip Planning</h2>
          <p>Plan trips with detailed itineraries and shared resources.</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Budget Tracking</h2>
          <p>Set budgets and track expenses for the entire group.</p>
        </div>
      </div>
    </div>
  )
}
