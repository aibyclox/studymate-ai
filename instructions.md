Build a complete, production-quality web application called **StudyMate AI** — an AI-powered personal study material organizer and exam preparation platform for college/university students.

The application should NOT look like a basic CRUD student project. It should feel like a modern SaaS product similar in polish to Notion, Google Drive, and an AI study assistant combined.

## 1. CORE PRODUCT IDEA

Students can upload their study materials such as:

- PDF notes
- PPT/PPTX presentations
- DOC/DOCX documents
- Previous-year question papers
- Lab manuals
- Images of handwritten notes
- Syllabus documents

The application automatically organizes the materials by:

Semester → Subject → Unit → Topic → Material

The student can then ask questions about their uploaded materials, generate exam-ready answers, create quizzes, identify important topics, and track preparation progress.

The central concept is:

**Upload → Organize → Understand → Practice → Analyze → Revise → Prepare**

---

# 2. TARGET USERS

Primary users:

- Engineering students
- University students
- College students
- Students preparing for semester examinations

The interface should be extremely easy to understand and mobile-friendly.

---

# 3. TECH STACK

Use a modern full-stack architecture.

Preferred:

- Frontend: Next.js / React
- Styling: Tailwind CSS
- UI components: modern reusable component library
- Backend: Supabase or equivalent
- Database: PostgreSQL
- Authentication: Email/password + Google authentication if supported
- File storage: Supabase Storage
- AI: LLM API
- Vector search: pgvector or another vector database
- Document processing: PDF/DOC/PPT text extraction
- OCR: suitable OCR service/library for handwritten/image notes

Use environment variables for all API keys.

Never hard-code API keys.

---

# 4. DESIGN REQUIREMENTS

Create a premium, clean, modern SaaS interface.

Design principles:

- Minimal
- Professional
- Fast
- Student-friendly
- Responsive
- Mobile-first
- Excellent typography
- Clear visual hierarchy
- Smooth animations
- Dark/light mode
- Accessible UI

Avoid:

- Generic Bootstrap-looking interfaces
- Excessive gradients
- Overloaded dashboards
- Huge unnecessary cards
- Fake statistics
- Placeholder-looking components

Use meaningful empty states, loading states, error states and success states.

---

# 5. MAIN APPLICATION STRUCTURE

Create the following pages:

1. Landing Page
2. Sign Up
3. Login
4. Onboarding
5. Dashboard
6. My Materials
7. Subjects
8. Subject Details
9. Document Viewer
10. AI Study Chat
11. Question Generator
12. Quiz Mode
13. Important Topics
14. Study Planner
15. Progress Dashboard
16. Exam Mode
17. Profile
18. Settings

---

# 6. LANDING PAGE

Create a highly polished landing page.

Hero section:

Headline:

**Your Notes. Your AI Tutor. Your Exam Strategy.**

Subheading:

**Upload your study material, ask questions, generate exam-ready answers, practice with AI quizzes, and discover what you should study next.**

Primary CTA:

**Start Studying Free**

Secondary CTA:

**See How It Works**

Add an attractive product dashboard preview.

Feature sections:

- AI-powered document organization
- Chat with your notes
- Exam-ready answer generation
- AI question generation
- Previous-paper analysis
- Smart study planning
- Progress tracking

Add a simple 3-step section:

**1. Upload**
Upload your notes and study materials.

**2. Understand**
Ask AI questions about your own material.

**3. Prepare**
Generate questions, quizzes and personalized study plans.

---

# 7. AUTHENTICATION

Implement:

- Sign up
- Login
- Logout
- Forgot password
- Password reset
- Google login if supported

Store user profiles securely.

Every user's materials must be isolated from other users.

Users must NEVER be able to access another user's documents.

---

# 8. ONBOARDING

After registration, ask:

- Name
- College/university
- Course
- Branch
- Current semester
- Subjects
- Exam dates

Allow the user to skip optional information.

Create their initial academic workspace automatically.

Example:

Semester 5

→ DBMS
→ Machine Learning
→ Computer Networks
→ MEMS

---

# 9. DASHBOARD

Create a powerful personalized dashboard.

Show:

### Welcome section

"Good morning, [Name]"

Then:

**Your exam preparation**

Overall progress: 64%

Display:

- Subjects
- Preparation percentage
- Upcoming exams
- Pending topics
- Recent materials
- Recent AI conversations

Create a "Continue Studying" section.

Example:

**DBMS — Unit 2**

Continue →

Also show:

### AI Recommendations

Examples:

"Revise DBMS normalization today."

"You have 3 important ML topics that haven't been reviewed."

"Your Computer Networks preparation is behind schedule."

Recommendations should be generated from actual user data, not hard-coded.

---

# 10. MATERIAL MANAGEMENT

Create a powerful material upload system.

Supported:

- PDF
- PPT
- PPTX
- DOC
- DOCX
- TXT
- PNG
- JPG/JPEG

Drag-and-drop upload.

After upload, automatically extract:

- Title
- Subject
- Unit
- Topics
- File type
- Page count
- Upload date

Allow the user to manually correct AI classification.

Example:

Uploaded:

"DBMS Unit 2 Notes.pdf"

Automatically classify:

Subject: DBMS

Unit: Unit 2

Topics:

- Functional Dependencies
- Normalization
- 1NF
- 2NF
- 3NF
- BCNF

---

# 11. MATERIAL LIBRARY

Create a Google Drive/Notion-like material library.

Features:

- Search
- Filter
- Sort
- Folder structure
- Grid/list view
- Favorites
- Recently opened
- Recently uploaded
- Delete
- Rename
- Move
- Download
- Preview

Filters:

Subject
Unit
Material type
Date
Favorite

---

# 12. DOCUMENT VIEWER

Build an integrated document viewer.

When a student opens a PDF:

Left side:

Document preview

Right side:

AI Assistant

Example:

Student asks:

"What is normalization?"

AI answers based on the currently opened document.

Show source references:

**Source: Page 14**

Clicking the source should take the student to the relevant page if technically possible.

---

# 13. AI CHAT WITH STUDY MATERIAL

This is the core feature.

Create a ChatGPT-like interface called:

**Ask Your Notes**

Users can ask:

- Explain this topic.
- Summarize this unit.
- Give important questions.
- Explain in simple language.
- Compare two concepts.
- Give examples.
- Generate viva questions.
- Generate exam answers.

The AI must prioritize the user's uploaded material using RAG.

If the answer cannot be found in the uploaded materials, clearly say:

"I couldn't find this information in your uploaded study material."

Do not confidently invent information.

Allow chat scope:

- Current document
- Current unit
- Current subject
- All study materials

---

# 14. ANSWER GENERATOR

Create an AI answer-generation interface.

User enters:

"Explain three-schema architecture."

Then selects:

Answer type:

- 2 marks
- 5 marks
- 7–8 marks
- 10 marks
- Viva
- Short notes

Also allow:

Difficulty:

- Simple
- Moderate
- Detailed

The AI should generate structured answers.

For 7–8 mark answers use:

1. Definition
2. Explanation
3. Key points
4. Diagram if appropriate
5. Example
6. Conclusion

Do not unnecessarily make answers extremely long.

---

# 15. AI QUESTION GENERATOR

Allow users to select:

Subject
Unit
Difficulty
Number of questions
Question type

Question types:

- Short answer
- Long answer
- MCQ
- Viva
- True/False

Generate questions based primarily on the uploaded material.

Allow:

**Generate Important Questions**

The AI should rank questions:

🔥 Must Prepare

⭐ Important

○ Low Priority

Explain briefly why a question has high priority.

---

# 16. PREVIOUS YEAR QUESTION PAPER ANALYZER

This should be a major feature.

User uploads multiple previous-year question papers.

AI analyzes them and identifies:

- Frequently repeated questions
- Frequently repeated topics
- Important units
- Question patterns
- Marks distribution
- Topic frequency
- High-priority preparation areas

Example:

### Exam Intelligence

Normalization
Appeared 7 times

Priority:
🔥🔥🔥🔥🔥

OSI Model
Appeared 5 times

Priority:
🔥🔥🔥🔥

Create charts showing topic frequency.

---

# 17. IMPORTANT TOPICS ENGINE

Create a page called:

**Exam Intelligence**

Analyze:

- Uploaded syllabus
- Study material
- Previous-year papers
- User's progress

Generate:

### Must Prepare

Topics with highest priority.

### Important

Topics with moderate priority.

### Low Priority

Topics with lower frequency or importance.

For every topic show:

- Importance score
- Frequency
- Source documents
- Preparation status
- Last revised date

---

# 18. AI QUIZ MODE

Create an interactive quiz system.

User selects:

Subject
Unit
Number of questions
Difficulty

Generate MCQs.

Display one question at a time.

After answering:

- Correct/incorrect
- Explanation
- Score
- Progress

At the end show:

**Quiz Score: 8/10**

Then analyze weaknesses.

Example:

"You're weak in Functional Dependencies."

Provide:

**Revise this topic →**

---

# 19. STUDY PLANNER

Create an AI study planner.

Inputs:

- Exam date
- Subjects
- Available hours per day
- Current preparation
- Important topics

AI generates a daily schedule.

Example:

Monday:

DBMS — 2 hours
Normalization

ML — 1 hour
Ensemble Learning

Networking — 1 hour
OSI Model

Allow users to mark tasks completed.

If the student misses a day, the AI should automatically regenerate the remaining plan.

---

# 20. PROGRESS TRACKING

Track:

- Topics completed
- Topics pending
- Quiz scores
- Study sessions
- Revision count
- Subject progress
- Overall progress

Create visual charts.

Example:

DBMS: 82%
ML: 68%
Networks: 54%

Overall: 68%

---

# 21. REVISION SYSTEM

Allow students to mark topics as:

- Not Started
- Learning
- Learned
- Needs Revision
- Mastered

Create a revision queue.

AI should recommend:

**Revise Today**

based on:

- Importance
- Previous performance
- Time since last revision
- Quiz mistakes

---

# 22. HANDWRITTEN NOTES

Allow image upload.

Use OCR to extract handwritten content when possible.

Convert it into:

- Clean digital notes
- Summary
- Important points
- Flashcards
- Questions

If handwriting cannot be confidently recognized, clearly tell the user instead of generating false text.

---

# 23. FLASHCARDS

Automatically generate flashcards.

Example:

Front:

"What is normalization?"

Back:

"Normalization is the process of organizing data to reduce redundancy..."

Allow:

- Flip
- Next
- Previous
- Mark difficult
- Mark mastered

Create spaced-revision functionality later.

---

# 24. EXAM MODE

Create a special mode:

**EXAM MODE**

Student selects:

Subject
Exam date

The app should display:

### Days Remaining

12

### Preparation

72%

### Must Prepare

5 topics

### Weak Areas

3 topics

### Today's Study Plan

4 tasks

### Predicted Readiness

78%

Make the readiness score transparent and based on actual tracked data.

---

# 25. SEARCH

Implement global search.

Search across:

- Documents
- Subjects
- Topics
- Questions
- AI conversations

Example:

Search:

"normalization"

Results:

DBMS Unit 2
Previous Paper 2025
AI Chat
Important Questions

---

# 26. DATABASE DESIGN

Create proper relational tables such as:

users
profiles
semesters
subjects
units
documents
document_chunks
topics
questions
quizzes
quiz_questions
quiz_attempts
study_sessions
study_plans
study_tasks
progress
exam_dates
chat_sessions
chat_messages
flashcards

Use proper foreign keys and indexes.

Implement Row Level Security where supported.

---

# 27. AI ARCHITECTURE

Use RAG for document-based questions.

Pipeline:

Upload document
→ Extract text
→ Clean text
→ Split into chunks
→ Generate embeddings
→ Store embeddings
→ User asks question
→ Semantic search
→ Retrieve relevant chunks
→ Send context to LLM
→ Generate answer
→ Display source references

Keep AI prompts modular and maintainable.

---

# 28. ERROR HANDLING

Handle:

- Invalid file
- File too large
- Unsupported format
- AI API failure
- OCR failure
- Empty document
- No search results
- Network failure
- Expired authentication

Never show raw technical errors to users.

Show friendly messages.

---

# 29. SECURITY

Implement:

- Secure authentication
- User-specific authorization
- Row Level Security
- Secure file access
- Input validation
- API rate limiting where appropriate
- Environment variables
- No exposed API keys
- Protection against unauthorized document access

Users can only access their own materials.

---

# 30. PERFORMANCE

Optimize:

- Lazy loading
- Pagination
- File processing
- Database queries
- Vector search
- Image loading

Do not load every document on the dashboard.

---

# 31. MOBILE EXPERIENCE

The entire application must work properly on:

- Android phones
- iPhones
- Tablets
- Desktop

On mobile, use a bottom navigation bar:

Home
Materials
AI
Practice
Profile

---

# 32. DEMO DATA

Create an optional demo workspace so a new user can understand the application immediately.

Example:

Semester 5

DBMS
Machine Learning
Computer Networks

Include realistic sample materials, questions and progress data.

Clearly label demo data.

Do not mix demo data with the user's real data.

---

# 33. IMPORTANT PRODUCT RULE

Do NOT build every advanced feature first.

Build the application in phases.

### PHASE 1 — MVP

Implement first:

1. Authentication
2. Dashboard
3. Subjects
4. File upload
5. Material organization
6. PDF/document viewer
7. AI chat with documents
8. Basic question generation
9. Basic progress tracking

Make this phase fully functional before continuing.

### PHASE 2

Add:

- Previous-paper analyzer
- Important-topic engine
- Quiz system
- Study planner
- Flashcards

### PHASE 3

Add:

- Handwritten OCR
- Advanced revision algorithm
- Exam readiness score
- Advanced analytics
- Personalized AI recommendations

---

# 34. DEVELOPMENT REQUIREMENT

Do not create fake functionality.

If an API is not configured, create a clean setup/integration layer and show an appropriate configuration message rather than pretending the feature works.

Use reusable components.

Keep the code modular.

Use TypeScript where possible.

Write clean, maintainable code.

After implementing each major feature, test the complete user flow.

---

# 35. FINAL UX GOAL

The user should feel that they are not using a file-storage application.

They should feel like they have an:

# "AI-powered personal study system."

The final experience should answer three questions for the student:

**1. What do I have to study?**

**2. What should I study first?**

**3. How well am I prepared?**

Build the application around those three questions.

Start with Phase 1 and make the core application fully functional before adding Phase 2 or Phase 3.