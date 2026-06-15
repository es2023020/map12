---
name: TanStack Router code-splitter naming
description: Importing a named symbol into a TanStack route file can cause "Duplicate declaration" errors in the code-splitter compile-reference-file plugin
---

## Rule
Do NOT export or import a React component by a name that TanStack Router's code-splitter might auto-generate (e.g. `DevLogo`, component names that match other declarations). Instead, define helper components inline within the route file under a unique name (e.g. `LogoBadge`).

**Why:** The `tanstack-router:code-splitter:compile-reference-file` Babel plugin hoists declarations into a synthetic reference file. If an imported name collides with an auto-generated declaration, you get "Duplicate declaration 'X'" at build time, which silently breaks the route.

**How to apply:** When you want to share a small UI helper across route files, either (a) inline it with a unique name per file, or (b) use a non-conflicting exported name and alias it on import (`import { DevLogo as LogoBadge }`).
