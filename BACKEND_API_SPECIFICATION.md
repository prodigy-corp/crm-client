# Backend API Specification for CMS Content Management

This document provides the complete backend API specification for the Hero Sections, Banners, and Testimonials content management system.

## 🚀 Overview

The backend API provides comprehensive CRUD operations, file upload capabilities, and public-facing endpoints for content consumption. All endpoints follow RESTful conventions with consistent response formats.

## 📋 Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Response Format](#response-format)
3. [Hero Sections API](#hero-sections-api)
4. [Banners API](#banners-api)
5. [Testimonials API](#testimonials-api)
6. [File Upload API](#file-upload-api)
7. [Database Schema](#database-schema)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Implementation Examples](#implementation-examples)

## 🔐 Authentication & Authorization

### Admin Endpoints
All admin endpoints require authentication and appropriate permissions:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Public Endpoints
Public endpoints for frontend consumption do not require authentication.

## 📊 Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## 🎯 Hero Sections API

### Data Model

```typescript
interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number; // 0-100
  textAlignment?: "left" | "center" | "right";
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}
```

### Admin Endpoints

#### Get All Hero Sections
```http
GET /admin/cms/hero-sections
```

**Query Parameters:**
```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 10, Max: 100
  search?: string;      // Search in title, subtitle, description
  isActive?: boolean;   // Filter by active status
  sortBy?: string;      // Default: "displayOrder"
  sortOrder?: "asc" | "desc"; // Default: "asc"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hero sections retrieved successfully",
  "data": {
    "data": [/* HeroSection[] */],
    "pagination": {/* PaginationInfo */}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Get Hero Section by ID
```http
GET /admin/cms/hero-sections/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Hero section retrieved successfully",
  "data": {/* HeroSection */},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Create Hero Section
```http
POST /admin/cms/hero-sections
```

**Request Body:**
```typescript
{
  title: string;                    // Required, max 200 chars
  subtitle?: string;                // Optional, max 300 chars
  description?: string;             // Optional, max 1000 chars
  primaryButtonText?: string;       // Optional, max 50 chars
  primaryButtonUrl?: string;        // Optional, valid URL
  secondaryButtonText?: string;     // Optional, max 50 chars
  secondaryButtonUrl?: string;      // Optional, valid URL
  backgroundImage?: string;         // Optional, valid URL
  backgroundVideo?: string;         // Optional, valid URL
  overlayOpacity?: number;          // Optional, 0-100
  textAlignment?: "left" | "center" | "right"; // Optional, default: "left"
  isActive?: boolean;               // Optional, default: true
  displayOrder?: number;            // Optional, auto-increment
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hero section created successfully",
  "data": {/* HeroSection */},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Update Hero Section
```http
PUT /admin/cms/hero-sections/:id
```

**Request Body:** Same as create, all fields optional

#### Delete Hero Section
```http
DELETE /admin/cms/hero-sections/:id
```

#### Reorder Hero Sections
```http
PUT /admin/cms/hero-sections/reorder
```

**Request Body:**
```typescript
{
  items: Array<{
    id: string;
    displayOrder: number;
  }>;
}
```

### Public Endpoints

#### Get Active Hero Sections
```http
GET /cms/hero-sections/active
```

**Query Parameters:**
```typescript
{
  limit?: number; // Default: 10, Max: 50
}
```

## 🏷️ Banners API

### Data Model

```typescript
interface Banner {
  id: string;
  title: string;
  message?: string;
  type: "info" | "warning" | "success" | "error" | "promotion";
  backgroundColor?: string;  // Hex color
  textColor?: string;        // Hex color
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;      // Hex color
  icon?: string;             // URL to icon image
  isActive: boolean;
  isDismissible: boolean;
  startDate?: string;        // ISO date string
  endDate?: string;          // ISO date string
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}
```

### Admin Endpoints

#### Get All Banners
```http
GET /admin/cms/banners
```

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  search?: string;          // Search in title, message
  isActive?: boolean;
  type?: "info" | "warning" | "success" | "error" | "promotion";
  sortBy?: string;          // Default: "displayOrder"
  sortOrder?: "asc" | "desc";
}
```

#### Get Banner by ID
```http
GET /admin/cms/banners/:id
```

#### Create Banner
```http
POST /admin/cms/banners
```

**Request Body:**
```typescript
{
  title: string;                    // Required, max 100 chars
  message?: string;                 // Optional, max 500 chars
  type: "info" | "warning" | "success" | "error" | "promotion"; // Required
  backgroundColor?: string;         // Optional, hex color
  textColor?: string;              // Optional, hex color
  buttonText?: string;             // Optional, max 50 chars
  buttonUrl?: string;              // Optional, valid URL
  buttonColor?: string;            // Optional, hex color
  icon?: string;                   // Optional, valid URL
  isActive?: boolean;              // Optional, default: true
  isDismissible?: boolean;         // Optional, default: true
  startDate?: string;              // Optional, ISO date
  endDate?: string;                // Optional, ISO date
  displayOrder?: number;           // Optional, auto-increment
}
```

#### Update Banner
```http
PUT /admin/cms/banners/:id
```

#### Delete Banner
```http
DELETE /admin/cms/banners/:id
```

#### Reorder Banners
```http
PUT /admin/cms/banners/reorder
```

### Public Endpoints

#### Get Active Banners
```http
GET /cms/banners/active
```

**Query Parameters:**
```typescript
{
  limit?: number;     // Default: 10, Max: 20
  type?: string;      // Filter by banner type
}
```

**Response includes date filtering:** Only returns banners where current date is between startDate and endDate (if specified).

## 💬 Testimonials API

### Data Model

```typescript
interface Testimonial {
  id: string;
  name: string;
  position?: string;
  company?: string;
  content: string;
  rating?: number;        // 1-5 stars
  avatar?: string;        // URL to avatar image
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}
```

### Admin Endpoints

#### Get All Testimonials
```http
GET /admin/cms/testimonials
```

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  search?: string;          // Search in name, position, company, content
  isActive?: boolean;
  isFeatured?: boolean;
  rating?: number;          // Filter by minimum rating
  sortBy?: string;          // Default: "displayOrder"
  sortOrder?: "asc" | "desc";
}
```

#### Get Testimonial by ID
```http
GET /admin/cms/testimonials/:id
```

#### Create Testimonial
```http
POST /admin/cms/testimonials
```

**Request Body:**
```typescript
{
  name: string;                     // Required, max 100 chars
  position?: string;                // Optional, max 100 chars
  company?: string;                 // Optional, max 100 chars
  content: string;                  // Required, max 1000 chars
  rating?: number;                  // Optional, 1-5
  avatar?: string;                  // Optional, valid URL
  isActive?: boolean;               // Optional, default: true
  isFeatured?: boolean;             // Optional, default: false
  displayOrder?: number;            // Optional, auto-increment
}
```

#### Update Testimonial
```http
PUT /admin/cms/testimonials/:id
```

#### Delete Testimonial
```http
DELETE /admin/cms/testimonials/:id
```

#### Reorder Testimonials
```http
PUT /admin/cms/testimonials/reorder
```

### Public Endpoints

#### Get Active Testimonials
```http
GET /cms/testimonials/active
```

**Query Parameters:**
```typescript
{
  limit?: number;         // Default: 10, Max: 50
  featured?: boolean;     // Filter featured testimonials
  minRating?: number;     // Filter by minimum rating
}
```

## 📁 File Upload API

### Upload Hero Background Image
```http
POST /admin/cms/upload/hero-image
Content-Type: multipart/form-data
```

**Request Body:**
```
file: File (image/*) // Max 10MB, formats: jpg, jpeg, png, webp
```

**Response:**
```json
{
  "success": true,
  "message": "Hero image uploaded successfully",
  "data": {
    "url": "https://cdn.example.com/hero-images/uuid.jpg",
    "filename": "hero-background.jpg",
    "size": 2048576,
    "mimeType": "image/jpeg"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Upload Testimonial Avatar
```http
POST /admin/cms/upload/testimonial-avatar
Content-Type: multipart/form-data
```

**Request Body:**
```
file: File (image/*) // Max 5MB, formats: jpg, jpeg, png, webp
```

### Upload Content Image
```http
POST /admin/cms/upload/content-image
Content-Type: multipart/form-data
```

**Request Body:**
```
file: File (image/*) // Max 5MB, formats: jpg, jpeg, png, webp, svg
```

## 🗄️ Database Schema

### Hero Sections Table
```sql
CREATE TABLE hero_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  description TEXT,
  primary_button_text VARCHAR(50),
  primary_button_url TEXT,
  secondary_button_text VARCHAR(50),
  secondary_button_url TEXT,
  background_image TEXT,
  background_video TEXT,
  overlay_opacity INTEGER CHECK (overlay_opacity >= 0 AND overlay_opacity <= 100),
  text_alignment VARCHAR(10) CHECK (text_alignment IN ('left', 'center', 'right')) DEFAULT 'left',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(100)
);

CREATE INDEX idx_hero_sections_active ON hero_sections (is_active);
CREATE INDEX idx_hero_sections_order ON hero_sections (display_order);
```

### Banners Table
```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  message VARCHAR(500),
  type VARCHAR(20) CHECK (type IN ('info', 'warning', 'success', 'error', 'promotion')) NOT NULL,
  background_color VARCHAR(7), -- Hex color
  text_color VARCHAR(7),       -- Hex color
  button_text VARCHAR(50),
  button_url TEXT,
  button_color VARCHAR(7),     -- Hex color
  icon TEXT,                   -- URL to icon
  is_active BOOLEAN DEFAULT true,
  is_dismissible BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(100),
  CONSTRAINT check_end_date CHECK (end_date IS NULL OR start_date IS NULL OR end_date > start_date)
);

CREATE INDEX idx_banners_active ON banners (is_active);
CREATE INDEX idx_banners_dates ON banners (start_date, end_date);
CREATE INDEX idx_banners_order ON banners (display_order);
```

### Testimonials Table
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  company VARCHAR(100),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar TEXT,             -- URL to avatar image
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(100)
);

CREATE INDEX idx_testimonials_active ON testimonials (is_active);
CREATE INDEX idx_testimonials_featured ON testimonials (is_featured);
CREATE INDEX idx_testimonials_rating ON testimonials (rating);
CREATE INDEX idx_testimonials_order ON testimonials (display_order);
```

## ⚠️ Error Handling

### Standard Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "error": "VALIDATION_ERROR",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `NOT_FOUND` | Resource not found | 404 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `DUPLICATE_ERROR` | Resource already exists | 409 |
| `FILE_TOO_LARGE` | File exceeds size limit | 413 |
| `INVALID_FILE_TYPE` | Unsupported file format | 415 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

### Validation Rules

#### Hero Sections
- `title`: Required, 1-200 characters
- `subtitle`: Optional, max 300 characters
- `description`: Optional, max 1000 characters
- `primaryButtonText`, `secondaryButtonText`: Optional, max 50 characters
- `primaryButtonUrl`, `secondaryButtonUrl`: Optional, valid URL format
- `overlayOpacity`: Optional, 0-100 integer
- `textAlignment`: Optional, enum: "left", "center", "right"

#### Banners
- `title`: Required, 1-100 characters
- `message`: Optional, max 500 characters
- `type`: Required, enum: "info", "warning", "success", "error", "promotion"
- `backgroundColor`, `textColor`, `buttonColor`: Optional, valid hex color (#RRGGBB)
- `buttonText`: Optional, max 50 characters
- `buttonUrl`: Optional, valid URL format
- `startDate`, `endDate`: Optional, valid ISO date, endDate > startDate

#### Testimonials
- `name`: Required, 1-100 characters
- `position`, `company`: Optional, max 100 characters
- `content`: Required, 1-1000 characters
- `rating`: Optional, integer 1-5
- `avatar`: Optional, valid URL format

## 🚦 Rate Limiting

### Admin Endpoints
- **Rate Limit**: 1000 requests per hour per user
- **Burst Limit**: 100 requests per minute

### Public Endpoints
- **Rate Limit**: 10000 requests per hour per IP
- **Burst Limit**: 100 requests per minute

### File Upload Endpoints
- **Rate Limit**: 100 uploads per hour per user
- **File Size Limits**:
  - Hero images: 10MB max
  - Testimonial avatars: 5MB max
  - Content images: 5MB max

## 💻 Implementation Examples

### Node.js/Express Implementation

```javascript
// Hero Sections Controller
const heroSectionsController = {
  // GET /admin/cms/hero-sections
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search, isActive, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;
      
      const query = db.heroSections.findMany({
        where: {
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { subtitle: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } }
            ]
          }),
          ...(isActive !== undefined && { isActive: isActive === 'true' })
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      });

      const total = await db.heroSections.count({ where: query.where });
      const data = await query;

      res.json({
        success: true,
        message: 'Hero sections retrieved successfully',
        data: {
          data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve hero sections',
        error: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  },

  // POST /admin/cms/hero-sections
  async create(req, res) {
    try {
      const validatedData = await heroSectionSchema.validate(req.body);
      
      const heroSection = await db.heroSections.create({
        data: {
          ...validatedData,
          updatedBy: req.user.name
        }
      });

      res.status(201).json({
        success: true,
        message: 'Hero section created successfully',
        data: heroSection,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: error.message,
          error: 'VALIDATION_ERROR',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create hero section',
          error: 'INTERNAL_ERROR',
          timestamp: new Date().toISOString()
        });
      }
    }
  }
};
```

### Validation Schemas (Yup)

```javascript
const yup = require('yup');

const heroSectionSchema = yup.object({
  title: yup.string().required().max(200),
  subtitle: yup.string().max(300),
  description: yup.string().max(1000),
  primaryButtonText: yup.string().max(50),
  primaryButtonUrl: yup.string().url(),
  secondaryButtonText: yup.string().max(50),
  secondaryButtonUrl: yup.string().url(),
  backgroundImage: yup.string().url(),
  backgroundVideo: yup.string().url(),
  overlayOpacity: yup.number().min(0).max(100),
  textAlignment: yup.string().oneOf(['left', 'center', 'right']),
  isActive: yup.boolean(),
  displayOrder: yup.number().min(0)
});

const bannerSchema = yup.object({
  title: yup.string().required().max(100),
  message: yup.string().max(500),
  type: yup.string().required().oneOf(['info', 'warning', 'success', 'error', 'promotion']),
  backgroundColor: yup.string().matches(/^#[0-9A-F]{6}$/i),
  textColor: yup.string().matches(/^#[0-9A-F]{6}$/i),
  buttonText: yup.string().max(50),
  buttonUrl: yup.string().url(),
  buttonColor: yup.string().matches(/^#[0-9A-F]{6}$/i),
  icon: yup.string().url(),
  isActive: yup.boolean(),
  isDismissible: yup.boolean(),
  startDate: yup.date(),
  endDate: yup.date().min(yup.ref('startDate')),
  displayOrder: yup.number().min(0)
});

const testimonialSchema = yup.object({
  name: yup.string().required().max(100),
  position: yup.string().max(100),
  company: yup.string().max(100),
  content: yup.string().required().max(1000),
  rating: yup.number().min(1).max(5),
  avatar: yup.string().url(),
  isActive: yup.boolean(),
  isFeatured: yup.boolean(),
  displayOrder: yup.number().min(0)
});
```

## 🔄 Deployment Checklist

### Database Setup
- [ ] Create database tables with proper indexes
- [ ] Set up database migrations
- [ ] Configure database connection pooling
- [ ] Set up database backups

### API Configuration
- [ ] Configure CORS for frontend domains
- [ ] Set up rate limiting middleware
- [ ] Configure file upload limits
- [ ] Set up CDN for file storage

### Security
- [ ] Implement JWT authentication
- [ ] Set up role-based permissions
- [ ] Configure HTTPS/SSL
- [ ] Implement input sanitization
- [ ] Set up API logging and monitoring

### Performance
- [ ] Configure Redis for caching
- [ ] Set up database query optimization
- [ ] Implement response compression
- [ ] Configure CDN for static assets

This comprehensive API specification provides everything needed to implement a production-ready backend for the CMS content management system.
