import fs from "fs";
import path from "path";
import { Profile, Subject, Unit, DocumentItem, Semester } from "@/types/database";

export interface StoredUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  created_at: string;
}

interface LocalDatabase {
  users: StoredUser[];
  profiles: Profile[];
  semesters: Semester[];
  subjects: Subject[];
  units: Unit[];
  documents: DocumentItem[];
}

function getDbFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpFile = path.join("/tmp", "db.json");
    if (!fs.existsSync(tmpFile)) {
      try {
        const bundledFile = path.join(process.cwd(), "data", "db.json");
        if (fs.existsSync(bundledFile)) {
          fs.copyFileSync(bundledFile, tmpFile);
        }
      } catch (e) {
        // Fallback to in-memory/fresh write
      }
    }
    return tmpFile;
  }
  return path.join(process.cwd(), "data", "db.json");
}

function getDbFile(): string {
  return getDbFilePath();
}

function getDefaultData(): LocalDatabase {
  const demoUserId = "usr_demo_studymate_101";

  const defaultSubjects: Subject[] = [
    {
      id: "sub_dbms_101",
      user_id: demoUserId,
      semester_id: "sem_5",
      name: "Database Management Systems",
      code: "CS501",
      color: "#4f46e5",
      icon: "BookOpen",
      description: "Relational models, SQL, Normalization, Transactions & Concurrency control.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sub_ml_102",
      user_id: demoUserId,
      semester_id: "sem_5",
      name: "Machine Learning",
      code: "CS502",
      color: "#7c3aed",
      icon: "BookOpen",
      description: "Supervised, Unsupervised learning, Neural Networks, Ensemble Methods.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sub_cn_103",
      user_id: demoUserId,
      semester_id: "sem_5",
      name: "Computer Networks",
      code: "CS503",
      color: "#0284c7",
      icon: "BookOpen",
      description: "OSI & TCP/IP stack, Routing protocols, Transport layer reliability, DNS.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const defaultUnits: Unit[] = [
    // DBMS Units
    {
      id: "unit_dbms_1",
      user_id: demoUserId,
      subject_id: "sub_dbms_101",
      unit_number: 1,
      title: "Introduction & Database Architecture",
      description: "Three-schema architecture, Data independence, ER modeling.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "unit_dbms_2",
      user_id: demoUserId,
      subject_id: "sub_dbms_101",
      unit_number: 2,
      title: "Relational Model & Normalization",
      description: "Functional dependencies, 1NF, 2NF, 3NF, BCNF, Multi-valued dependencies.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "unit_dbms_3",
      user_id: demoUserId,
      subject_id: "sub_dbms_101",
      unit_number: 3,
      title: "SQL & Relational Calculus",
      description: "Complex queries, Subqueries, Joins, Relational Algebra.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "unit_dbms_4",
      user_id: demoUserId,
      subject_id: "sub_dbms_101",
      unit_number: 4,
      title: "Transaction Processing & Concurrency",
      description: "ACID properties, Serializability, Two-phase locking (2PL), Deadlocks.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // ML Units
    {
      id: "unit_ml_1",
      user_id: demoUserId,
      subject_id: "sub_ml_102",
      unit_number: 1,
      title: "Introduction to Learning & Linear Models",
      description: "Linear Regression, Logistic Regression, Cost functions, Gradient Descent.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "unit_ml_2",
      user_id: demoUserId,
      subject_id: "sub_ml_102",
      unit_number: 2,
      title: "Tree Models & Ensemble Learning",
      description: "Decision Trees, Random Forests, AdaBoost, Gradient Boosting.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // CN Units
    {
      id: "unit_cn_1",
      user_id: demoUserId,
      subject_id: "sub_cn_103",
      unit_number: 1,
      title: "Network Fundamentals & Physical Layer",
      description: "OSI 7-layer model, TCP/IP reference model, Transmission media.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "unit_cn_2",
      user_id: demoUserId,
      subject_id: "sub_cn_103",
      unit_number: 2,
      title: "Data Link Layer & MAC Protocols",
      description: "Error detection (CRC), Sliding window protocols, CSMA/CD, Ethernet.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const defaultDocuments: DocumentItem[] = [
    {
      id: "doc_dbms_norm_101",
      user_id: demoUserId,
      subject_id: "sub_dbms_101",
      unit_id: "unit_dbms_2",
      title: "DBMS Unit 2: Normalization & Functional Dependencies",
      file_name: "DBMS_Unit2_Normalization.pdf",
      file_path: "demo/DBMS_Unit2_Normalization.pdf",
      file_size: 2450000,
      file_type: "pdf",
      storage_bucket: "study-materials",
      status: "ready",
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      subject_name: "Database Management Systems",
      subject_color: "#4f46e5",
      unit_title: "Relational Model & Normalization",
      unit_number: 2,
    },
    {
      id: "doc_ml_trees_102",
      user_id: demoUserId,
      subject_id: "sub_ml_102",
      unit_id: "unit_ml_2",
      title: "Ensemble Learning & Random Forests Lecture Notes",
      file_name: "ML_Ensemble_Methods.docx",
      file_path: "demo/ML_Ensemble_Methods.docx",
      file_size: 1120000,
      file_type: "docx",
      storage_bucket: "study-materials",
      status: "ready",
      created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
      subject_name: "Machine Learning",
      subject_color: "#7c3aed",
      unit_title: "Tree Models & Ensemble Learning",
      unit_number: 2,
    },
    {
      id: "doc_cn_osi_103",
      user_id: demoUserId,
      subject_id: "sub_cn_103",
      unit_id: "unit_cn_1",
      title: "Computer Networks: OSI 7-Layer Model Reference Guide",
      file_name: "OSI_Model_Summary.pptx",
      file_path: "demo/OSI_Model_Summary.pptx",
      file_size: 3840000,
      file_type: "pptx",
      storage_bucket: "study-materials",
      status: "ready",
      created_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
      subject_name: "Computer Networks",
      subject_color: "#0284c7",
      unit_title: "Network Fundamentals & Physical Layer",
      unit_number: 1,
    },
  ];

  return {
    users: [
      {
        id: demoUserId,
        email: "demo@studymate.ai",
        password_hash: "password123",
        full_name: "Alex Mercer",
        created_at: new Date().toISOString(),
      },
    ],
    profiles: [
      {
        id: demoUserId,
        full_name: "Alex Mercer",
        college: "Stanford School of Engineering",
        course: "B.Tech",
        branch: "Computer Science & Engineering",
        current_semester: 5,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
      id: `sem_${s}`,
      user_id: demoUserId,
      semester_number: s,
      academic_year: "2026-2027",
      is_current: s === 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    subjects: defaultSubjects,
    units: defaultUnits,
    documents: defaultDocuments,
  };
}

export function readDb(): LocalDatabase {
  const dbFile = getDbFile();
  try {
    if (!fs.existsSync(dbFile)) {
      const initial = getDefaultData();
      fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(dbFile, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local db:", err);
    return getDefaultData();
  }
}

export function writeDb(db: LocalDatabase): void {
  const dbFile = getDbFile();
  try {
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local db:", err);
  }
}

// User Helpers
export function findUserByEmail(email: string): StoredUser | undefined {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function registerUser(email: string, password: string,fullName: string): StoredUser {
  const db = readDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return existing;
  }

  const id = "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const newUser: StoredUser = {
    id,
    email: email.trim().toLowerCase(),
    password_hash: password, // For local dev fallback
    full_name: fullName.trim(),
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Initialize profile
  db.profiles.push({
    id,
    full_name: fullName.trim(),
    college: "University Student",
    course: "B.Tech",
    branch: "Computer Science",
    current_semester: 1,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Seed default 8 semesters
  for (let s = 1; s <= 8; s++) {
    db.semesters.push({
      id: `sem_${id}_${s}`,
      user_id: id,
      semester_number: s,
      academic_year: "2026-2027",
      is_current: s === 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  writeDb(db);
  return newUser;
}

