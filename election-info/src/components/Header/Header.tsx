import { HeaderLink } from "../../types"
import Navbar from "./Navbar"

const headerLinks: HeaderLink[] = [
  { text: 'Search Candidates', routerLink: '/candidates', alignment: 'left' },
  { text: 'Elections (Dropdown?)', routerLink: '/elections', alignment: 'left' },
  { text: `Parties' Stances`, routerLink: '/party-stances', alignment: 'left' },
  { text: 'Not Registered to Vote?', routerLink: '/register-to-vote', alignment: 'right' },
  { text: 'Donate', routerLink: '/donate', alignment: 'right' }
]

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-nav-bg-color border-b border-gray-200 shadow-sm">
      <Navbar links={headerLinks} />
    </header>
  )
}

export default Header