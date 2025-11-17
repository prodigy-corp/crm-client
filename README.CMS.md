# CMS System Documentation

## Overview

This Next.js starter kit now includes a comprehensive CMS (Content Management System) with full SEO capabilities. The system is production-ready and follows the existing UI/UX patterns.

## Features Implemented

### 1. **Site Settings Management**
Complete site configuration management with the following capabilities:

#### Basic Information
- **Site Name**: Your application's name
- **Site URL**: Primary domain URL
- **Site Description**: Brief description (max 500 characters)

#### Branding
- **Logo**: Site logo with live preview
- **Favicon**: Site favicon with preview

#### Contact Information
- **Contact Email**: Primary contact email
- **Contact Phone**: Contact phone number
- **Contact Address**: Physical address
- **Business Hours**: Operating hours

#### Localization
- **Timezone**: Site timezone (default: UTC)
- **Language**: Primary language (default: en)
- **Currency**: Currency code (default: USD)

#### Social Media Links
- Facebook
- Twitter
- Instagram
- LinkedIn
- YouTube
- GitHub

### 2. **SEO Settings Management**
Comprehensive SEO optimization tools organized in 4 tabs:

#### Meta Tags Tab
- **Meta Title**: Default page title (max 70 characters)
- **Meta Description**: Default page description (max 160 characters)
- **Meta Keywords**: Tag-based keyword management
- **Canonical URL**: Preferred URL for duplicate content
- **Search Preview**: Real-time preview of search engine results

#### Social Media Tab
- **Open Graph (Facebook)**
  - OG Title
  - OG Description
  - OG Image (with preview, recommended: 1200x630px)
  - Facebook App ID
  
- **Twitter Card**
  - Card Type (Summary, Summary Large Image, App, Player)
  - Twitter Title
  - Twitter Description
  - Twitter Image (with preview)
  - Twitter Site Handle
  - Twitter Creator Handle

#### Search Engines Tab
- **Robots Directives**
  - Index/NoIndex
  - Follow/NoFollow
  - NoArchive
  - NoSnippet
  - NoImageIndex
  
- **Google Site Verification**
  - Verification code with setup instructions

#### Analytics Tab
- **Google Analytics**
  - Analytics ID (G-XXXXXXXXXX or UA-XXXXXXXXX-X)
  - Tag Manager ID (GTM-XXXXXXX)
  
- **Facebook Pixel**
  - Pixel ID for conversion tracking

## API Endpoints

### Site Settings
- `GET /admin/cms/site-settings` - Get current site settings
- `PUT /admin/cms/site-settings` - Update site settings

### SEO Settings
- `GET /admin/cms/seo-settings` - Get current SEO settings
- `PUT /admin/cms/seo-settings` - Update SEO settings

## Frontend Structure

```
app/
└── dashboard/
    └── admin/
        └── cms/
            ├── site-settings/
            │   └── page.tsx
            └── seo-settings/
                ├── page.tsx
                └── _components/
                    └── seo-tabs.tsx

lib/
└── api/
    └── admin.ts (CMS types and API calls)

hooks/
└── use-admin.ts (CMS React Query hooks)
```

## React Query Hooks

### Site Settings Hooks
```typescript
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/use-admin";

// Fetch site settings
const { data: settings, isLoading, error } = useSiteSettings();

// Update site settings
const updateMutation = useUpdateSiteSettings();
updateMutation.mutate(settingsData);
```

### SEO Settings Hooks
```typescript
import { useSEOSettings, useUpdateSEOSettings } from "@/hooks/use-admin";

// Fetch SEO settings
const { data: seoSettings, isLoading, error } = useSEOSettings();

// Update SEO settings
const updateMutation = useUpdateSEOSettings();
updateMutation.mutate(seoData);
```

## TypeScript Types

### Site Settings
```typescript
interface SiteSettings {
  id: string;
  siteName: string;
  siteUrl: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  businessHours?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  updatedAt: string;
  updatedBy?: string;
}
```

### SEO Settings
```typescript
interface SEOSettings {
  id: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robotsDirectives?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
  };
  structuredData?: any;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  facebookAppId?: string;
  updatedAt: string;
  updatedBy?: string;
}
```

## Navigation

The CMS features are accessible through the Admin Panel in the sidebar:

```
Admin Panel
├── Overview
├── Users Management
├── Blogs Management
├── Roles & Permissions
├── System Health
├── Site Settings        ← NEW
└── SEO Settings         ← NEW
```

## Form Validation

Both pages implement comprehensive form validation using Yup:

### Site Settings Validation
- Site Name: Required, min 2 characters
- Site URL: Required, valid URL format
- Site Description: Max 500 characters
- Logo/Favicon: Valid URL format
- Contact Email: Valid email format
- Social Links: Valid URL format

### SEO Settings Validation
- Meta Title: Max 70 characters
- Meta Description: Max 160 characters
- OG Title: Max 70 characters
- OG Description: Max 160 characters
- Twitter Title: Max 70 characters
- Twitter Description: Max 160 characters
- All image URLs: Valid URL format

## UI/UX Features

### Consistent Design
- Follows existing design system and typography
- Uses shadcn/ui components
- Responsive layout (mobile-friendly)
- Dark mode support

### User Experience
- **Tab Navigation**: Organized content in logical tabs
- **Live Previews**: Image and search result previews
- **Character Counters**: Real-time character count for limited fields
- **Loading States**: Skeleton loaders during data fetch
- **Error Handling**: Clear error messages
- **Success Feedback**: Toast notifications on save
- **Input Helpers**: Placeholder text and helper descriptions

### Interactive Elements
- **Keyword Management**: Add/remove keywords with badges
- **Image Previews**: Live preview for logos, favicons, and social images
- **Search Preview**: See how your site appears in Google search
- **Toggle Switches**: Easy robots directive management
- **Help Instructions**: Inline guides (e.g., Google verification steps)

## Backend Requirements

Your backend API should implement these endpoints:

### Site Settings Endpoints
```typescript
// GET /admin/cms/site-settings
// Response: { data: SiteSettings, success: boolean, message?: string }

// PUT /admin/cms/site-settings
// Request: UpdateSiteSettingsDto
// Response: { data: SiteSettings, success: boolean, message?: string }
```

### SEO Settings Endpoints
```typescript
// GET /admin/cms/seo-settings
// Response: { data: SEOSettings, success: boolean, message?: string }

// PUT /admin/cms/seo-settings
// Request: UpdateSEOSettingsDto
// Response: { data: SEOSettings, success: boolean, message?: string }
```

## Database Schema Suggestions

### Site Settings Table
```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) NOT NULL,
  site_url VARCHAR(500) NOT NULL,
  site_description TEXT,
  logo VARCHAR(500),
  favicon VARCHAR(500),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_address TEXT,
  social_links JSONB,
  business_hours TEXT,
  timezone VARCHAR(100) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(10) DEFAULT 'USD',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SEO Settings Table
```sql
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  meta_keywords TEXT[],
  og_title VARCHAR(70),
  og_description VARCHAR(160),
  og_image VARCHAR(500),
  twitter_card VARCHAR(50),
  twitter_title VARCHAR(70),
  twitter_description VARCHAR(160),
  twitter_image VARCHAR(500),
  twitter_site VARCHAR(100),
  twitter_creator VARCHAR(100),
  canonical_url VARCHAR(500),
  robots_directives JSONB,
  structured_data JSONB,
  google_site_verification VARCHAR(255),
  google_analytics_id VARCHAR(100),
  google_tag_manager_id VARCHAR(100),
  facebook_pixel_id VARCHAR(100),
  facebook_app_id VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Best Practices

### SEO Best Practices
1. **Meta Titles**: Keep under 60 characters for optimal display
2. **Meta Descriptions**: Aim for 150-160 characters
3. **OG Images**: Use 1200x630px for best social media display
4. **Keywords**: Use 3-5 relevant, targeted keywords
5. **Canonical URLs**: Set to avoid duplicate content penalties
6. **Robots Directives**: Enable Index and Follow for public pages

### Security Considerations
1. **Authentication**: All CMS routes require admin authentication
2. **Authorization**: Implement role-based access control
3. **Input Validation**: Backend validation mirrors frontend validation
4. **XSS Prevention**: Sanitize all user inputs
5. **Rate Limiting**: Implement API rate limits

### Performance Optimization
1. **Image Optimization**: Compress logos and images before upload
2. **Caching**: Cache SEO settings for better performance
3. **CDN**: Serve static assets (logos, images) via CDN
4. **Lazy Loading**: Images load on demand

## Testing

### Manual Testing Checklist
- [ ] Site settings can be fetched and updated
- [ ] SEO settings can be fetched and updated
- [ ] Form validation works correctly
- [ ] Image previews display properly
- [ ] Character counters are accurate
- [ ] Tab navigation works smoothly
- [ ] Toast notifications appear on success/error
- [ ] Responsive design works on mobile
- [ ] Dark mode displays correctly
- [ ] Sidebar navigation links work

### Integration Testing
```typescript
// Example test for Site Settings
describe('Site Settings', () => {
  it('should update site name successfully', async () => {
    const newName = 'My New Site';
    await updateSiteSettings({ siteName: newName });
    const settings = await getSiteSettings();
    expect(settings.siteName).toBe(newName);
  });
});
```

## Next Steps

### Recommended Enhancements
1. **File Upload**: Implement image upload instead of URL input
2. **SEO Analytics**: Dashboard showing SEO performance metrics
3. **Sitemap Generator**: Auto-generate XML sitemap
4. **Robots.txt Editor**: Visual robots.txt file editor
5. **Schema Markup**: Visual structured data editor
6. **SEO Audit**: Built-in SEO checker
7. **A/B Testing**: Test different meta tags
8. **Version History**: Track changes to settings
9. **Import/Export**: Backup and restore settings
10. **Multi-language**: Support for multilingual SEO

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check the existing UI patterns
4. Refer to shadcn/ui documentation
5. Check React Query documentation

## License

This CMS system is part of the Next.js Starter Kit and follows the same license.

---

**Built with**: Next.js 16, React 19, TypeScript, shadcn/ui, React Query, React Hook Form, Yup
