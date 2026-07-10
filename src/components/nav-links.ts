export type NavLink = {
  label: string;
  href: string;
};

// Shared primary navigation, reused by the header (and available to the footer).
export const navLinks: NavLink[] = [
  { label: "Verhaal", href: "/verhaal" },
  { label: "Video's", href: "/videos" },
  { label: "Gids", href: "/gids" },
  { label: "Gear", href: "/gear" },
  { label: "Samenwerken", href: "/samenwerken" },
  { label: "Contact", href: "/contact" },
];
