---
name: TanStack Router nested routes layout fix
description: Fix for child routes not rendering when parent route file lacks Outlet
---

## Rule
When a TanStack Router route file (`projects.tsx`) has child routes (`projects.$slug.tsx`), the parent MUST render `<Outlet />` or children will never render — even though SSR loads the correct data, the HTML body shows only the parent's content.

**Why:** TanStack Router builds a nested hierarchy from file paths. The parent component renders first; children render where the parent places `<Outlet>`. Without Outlet, the parent renders its full content and the child component tree is silently discarded.

**How to apply:**
- Split the route into two files:
  1. `projects.tsx` → pure layout: `createFileRoute("/projects")({ component: () => <Outlet /> })`
  2. `projects.index.tsx` → content: `createFileRoute("/projects/")({ component: ProjectsPage })`
- The `$slug.tsx` child then renders correctly as an independent route.
- Symptom to recognize: SSR title is CORRECT for the child page, but the body HTML shows the parent's content. The SSR `$_TSR` payload has `s:"success"` for the child match.
