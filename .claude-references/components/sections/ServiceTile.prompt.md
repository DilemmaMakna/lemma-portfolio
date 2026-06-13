Immersive full-bleed service / category section — colored radial backdrop, decorative geometry behind a 68% black veil, numbered badges top-left, title + description + scheme note bottom row.

```jsx
<ServiceTile
  index={1} count={3}
  variant="magenta"
  title="Kreatif & Desain"
  description="Sistem visual yang dirancang…"
  scheme="Skema: Berbasis Proyek"
  decoration={<MyDecorativeRings/>}
/>
```

Variants are reserved for Lemma's three services: `magenta` (Kreatif), `teal` (Analitik), `olive` (Digital). Pass an SVG/decoration node as `decoration` to ride under the veil.
