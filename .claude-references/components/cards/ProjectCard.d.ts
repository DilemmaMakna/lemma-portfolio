import * as React from "react";

/**
 * Project card. Image on top, eyebrow + title + description below.
 */
export interface ProjectCardProps {
  /** Tracked sentence-case label above the title (e.g. "Identitas Visual — 2025"). */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  /** Cover image height in px. Default 365. */
  imageHeight?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function ProjectCard(props: ProjectCardProps): JSX.Element;
