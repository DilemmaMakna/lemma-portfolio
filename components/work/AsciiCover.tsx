// Sampul ASCII statis untuk proyek yang belum punya foto. Polanya deterministik per seed (aman untuk SSR).
const RAMP = " .:-=+*#";

function pattern(seed: number, cols: number, rows: number) {
  const a = 1 + (seed % 7) * 0.37;
  const cx = 0.25 + ((seed * 13) % 50) / 100;
  let out = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const nx = x / cols;
      const ny = y / rows;
      // garis kontur di sekitar satu titik, mirip peta topografi di hero beranda
      const d = Math.hypot((nx - cx) * 1.7, ny - 0.55);
      const v = 0.5 + 0.5 * Math.sin(d * (16 + a * 4) - Math.sin(nx * 6 * a) * 0.8);
      const k = Math.max(0, v * (1.15 - d));
      out += RAMP[Math.min(RAMP.length - 1, Math.floor(k * RAMP.length))];
    }
    out += "\n";
  }
  return out;
}

export default function AsciiCover({ seed, className = "" }: { seed: number; className?: string }) {
  return (
    <pre
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden font-mono text-[10px] leading-[1.1] text-fg-dim ${className}`}
    >
      {pattern(seed, 64, 40)}
    </pre>
  );
}
