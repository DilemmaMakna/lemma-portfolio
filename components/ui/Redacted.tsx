// Nama produk stealth yang disensor penuh: dua balok berkedip, tanpa huruf asli di DOM.
export default function Redacted({ className = "" }: { className?: string }) {
  return (
    <span role="img" aria-label="redacted" className={`inline-flex items-center gap-[0.3em] align-[-0.1em] ${className}`}>
      <span className="stealth-block inline-block h-[0.85em] w-[3.2ch] bg-current" />
      <span className="stealth-block inline-block h-[0.85em] w-[5.5ch] bg-current" />
    </span>
  );
}
