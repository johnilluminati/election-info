export interface HeaderLink {
  text: string,
  routerLink: string
}

export interface Candidate {
  firstName: string,
  lastName: string,
  party: string,
  position: {
    title: string,
    tenure: string
  },
  website: string,
  image: string,
  keyIssues: {
    position: string
  }[]
}

export interface CandidateInfoTab {
  title: string,
  link: string,
  component: React.ReactNode
}