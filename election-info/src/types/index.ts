// UI-specific types for the frontend application
// API types are in @shared/types

export interface HeaderLink {
  text: string,
  routerLink: string,
  alignment: 'left' | 'right'
}