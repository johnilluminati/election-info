import { HeaderLink } from "../../types"
import Navbar from "./Navbar"

const headerLinks: HeaderLink[] = [
  { text: 'Search Candidates', routerLink: '/candidates' },
  { text: 'Elections (Dropdown?)', routerLink: '/elections' },
  { text: `Parties' Stances`, routerLink: '/party-stances' },
]

const Header = () => {
  return (
    <header className="bg-white dark:bg-nav-bg-color border-b border-gray-200">
      <Navbar links={headerLinks} />
    </header>
  )
}

export default Header