---
name: Logo fallback pattern for developer logos
description: How to show initials instantly while a real logo loads, without broken-image states
---

## Pattern
Use two absolutely-positioned layers inside a relative container:
1. Inner div with `absolute inset-0 bg-primary flex items-center justify-center` — shows initials immediately
2. `<img>` with `absolute inset-0 opacity-0`, transitions to `opacity-100` on `onLoad`

This way the user-passed `className` (sizing, rounding) applies to the outer container only, and the bg-primary initials layer is always visible until the real logo loads.

**Why:** In Replit's preview sandbox, external DNS (clearbit.com, logo.clearbit.com) is blocked with ERR_NAME_NOT_RESOLVED. Without an immediate fallback, the browser shows a broken-image state. The pattern avoids this by having styled initials as the default visible state.

**How to apply:** Use this in every route file that shows developer logos. Clearbit will load correctly for real users in production.
