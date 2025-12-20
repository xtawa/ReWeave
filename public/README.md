# Public Assets Directory

This directory contains static assets that will be copied to the root of your built site.

## Usage

Place any static files here that you want to be accessible from the root of your website:

- **Logo**: `logo.png`, `logo.svg`, etc.
- **Favicon**: `favicon.ico`
- **Images**: Any images you want to reference directly
- **Other assets**: robots.txt, sitemap.xml, etc.

## Logo Configuration

To use a custom logo:

1. Place your logo file in this directory (e.g., `logo.png`)
2. Update `src/core/config.ts`:

```typescript
logo: {
    path: "logo.png",  // Filename in public/ directory
    alt: "Your Site Logo",
},
```
//support eternal links like https://...


## Build Process

During build, all files in this directory will be copied to the `dist/` directory, making them accessible at the root of your site.

For example:
- `public/logo.png` → `dist/logo.png` → accessible at `/logo.png`
- `public/favicon.ico` → `dist/favicon.ico` → accessible at `/favicon.ico`

## Supported File Types

Any file type is supported. Common examples:

- Images: `.png`, `.jpg`, `.svg`, `.webp`, `.gif`
- Icons: `.ico`
- Documents: `.pdf`
- Text files: `.txt`, `.xml`
