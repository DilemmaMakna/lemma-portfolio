# oxlint gap check vs eslint-config-next

Run before eslint removal (10.6). Source: `eslint.config.mjs` → eslint-config-next 16.4.2 (core-web-vitals + typescript). Tools: `@oxlint/migrate` 1.89.0 (output kept outside the repo), oxlint 1.89.0. The repo `.oxlintrc.json` enables correctness plus 8 rules, so the migrator's full set is the upper bound.

Decisions: accept loss | covered by tsc | keep as warn.

## Known items from 10.2

- nextjs/no-img-element (warn): same rule. Hero.tsx:51 still reported. keep as warn.
- jsx-a11y/prefer-tag-over-role: not in eslint-config-next, oxlint-only extra. keep as warn.
- jsx-a11y/no-static-element-interactions: not in eslint-config-next, extra. keep as warn.
- jsx-a11y/no-noninteractive-element-interactions: not in eslint-config-next, extra. keep as warn.
- no-control-regex: not in eslint-config-next (eslint:recommended only). Intentional control-char strip at app/api/contact/route.ts:32. keep as warn.
- unicorn/no-new-array: not in eslint-config-next, extra. components/work/WorkWall.tsx:47. keep as warn.
- @next/next/no-location-assign-relative-destination (warn): not implemented in oxlint, no rule name in its binding. lib/lenis.ts:14 warning disappears. accept loss.

## Skipped by the migrator

- react/jsx-uses-react, react/jsx-uses-vars: React 17+ JSX transform; unused-vars handles JSX. accept loss.
- react/no-deprecated: oxlint routes it through typescript/no-deprecated, which needs tsgolint (skipped). accept loss.
- react/require-render-return: nursery only; no class components in app, components, lib. accept loss.
- react-hooks/config, react-hooks/gating: React Compiler options not exposed by oxlint. accept loss.

## react-hooks (core-web-vitals)

- rules-of-hooks (error), exhaustive-deps (warn): both set in `.oxlintrc.json`. exhaustive-deps is error in oxlint, stricter than eslint warn; 0 hits. keep as error.
- Error-level React Compiler rules: static-components, use-memo, preserve-manual-memoization, immutability, globals, refs, set-state-in-effect, error-boundaries, purity, set-state-in-render. Warn-level: incompatible-library, unsupported-syntax. Names exist in oxlint's binding and map to react/*, but they are not enabled in the repo config and 0 hits with the migrator config. Logic parity UNVERIFIED. accept loss for now.

## @next/next (core-web-vitals), remaining rules

- Warn: google-font-display, google-font-preconnect, next-script-for-ga, no-async-client-component, no-before-interactive-script-outside-document, no-css-tags, no-head-element, no-page-custom-font, no-styled-jsx-in-document, no-title-in-document-head, no-typos, no-unwanted-polyfillio. accept loss (maps to nextjs/*, 0 hits).
- Error: no-html-link-for-pages, no-sync-scripts, inline-script-id, no-assign-module-variable, no-document-import-in-page, no-duplicate-head, no-head-import-in-document, no-script-component-in-head. Same names under nextjs/*, not enabled in repo config, 0 hits. accept loss.

## jsx-a11y and import (core-web-vitals)

- jsx-a11y/alt-text, aria-props, aria-proptypes, aria-unsupported-elements, role-has-required-aria-props, role-supports-aria-props (warn): same names, not enabled in repo config, 0 hits. keep as warn; add to `.oxlintrc.json` in a follow-up.
- import/no-anonymous-default-export (warn): same name, not enabled explicitly. keep as warn; add in a follow-up.

## typescript config

- @typescript-eslint/* error rules (ban-ts-comment, no-explicit-any, no-namespace, no-empty-object-type, and 13 more): same names under typescript/*, 0 hits. accept loss.
- @typescript-eslint/no-unused-vars, no-unused-expressions (warn): mapped to base no-unused-vars and no-unused-expressions (warn). tsconfig has no noUnusedLocals, so tsc does not cover them. keep as warn; whether the repo's correctness category already enables them is UNVERIFIED.
- @typescript-eslint/no-array-constructor, base no-var, prefer-const, prefer-rest-params, prefer-spread (error): same or mapped names, 0 hits. accept loss.
- Base JS rules that eslint-config-next turns off (no-undef, no-dupe-keys, no-redeclare, ...): tsc covers them (strict true). covered by tsc.

## Tooling

- oxfmt 0.74.0 is 0.x with no stability label found. UNVERIFIED beyond that.
- oxlint-tsgolint skipped: needs TS 7. Type-aware rules are lost. accept loss.
- `next lint` is absent in Next 16.4.2 (no lint command in next/dist/bin/next). Lint runs only through oxlint after 10.5.
- Migrator warnings: eslint-config-next special parser and react/import settings in overrides are dropped. accept loss.
