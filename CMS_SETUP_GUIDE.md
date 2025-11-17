# CMS Quick Setup Guide

## ✅ What's Been Implemented (Frontend)

### 1. API Layer
- **File**: `lib/api/admin.ts`
- Added `SiteSettings` and `SEOSettings` TypeScript interfaces
- Added API methods: `getSiteSettings`, `updateSiteSettings`, `getSEOSettings`, `updateSEOSettings`

### 2. React Query Hooks
- **File**: `hooks/use-admin.ts`
- `useSiteSettings()` - Fetch site settings
- `useUpdateSiteSettings()` - Update site settings
- `useSEOSettings()` - Fetch SEO settings
- `useUpdateSEOSettings()` - Update SEO settings

### 3. Site Settings Page
- **File**: `app/dashboard/admin/cms/site-settings/page.tsx`
- **Route**: `/dashboard/admin/cms/site-settings`
- **Features**:
  - General settings (site name, URL, description, branding)
  - Contact information (email, phone, address, business hours)
  - Social media links (Facebook, Twitter, Instagram, LinkedIn, YouTube, GitHub)
  - Localization (timezone, language, currency)
  - Form validation with Yup
  - Live image previews
  - Loading states and error handling

### 4. SEO Settings Page
- **File**: `app/dashboard/admin/cms/seo-settings/page.tsx`
- **Route**: `/dashboard/admin/cms/seo-settings`
- **Tab Components**: `app/dashboard/admin/cms/seo-settings/_components/seo-tabs.tsx`
- **Features**:
  - **Meta Tags Tab**: Title, description, keywords, canonical URL, search preview
  - **Social Media Tab**: Open Graph (Facebook), Twitter Card settings
  - **Search Engines Tab**: Robots directives, Google verification
  - **Analytics Tab**: Google Analytics, Google Tag Manager, Facebook Pixel
  - Keyword management with add/remove functionality
  - Image previews for social media images
  - Character counters for limited fields
  - Form validation with Yup

### 5. Navigation
- **File**: `app/dashboard/_components/sidebar/menu-list.tsx`
- Added "Site Settings" and "SEO Settings" to Admin Panel submenu

## ⚠️ What You Need to Implement (Backend)

### 1. Database Setup

Create two tables in your database:

#### Site Settings Table
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
  social_links JSONB DEFAULT '{}',
  business_hours TEXT,
  timezone VARCHAR(100) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(10) DEFAULT 'USD',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default row
INSERT INTO site_settings (site_name, site_url, social_links) 
VALUES ('My Site', 'https://example.com', '{}');
```

#### SEO Settings Table
```sql
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  meta_keywords TEXT[],
  og_title VARCHAR(70),
  og_description VARCHAR(160),
  og_image VARCHAR(500),
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(70),
  twitter_description VARCHAR(160),
  twitter_image VARCHAR(500),
  twitter_site VARCHAR(100),
  twitter_creator VARCHAR(100),
  canonical_url VARCHAR(500),
  robots_directives JSONB DEFAULT '{"index": true, "follow": true}',
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

-- Insert default row
INSERT INTO seo_settings (robots_directives) 
VALUES ('{"index": true, "follow": true}');
```

### 2. API Endpoints

Implement these 4 endpoints in your backend:

#### GET /admin/cms/site-settings
```typescript
// Response format
{
  status: true,
  data: {
    id: "uuid",
    siteName: "string",
    siteUrl: "string",
    siteDescription: "string | null",
    logo: "string | null",
    favicon: "string | null",
    contactEmail: "string | null",
    contactPhone: "string | null",
    contactAddress: "string | null",
    socialLinks: {
      facebook: "string | null",
      twitter: "string | null",
      instagram: "string | null",
      linkedin: "string | null",
      youtube: "string | null",
      github: "string | null"
    },
    businessHours: "string | null",
    timezone: "string",
    language: "string",
    currency: "string",
    updatedAt: "ISO 8601 date string",
    updatedBy: "uuid | null"
  },
  message: "Site settings retrieved successfully"
}
```

#### PUT /admin/cms/site-settings
```typescript
// Request body (all fields optional)
{
  siteName?: "string",
  siteUrl?: "string",
  siteDescription?: "string",
  logo?: "string",
  favicon?: "string",
  contactEmail?: "string",
  contactPhone?: "string",
  contactAddress?: "string",
  socialLinks?: {
    facebook?: "string",
    twitter?: "string",
    instagram?: "string",
    linkedin?: "string",
    youtube?: "string",
    github?: "string"
  },
  businessHours?: "string",
  timezone?: "string",
  language?: "string",
  currency?: "string"
}

// Response format (same as GET)
{
  status: true,
  data: { /* SiteSettings object */ },
  message: "Site settings updated successfully"
}
```

#### GET /admin/cms/seo-settings
```typescript
// Response format
{
  status: true,
  data: {
    id: "uuid",
    metaTitle: "string | null",
    metaDescription: "string | null",
    metaKeywords: ["string"] | [],
    ogTitle: "string | null",
    ogDescription: "string | null",
    ogImage: "string | null",
    twitterCard: "summary" | "summary_large_image" | "app" | "player",
    twitterTitle: "string | null",
    twitterDescription: "string | null",
    twitterImage: "string | null",
    twitterSite: "string | null",
    twitterCreator: "string | null",
    canonicalUrl: "string | null",
    robotsDirectives: {
      index: boolean,
      follow: boolean,
      noarchive: boolean,
      nosnippet: boolean,
      noimageindex: boolean
    },
    structuredData: "any | null",
    googleSiteVerification: "string | null",
    googleAnalyticsId: "string | null",
    googleTagManagerId: "string | null",
    facebookPixelId: "string | null",
    facebookAppId: "string | null",
    updatedAt: "ISO 8601 date string",
    updatedBy: "uuid | null"
  },
  message: "SEO settings retrieved successfully"
}
```

#### PUT /admin/cms/seo-settings
```typescript
// Request body (all fields optional)
{
  metaTitle?: "string",
  metaDescription?: "string",
  metaKeywords?: ["string"],
  ogTitle?: "string",
  ogDescription?: "string",
  ogImage?: "string",
  twitterCard?: "summary" | "summary_large_image" | "app" | "player",
  twitterTitle?: "string",
  twitterDescription?: "string",
  twitterImage?: "string",
  twitterSite?: "string",
  twitterCreator?: "string",
  canonicalUrl?: "string",
  robotsDirectives?: {
    index?: boolean,
    follow?: boolean,
    noarchive?: boolean,
    nosnippet?: boolean,
    noimageindex?: boolean
  },
  structuredData?: any,
  googleSiteVerification?: "string",
  googleAnalyticsId?: "string",
  googleTagManagerId?: "string",
  facebookPixelId?: "string",
  facebookAppId?: "string"
}

// Response format (same as GET)
{
  status: true,
  data: { /* SEOSettings object */ },
  message: "SEO settings updated successfully"
}
```

### 3. Backend Implementation Example (Node.js/Express)

```javascript
// routes/admin/cms.routes.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middleware/auth');

// Get Site Settings
router.get('/site-settings', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const settings = await db.query('SELECT * FROM site_settings LIMIT 1');
    
    if (!settings.rows.length) {
      return res.status(404).json({
        status: false,
        message: 'Site settings not found'
      });
    }

    res.json({
      status: true,
      data: {
        id: settings.rows[0].id,
        siteName: settings.rows[0].site_name,
        siteUrl: settings.rows[0].site_url,
        siteDescription: settings.rows[0].site_description,
        logo: settings.rows[0].logo,
        favicon: settings.rows[0].favicon,
        contactEmail: settings.rows[0].contact_email,
        contactPhone: settings.rows[0].contact_phone,
        contactAddress: settings.rows[0].contact_address,
        socialLinks: settings.rows[0].social_links || {},
        businessHours: settings.rows[0].business_hours,
        timezone: settings.rows[0].timezone,
        language: settings.rows[0].language,
        currency: settings.rows[0].currency,
        updatedAt: settings.rows[0].updated_at,
        updatedBy: settings.rows[0].updated_by
      },
      message: 'Site settings retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch site settings'
    });
  }
});

// Update Site Settings
router.put('/site-settings', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user.id;

    // Build dynamic update query
    const fields = Object.keys(updates)
      .map((key, idx) => {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${dbField} = $${idx + 1}`;
      })
      .join(', ');

    const values = Object.values(updates);
    values.push(userId);
    values.push(new Date());

    const query = `
      UPDATE site_settings 
      SET ${fields}, updated_by = $${values.length - 1}, updated_at = $${values.length}
      RETURNING *
    `;

    const result = await db.query(query, values);

    res.json({
      status: true,
      data: transformSiteSettings(result.rows[0]),
      message: 'Site settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to update site settings'
    });
  }
});

// Similar implementation for SEO settings endpoints...

module.exports = router;
```

### 4. Authentication & Authorization

Ensure these endpoints are protected:
- Require authentication (valid JWT token)
- Require admin role
- Log all changes for audit trail

### 5. Validation (Backend)

Add validation middleware:

```javascript
const { body, validationResult } = require('express-validator');

const validateSiteSettings = [
  body('siteName').optional().isLength({ min: 2 }).trim(),
  body('siteUrl').optional().isURL(),
  body('siteDescription').optional().isLength({ max: 500 }),
  body('logo').optional().isURL(),
  body('favicon').optional().isURL(),
  body('contactEmail').optional().isEmail(),
  // ... add more validations
];

router.put('/site-settings', 
  authenticate, 
  authorize(['admin']), 
  validateSiteSettings,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: false, 
        errors: errors.array() 
      });
    }
    // ... rest of the code
  }
);
```

## 🧪 Testing the Implementation

### 1. Test API Endpoints
```bash
# Get Site Settings
curl -X GET http://localhost:4000/admin/cms/site-settings \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update Site Settings
curl -X PUT http://localhost:4000/admin/cms/site-settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "My Awesome Site",
    "siteUrl": "https://mysite.com"
  }'
```

### 2. Test Frontend
1. Start your backend server
2. Start the Next.js dev server: `npm run dev`
3. Navigate to `/dashboard/admin/cms/site-settings`
4. Fill in the form and click "Save Changes"
5. Check for success toast notification
6. Navigate to `/dashboard/admin/cms/seo-settings`
7. Test all 4 tabs (Meta Tags, Social Media, Search Engines, Analytics)

## 📋 Checklist

- [ ] Database tables created
- [ ] Default data inserted
- [ ] GET /admin/cms/site-settings endpoint implemented
- [ ] PUT /admin/cms/site-settings endpoint implemented
- [ ] GET /admin/cms/seo-settings endpoint implemented
- [ ] PUT /admin/cms/seo-settings endpoint implemented
- [ ] Authentication middleware applied
- [ ] Authorization middleware applied (admin only)
- [ ] Backend validation implemented
- [ ] Error handling implemented
- [ ] Frontend can fetch site settings
- [ ] Frontend can update site settings
- [ ] Frontend can fetch SEO settings
- [ ] Frontend can update SEO settings
- [ ] Toast notifications work
- [ ] Form validation works
- [ ] Image previews work
- [ ] Responsive design tested
- [ ] Dark mode tested

## 🚀 Next Steps

1. **Implement File Upload**: Replace URL inputs with actual file upload
2. **Add Image Optimization**: Compress images on upload
3. **Create Sitemap Generator**: Auto-generate XML sitemap from settings
4. **Add SEO Score**: Implement SEO checker/analyzer
5. **Version History**: Track changes to settings over time

## 📚 Additional Resources

- [README.CMS.md](./README.CMS.md) - Comprehensive documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🆘 Troubleshooting

### Frontend shows "Error loading settings"
- Check if backend endpoints are running
- Verify authentication token is valid
- Check browser console for error details
- Verify API URL in `.env` file

### Settings don't save
- Check network tab in browser dev tools
- Verify request payload format
- Check backend logs for errors
- Ensure user has admin permissions

### Images don't preview
- Verify image URLs are valid
- Check for CORS issues
- Ensure images are publicly accessible

---

**Need Help?** Check the [README.CMS.md](./README.CMS.md) for detailed documentation.
