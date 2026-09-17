import Link from "next/link";
import { FaBriefcase, FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FaBriefcase className="text-lg" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ApplyThisJobs
          </span>
        </Link>

        {/* Header Action / Search Link */}
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <FaSearch className="text-xs" />
            <span>Browse Jobs</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
