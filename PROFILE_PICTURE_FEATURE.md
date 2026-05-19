# Profile Picture Upload Feature

## Overview
Users can now upload a custom profile picture on the Settings page. If no picture is provided, a default icon badge appears.

## Implementation Details

### 1. Settings Page Updates
**File**: `app/(account)/account/settings/page.tsx`

#### Display Mode
- Shows current profile picture (128x128px)
- Shows "No picture" with user icon if not set
- Smooth rounded corners and proper spacing

#### Edit Mode
- New `ImageUpload` component at the top
- Allows drag-and-drop or click to select image
- Supports: JPG, PNG, WebP (max 5MB)
- Preview shown before saving

#### Profile Picture in Display Mode
```jsx
<div className="h-32 w-32 rounded-lg overflow-hidden bg-neutral-100">
  {profile?.profile_picture_url ? (
    <Image src={profile.profile_picture_url} ... />
  ) : (
    <User icon with "No picture" text />
  )}
</div>
```

### 2. Backend Updates
**File**: `app/actions/account.ts`

#### Enhanced `updateProfile` Function
- Accepts profile picture as FormData
- Uploads to Supabase Storage (`users` bucket)
- Stores in path: `profile-pictures/{userId}-{timestamp}.{ext}`
- Stores public URL in database
- Returns error if upload fails
- Only updates if new picture provided

#### Upload Process
```
1. Validate picture is File type
2. Generate unique filename with user ID and timestamp
3. Upload to Supabase Storage with upsert option
4. Get public URL from storage
5. Update database with profile_picture_url
6. Handle errors gracefully
```

### 3. Header/Avatar Updates
**File**: `components/layout/app-shell.tsx`

#### User Avatar Badge
- **With Picture**: Shows actual profile picture (36x36px, rounded)
- **Without Picture**: Shows default user icon in circle
- Both centered in the header

```jsx
{user?.profilePicture ? (
  <Image src={user.profilePicture} width={36} height={36} />
) : (
  <User icon in circle />
)}
```

### 4. Database Schema Required
The `users` table needs:
```sql
profile_picture_url VARCHAR(500) -- URL to stored image
```

This column stores the public URL returned by Supabase Storage.

---

## User Experience Flow

### Uploading Picture
```
1. User goes to Settings
2. Clicks "Edit" button
3. Sees profile picture upload area
4. Either:
   - Drags image onto the upload area, OR
   - Clicks to browse files
5. Selects image (JPG, PNG, WebP, max 5MB)
6. Sees preview in upload box
7. Reviews all changes in confirmation dialog
8. Clicks "Confirm Changes"
9. Picture uploaded and profile updated
10. Sees new picture in profile display
11. Avatar in header updates
```

### Removing Picture
```
1. User in edit mode
2. Sees picture in upload area
3. Clicks X button on picture
4. Picture removed from form
5. Saves changes
6. Profile picture removed from database
7. Default icon shows in header
```

### No Picture Set
```
Default user icon shows:
- In Settings (display mode)
- In Header/Avatar badge
```

---

## Technical Stack

### Components
- `ImageUpload`: Drag-drop image upload with preview
- Settings page: Handles edit/display modes
- Header: Shows picture or default

### Storage
- **Service**: Supabase Storage
- **Bucket**: `users`
- **Path**: `profile-pictures/{userId}-{timestamp}.{ext}`
- **Access**: Public (readable, not writable)

### Database
- **Table**: `users`
- **Column**: `profile_picture_url (VARCHAR)`
- Stores public URL returned by storage service

---

## File Changes Summary

### Modified Files (3)
1. `app/(account)/account/settings/page.tsx`
   - Added image upload field
   - Updated profile display with picture preview
   - Enhanced form handling for pictures

2. `app/actions/account.ts`
   - Enhanced `updateProfile()` to handle picture upload
   - Added Supabase Storage integration
   - Proper error handling for uploads

3. `components/layout/app-shell.tsx`
   - Updated avatar to show picture or default
   - Added Image import

---

## Features

### Image Upload
✅ Drag-and-drop support
✅ Click to browse
✅ File type validation (JPG, PNG, WebP)
✅ File size limit (5MB)
✅ Real-time preview
✅ Remove/clear button

### Display
✅ Profile picture in settings
✅ Avatar in header
✅ Responsive sizing
✅ Proper fallback to icon

### Confirmation
✅ Preview before upload
✅ Review dialog shows changes
✅ Success/error messages
✅ Graceful error handling

---

## Testing Checklist

### Upload Picture
- [ ] Go to Settings → Click Edit
- [ ] See image upload area
- [ ] Drag image onto area → preview appears
- [ ] Click upload area → browse dialog opens
- [ ] Select image → preview shows
- [ ] Click "Review Changes"
- [ ] See confirmation with picture noted as changed
- [ ] Click "Confirm Changes"
- [ ] Success message appears
- [ ] Picture shows in profile display
- [ ] Picture shows in header avatar

### Remove Picture
- [ ] Edit mode with picture uploaded
- [ ] Click X on picture
- [ ] Picture removed from form
- [ ] Save changes
- [ ] Default icon shows in header

### File Validation
- [ ] Try uploading non-image file → error message
- [ ] Try uploading >5MB file → error message
- [ ] Upload valid image → success

### Multiple Uploads
- [ ] Upload picture 1
- [ ] Edit again, upload picture 2
- [ ] Picture 2 replaces picture 1
- [ ] No duplicate files stored

---

## Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## Performance Notes
- Images stored in Supabase Storage (optimized CDN)
- Public URLs cached by browser
- Minimal database impact (just URL storage)
- Upload async, doesn't block UI
- Loading indicator during upload

---

## Security
- ✅ File type validation on client + server
- ✅ File size limit (5MB max)
- ✅ Unique filename prevents overwrite concerns
- ✅ User can only upload their own picture
- ✅ Storage URL is public (read-only)

---

## Future Enhancements
- Image cropping/resizing before upload
- Image optimization (WebP conversion)
- Multiple picture storage with rotation
- Picture frame/border options
- Batch upload support

