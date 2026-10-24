"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isTouch, reducedMotion } from "@/lib/motion/gsap";

const RAW_ASCII = `                                                            ~fr$$$$$$$$$$$p$$$                                          
                                                       +$v$$$$$$$$$$$$$$$$$$$$J$$$>                                     
                                                    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$<                                 
                                                $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$                              
                   <|           ;?||~         ]$r$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$n\\}i                            
               j$$$$$$$$$_  $$$$$pz$$p$$$     $$$$$p$$$$$j///////p$$$$$$$$$$$$$$$$$v\\|(){j                            
            ?$$$$$$$$$$$$$$j$$$$$$$$$$$$$1    $$$$$$$$$zf/\\\\\\\\/f$$$$$$$$$$$$$$pt\\|||(){t                            
         Jf$$$$$$$$$$$$$$$$$$$$$$$$$$$$J\\_    $$$$$$$$$$j/\\\\//tjz$$$$$$$$$$$$$$$$$$$$Jt(1z                            
     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$zt\\|((}~    $$$$$$$$$$j/\\/fnJ$$$$$$$$$Jt||z$$$$$$$$$$v/)p                            
p$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$v/||}~    $$$$$$$$$$j/\\/fJ$$$z$$$j||(((((|tv$$$pvf|()1r                            
n$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$j)[   $$$$$$$$$$j/\\/fp$$$$$$|(((((((((((((())))(){f                            
$$$$$$$$$$$$$$$$$$$$$$pJJJpppJJJ$$$$$pr\\(1}    $$$$$$$$$j\\\\fp$$$$$p|(((((((((((((())))))}}                            
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$pvr/|(())1{     $$$$$$$$n||()$$$$$$$p|(((((((((((((()(((1{]"                            
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$pj(())())1}        $$$$$$[  $$$$$$$$$|((((((((((((((((((){}\`                            
$$$$$$$$$$$$$$$$$$$$$$$$$$Jz$$$$pj())))((1}                 $$$$$$$$$|((((((((((((((((((){}\`       $                    
$$$$$$$$$$$$$$$$$$$$$$pj///n$$$$pj|((||\\\\|)f$      z$$$|$    $$$$$$$$|(((((){)((((((((((1{?   ,$$$$$$$t$_               
$$$$$$$$$$$$$$$$$$$$$\\\\////n$$$$$j/p$$$$$$$$$$$ $$$$$$$$$$$$-   $]$$$(1|]!   n)1))))))))|i  $$$$$$$$$$$$$jv!            
$$$$$$$$$$$$$$$$$$$$$/\\////n$$$$$rn$$$$$$$$$$$$$$$$$$$$$$$$pn)$                           ?$$$$Jp$$$$$$$$$$$$$$$$       
$$$$$$$$$$$$$$$$$$$$$\\||||((tzp$Jjrppp$$$$$$$$$$$$$$$$$r|(((|)|   |Jz!            z$$$$J+  $$$$$$$$$$$$$$$$$$$$$$$$$$   
  $$$$$$$$$$$$$$$$$$$|((((((}i~1)(n$$$$$$$$$$$$$$$$$$$$||(((|[,,$$$$$$$pz      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$J$$
      1$$$$$$$$$$$$$$|((((((}i  $1$$$$$$$$$$$$$$$$$$$$$$zf/||j$$$$$$$$$$$fz- $nJ$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$(
          z$$$$$$$$$$|(((())j   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$J$$$ $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$v/||1
              $$$$$$$|))}}]l    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$nt||||((1
                  J$z1}>        $$$$$$$$$$$p$$$$$$$$$$$$$$$$$$$$p$$$$$$$$$$$ $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$v/||||((((((1
                                $$$$$$$$$$$$$$$$$$$$$$$$$$$$J$$$$$$$$$$$$$$$ $$$$$$$$$$$$$$$$$J$$$$$$$$Jt|(((((((((((((1
                                $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ $$$ffrzJzvrf/t$$$$$$$pzf|(|(((((((((((((((1
                                $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ $$$jjjjt/\\\\t$$$$$$$$v|((((((((((((((((((1
                                $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ $$nfjjjt/\\\\t$$$$$$$$v|(((((((((((((((((||
                                $r$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$?  i)//tt\\\\\\t$$$$$$$$v|((((((((((((()()1)1
                                  ?$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$     !)\\\\\\\\\\\\t$$$$$$$$v|((((((((()()1}[\\:  
                                      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$/         !)\\\\\\\\\\/$$$$$$$$v|((((((()1{{|;      
                                          $$$$$$$$$$$$$$$$$$$$$$]             "(/\\\\\\\\|\\J$$$$$$v|(())11[|,          
                                              $$$$$$$$$$$$$$1                  $))(|||||()($   $$$$v){?t)               `;

const GLYPHS = "$/\\|(){}1zpvrfjnt+-*~!?><[]";

type Cell = {
  r: number;
  c: number;
  target: string;
  order: number;
};

export default function AsciiPuzzle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [solved, setSolved] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Parse lines & build cell list once
  const cellsRef = useRef<Cell[]>([]);
  const gridDims = useRef({ rows: 33, cols: 105 });

  useEffect(() => {
    const lines = RAW_ASCII.split("\n");
    const rows = lines.length;
    let maxCols = 0;
    lines.forEach((l) => {
      if (l.length > maxCols) maxCols = l.length;
    });
    gridDims.current = { rows, cols: maxCols };

    const cells: Cell[] = [];
    for (let r = 0; r < rows; r++) {
      const line = lines[r] || "";
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char && char !== " ") {
          // Angle-based wave reveal from top-left to bottom-right with noise
          const dist = Math.hypot(c * 0.45, r * 0.9) + (Math.sin(c * 0.3) + Math.cos(r * 0.4)) * 3;
          cells.push({
            r,
            c,
            target: char,
            order: dist,
          });
        }
      }
    }

    // Normalize order 0..1
    if (cells.length > 0) {
      const minO = Math.min(...cells.map((c) => c.order));
      const maxO = Math.max(...cells.map((c) => c.order));
      const span = maxO - minO || 1;
      cells.forEach((c) => {
        c.order = (c.order - minO) / span;
      });
    }

    cellsRef.current = cells;
  }, []);

  const progressRef = useRef(0);
  const mouseRef = useRef({ x: -999, y: -999, active: false });
  const rafRef = useRef<number>(0);

  const startAnimation = useCallback(() => {
    if (reducedMotion()) {
      progressRef.current = 1;
      setSolved(true);
      return;
    }
    progressRef.current = 0;
    setSolved(false);
    setAnimating(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Trigger on scroll visibility
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          startAnimation();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(canvas);

    const charW = () => w / gridDims.current.cols;
    const charH = () => h / gridDims.current.rows;

    let lastTime = performance.now();

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Animate progress smoothly
      if (progressRef.current < 1) {
        progressRef.current = Math.min(1, progressRef.current + dt * 0.45);
        if (progressRef.current >= 1) {
          setSolved(true);
          setAnimating(false);
        }
      }

      ctx.clearRect(0, 0, w, h);

      const cw = charW();
      const ch = charH();
      const fontSize = Math.max(7, Math.floor(ch * 0.95));
      ctx.font = `500 ${fontSize}px var(--font-mono), monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const currentProgress = progressRef.current;
      const mouse = mouseRef.current;

      const cells = cellsRef.current;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const x = cell.c * cw + cw / 2;
        const y = cell.r * ch + ch / 2;

        // Threshold window for resolving
        const threshold = cell.order;
        const delta = currentProgress - threshold;

        let char = "";
        let color = "#6e6b65";

        if (delta < -0.08) {
          // Unresolved: hidden or faint dust
          if (Math.random() < 0.008) {
            char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            color = "#2a2a2a";
          } else {
            continue;
          }
        } else if (delta < 0.05) {
          // Actively resolving: flickering random glyph in orange!
          char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          color = "#ff5a1f";
        } else {
          // Fully resolved to target character
          char = cell.target;

          // Mouse proximity reaction
          let isNear = false;
          if (mouse.active) {
            const d = Math.hypot(x - mouse.x, y - mouse.y);
            if (d < 70) {
              isNear = true;
            }
          }

          if (isNear) {
            color = "#ff7440";
            if (Math.random() < 0.15) {
              char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
          } else if (cell.target === "$") {
            color = "#f2f0eb";
          } else if (cell.target === "p" || cell.target === "z" || cell.target === "J") {
            color = "#d6d3cb";
          } else {
            color = "#7a7770";
          }
        }

        ctx.fillStyle = color;
        ctx.fillText(char, x, y);
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
    };
  }, [startAnimation]);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTouch() || reducedMotion()) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const onMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      className="group relative rounded-[4px] border border-line bg-surface/80 p-4 sm:p-6 backdrop-blur-sm transition-all duration-500 hover:border-line-strong"
    >
      {/* Header bar / technical metadata */}
      <div className="mono mb-4 flex items-center justify-between text-[11px] text-fg-dim">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>PUZZLE.01 // MORPHOLOGY</span>
        </div>
        <button
          type="button"
          onClick={startAnimation}
          className="transition-colors hover:text-accent"
          title="Reconstruct ASCII puzzle"
        >
          {animating ? "[SOLVING...]" : solved ? "[RECONSTRUCT ↺]" : "[INITIALIZING]"}
        </button>
      </div>

      {/* Canvas container with aspect ratio matching ~105 cols by 33 rows */}
      <div className="relative aspect-[16/10] w-full overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className="absolute inset-0 h-full w-full cursor-crosshair"
          aria-label="Interactive ASCII puzzle piece animation"
        />
      </div>

      {/* Subtext info */}
      <div className="mono mt-3 flex items-center justify-between text-[10px] text-fg-dim">
        <span>GRID: 105x33 CHARS</span>
        <span className="text-fg-muted">STATUS: EVIDENCE_UNFORMED</span>
      </div>
    </div>
  );
}
