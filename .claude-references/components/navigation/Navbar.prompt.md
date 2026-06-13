Lemma's marketing-page top nav. Three slots: brand on the left, centred link list, primary CTA on the right. Hairline bottom border + 2px backdrop blur, sits flush over the hero.

```jsx
<Navbar
  links={[{label:"About"},{label:"Services"},{label:"Work"},{label:"Clients"}]}
  cta={<Button>Start a project</Button>}
/>
```

- Use `variant="dark"` only on dark service tiles; default "light" is what the brand uses on every cream/white page.
- Avoid more than 4–5 link items — the layout is sized for that.
