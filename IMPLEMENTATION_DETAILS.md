# Implementation Details - Realistic Workflows

## Technical Architecture

### State Management Pattern

All realistic workflow components follow this pattern:

```typescript
// 1. Core state
const [data, setData] = useState(...)           // Current data
const [isEditing, setIsEditing] = useState(false) // Mode flag
const [isLoading, setIsLoading] = useState(false) // Loading state

// 2. Form state (for edit mode)
const [formData, setFormData] = useState(...)   // Form values

// 3. Confirmation state
const [showConfirm, setShowConfirm] = useState(false) // Confirmation dialog
const [changes, setChanges] = useState(null)    // What's changing (for preview)

// 4. Handlers
const handleStart = () => { /* enter edit/action */ }
const handleReview = () => { /* prepare confirmation */ }
const handleConfirm = async () => { /* execute action */ }
const handleCancel = () => { /* discard changes */ }
```

---

## Component Implementation Examples

### Pattern 1: Display → Edit → Review → Confirm

**Used in**: Settings (Profile)

```typescript
// DISPLAY MODE (Default)
{!isEditing ? (
  <div className="space-y-4">
    {/* Show current saved values */}
    <p className="text-xs text-neutral-600">FIRST NAME</p>
    <p className="text-sm text-neutral-900">{profile.first_name}</p>
    
    <Button onClick={() => setIsEditing(true)}>Edit</Button>
  </div>
) : (
  // EDIT MODE
  <div className="space-y-4">
    {/* Show editable fields */}
    <Input
      value={formData.firstName}
      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
    />
    
    <Button onClick={handleReviewClick}>Review Changes</Button>
    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
  </div>
)}

// CONFIRMATION DIALOG
<AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
  <AlertDialogContent>
    <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
    <AlertDialogDescription>
      {/* Show old vs new */}
      First Name: {changes.firstName.old} → {changes.firstName.new}
    </AlertDialogDescription>
    <div className="flex gap-2">
      <AlertDialogCancel>Go Back</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
    </div>
  </AlertDialogContent>
</AlertDialog>
```

---

### Pattern 2: Verify → Execute (Password)

**Used in**: Settings (Password)

```typescript
const [stage, setStage] = useState('start') // 'start' | 'verify' | 'newpassword'

// STAGE 1: Verify Current Password
{stage === 'verify' && (
  <div>
    <Input
      type="password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      placeholder="Enter current password"
    />
    <Button onClick={handleVerify}>Verify Password</Button>
  </div>
)}

// STAGE 2: Enter New Password (after verification)
{stage === 'newpassword' && (
  <div>
    <div className="bg-green-50 p-3">✓ Password verified</div>
    <Input type="password" placeholder="New password" />
    <Input type="password" placeholder="Confirm password" />
    <Button onClick={handleChangePassword}>Change Password</Button>
  </div>
)}

// HANDLER: Verify Current Password
const handleVerify = async () => {
  try {
    const response = await fetch('/api/auth/validate-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword })
    })
    
    if (!response.ok) {
      toast.error('Current password is incorrect')
      return
    }
    
    setStage('newpassword') // Move to next stage
  } catch (err) {
    toast.error('Error verifying password')
  }
}
```

---

### Pattern 3: Action → Confirm (Simple Confirmations)

**Used in**: Cart, Addresses, Wishlist

```typescript
const [showConfirm, setShowConfirm] = useState(false)

// BUTTON THAT TRIGGERS CONFIRMATION
<Button onClick={() => setShowConfirm(true)}>Delete</Button>

// CONFIRMATION DIALOG
<AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
  <AlertDialogContent>
    <AlertDialogTitle>Delete Item?</AlertDialogTitle>
    <AlertDialogDescription>
      This will delete "Item Name". This action cannot be undone.
    </AlertDialogDescription>
    <div className="flex gap-2">
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-red-600 text-white"
      >
        Delete
      </AlertDialogAction>
    </div>
  </AlertDialogContent>
</AlertDialog>

// HANDLER
const handleDelete = async () => {
  setShowConfirm(false)
  const result = await deleteItem()
  if (result.error) {
    toast.error(result.error)
  } else {
    toast.success('Item deleted')
  }
}
```

---

## API Endpoint Implementation

### Password Validation Endpoint

**Path**: `app/api/auth/validate-password/route.ts`

```typescript
import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Parse request
    const body = await request.json()
    const { currentPassword } = body

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      )
    }

    // Verify password by attempting re-auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Success
    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Why This Design**:
- ✅ Validates on backend (security)
- ✅ Uses actual Supabase auth (no workarounds)
- ✅ Proper HTTP status codes
- ✅ Clear error messages
- ✅ Handles edge cases

---

## Backend Function Updates

### Changed `changePassword()` in `app/actions/account.ts`

**Before**:
```typescript
export async function changePassword(formData: FormData) {
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string
  
  // Only validates new password, doesn't verify current!
  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  return { error: error?.message || null }
}
```

**After**:
```typescript
export async function changePassword(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // NEW: Validate all inputs
  if (!currentPassword) {
    return { error: 'Current password is required' }
  }

  if (!newPassword) {
    return { error: 'New password is required' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match' }
  }

  if (newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  if (currentPassword === newPassword) {
    return { error: 'New password must be different from current password' }
  }

  // NEW: Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })

  if (signInError) {
    return { error: 'Current password is incorrect' }
  }

  // Now update to new password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) return { error: error.message }
  return { error: null }
}
```

**Key Differences**:
1. Now accepts and validates `currentPassword`
2. Verifies current password against Supabase auth
3. Prevents using same password twice
4. Better error messages for each case
5. All validation happens server-side (secure)

---

## Error Handling Pattern

### Frontend Error Handling

```typescript
const handleAction = async () => {
  setLoading(true)
  
  try {
    const result = await serverAction()
    
    if (result.error) {
      // Show error to user
      toast.error(result.error)
      
      // Reset state if needed
      setShowConfirm(false)
      
      return // Don't proceed
    }
    
    // Success
    toast.success('Success message')
    
    // Update UI
    setIsEditing(false)
    setData(newData)
    
  } catch (err: any) {
    // Network or other errors
    toast.error(err.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}
```

---

## Form Data Comparison

### For Review Confirmations

```typescript
// When user clicks "Review Changes"
const handleReviewClick = () => {
  const changes: any = {}
  
  // Compare new values with current values
  if (formData.firstName !== profile?.first_name) {
    changes.firstName = {
      old: profile?.first_name || "Not set",
      new: formData.firstName
    }
  }
  
  if (formData.phone !== profile?.phone) {
    changes.phone = {
      old: profile?.phone || "Not set",
      new: formData.phone
    }
  }
  
  // If nothing changed
  if (Object.keys(changes).length === 0) {
    toast.info("No changes made")
    return
  }
  
  // Show changes in confirmation
  setChanges(changes)
  setShowConfirm(true)
}
```

---

## State Flow Diagrams

### Settings - Profile Update
```
┌─────────────────────────────────────┐
│ DISPLAY MODE                        │
│ (isEditing = false)                 │
│ • Show current values               │
│ • Click "Edit"                      │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│ EDIT MODE                           │
│ (isEditing = true)                  │
│ • Editable form fields              │
│ • Click "Review Changes"            │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│ CONFIRMATION DIALOG                 │
│ (showConfirm = true)                │
│ • Show old → new values             │
│ • Click "Confirm Changes"           │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│ UPDATE & RETURN TO DISPLAY          │
│ • Save to database                  │
│ • Update local state                │
│ • Close dialog                      │
│ • Exit edit mode                    │
└─────────────────────────────────────┘
```

### Settings - Password Change
```
┌─────────────────────────────────────┐
│ START                               │
│ • Click "Change Password"           │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│ VERIFY STAGE                        │
│ (stage = 'verify')                  │
│ • Input: Current password           │
│ • Click "Verify Password"           │
│ • Call /api/auth/validate-password  │
└──────────────────┬──────────────────┘
           ┌───────┴───────┐
           ▼               ▼
        ✓ VALID        ✗ INVALID
           │               │
           ▼               ▼
    ┌────────────────┐ Error toast
    │ NEW PASSWORD   │ Stay on verify
    │   STAGE        │ stage
    │ (Enter new)    │
    │ Click "Change" │
    │ (Move to DB)   │
    └────────────────┘
           │
           ▼
    ✓ Success
```

### Cart - Clear
```
┌─────────────────────────────────────┐
│ CART PAGE                           │
│ [Clear Cart] button visible         │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│ CONFIRMATION DIALOG                 │
│ "This will remove all X items"      │
│ "Cannot be undone"                  │
│ [Keep Items] [Clear Cart]           │
└─────────────────────────────────────┘
       ▲        │        │
       │        │        ▼
    Cancel      │    Execute
       │        │        │
       └────────┼────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
    CANCEL         EXECUTE
    • Stay on   • Clear cart
      cart page • Empty state
    • Items     • Back to
      stay        empty cart
                  message
```

---

## Testing Scenarios

### Scenario 1: Profile Update with Review
```
Setup: User on settings page with current values
Step 1: Click Edit
  ✓ Form fields become editable
  ✓ "Review Changes" button appears
  ✓ "Cancel" button appears

Step 2: Change first name from "John" to "Jonathan"
  ✓ Form value updates

Step 3: Click "Review Changes"
  ✓ Confirmation dialog opens
  ✓ Shows "John → Jonathan"
  
Step 4: Click "Confirm Changes"
  ✓ Success toast appears
  ✓ View mode restored
  ✓ Profile shows "Jonathan"
  
Step 5: Refresh page
  ✓ Still shows "Jonathan" (persisted)
```

### Scenario 2: Password Change - Wrong Current
```
Setup: User on settings page
Step 1: Click "Change Password"
  ✓ Shows current password input

Step 2: Enter wrong password
  ✓ Click "Verify Password"
  ✓ API call made to /api/auth/validate-password
  
Step 3: See error
  ✓ Toast error: "Current password is incorrect"
  ✓ Still on verify stage
  
Step 4: Enter correct password
  ✓ Click "Verify Password"
  ✓ See "✓ Password verified" message
  ✓ Move to new password input
```

### Scenario 3: Cart Clear Confirmation
```
Setup: Cart has 3 items
Step 1: Click "Clear Cart"
  ✓ Confirmation dialog opens
  ✓ Shows "This will remove all 3 items"
  
Step 2: Click "Keep Items"
  ✓ Dialog closes
  ✓ All 3 items still in cart
  
Step 3: Click "Clear Cart" again
  ✓ Dialog opens again
  
Step 4: Click "Clear Cart" in dialog
  ✓ Dialog closes
  ✓ Cart becomes empty
  ✓ "Your cart is empty" message shows
```

---

## Performance Considerations

### Optimizations Applied

1. **State Splitting**: Separate states for different concerns
   - Data state: holds actual data
   - Form state: holds temporary form values
   - UI state: dialog visibility, loading flags

2. **Efficient Re-renders**: 
   - Conditional rendering prevents unnecessary DOM updates
   - Form changes don't re-render entire page

3. **Async Operations**:
   - Loading states prevent double-clicks
   - API calls happen only on confirm
   - No premature database updates

4. **API Efficiency**:
   - Password validation happens once
   - Only called when needed
   - Minimal payload (just password)

---

## Security Implementation

### Defense in Depth

1. **Frontend Validation**
   - Immediate feedback to user
   - Password match validation
   - Minimum length check

2. **Backend Validation** (Server Actions)
   - Re-validate all inputs
   - Compare new vs current password
   - Additional business logic

3. **API Endpoint Validation**
   - Authentication check
   - Password verification via Supabase
   - Proper error responses

### Why Multiple Layers?

- **Frontend**: UX feedback
- **Server Action**: Business logic
- **API Endpoint**: Critical operations

This "defense in depth" ensures security even if frontend is bypassed.

---

## Browser Compatibility

All implemented features use:
- ✅ Standard ES6+ JavaScript
- ✅ React Hooks (useState, useTransition)
- ✅ Next.js Server Components & Actions
- ✅ Native Fetch API
- ✅ Standard HTML5 forms

**Compatible with**: All modern browsers (Chrome, Firefox, Safari, Edge)

---

## Accessibility Considerations

### Dialog Accessibility
- Uses `AlertDialog` component from shadcn/ui
- Built on Radix Dialog (accessible)
- Proper ARIA labels
- Focus management
- Keyboard navigation (Escape to close)

### Form Accessibility
- Proper `<label>` elements
- Input IDs link to labels
- Form validation feedback
- Clear error messages

### Button Accessibility
- Clear button text
- Type clearly specified
- Disabled state properly managed

---

## Future Enhancements

### Could Be Added
1. **Undo/History**: Show change history
2. **Drafts**: Save changes as draft before confirming
3. **Notifications**: Notify of changes via email
4. **Audit Log**: Track who changed what and when
5. **Two-Factor**: Require 2FA for password changes

---

## Summary

The implementation follows modern React patterns and provides:
- ✅ Realistic user workflows
- ✅ Security through verification
- ✅ Clear user feedback
- ✅ Error handling
- ✅ Accessibility
- ✅ Performance optimization

All code is production-ready and follows best practices.

