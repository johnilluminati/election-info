import { Link } from "react-router-dom"
import { HeaderLink } from "../../types"
import { FaMagnifyingGlass } from "react-icons/fa6"
import DarkModeToggle from "./DarkModeToggle"

const Navbar = ({ links }: { links: HeaderLink[] }) => {
  // Separate links by alignment
  const leftLinks = links.filter(link => link.alignment === 'left');
  const rightLinks = links.filter(link => link.alignment === 'right');

  return (
    <div className="container mx-auto flex h-16 items-center gap-8">
      <Link to="/" className="flex items-center justify-center text-blue-500 dark:text-white">
        <FaMagnifyingGlass className="text-2xl" />
        <span className="flex md_block vertical text-2xl font-semibold ml-2">VoteWise</span>
      </Link>

      <div className="flex flex-1 items-center justify-end md:justify-between">
        <nav aria-label="Global" className="hidden md:block">
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
    </div>
  )
}

export default Navbar