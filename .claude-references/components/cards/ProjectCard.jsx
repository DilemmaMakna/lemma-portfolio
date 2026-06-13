import React from "react";

/**
 * Project card — image on top, eyebrow + title + body underneath.
 * White card on cream paper, 25px radius, hairline outline.
 *
 * The brand uses these in a staggered 2-column grid (the right column is
 * offset by ~52px to break the rhythm); compose them with CSS grid, not
 * inside the card.
 */
export function ProjectCard({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = "",
  href,
  imageHeight = 365,
  style,
  onClick,
}) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "var(--surface-card)",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        textDecoration: "none",
        color: "var(--text-body)",
        transition: "transform var(--duration-base) var(--ease-out)",
        cursor: href || onClick ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (href || onClick) e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        if (href || onClick) e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          height: imageHeight,
          background: "var(--surface-tile)",
          overflow: "hidden",
          borderTopLeftRadius: "var(--radius-lg)",
          borderTopRightRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          paddingInline: 20,
          paddingBlock: 22,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 9.14 }}>
          {eyebrow ? (
            <div
              style={{
                font: "var(--type-eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                color: "rgba(14,13,12,0.5)",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              font: "var(--type-card-title)",
              color: "var(--neutral-700)",
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
        </div>
        {description ? (
          <div
            style={{
              font: "var(--type-meta)",
              fontSize: 14,
              lineHeight: 1.625,
              color: "var(--neutral-600)",
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
    </Tag>
  );
}
