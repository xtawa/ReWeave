# Action Review

## 2025-12-20

### Mobile Menu Implementation
- **Action**: Modified `src/themes/weave/components/Header.tsx` to add a responsive mobile menu.
- **Details**:
    - Added a hamburger menu button visible only on mobile (`md:hidden`).
    - Added a full-screen overlay menu (`#mobile-menu`) containing the navigation links.
    - Added inline JavaScript to handle the menu toggle logic (show/hide with fade transition).
- **Reason**: The user reported that the menu was not visible on mobile devices.

### Clean URLs Implementation
- **Action**: Modified `src/core/config.ts`, `src/themes/weave/components/Pagination.tsx`, and `src/core/build.tsx`.
- **Details**:
    - Updated `config.ts` to remove `.html` extensions from navbar links.
    - Updated `Pagination.tsx` to generate clean URLs for pagination links (e.g., `/articles/2` instead of `/articles/2.html`).
    - Updated `build.tsx` to:
        - Use a helper function `writeHtml` to write files to `folder/index.html` structure instead of `folder.html`.
        - Remove `.html` extensions from all generated links in HTML, RSS, and Sitemap.
- **Reason**: The user requested that links should not end with `.html` (e.g., `/posts` instead of `/posts.html`).

### Chinese Path Fix
- **Action**: Modified `src/core/build.tsx`.
- **Details**:
    - Applied `safeSlug` function to all post URLs (including RSS and Sitemap).
    - `safeSlug` converts non-ASCII strings to hex encoding to ensure safe filenames and URLs.
- **Reason**: The user requested to fix issues with Chinese paths.

### Pinned Posts Implementation
- **Action**: Modified `src/core/markdown.ts` and `src/core/build.tsx`.
- **Details**:
    - Updated `Post` interface and `getPosts` in `markdown.ts` to support `pin` frontmatter.
    - Updated sorting logic in `markdown.ts` to prioritize pinned posts (newest first).
    - Updated `build.tsx` to display a pin icon next to the title of pinned posts.
- **Reason**: The user requested a feature to pin posts to the top.

### Full Width Layout Fix & Home Page Width Override
- **Action**: Modified `src/themes/weave/layouts/Layout.tsx` and `src/core/build.tsx`.
- **Details**:
    - Updated `Layout.tsx` to allow overriding `contentWidth` via props.
    - In `build.tsx`, passed `contentWidth="normal"` to the home page and articles list page.
    - This ensures that while the site default can be `full`, the home page remains centered and non-flush with the screen edges as requested.
- **Reason**: The user requested that the home page be non-full width while other pages follow the config.

### Dark Mode Rendering Fix (Consistency & Contrast)
- **Action**: Modified `src/themes/weave/layouts/Layout.tsx` and `src/core/build.tsx`.
- **Details**:
    - Updated `Layout.tsx` dark mode detection script to use `localStorage.getItem('color-theme')` to match the theme toggle logic in `Footer.tsx`.
    - Added `text-zinc-900 dark:text-zinc-100` to the `body` in `Layout.tsx` for global dark mode text support.
    - In `build.tsx`, updated Category, Tag, and Archive pages to use `dark:text-white` for titles and `dark:text-zinc-100` for post titles.
    - **Added Timeline to Archive Page**: Added a list of posts grouped by year to the Archive page, as users expect to see articles there.
    - **Improved Contrast**: Brightened dark mode text colors for excerpts (`zinc-300`) and category list items (`zinc-100`).
    - **Forced White Text**: Updated Category and Tag list buttons to use `dark:text-white` explicitly for maximum visibility in dark mode.
    - **Pure White Enforcement**: Updated all text elements (including counts and dates) in Archive, Category, and Tag pages to use `dark:text-white` as requested by the user.
- **Reason**: The user reported that titles and posts in Archive, Category, and Tag pages were not white in dark mode, and articles were hard to see (or missing in Archive).

## Next Step
- Verify the dark mode rendering and home page layout.
