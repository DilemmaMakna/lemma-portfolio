"use client";
import * as React from "react";
import Image from "next/image";
import { Eyebrow } from "@/components/feedback/Eyebrow";

export interface ProjectCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  imageHeight?: number;
  accentColor?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function ProjectCard({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = "",
  href,
  imageHeight = 300,
  accentColor = "var(--orange-200)",
  style,
  onClick,
}: ProjectCardProps) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        background: "var(--surface-card)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--border-hairline)",
        overflow: "hidden",
        textDecoration: "none",
        color: "var(--text-body)",
        transition: "transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)",
        cursor: href || onClick ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
        if (href || onClick) {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        if (href || onClick) {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }
      }}
    >
      {/* Image area */}
      <div
        style={{
          height: imageHeight,
          background: accentColor,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt} fill style={{ objectFit: "cover" }} />
        ) : (
          /* Decorative placeholder with brand gradient */
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--radius-pill)",
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 22px 24px" }}>
        {eyebrow && <Eyebrow tone="muted">{eyebrow}</Eyebrow>}
        <div
          style={{
            font: "var(--type-card-title)",
            color: "var(--neutral-700)",
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {description && (
          <div style={{ font: "var(--type-meta)", fontSize: 14, lineHeight: 1.625, color: "var(--neutral-600)" }}>
            {description}
          </div>
        )}
      </div>
    </Tag>
  );
}
