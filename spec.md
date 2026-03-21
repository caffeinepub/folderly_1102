# ICcloud

## Current State
The app has a landing page and authenticated file manager. Some responsive classes exist but several areas need improvement for small screens.

## Requested Changes (Diff)

### Add
- Nothing new.

### Modify
- Landing page blobs: scale down on mobile to prevent overflow
- App toolbar: on mobile wrap search to full-width top row, action buttons on row below
- ProfileSetupDialog: fix title from "Folderly" to "ICcloud"
- FilePreviewDialog: constrain width/height better on mobile
- General: ensure 44px touch targets, proper padding on small screens

### Remove
- Nothing.

## Implementation Plan
1. Fix ProfileSetupDialog title
2. Make landing page blobs responsive
3. Restructure AuthenticatedApp toolbar for mobile
4. Improve FilePreviewDialog on mobile
5. Audit touch targets and padding across components
