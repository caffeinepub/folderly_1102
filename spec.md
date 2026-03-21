# ICcloud

## Current State
A file management app called "Folderly" with:
- A landing/intro page showing the app name "Folderly" with a FolderTree icon, tagline, feature highlights, sample file preview cards, and a "Get Started with Internet Identity" login button.
- An authenticated app view with folder/file management, search, tag filtering, and CSV export.
- Header showing "Folderly" branding.

## Requested Changes (Diff)

### Add
- New professional, light, eye-catching intro/landing page for ICcloud with minimal content and a prominent login point.

### Modify
- Rename app from "Folderly" to "ICcloud" in all UI text (landing page header, authenticated header, any branding references).
- Redesign the landing page: light background, colorful and stylish visuals, minimal text (tagline + brief description), a single prominent login CTA button.
- Replace FolderTree icon with Cloud icon to match the ICcloud brand.

### Remove
- Old "Folderly" branding and landing page design.

## Implementation Plan
1. Update App.tsx landing page section: replace "Folderly" with "ICcloud", swap icon, redesign layout with a modern light design featuring gradient accents, bold typography, and a clean login CTA.
2. Update Header.tsx: replace "Folderly" with "ICcloud" and swap icon.
3. Ensure all text references to "Folderly" are replaced throughout the frontend.
