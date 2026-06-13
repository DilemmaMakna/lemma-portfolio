import * as React from "react";

/**
 * Top navigation bar. Glassy hairline border, three slots: logo, links, CTA.
 */
export interface NavbarLink {
  id?: string;
  href?: string;
  label: string;
}

export interface NavbarProps {
  /** Brand mark — defaults to the "Lemma" wordmark. */
  logo?: React.ReactNode;
  /** Middle link cluster. */
  links?: NavbarLink[];
  /** Right-aligned CTA (typically a <Button/>). */
  cta?: React.ReactNode;
  /** id or href of the active link for highlighting. */
  current?: string;
  /** Light (cream) or dark (deep-orange) chrome. Default "light". */
  variant?: "light" | "dark";
  /** Programmatic navigation handler. */
  onNavigate?: (link: NavbarLink) => void;
  style?: React.CSSProperties;
}

export function Navbar(props: NavbarProps): JSX.Element;
