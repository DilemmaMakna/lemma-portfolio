import Link from "next/link";

type Props = {
  href?: string;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  children: React.ReactNode;
  arrow?: boolean;
  className?: string;
  id?: string;
  onClick?: React.MouseEventHandler;
};

export default function Button({
  href,
  variant = "primary",
  disabled,
  children,
  arrow = true,
  className = "",
  id,
  onClick,
}: Props) {
  const cls = `btn btn-${variant} ${disabled ? "is-disabled" : ""} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && !disabled && <span className="arrow" aria-hidden="true">↗</span>}
    </>
  );
  if (disabled) {
    return (
      <button id={id} type="button" className={cls} disabled aria-disabled="true">
        {inner}
      </button>
    );
  }
  if (href?.startsWith("#") || href?.startsWith("mailto:")) {
    return (
      <a id={id} href={href} className={cls} onClick={onClick}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link id={id} href={href} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button id={id} type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
