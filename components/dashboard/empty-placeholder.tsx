import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarPlus } from "lucide-react"

interface EmptyPlaceholderProps {
  title: string
  description: string
  buttonText?: string
  buttonLink?: string
}

export function EmptyPlaceholder({ title, description, buttonText, buttonLink }: EmptyPlaceholderProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <CalendarPlus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {buttonText && buttonLink && (
          <Link href={buttonLink} className="mt-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700">{buttonText}</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
