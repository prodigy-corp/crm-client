# CMS Quick Reference Card

## 🚀 Quick Start

### Access the CMS
1. Login as admin
2. Go to **Admin Panel** in sidebar
3. Click **Site Settings** or **SEO Settings**

---

## 📍 Routes

| Page | Route |
|------|-------|
| Site Settings | `/dashboard/admin/cms/site-settings` |
| SEO Settings | `/dashboard/admin/cms/seo-settings` |

---

## 📂 Key Files

```
Frontend Implementation:
├── app/dashboard/admin/cms/
│   ├── site-settings/page.tsx          # Site Settings UI
│   └── seo-settings/
│       ├── page.tsx                    # SEO Settings UI
│       └── _components/seo-tabs.tsx    # SEO Tab Components
│
├── lib/api/admin.ts                     # API calls & types
├── hooks/use-admin.ts                   # React Query hooks
└── app/dashboard/_components/sidebar/
    └── menu-list.tsx                    # Navigation menu

Documentation:
├── README.CMS.md                        # Full documentation
├── CMS_SETUP_GUIDE.md                   # Backend setup
├── CMS_IMPLEMENTATION_SUMMARY.md        # Implementation details
└── QUICK_REFERENCE.md                   # This file
```

---

## 🎯 React Query Hooks

```typescript
import { 
  useSiteSettings, 
  useUpdateSiteSettings,
  useSEOSettings,
  useUpdateSEOSettings 
} from "@/hooks/use-admin";

// Fetch site settings
const { data, isLoading, error } = useSiteSettings();

// Update site settings
const mutation = useUpdateSiteSettings();
mutation.mutate({ siteName: "New Name" });

// Fetch SEO settings
const { data: seo } = useSEOSettings();

// Update SEO settings
const seoMutation = useUpdateSEOSettings();
seoMutation.mutate({ metaTitle: "New Title" });
```

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| GET | `/admin/cms/site-settings` | ✅ Admin |
| PUT | `/admin/cms/site-settings` | ✅ Admin |
| GET | `/admin/cms/seo-settings` | ✅ Admin |
| PUT | `/admin/cms/seo-settings` | ✅ Admin |

### Response Format
```json
{
  "status": true,
  "data": { /* settings object */ },
  "message": "Success message"
}
```

---

## 📋 Site Settings Fields

### General
- `siteName` - string, required, min 2 chars
- `siteUrl` - string, required, valid URL
- `siteDescription` - string, optional, max 500 chars
- `logo` - string, optional, valid URL
- `favicon` - string, optional, valid URL

### Contact
- `contactEmail` - string, optional, valid email
- `contactPhone` - string, optional
- `contactAddress` - string, optional
- `businessHours` - string, optional

### Localization
- `timezone` - string, default "UTC"
- `language` - string, default "en"
- `currency` - string, default "USD"

### Social
- `socialLinks.facebook` - string, optional, valid URL
- `socialLinks.twitter` - string, optional, valid URL
- `socialLinks.instagram` - string, optional, valid URL
- `socialLinks.linkedin` - string, optional, valid URL
- `socialLinks.youtube` - string, optional, valid URL
- `socialLinks.github` - string, optional, valid URL

---

## 📋 SEO Settings Fields

### Meta Tags
- `metaTitle` - string, optional, max 70 chars
- `metaDescription` - string, optional, max 160 chars
- `metaKeywords` - array of strings
- `canonicalUrl` - string, optional, valid URL

### Open Graph (Facebook)
- `ogTitle` - string, optional, max 70 chars
- `ogDescription` - string, optional, max 160 chars
- `ogImage` - string, optional, valid URL (1200x630px recommended)
- `facebookAppId` - string, optional

### Twitter
- `twitterCard` - "summary" | "summary_large_image" | "app" | "player"
- `twitterTitle` - string, optional, max 70 chars
- `twitterDescription` - string, optional, max 160 chars
- `twitterImage` - string, optional, valid URL
- `twitterSite` - string, optional (@handle)
- `twitterCreator` - string, optional (@handle)

### Robots
- `robotsDirectives.index` - boolean, default true
- `robotsDirectives.follow` - boolean, default true
- `robotsDirectives.noarchive` - boolean, default false
- `robotsDirectives.nosnippet` - boolean, default false
- `robotsDirectives.noimageindex` - boolean, default false

### Verification & Analytics
- `googleSiteVerification` - string, optional
- `googleAnalyticsId` - string, optional (G-XXXXXXXXXX or UA format)
- `googleTagManagerId` - string, optional (GTM-XXXXXXX)
- `facebookPixelId` - string, optional

---

## 🎨 UI Components Used

| Component | From | Purpose |
|-----------|------|---------|
| `Card` | shadcn/ui | Content containers |
| `Input` | shadcn/ui | Text inputs |
| `Textarea` | shadcn/ui | Multi-line text |
| `Button` | shadcn/ui | Actions |
| `Label` | shadcn/ui | Input labels |
| `Badge` | shadcn/ui | Keywords display |
| `Switch` | shadcn/ui | Robots toggles |
| `Select` | shadcn/ui | Dropdowns |
| `Skeleton` | shadcn/ui | Loading states |
| `Spinner` | custom | Loading indicator |

---

## 🔧 Form Validation

### Validation Library
- **Yup** for schema validation
- **React Hook Form** for form management

### Example Validation Rules
```typescript
const schema = yup.object({
  siteName: yup.string()
    .required("Site name is required")
    .min(2, "Min 2 characters"),
  
  siteUrl: yup.string()
    .url("Must be a valid URL")
    .required("Site URL is required"),
  
  contactEmail: yup.string()
    .email("Must be a valid email")
    .optional(),
});
```

---

## 🎯 Common Tasks

### Add a New Field

1. **Update TypeScript interface** in `lib/api/admin.ts`
```typescript
export interface SiteSettings {
  // ... existing fields
  newField?: string;  // Add your field
}
```

2. **Add to form default values** in page component
```typescript
defaultValues: {
  // ... existing values
  newField: "",
}
```

3. **Add to validation schema**
```typescript
const schema = yup.object({
  // ... existing validations
  newField: yup.string().optional(),
});
```

4. **Add UI field** in the JSX
```tsx
<div className="space-y-2">
  <Label htmlFor="newField">New Field</Label>
  <Input
    id="newField"
    {...form.register("newField")}
  />
</div>
```

---

## 🐛 Troubleshooting

### Problem: Settings don't load
**Check**:
- Backend server is running
- API endpoints are implemented
- Authentication token is valid
- Check browser console for errors

### Problem: Settings don't save
**Check**:
- Network tab in browser DevTools
- Request payload format
- Backend validation errors
- User has admin permissions

### Problem: Images don't preview
**Check**:
- Image URL is valid and accessible
- No CORS issues
- Image format is supported
- Check browser console

---

## 📊 Performance Tips

1. **React Query caching**: Settings cached for 5 minutes
2. **Optimistic updates**: UI updates before server response
3. **Form debouncing**: Consider adding for auto-save
4. **Image optimization**: Compress before uploading
5. **Lazy loading**: Tab content loads on demand

---

## 🔒 Security Checklist

- [x] Authentication required for all endpoints
- [x] Authorization (admin-only) implemented
- [x] Frontend input validation
- [ ] Backend input validation (your responsibility)
- [ ] XSS prevention (sanitize inputs)
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Audit logging

---

## 📱 Responsive Design

- ✅ Mobile (< 640px): Single column layout
- ✅ Tablet (640px - 1024px): Adaptive layout
- ✅ Desktop (> 1024px): Two-column grid
- ✅ All form elements touch-friendly
- ✅ Tab navigation scrolls on mobile

---

## 🌙 Dark Mode

- ✅ Automatically follows system preference
- ✅ Can be toggled manually
- ✅ All colors support dark mode
- ✅ Images adapt to theme
- ✅ Form elements styled for dark mode

---

## 📈 SEO Best Practices

### Meta Tags
- Title: 50-60 characters optimal
- Description: 150-160 characters optimal
- Keywords: 3-5 relevant terms

### Images
- OG Image: 1200x630px
- Logo: SVG or PNG, transparent background
- Favicon: 32x32px ICO or PNG

### Robots
- Index: true for public pages
- Follow: true to allow link following
- NoArchive: true if content changes frequently

---

## 🚀 Deployment Checklist

### Before Deploying
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] SSL certificate installed
- [ ] CDN configured for images
- [ ] Error monitoring setup
- [ ] Backup system in place

### After Deploying
- [ ] Test site settings page
- [ ] Test SEO settings page
- [ ] Verify saved settings persist
- [ ] Check responsive design
- [ ] Test dark mode
- [ ] Monitor error logs
- [ ] Check performance metrics

---

## 📚 Learn More

| Topic | Resource |
|-------|----------|
| Full Documentation | `README.CMS.md` |
| Backend Setup | `CMS_SETUP_GUIDE.md` |
| Implementation Details | `CMS_IMPLEMENTATION_SUMMARY.md` |
| Next.js | https://nextjs.org/docs |
| React Query | https://tanstack.com/query |
| shadcn/ui | https://ui.shadcn.com |

---

## 🎯 Key Takeaways

1. **Frontend is complete** ✅
2. **Backend needs 4 endpoints** ⚠️
3. **Database tables required** ⚠️
4. **~3-4 hours of backend work** ⏱️
5. **Production-ready code** ✅
6. **Fully documented** ✅

---

**Questions? Check `README.CMS.md` for detailed answers!**
