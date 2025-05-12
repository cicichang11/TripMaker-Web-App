import { CalendarDays, Users, Plane, CreditCard, Vote, Map } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-emerald-600" />,
      title: "Group Management",
      description: "Create permanent or temporary groups with friends and family for your trips.",
    },
    {
      icon: <CalendarDays className="h-10 w-10 text-emerald-600" />,
      title: "Availability Coordination",
      description: "Find the perfect dates that work for everyone in your group.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-emerald-600" />,
      title: "Budget Planning",
      description: "Set shared budget parameters and individual budget limits.",
    },
    {
      icon: <Plane className="h-10 w-10 text-emerald-600" />,
      title: "Travel Options",
      description: "View personalized flight and hotel options for each group member.",
    },
    {
      icon: <Vote className="h-10 w-10 text-emerald-600" />,
      title: "Collaborative Decision-Making",
      description: "Vote on options, comment, and finalize plans together.",
    },
    {
      icon: <Map className="h-10 w-10 text-emerald-600" />,
      title: "Trip Optimization",
      description: "Our algorithm finds ideal date ranges based on everyone's availability and budget.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Everything you need to plan the perfect group trip
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 text-center">
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
