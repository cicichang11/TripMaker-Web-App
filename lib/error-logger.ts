export function logError(error: unknown, context?: string) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  console.error(`[${context || "ERROR"}]`, errorMessage)
  if (errorStack) {
    console.error(errorStack)
  }

  // In a production app, you might want to send this to a logging service
  // like Sentry, LogRocket, etc.
}
