---
description: "Always active for all GitMood prompts. Enforces agent collaboration between the Product Owner and Tech Architect, and generates a PR title and description after every implementation task."
name: "GitMood Workflow"
applyTo: "**"
---

# GitMood — Always-On Workflow

## Agent Roles (Active on Every Prompt)

Before responding to any prompt, mentally apply both agents as filters:

| Agent | Role | Veto Power |
|---|---|---|
| **GitMood Product Owner** | Is this feature in scope? Does it match the vision? | Can block out-of-scope work |
| **GitMood Tech Architect** | Is this code correct? Does it follow the stack and patterns? | Can block non-compliant code |

**Rule:** If a prompt conflicts with either agent's domain, surface the conflict before proceeding.

- If the request is **out of product scope** → flag it as the PO would: state why it conflicts with the vision and ask for confirmation.
- If the request produces **non-compliant code** → flag it as the Architect would: show the violation and the correct pattern before writing any code.

## Stack Reminder (Non-Negotiable)

| Layer | Technology |
|---|---|
| Runtime | Bun |
| Framework | TanStack Start |
| Routing | TanStack Router (file-based) |
| Data Fetching / Mutations | TanStack Query + `createServerFn` |
| Styling | Tailwind CSS v4 |
| Linting / Formatting | Biome |
| Testing | Vitest |
| Database | SQLite via `bun:sqlite` (only in `src/lib/db.ts`) |
| Language | TypeScript strict + TSX |

## PR Output (Required After Every Implementation Task)

After completing any prompt that creates, edits, or deletes files, append a PR block at the end of your response.

**PR title** (plain text, copy directly into the PR title field):
```
<type>(<scope>): <short imperative title>
```
**Type:** `feat` | `fix` | `chore` | `refactor` | `test` | `style` | `docs`
**Scope:** The route, component, or layer affected (e.g., `db`, `root-layout`, `check-in-form`)

**PR description** (HTML block, copy directly into the PR description field):

```html
<h2>What was implemented</h2>
<ul>
  <li><code>path/to/file.ts</code> — what this file does and why it exists</li>
  <!-- one <li> per file created or modified -->
</ul>

<h2>Why</h2>
<p>One sentence explaining the user value or architectural reason.</p>

<h2>Files changed</h2>
<table>
  <thead>
    <tr><th>File</th><th>Change</th></tr>
  </thead>
  <tbody>
    <tr><td><code>path/to/file.ts</code></td><td>Created</td></tr>
    <!-- Created | Modified | Deleted -->
  </tbody>
</table>

<h2>How to verify</h2>
<ol>
  <li>Step one — e.g. <code>bun run dev</code></li>
  <li>Step two — e.g. navigate to <code>/mood/log</code></li>
  <li>Step three — what to assert or observe</li>
</ol>

<h2>Stack compliance</h2>
<ul>
  <li>✅ Uses <code>bun:sqlite</code> only via <code>src/lib/db.ts</code></li>
  <li>✅ Data fetching via <code>createServerFn</code> + TanStack Query</li>
  <li>✅ Styling via Tailwind CSS v4 only</li>
  <li>✅ TypeScript strict — no <code>any</code></li>
</ul>
```

**PR title format examples:**
- `feat(db): add SQLite schema and seed data`
- `feat(root-layout): implement shell layout with dark mode toggle`
- `feat(check-in-form): add emoji picker, note input, and tag selector`
- `fix(seed): use INSERT OR IGNORE to prevent duplicate entries`

## What Counts as a Task Prompt

Generate a PR block when the prompt involves any of the following:
- Implementing a day from the 21-day build plan
- Creating a new file or route
- Adding a feature, component, or server function
- Fixing a bug in application code
- Refactoring existing code

Do **not** generate a PR block for:
- Questions or explanations
- Agent or config file creation (`.agent.md`, `.instructions.md`)
- Running terminal commands only
- Reading or searching the codebase
