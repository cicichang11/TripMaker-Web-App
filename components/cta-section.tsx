import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50 dark:bg-emerald-950/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to plan your next adventure?
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Join TripMaker today and start planning your dream trips with friends and family.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
