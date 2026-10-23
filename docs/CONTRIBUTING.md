# Contributing

This guide sets the conventions for changes to the Lemma website. Read [ARCHITECTURE.md](ARCHITECTURE.md) first for how the code is organized.

## Branches

Name a branch with a prefix that matches the change, followed by a short description in lowercase words separated by hyphens:

- `feat/` for a new feature, such as `feat/work-filters`.
- `fix/` for a bug fix, such as `fix/nav-mobile-overlap`.
- `chore/` for tooling, dependencies and other maintenance, such as `chore/update-oxfmt`.

## Commit messages

Write each commit message as one line in the form `type(scope): summary`.

- `type` is the kind of change: `feat`, `fix`, `chore`, `docs` or `refactor`.
- `scope` is the module or area the change touches, such as `home`, `ui`, `mobile`, `design` or `perf`.
- `summary` is a short description in lowercase and the imperative mood, with no trailing period.

Examples from this repository:

```text
feat(design): expose type scale and spacing as theme tokens
fix(mobile): meet 44px touch targets
chore(perf): add bundle analysis script
```

Keep the whole message on one line. Commit message rules are documented here only. The repository does not run commitlint or any other message checker.

## Titles and names

Do not use plan words such as milestone, task, step, slice or wip in commit messages, branch names or pull request titles. Those words describe the plan, not the change. Do not add a pull request number such as `(#12)` to a title.

## Quality gate

Run these three commands before you push or open a pull request. All three must pass:

```sh
npm run build
npm run lint
npm run typecheck
```

## Tooling

Linting and formatting use oxc:

- `oxlint` checks the code. Its settings are in `.oxlintrc.json`.
- `oxfmt` formats the code. Its settings are in `.oxfmtrc.json`.

The matching npm scripts are:

- `npm run lint` runs oxlint.
- `npm run lint:fix` runs oxlint and applies the fixes it can make automatically.
- `npm run format` formats files with oxfmt.
- `npm run format:check` reports files that oxfmt would change, without changing them.

oxfmt is still version 0.x, so its output and rules can change between releases. Check the formatting of the repository again after every oxfmt upgrade.

Migration note: lint and format moved from ESLint and Prettier to oxc. The rules that were compared during the move, and the ones accepted as lost, are listed in [oxc-gaps.md](oxc-gaps.md).

## Local git hook (optional)

The repository includes a plain shell hook at `.githooks/pre-commit`. Git does not run it until you opt in:

```sh
git config core.hooksPath .githooks
```

For staged files, the hook checks the following, in order:

1. `oxfmt --check` on staged `ts`, `tsx`, `js`, `mjs`, `css`, `json` and `md` files. This check only warns. It never blocks a commit.
2. `oxlint` on staged `ts`, `tsx`, `js` and `mjs` files. It blocks the commit when it finds errors. Warnings do not block.
3. `npm run typecheck`. It blocks the commit when it fails.

To turn the hook off, run:

```sh
git config --unset core.hooksPath
```

## Mobile checks

Before you merge a change that touches layout, navigation or motion, check it on a phone-sized screen:

- In browser devtools, test at 360x640 and at 390x844.
- Test on a real phone. Start the dev server on your local network with `npm run dev -- -H 0.0.0.0`, then open the address it prints on the phone.
- Make sure every tappable control is at least 44px high and wide.
- Use `svh` or `dvh` units for full-height sections, not `vh`, so the layout does not jump when the mobile browser bar shows or hides.
- Check that motion respects `prefers-reduced-motion`.

## Package manager

npm is the canonical package manager today, and the lockfile is `package-lock.json`. npm works everywhere; bun is supported once bun.lock lands.

## Bundle analysis

To see what ships in each page's JavaScript, run:

```sh
npm run analyze
```

Use the report to find large client bundles before you add a new dependency.
