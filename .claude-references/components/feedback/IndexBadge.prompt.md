Numbered step indicator (01/02/03…). Active step renders as a filled white capsule (taller, 9.6px radius); idle steps are hairline 32×32 squares.

```jsx
<IndexBadgeRow count={3} active={1} />
```

Reach for `<IndexBadgeRow>` rather than placing badges by hand. Use `tone="dark"` on the colored service tiles (default), `tone="light"` on cream backgrounds.
