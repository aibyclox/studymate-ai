export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DocumentStatus = 'uploaded' | 'processing' | 'ready' | 'failed';

export interface Profile {
  id: string;
  full_name: string | null;
  college: string | null;
  course: string | null;
  branch: string | null;
  current_semester: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Semester {
  id: string;
  user_id: string;
  semester_number: number;
  academic_year: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  semester_id: string | null;
  name: string;
  code: string | null;
  color: string;
  icon: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  // Joined or calculated fields
  units_count?: number;
  documents_count?: number;
}

export interface Unit {
  id: string;
  user_id: string;
  subject_id: string;
  unit_number: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  // Joined or calculated fields
  documents_count?: number;
}

export interface DocumentItem {
  id: string;
  user_id: string;
  subject_id: string | null;
  unit_id: string | null;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  storage_bucket: string;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
  // Joined metadata
  subject_name?: string;
  subject_color?: string;
  unit_title?: string;
  unit_number?: number;
}

export interface VTUQuestion {
  id: string;
  document_id?: string;
  subject_id?: string;
  unit_id?: string;
  question: string;
  priority: "MUST_PREPARE" | "IMPORTANT" | "PYQ";
  marks: number;
  module: number;
  vtu_exam_years: string[];
  repeat_frequency: string;
  key_marking_points: string[];
  sample_answer_hint?: string;
  is_saved?: boolean;
  scheme?: string;
  blooms_level?: string;
  question_no?: string;
  co_mapping?: string;
}

export interface DashboardStats {
  currentSemester: number;
  totalSubjects: number;
  totalUnits: number;
  totalDocuments: number;
  recentDocuments: DocumentItem[];
  subjects: (Subject & { units_count: number; documents_count: number })[];
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      semesters: {
        Row: Semester;
        Insert: Omit<Semester, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Semester>;
      };
      subjects: {
        Row: Subject;
        Insert: Omit<Subject, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Subject>;
      };
      units: {
        Row: Unit;
        Insert: Omit<Unit, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Unit>;
      };
      documents: {
        Row: DocumentItem;
        Insert: Omit<DocumentItem, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<DocumentItem>;
      };
    };
  };
}

