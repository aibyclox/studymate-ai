-- ==============================================================================
-- StudyMate AI — Phase 1 Schema & Row Level Security (RLS) Migration
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    college TEXT,
    course TEXT,
    branch TEXT,
    current_semester INTEGER DEFAULT 1,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Semesters Table
CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    semester_number INTEGER NOT NULL CHECK (semester_number >= 1 AND semester_number <= 12),
    academic_year TEXT,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_semester UNIQUE (user_id, semester_number)
);

-- 4. Create Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    code TEXT,
    color TEXT DEFAULT '#4f46e5',
    icon TEXT DEFAULT 'BookOpen',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create Units Table
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL CHECK (unit_number >= 1),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_subject_unit UNIQUE (subject_id, unit_number)
);

-- 6. Create Documents / Study Materials Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    storage_bucket TEXT NOT NULL DEFAULT 'study-materials',
    status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('uploaded', 'processing', 'ready', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_semesters_user_id ON public.semesters(user_id);
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_subjects_semester_id ON public.subjects(semester_id);
CREATE INDEX IF NOT EXISTS idx_units_user_id ON public.units(user_id);
CREATE INDEX IF NOT EXISTS idx_units_subject_id ON public.units(subject_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_subject_id ON public.documents(subject_id);
CREATE INDEX IF NOT EXISTS idx_documents_unit_id ON public.documents(unit_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Semesters Policies
CREATE POLICY "Users can view own semesters"
    ON public.semesters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own semesters"
    ON public.semesters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own semesters"
    ON public.semesters FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own semesters"
    ON public.semesters FOR DELETE
    USING (auth.uid() = user_id);

-- Subjects Policies
CREATE POLICY "Users can view own subjects"
    ON public.subjects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subjects"
    ON public.subjects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subjects"
    ON public.subjects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subjects"
    ON public.subjects FOR DELETE
    USING (auth.uid() = user_id);

-- Units Policies
CREATE POLICY "Users can view own units"
    ON public.units FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own units"
    ON public.units FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own units"
    ON public.units FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own units"
    ON public.units FOR DELETE
    USING (auth.uid() = user_id);

-- Documents Policies
CREATE POLICY "Users can view own documents"
    ON public.documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
    ON public.documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
    ON public.documents FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
    ON public.documents FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATED TRIGGERS & FUNCTIONS
-- ==============================================================================

-- Function to handle updated_at timestamp updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_semesters_updated_at
    BEFORE UPDATE ON public.semesters
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_units_updated_at
    BEFORE UPDATE ON public.units
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile automatically on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, current_semester)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        1
    );

    -- Automatically seed default 8 semesters
    FOR s IN 1..8 LOOP
        INSERT INTO public.semesters (user_id, semester_number, is_current)
        VALUES (NEW.id, s, (s = 1));
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STORAGE CONFIGURATION (Supabase Storage Bucket: study-materials)
-- ==============================================================================

-- Insert private storage bucket for study materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: allow authenticated users to manage files strictly in their user folder
CREATE POLICY "Allow authenticated user upload to own folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'study-materials'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Allow authenticated user to read own files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'study-materials'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Allow authenticated user to delete own files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'study-materials'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

