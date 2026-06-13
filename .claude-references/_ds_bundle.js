/* @ds-bundle: {"format":3,"namespace":"LemmaDesignSystem_e5b9a2","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"HaloCard","sourcePath":"components/cards/HaloCard.jsx"},{"name":"ProjectCard","sourcePath":"components/cards/ProjectCard.jsx"},{"name":"Eyebrow","sourcePath":"components/feedback/Eyebrow.jsx"},{"name":"IndexBadge","sourcePath":"components/feedback/IndexBadge.jsx"},{"name":"IndexBadgeRow","sourcePath":"components/feedback/IndexBadge.jsx"},{"name":"StatPill","sourcePath":"components/feedback/StatPill.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"},{"name":"BarrelBackdrop","sourcePath":"components/sections/BarrelBackdrop.jsx"},{"name":"ServiceTile","sourcePath":"components/sections/ServiceTile.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"542cc08d3e3d","components/buttons/IconButton.jsx":"12fddff655ea","components/cards/HaloCard.jsx":"105a537ea9ad","components/cards/ProjectCard.jsx":"4afc40533d81","components/feedback/Eyebrow.jsx":"5e1b3855794e","components/feedback/IndexBadge.jsx":"0ee22d4446a2","components/feedback/StatPill.jsx":"18813d3cf2fe","components/navigation/Navbar.jsx":"24daa8552b07","components/sections/BarrelBackdrop.jsx":"c9c42a3a367b","components/sections/ServiceTile.jsx":"b4ef06ee6f4d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LemmaDesignSystem_e5b9a2 = window.LemmaDesignSystem_e5b9a2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lemma's primary action button. Three variants for three contexts:
 *  - "primary"  → dark slate ink, used on cream surfaces (the nav "Start a project")
 *  - "accent"   → orange, used as the active CTA (Layanan card CTAs)
 *  - "ghost"    → outline only, used inline next to a heading ("Selected work")
 *  - "deep"     → dark-orange-on-deep-orange, used on the footer CTA
 *
 * Pair with <IconButton/> for a +arrow secondary tap target right next to it.
 */
function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  children,
  trailingIcon,
  onClick,
  disabled,
  style,
  className,
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const css = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "var(--font-sans)",
    fontWeight: 400,
    fontSize: s.fs,
    lineHeight: 1.625,
    padding: s.pad,
    borderRadius: "var(--radius-md)",
    border: `${"var(--border-soft)"} solid ${v.border}`,
    background: v.bg,
    color: v.fg,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    transition: "background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)",
    whiteSpace: "nowrap",
    ...style
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    href: href,
    type: href ? undefined : type,
    onClick: disabled ? undefined : onClick,
    className: className,
    style: css,
    onMouseEnter: e => {
      if (disabled) return;
      e.currentTarget.style.background = v.hover;
    },
    onMouseLeave: e => {
      if (disabled) return;
      e.currentTarget.style.background = v.bg;
    },
    onMouseDown: e => {
      if (disabled) return;
      e.currentTarget.style.transform = "scale(0.98)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }), /*#__PURE__*/React.createElement("span", null, children), trailingIcon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center"
    }
  }, trailingIcon) : null);
}
const VARIANTS = {
  primary: {
    bg: "var(--action-primary-bg)",
    hover: "var(--neutral-800)",
    fg: "var(--action-primary-fg)",
    border: "var(--action-primary-border)"
  },
  accent: {
    bg: "var(--action-accent-bg)",
    hover: "var(--orange-600)",
    fg: "var(--action-accent-fg)",
    border: "var(--action-accent-border)"
  },
  ghost: {
    bg: "transparent",
    hover: "rgba(14,13,12,0.04)",
    fg: "var(--action-ghost-fg)",
    border: "var(--action-ghost-border)"
  },
  deep: {
    bg: "var(--action-on-deep-bg)",
    hover: "var(--orange-700)",
    fg: "var(--neutral-0)",
    border: "var(--action-on-deep-border)"
  }
};
const SIZES = {
  sm: {
    fs: 14,
    pad: "4px 12px"
  },
  md: {
    fs: 16,
    pad: "4px 16px"
  },
  lg: {
    fs: 18,
    pad: "8px 20px"
  },
  xl: {
    fs: 20,
    pad: "10px 24px"
  }
};
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Square companion button used next to a labeled Button — usually a +arrow.
 * Matches Button radius/border so they pair as a "split CTA" lockup.
 */
function IconButton({
  variant = "accent",
  size = "md",
  href,
  type = "button",
  children,
  onClick,
  disabled,
  ariaLabel,
  style,
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const v = VARIANTS[variant] || VARIANTS.accent;
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    href: href,
    type: href ? undefined : type,
    onClick: disabled ? undefined : onClick,
    "aria-label": ariaLabel,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: s.size,
      height: s.size,
      padding: 0,
      borderRadius: "var(--radius-md)",
      background: v.bg,
      color: v.fg,
      border: `1.12px solid ${v.border}`,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
      ...style
    },
    onMouseEnter: e => !disabled && (e.currentTarget.style.background = v.hover),
    onMouseLeave: e => !disabled && (e.currentTarget.style.background = v.bg),
    onMouseDown: e => !disabled && (e.currentTarget.style.transform = "scale(0.96)"),
    onMouseUp: e => e.currentTarget.style.transform = "scale(1)"
  }), children || /*#__PURE__*/React.createElement(ArrowUpRight, null));
}
function ArrowUpRight() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 17 17 7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 7h10v10"
  }));
}
const VARIANTS = {
  primary: {
    bg: "var(--neutral-700)",
    hover: "var(--neutral-800)",
    fg: "var(--beige-100)",
    border: "var(--neutral-500)"
  },
  accent: {
    bg: "var(--orange-500)",
    hover: "var(--orange-600)",
    fg: "var(--beige-100)",
    border: "var(--neutral-400)"
  },
  ghost: {
    bg: "transparent",
    hover: "rgba(14,13,12,0.04)",
    fg: "var(--neutral-ink)",
    border: "var(--neutral-400)"
  },
  deep: {
    bg: "#ac3e04",
    hover: "var(--orange-700)",
    fg: "var(--beige-100)",
    border: "#cb4f0d"
  }
};
const SIZES = {
  sm: {
    size: 28
  },
  md: {
    size: 36
  },
  lg: {
    size: 44
  },
  xl: {
    size: 52
  }
};
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/cards/HaloCard.jsx
try { (() => {
/**
 * Hero-style "halo card" — an off-stage red rectangle tilted 13° behind
 * an orange-gradient card with a 7px halo outer ring. The decorative
 * artwork used on the landing-page hero between "Digital" and "Partner".
 */
function HaloCard({
  width = 343,
  height = 220,
  rotate = 13,
  variant = "orange",
  children,
  style
}) {
  const palette = variant === "magenta" ? {
    bg: "var(--grad-magenta-radial)",
    back: "var(--magenta-from)"
  } : variant === "olive" ? {
    bg: "var(--grad-olive-radial)",
    back: "var(--olive-from)"
  } : {
    bg: "var(--grad-orange-radial)",
    back: "var(--red-spot)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width,
      height,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      left: -width * 0.12,
      top: height * 0.1,
      width: width * 0.78,
      height: height * 0.82,
      background: palette.back,
      borderRadius: 28.8,
      transform: `rotate(${rotate}deg)`,
      transformOrigin: "center",
      boxShadow: "var(--halo-orange-thin)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: palette.bg,
      overflow: "hidden",
      borderRadius: 32,
      boxShadow: "var(--halo-orange)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      background: "url('../../assets/barrel-pattern.svg') center/cover no-repeat",
      opacity: 0.85,
      mixBlendMode: "screen"
    }
  }), children));
}
Object.assign(__ds_scope, { HaloCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/HaloCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProjectCard.jsx
try { (() => {
/**
 * Project card — image on top, eyebrow + title + body underneath.
 * White card on cream paper, 25px radius, hairline outline.
 *
 * The brand uses these in a staggered 2-column grid (the right column is
 * offset by ~52px to break the rhythm); compose them with CSS grid, not
 * inside the card.
 */
function ProjectCard({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = "",
  href,
  imageHeight = 365,
  style,
  onClick
}) {
  const Tag = href ? "a" : "div";
  return /*#__PURE__*/React.createElement(Tag, {
    href: href,
    onClick: onClick,
    style: {
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
      ...style
    },
    onMouseEnter: e => {
      if (href || onClick) e.currentTarget.style.transform = "translateY(-2px)";
    },
    onMouseLeave: e => {
      if (href || onClick) e.currentTarget.style.transform = "translateY(0)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: imageHeight,
      background: "var(--surface-tile)",
      overflow: "hidden",
      borderTopLeftRadius: "var(--radius-lg)",
      borderTopRightRadius: "var(--radius-lg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, imageSrc ? /*#__PURE__*/React.createElement("img", {
    src: imageSrc,
    alt: imageAlt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      paddingInline: 20,
      paddingBlock: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9.14
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--tracking-eyebrow)",
      color: "rgba(14,13,12,0.5)"
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-card-title)",
      color: "var(--neutral-700)",
      fontSize: 32,
      fontWeight: 500,
      lineHeight: 1.1
    }
  }, title)), description ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-meta)",
      fontSize: 14,
      lineHeight: 1.625,
      color: "var(--neutral-600)"
    }
  }, description) : null));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tracked sentence-case label that sits ABOVE a section title or
 * inside a card meta strip. Always lowercase or sentence case;
 * never ALL CAPS. Letter-spacing is what carries the visual identity.
 */
function Eyebrow({
  children,
  tone = "muted",
  as = "div",
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--tracking-eyebrow)",
      color: COLOR[tone] || COLOR.muted,
      ...style
    }
  }), children);
}
const COLOR = {
  muted: "rgba(14,13,12,0.5)",
  warm: "#fadccb",
  light: "rgba(255,255,255,0.8)",
  dark: "var(--neutral-700)",
  accent: "var(--orange-600)"
};
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/IndexBadge.jsx
try { (() => {
/**
 * Numbered step indicator (01 / 02 / 03 …). Used as a horizontal cluster
 * on the service tiles to show position in a sequence. The current step
 * is a solid white capsule; others are hairline-outlined.
 */
function IndexBadge({
  value,
  active = false,
  tone = "dark",
  onClick,
  style
}) {
  const palette = tone === "light" ? LIGHT : DARK;
  const activePalette = palette.active;
  const idlePalette = palette.idle;
  const p = active ? activePalette : idlePalette;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      appearance: "none",
      cursor: onClick ? "pointer" : "default",
      height: active ? 38.4 : 32,
      minWidth: active ? 38.4 : 32,
      paddingInline: active ? 9.6 : 8,
      paddingBlock: active ? 4.8 : 4,
      background: p.bg,
      border: `1px solid ${p.border}`,
      borderRadius: active ? 9.6 : 8,
      color: p.fg,
      font: "var(--type-button)",
      fontSize: active ? 21.6 : 18,
      fontWeight: 300,
      lineHeight: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all var(--duration-base) var(--ease-out)",
      ...style
    }
  }, String(value).padStart(2, "0"));
}

/** Convenience wrapper that renders a row of IndexBadges. */
function IndexBadgeRow({
  count = 3,
  active = 1,
  tone = "dark",
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, Array.from({
    length: count
  }, (_, i) => i + 1).map(v => /*#__PURE__*/React.createElement(IndexBadge, {
    key: v,
    value: v,
    active: v === active,
    tone: tone,
    onClick: onSelect ? () => onSelect(v) : undefined
  })));
}
const DARK = {
  active: {
    bg: "var(--neutral-0)",
    fg: "#111",
    border: "var(--neutral-0)"
  },
  idle: {
    bg: "transparent",
    fg: "rgba(255,255,255,0.62)",
    border: "rgba(255,255,255,0.56)"
  }
};
const LIGHT = {
  active: {
    bg: "var(--neutral-ink)",
    fg: "var(--neutral-0)",
    border: "var(--neutral-ink)"
  },
  idle: {
    bg: "transparent",
    fg: "var(--neutral-500)",
    border: "var(--neutral-300)"
  }
};
Object.assign(__ds_scope, { IndexBadge, IndexBadgeRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/IndexBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatPill.jsx
try { (() => {
/**
 * Inline stat with leading 24px icon and tabular-light number. Used in the
 * hero "4 project · 701K+ · IPB" row. Right-aligned, hairline-divided.
 */
function StatPill({
  icon,
  value,
  dividerBefore = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 14,
      paddingInline: 16,
      paddingBlock: 9,
      borderLeft: dividerBefore ? "1px solid var(--border-hairline)" : "none",
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      color: "var(--neutral-700)",
      display: "inline-flex"
    }
  }, icon) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-stat)",
      textAlign: "right",
      color: "var(--neutral-700)",
      fontWeight: 500,
      fontSize: 24,
      lineHeight: 1.45,
      whiteSpace: "nowrap"
    }
  }, value));
}
Object.assign(__ds_scope, { StatPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatPill.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
/**
 * Top navigation. A glassy hairline-bordered bar with logo on the left,
 * link cluster in the middle, and a primary CTA on the right.
 *
 * Lemma's navbar sits flush over content (light tinted background +
 * 2px backdrop blur). Designed for the cream/white marketing pages.
 */
function Navbar({
  logo,
  links = [],
  cta,
  current,
  onNavigate,
  variant = "light",
  style
}) {
  const palette = variant === "dark" ? DARK : LIGHT;
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      height: "var(--nav-height)",
      paddingInline: "var(--gutter)",
      paddingBlock: 12,
      background: palette.bg,
      borderBottom: `1px solid ${palette.border}`,
      backdropFilter: "var(--blur-nav)",
      WebkitBackdropFilter: "var(--blur-nav)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "var(--font-sans)",
      color: palette.fg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, logo || /*#__PURE__*/React.createElement(DefaultLogo, {
    variant: variant
  })), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      gap: 0,
      margin: 0,
      padding: 0,
      listStyle: "none",
      minWidth: 0,
      flex: "0 1 475px"
    }
  }, links.map(l => {
    const active = l.id === current || l.href === current;
    return /*#__PURE__*/React.createElement("li", {
      key: l.id || l.href,
      style: {
        flex: 1,
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: l.href || "#",
      onClick: e => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(l);
        }
      },
      style: {
        padding: "1px 16px",
        font: "var(--type-button)",
        color: active ? palette.fg : palette.fgMuted,
        textDecoration: "none",
        transition: "color var(--duration-fast) var(--ease-out)"
      },
      onMouseEnter: e => e.currentTarget.style.color = palette.fg,
      onMouseLeave: e => e.currentTarget.style.color = active ? palette.fg : palette.fgMuted
    }, l.label));
  })), /*#__PURE__*/React.createElement("div", null, cta));
}
function DefaultLogo({
  variant
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-button)",
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: "-0.01em",
      color: variant === "dark" ? "var(--beige-100)" : "var(--neutral-ink)"
    }
  }, "Lemma");
}
const LIGHT = {
  bg: "rgba(245,245,245,0.10)",
  border: "rgba(14,13,12,0.12)",
  fg: "var(--neutral-ink)",
  fgMuted: "var(--neutral-600)"
};
const DARK = {
  bg: "rgba(20,12,4,0.40)",
  border: "rgba(255,255,255,0.16)",
  fg: "var(--beige-100)",
  fgMuted: "rgba(247,245,241,0.62)"
};
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// components/sections/BarrelBackdrop.jsx
try { (() => {
/**
 * Decorative columnar gradient backdrop — the brand's signature motif.
 * Renders the paired peach/cream columns at full size, layered behind
 * any content. Use inside a relative-positioned section.
 *
 * The pattern is inlined as SVG so there's no external file dependency.
 */
function BarrelBackdrop({
  opacity = 0.9,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      opacity,
      pointerEvents: "none",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1440 720",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "lemma-barrel-outer",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#FFC3A7"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#FFC3A7",
    stopOpacity: "0"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "lemma-barrel-inner",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#FFDCCB"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#FFDCCB",
    stopOpacity: "0"
  }))), COLUMNS.map(([x, hOuter, hInner], i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: 0,
    width: 170,
    height: hOuter,
    fill: "url(#lemma-barrel-outer)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: 0,
    width: 170,
    height: hInner,
    fill: "url(#lemma-barrel-inner)"
  })))));
}
const COLUMNS = [[0, 720, 610], [170, 585, 495], [340, 400, 340], [510, 260, 220], [760, 260, 220], [930, 400, 340], [1100, 585, 495], [1270, 720, 610]];
Object.assign(__ds_scope, { BarrelBackdrop });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/BarrelBackdrop.jsx", error: String((e && e.message) || e) }); }

// components/sections/ServiceTile.jsx
try { (() => {
/**
 * Immersive service tile — a full-bleed colored section with a dark veil,
 * IndexBadgeRow at the top, title + description on the bottom-left,
 * and a billing/scheme note on the bottom-right.
 *
 * The background is a decorative SVG element (rings, lozenges, dots —
 * whatever the brand uses for each service) covered by a 68% black veil.
 * Pass it as `decoration`.
 */
function ServiceTile({
  index,
  count = 3,
  active,
  variant = "magenta",
  title,
  description,
  scheme,
  decoration,
  onSelect,
  style
}) {
  const palette = PALETTES[variant] || PALETTES.magenta;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      width: "100%",
      height: "var(--tile-h)",
      padding: "var(--gutter)",
      background: palette.bg,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, decoration ? /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none"
    }
  }, decoration) : null, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--veil-service)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, Array.from({
    length: count
  }, (_, i) => i + 1).map(v => /*#__PURE__*/React.createElement(IndexCapsule, {
    key: v,
    value: v,
    active: v === (active ?? index),
    onClick: onSelect ? () => onSelect(v) : undefined
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: "auto",
      display: "flex",
      alignItems: "flex-end",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: "var(--type-tile-title)",
      fontSize: 42,
      fontWeight: 500,
      lineHeight: 1.05,
      color: "var(--beige-0)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 447,
      fontSize: 18,
      fontWeight: 400,
      lineHeight: 1.625,
      color: "var(--beige-0)"
    }
  }, description)), scheme ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "right",
      fontSize: 14,
      lineHeight: 1.625,
      color: "var(--beige-0)",
      opacity: 0.9
    }
  }, scheme) : null));
}
function IndexCapsule({
  value,
  active,
  onClick
}) {
  const label = String(value).padStart(2, "0");
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      appearance: "none",
      cursor: onClick ? "pointer" : "default",
      height: active ? 38.4 : 32,
      minWidth: active ? 38.4 : 32,
      paddingInline: active ? 9.6 : 8,
      paddingBlock: active ? 4.8 : 4,
      background: active ? "var(--neutral-0)" : "transparent",
      border: `1px solid ${active ? "var(--neutral-0)" : "rgba(255,255,255,0.56)"}`,
      borderRadius: active ? 9.6 : 8,
      color: active ? "#111" : "rgba(255,255,255,0.62)",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: active ? 21.6 : 18,
      lineHeight: 1,
      transition: "all var(--duration-base) var(--ease-out)"
    }
  }, label);
}
const PALETTES = {
  magenta: {
    bg: "var(--grad-magenta-radial)"
  },
  teal: {
    bg: "radial-gradient(ellipse 70.71% 53.85% at 50% 50%, var(--teal-from) 0%, var(--teal-to) 100%)"
  },
  olive: {
    bg: "var(--grad-olive-radial)"
  },
  orange: {
    bg: "var(--grad-orange-radial)"
  }
};
Object.assign(__ds_scope, { ServiceTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/ServiceTile.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.HaloCard = __ds_scope.HaloCard;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.IndexBadge = __ds_scope.IndexBadge;

__ds_ns.IndexBadgeRow = __ds_scope.IndexBadgeRow;

__ds_ns.StatPill = __ds_scope.StatPill;

__ds_ns.Navbar = __ds_scope.Navbar;

__ds_ns.BarrelBackdrop = __ds_scope.BarrelBackdrop;

__ds_ns.ServiceTile = __ds_scope.ServiceTile;

})();
