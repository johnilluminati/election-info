import { useState } from "react"
import { Link } from "react-router-dom"
import { HeaderLink } from "../../types"
import { FaMagnifyingGlass, FaBars } from "react-icons/fa6"
import { FaTimes } from "react-icons/fa"
import DarkModeToggle from "./DarkModeToggle"

const Navbar = ({ links }: { links: HeaderLink[] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Separate links by alignment
  const leftLinks = links.filter(link => link.alignment === 'left');
  const rightLinks = links.filter(link => link.alignment === 'right');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center justify-center text-blue-500 dark:text-white flex-shrink-0">
          <FaMagnifyingGlass className="text-2xl" />
          <span className="text-xl sm:text-2xl font-semibold ml-2">VoteWise</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 items-center justify-between ml-8">
          <nav aria-label="Global">
            <ul className="flex items-center gap-6 text-[1rem]">
              {leftLinks.map((item: HeaderLink, key: number) => {
                return (
                  <li key={key}>
                    <Link to={item.routerLink} className="text-gray-500 dark:text-white transition hover:text-gray-500/75 dark:hover:text-gray-300">
                      {item.text}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {rightLinks.map((item: HeaderLink, key: number) => {
              const isDonate = item.text === 'Donate';
              return (
                <Link 
                  key={key}
                  to={item.routerLink} 
                  className={isDonate 
                    ? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
                    : "text-gray-500 dark:text-white transition hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  }
                >
                  {item.text}
                </Link>
              );
            })}
            <DarkModeToggle />
          </div>
        </div>

        {/* Mobile: Hamburger button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white dark:bg-nav-bg-color">
          <div className="container mx-auto px-4 py-4">
            <nav aria-label="Mobile navigation">
              <ul className="space-y-4">
                {/* Left links */}
                {leftLinks.map((item: HeaderLink, key: number) => {
                  return (
                    <li key={key}>
                      <Link 
                        to={item.routerLink} 
                        onClick={closeMobileMenu}
                        className="block text-gray-500 dark:text-white transition hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2"
                      >
                        {item.text}
                      </Link>
                    </li>
                  )
                })}
                {/* Right links */}
                {rightLinks.map((item: HeaderLink, key: number) => {
                  const isDonate = item.text === 'Donate';
                  return (
                    <li key={key}>
                      <Link 
                        to={item.routerLink}
                        onClick={closeMobileMenu}
                        className={isDonate 
                          ? "block bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors font-medium text-center"
                          : "block text-gray-500 dark:text-white transition hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                        }
                      >
                        {item.text}
                      </Link>
                    </li>
                  );
                })}
                {/* Dark mode toggle */}
                <li className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-500 dark:text-white font-medium">Dark Mode</span>
                    <DarkModeToggle />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar