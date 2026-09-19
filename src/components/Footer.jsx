import Link from "next/link";
import { FaBriefcase, FaEnvelope, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FaBriefcase className="text-sm" />
            </div>
            <span className="text-lg font-bold text-white">Fresher<span className="text-blue-400">Apply</span></span>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed">
            Discover handpicked fresher opportunities, tech job openings, and direct recruiter contact links.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors">
                All Jobs
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-blue-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-blue-400 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Policy (Compulsory for AdSense) */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal & Trust</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                <FaShieldAlt className="text-xs text-blue-500" />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Details */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center space-x-2">
              <FaEnvelope className="text-blue-500" />
              <a href="mailto:fresherapplyofficial@gmail.com" className="hover:text-blue-400 transition-colors">
                fresherapplyofficial@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {currentYear} FresherApply.com. All rights reserved.
      </div>
    </footer>
  );
}
