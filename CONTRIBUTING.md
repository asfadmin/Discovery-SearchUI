# Contributing to Discovery-SearchUI

We welcome contributions! Please adhere to these guidelines to ensure seamless
integration of your PRs. It is advisable to contact the Discovery team prior to
commencing your development efforts. We are committed to providing comprehensive
assistance. You may reach us by initiating an issue on this repository or
writing an email to [UAF-asf-discovery@alaska.edu](mailto:UAF-asf-discovery@alaska.edu).

---
## Branch & PR Target

- The base branch is **`test`** (default branch).
- Always branch off of `upstream/test` and open PRs against `test`.

---

## Local Setup

This is a quick outline for local setup. For detailed instructions, see the
[README](https://github.com/asfadmin/Discovery-SearchUI?tab=readme-ov-file#development-server).

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
     For detailed instructions, see the
     [README](https://github.com/asfadmin/Discovery-SearchUI?tab=readme-ov-file#development-server).

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

## E2E Test Rules (Important)

- Prefer the clearest user-facing locator available:
  - `getByRole(...)`
  - `getByLabel(...)`
  - `getByPlaceholder(...)`
- Do not use generated Material selectors such as:
  - `#mat-button-toggle-*`
  - `#mat-input-*`
  - `#mat-select-value-*`
  - `#mat-mdc-*`
- Avoid fragile positional locators such as `.first()` and `.nth()` when a stable accessible locator is available.
- Do not replace a clear locator with a more indirect or harder-to-read one just to make it look more uniform.
- Do not add duplicate visibility checks immediately before `.click()` when the click already requires the element to be visible, enabled, and stable.
- Only keep an explicit `expect(...).toBeVisible()` before a click when it adds distinct value, such as a clearer failure message or a separate assertion.
- Reuse locator variables only when they are used more than once or clearly improve readability.
- Prefer validating the real result of a flow over only checking that a container exists or is visible.
- If a test no longer provides meaningful coverage, consider removing it instead of keeping low-value maintenance cost.

These rules should be treated as high-priority review checks for any E2E refactor or new Playwright test.

---

## Commit Style

Use descriptive commit messages. [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) style is preferred:

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
