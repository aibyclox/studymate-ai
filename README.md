# StudyMate AI — Phase 1 Foundation

StudyMate AI is a modern, production-quality web application designed to help college and university students organize study materials, track syllabus progress, and prepare efficiently for examinations.

---

## Phase 1 Features Implemented

- **Authentication & Security**: Email/password authentication, password recovery, session handling, and Row-Level Security (RLS) guaranteeing strict multi-user data isolation.
- **Academic Hierarchy**:
  - **Semesters**: Active semester preferences (Semester 1–8).
  - **Subjects**: Course catalog, color accents, course codes, and descriptions.
  - **Units / Modules**: Syllabus breakdown into units with topics.
- **Study Material Management**:
  - **File Upload**: Direct drag-and-drop supporting PDF, PPT/PPTX, DOC/DOCX, TXT, and images up to 25MB.
  - **Secure Storage**: Storage inside the private `study-materials` Supabase bucket under `{user_id}/{subject_id}/...`.
  - **Material Library**: Search, filter by semester, subject, and file category (PDFs, Docs, Slides, Images) with Grid and Table view toggles.
  - **Secure Downloads**: On-demand signed URL generation for encrypted, private access.
- **Student Dashboard**:
  - Personalized greeting.
  - Real database metrics (Current Semester, Enrolled Subjects, Syllabus Units, Total Materials).
  - Quick-access subject cards and recent files list.
  - Informative empty and loading states.
- **Responsive Layout**:
  - Desktop: Collapsible sidebar navigation + Topbar with profile.
  - Mobile: Bottom navigation bar (`Home`, `Subjects`, `Materials`, `Profile`) + sticky header.

---

## Getting Started

### 1. Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/001_initial_schema.sql` and run the script. This will:
   - Create tables: `profiles`, `semesters`, `subjects`, `units`, `documents`.
   - Configure foreign keys, triggers, and indexes.
   - Enable Row-Level Security (RLS) on all tables.
   - Create the private `study-materials` storage bucket with strict user-folder security policies.

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server

```bash
# Install dependencies
npm install
# or
pnpm install

# Start the dev server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

