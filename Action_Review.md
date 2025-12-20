# Action Review

## 2025-12-20

### Fix Dark Mode Text Color on Archive, Categories, and Tags Pages
- **Issue**: Text on Archive, Categories, and Tags pages was dark on a dark background in dark mode, making it unreadable.
- **Action**: Updated `src/core/build.tsx` to use `dark:!text-white` instead of `dark:text-white` (or relying on inheritance) for:
    - Archive page title and card content (Categories/Tags counts).
    - Archive page list items (Years, Dates, Post Titles).
    - Categories page title and list items.
    - Tags page title and list items.
- **Reason**: To ensure high contrast and readability in dark mode, overriding any conflicting styles.

### Change Global Content Width to Normal
- **Issue**: User requested all pages to be non-full-width (非全贴合).
- **Action**: Updated `src/core/config.ts` to set `theme.contentWidth` to `'normal'`.
- **Reason**: This global setting ensures that all pages using the `Layout` component default to a constrained width (max-w-7xl) instead of full width, unless explicitly overridden.

### Implement Sticky Footer
- **Issue**: User requested the footer on Archive and its sub-pages to be at the bottom of the screen (sticky footer).
- **Action**: Updated `src/themes/weave/layouts/Layout.tsx`:
    - Calculated `minHeightClass` based on `isFullWidth` and `verticalMargin` (accounting for top margins).
    - Changed the inner content container to `flex flex-col ${minHeightClass}`.
    - Wrapped `{children}` in a `div` with `flex-1` to push the footer down when content is short.
- **Reason**: To ensure the footer stays at the bottom of the viewport on pages with little content, improving visual balance.

### Revise Sticky Footer Logic
- **Issue**: User reported the previous sticky footer fix was ineffective ("还是不变").
- **Action**: Updated `src/themes/weave/layouts/Layout.tsx` to increase the subtracted height in `min-h` calculation:
    - Changed from `min-h-[calc(100vh-2rem)]` to `min-h-[calc(100vh-6rem)]`.
    - Changed from `sm:min-h-[calc(100vh-4rem)]` to `sm:min-h-[calc(100vh-8rem)]`.
- **Reason**: The previous calculation likely didn't account for all vertical spacing (e.g., header height, footer padding, or other margins). Increasing the offset ensures the container fits within the viewport while still pushing the footer down.

### Final Sticky Footer Fix (Flexbox)
- **Issue**: Previous `min-h` calculation was still not perfectly positioning the footer at the bottom.
- **Action**: Updated `src/themes/weave/layouts/Layout.tsx` to use a full flexbox chain:
    - Added `min-h-screen` to the main wrapper.
    - Added `flex-1 flex flex-col` to all nested containers down to the content area.
    - Removed manual `min-h` calculations.
- **Reason**: This is a more robust way to implement a sticky footer that automatically adapts to varying header heights and margins without manual offsets.

### Improve Dark Mode Visibility for Tags and Titles
- **Issue**: Tags and titles on Archive, Categories, and Tags pages were hard to read in dark mode (poor contrast).
- **Action**: Updated `src/core/build.tsx`:
    - Replaced `dark:!text-white` with `dark:text-zinc-100` for main titles and headings.
    - Adjusted tag styling: used `bg-teal-50 dark:bg-teal-900/30` and `text-teal-700 dark:text-teal-200` with subtle borders.
    - Adjusted category styling: used `dark:bg-zinc-800/50` and `dark:text-zinc-200`.
- **Reason**: Standard Tailwind gray and teal scales provide better readability and a more polished look than pure white on black, especially when combined with semi-transparent backgrounds.
