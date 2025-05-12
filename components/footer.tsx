import Link from "next/link"
import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full py-6 bg-white dark:bg-gray-950 border-t">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-xl">TripMaker</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">Make this trip happen</p>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium">Product</h3>
            <Link
              href="/features"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              FAQ
            </Link>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium">Company</h3>
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Blog
            </Link>
            <Link
              href="/careers"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Careers
            </Link>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium">Legal</h3>
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Cookies
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between space-y-4 pt-8 mt-8 border-t md:flex-row md:space-y-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} TripMaker. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              <span className="sr-only">Twitter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              <span className="sr-only">Instagram</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              <span className="sr-only">Facebook</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
