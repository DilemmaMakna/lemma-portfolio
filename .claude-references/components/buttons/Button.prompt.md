Lemma's primary action button — use anywhere the user takes a deliberate next step. Variants: `primary` (dark on cream, default), `accent` (signature orange, headline CTA), `ghost` (outline-only, inline near text), `deep` (dark-orange on deep-orange for the footer CTA).

```jsx
<Button variant="accent" size="lg" trailingIcon={<ArrowUpRight />}>
  Start a project
</Button>
```

- Pair with `<IconButton>` for the small "+arrow" capsule tap target right next to it (e.g. footer CTA pattern).
- Use `ghost` next to a section heading (`Selected work →`); use `accent` sparingly — one per section.
- Never invent new colors; stick to the four variants.
