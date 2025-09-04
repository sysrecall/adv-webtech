import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-black text-xl font-bold hover:text-gray-700 transition-colors">
              Wrong Store
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/posters" 
                className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                POSTERS
              </Link>
              <Link 
                href="/frames" 
                className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                FRAMES
              </Link>
              <Link 
                href="/prints" 
                className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                EDITION PRINTS
              </Link>
              <Link 
                href="/artists" 
                className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                ARTISTS
              </Link>
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/search" 
              className="text-black hover:text-gray-700 text-sm font-medium transition-colors"
            >
              SEARCH
            </Link>
            <Link 
              href="/account" 
              className="text-black hover:text-gray-700 text-sm font-medium transition-colors"
            >
              
            </Link>
            <Link 
              href="admin/login" 
              className="text-black hover:text-gray-700 text-sm font-medium transition-colors"
            >
              LOGIN
            </Link>
            <Link 
              href="admin/register" 
              className="text-black hover:text-gray-700 text-sm font-medium transition-colors"
            >
              REGISTER
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-900 hover:text-black focus:outline-none focus:text-black">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
