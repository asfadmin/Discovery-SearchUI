
# Contributing to Discovery-SearchUI

We welcome contributions! Please follow these guidelines so your PRs integrate smoothly.

---

## Branch & PR Target

- The base branch is **`test`** (default branch).
- Always branch off of `upstream/test` and open PRs against `test`.

---

## Local Setup

1. Fork & clone:
   ```bash
   git clone https://github.com/<your-username>/Discovery-SearchUI.git
   cd Discovery-SearchUI
   git remote add upstream https://github.com/asfadmin/Discovery-SearchUI.git
   git fetch upstream
   git checkout -b feat/short-description upstream/test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run dev server:
   ```bash
   npx ng serve
   ```

4. **If your feature depends on local domain or SSL:**
   - Add `127.0.0.1 local.asf.alaska.edu` to `/etc/hosts`
   - Install [`mkcert`](https://github.com/FiloSottile/mkcert)
   - Serve with HTTPS:
     ```bash
     npx ng serve --host=local.asf.alaska.edu --ssl true --ssl-cert <cert-path> --ssl-key <key-path>
     ```

---

## i18n (Required)

- **Do not hardcode user-facing text.**
- Use [ngx-translate](https://github.com/ngx-translate/core).
- Add/modify translation keys in `strings.json`.
- Reference in templates with the translate pipe, e.g.:

  ```html
  <button>{{ 'SEARCH_BUTTON_APPLY' | translate }}</button>
  ```

- List any new/changed keys in your PR description.

---

## Tests, Lint, Build

Run before opening a PR:

```bash
npm run lint
npm test
npm run build
```

All must pass.

---

## Commit Style

Use descriptive commit messages. Conventional Commit style is preferred:

- `feat(download-queue): add cancel button`
- `fix(map): correct tile layer attribution`
- `docs(readme): clarify HTTPS setup`

---

## Opening a PR

- Target branch: `test`
- Title: short and descriptive
- Body:
  - What changed
  - Why
  - How tested
  - Screenshots if UI
  - i18n keys list (if applicable)
- Check the checklist in the PR template.

---

## Review & Merge

- Maintainers will review for scope, coding style, and i18n compliance.
- CI (lint, tests, build, CodeQL) must pass.
- Merges use **Squash & merge** into `test`.
- Deployments to shared environments are maintainers-only.

---

Thank you for contributing!
