export default function PricingPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>
      <p className="mb-6">TripMaker offers flexible pricing options to suit your needs:</p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Free</h2>
          <p className="text-3xl font-bold mb-4">$0</p>
          <ul className="space-y-2">
            <li>Basic trip planning</li>
            <li>Up to 3 groups</li>
            <li>Limited features</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6 bg-emerald-50 dark:bg-emerald-950/20">
          <h2 className="text-xl font-semibold mb-2">Premium</h2>
          <p className="text-3xl font-bold mb-4">$9.99/mo</p>
          <ul className="space-y-2">
            <li>Advanced trip planning</li>
            <li>Unlimited groups</li>
            <li>All features included</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Business</h2>
          <p className="text-3xl font-bold mb-4">$29.99/mo</p>
          <ul className="space-y-2">
            <li>Team management</li>
            <li>Business analytics</li>
            <li>Priority support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
