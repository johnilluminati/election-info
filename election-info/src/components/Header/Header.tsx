import { HeaderLink } from "../../types"
import Navbar from "./Navbar"

const headerLinks: HeaderLink[] = [
  { text: 'Search Candidates', routerLink: '/candidates' },
  { text: 'Search Elections', routerLink: '/elections' },
  { text: `Parties' Stances`, routerLink: '/party-stances' },
]

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-nav-bg-color border-b border-gray-200 shadow-sm">
      <Navbar links={headerLinks} />
    </header>
  )
}

export default Header