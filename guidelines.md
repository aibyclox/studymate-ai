# StudyMate AI — Development Guidelines

## 1. PROJECT VISION

Build **StudyMate AI**, a production-quality AI-powered study management platform.

The application is NOT simply a PDF storage system.

Its purpose is to help students:

1. Organize study materials
2. Understand their materials using AI
3. Generate exam-ready answers
4. Identify important topics
5. Practice using AI-generated questions and quizzes
6. Create personalized study plans
7. Track preparation and revision
8. Prepare efficiently for examinations

The core product philosophy is:

**"Don't just store study material. Help the student know what to study, understand it, practice it, and know whether they are ready."**

---

# 2. DEVELOPMENT PHILOSOPHY

Follow these principles throughout development:

### Build working software, not mockups.

Do not create buttons that appear functional but have no backend implementation.

Do not use fake AI responses in production features.

Do not hard-code fake user statistics.

Do not create placeholder functionality unless explicitly marked as demo functionality.

Every major UI feature should connect to actual application logic.

---

# 3. DEVELOPMENT ORDER

Never attempt to build the entire application simultaneously.

Follow this order:

### Phase 1 — Foundation

Build:

- Project structure
- Authentication
- Database
- User profiles
- Subjects
- Units
- Dashboard
- File upload
- File storage

### Phase 2 — Study Materials

Build:

- Material library
- Folder/subject organization
- Document metadata
- Search
- Filters
- Document viewer
- Delete/rename/move functionality

### Phase 3 — AI

Build:

- Document text extraction
- Chunking
- Embeddings
- Vector storage
- RAG pipeline
- AI study chat
- Source citations

### Phase 4 — Exam Intelligence

Build:

- Question generator
- Important-topic detection
- Previous-paper analyzer
- Exam priority system

### Phase 5 — Practice

Build:

- Quiz generator
- Quiz interface
- Score tracking
- Weak-topic detection
- Flashcards

### Phase 6 — Planning

Build:

- Study planner
- Daily tasks
- Revision system
- Exam mode
- Readiness analysis

### Phase 7 — Advanced Features

Build:

- OCR for handwritten notes
- Advanced analytics
- Personalized recommendations
- Spaced revision

Do not move to the next phase until the current phase is functional.

---

# 4. UI/UX GUIDELINES

The application should look like a modern SaaS product.

Design inspiration:

- Notion
- Linear
- Google Drive
- modern AI applications

Do NOT copy their UI directly.

Use:

- Clean typography
- Consistent spacing
- Rounded but professional components
- Clear hierarchy
- Subtle animations
- Responsive layouts
- Dark/light mode
- Accessible colors
- Consistent icons

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Giant cards
- Unnecessary animations
- Cluttered dashboards
- Too many colors
- Generic template appearance

The application should look professional enough to be shown to a client or evaluator.

---

# 5. RESPONSIVE DESIGN

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop:

Use a sidebar navigation.

Mobile:

Use a compact navigation/bottom navigation system.

Never allow:

- Horizontal overflow
- Broken tables
- Text going outside cards
- Buttons becoming unusable
- Unreadable dialogs

Test important screens at multiple screen sizes.

---

# 6. NAVIGATION

Main navigation:

Dashboard

Materials

Subjects

AI Study

Questions

Quiz

Study Planner

Exam Mode

Progress

Settings

Keep navigation consistent throughout the application.

Use breadcrumbs where useful.

---

# 7. DASHBOARD GUIDELINES

The dashboard should answer:

### What should I study?

### What should I study next?

### How prepared am I?

Show:

- Overall progress
- Subject progress
- Upcoming exams
- Pending tasks
- Recently opened material
- AI recommendations
- Weak topics
- Continue studying

Do not overwhelm the dashboard.

Prioritize important information.

---

# 8. DATABASE GUIDELINES

Use a relational database.

Suggested entities:

users

profiles

semesters

subjects

units

topics

documents

document_chunks

questions

quizzes

quiz_questions

quiz_attempts

study_plans

study_tasks

study_sessions

progress

exam_dates

chat_sessions

chat_messages

flashcards

Use:

- Foreign keys
- Proper indexes
- Timestamps
- Unique constraints where appropriate

Avoid unnecessary duplication.

Use migrations for schema changes.

Never manually modify production database structure without updating migrations.

---

# 9. AUTHENTICATION & AUTHORIZATION

Every user must have isolated data.

A user must never be able to:

- View another user's documents
- Download another user's files
- View another user's chat
- Modify another user's subjects
- Access another user's progress

Use server-side authorization.

Do not rely only on frontend checks.

If using Supabase, implement Row Level Security properly.

---

# 10. FILE UPLOAD GUIDELINES

Supported formats should include where technically possible:

PDF

PPT

PPTX

DOC

DOCX

TXT

PNG

JPG

JPEG

Validate:

- File type
- File size
- File name
- Upload permissions

Show:

Uploading...

Processing...

Analyzing...

Ready

If processing fails:

Show a clear error and allow retry.

Do not silently fail.

---

# 11. DOCUMENT PROCESSING

For every uploaded document:

1. Validate file
2. Store file
3. Extract text
4. Clean extracted text
5. Detect metadata
6. Split into chunks
7. Generate embeddings
8. Store chunks
9. Mark document as processed

Maintain document status:

`uploaded`

`processing`

`ready`

`failed`

Do not allow AI search before processing is complete.

---

# 12. RAG GUIDELINES

The AI study assistant must use Retrieval-Augmented Generation.

Pipeline:

User Question

↓

Query Processing

↓

Semantic Search

↓

Relevant Document Chunks

↓

Context Construction

↓

LLM

↓

Answer

↓

Source References

The AI should prioritize the student's uploaded material.

Never pretend that an answer came from the user's document if it did not.

If the required information is unavailable, say so clearly.

---

# 13. AI RESPONSE GUIDELINES

AI responses should be:

- Accurate
- Structured
- Concise
- Student-friendly
- Exam-oriented when requested

Use headings and bullet points where appropriate.

For exam answers:

### Definition

### Explanation

### Key Points

### Example

### Diagram

### Conclusion

Only include sections that make sense for the question.

---

# 14. SOURCE CITATIONS

When answering using uploaded documents, show:

Document name

Page number if available

Relevant section if available

Example:

**Source: DBMS Unit 2 Notes — Page 14**

Make source references clickable when technically possible.

Never invent page numbers.

---

# 15. QUESTION GENERATOR

Questions must be generated from actual study material whenever possible.

Support:

- 2-mark
- 5-mark
- 7–8-mark
- 10-mark
- MCQ
- Viva

Allow:

- Difficulty selection
- Number of questions
- Unit selection
- Subject selection

Questions should not be repetitive.

---

# 16. IMPORTANT TOPIC ENGINE

Priority should be calculated using actual evidence.

Possible factors:

- Frequency in previous papers
- Frequency in study material
- Syllabus importance
- User mistakes
- User revision history
- Exam proximity

Do not randomly assign importance.

Display a reason for high-priority topics.

Example:

**Normalization — High Priority**

Reason:

"Appeared in 5 of the last 7 uploaded question papers."

---

# 17. QUIZ SYSTEM

Quiz flow:

Start Quiz

↓

Question

↓

Answer

↓

Immediate feedback

↓

Explanation

↓

Next Question

↓

Final Score

↓

Weak Topic Analysis

Store quiz attempts.

Track:

- Score
- Accuracy
- Time
- Weak topics
- Strong topics

Use this information in future recommendations.

---

# 18. STUDY PLANNER

The AI study planner should consider:

- Exam date
- Available study hours
- Subject difficulty
- Current progress
- Important topics
- Weak topics
- Completed tasks

If the user misses a task, don't simply mark it failed.

Recalculate the remaining plan.

Do not schedule more hours than the user has declared available.

---

# 19. PROGRESS TRACKING

Progress must be based on real user activity.

Possible signals:

- Completed topics
- Completed study tasks
- Quiz scores
- Revision count
- Material viewed
- Practice completed

Do not use arbitrary random percentages.

---

# 20. SEARCH

Global search should eventually search:

- Documents
- Subjects
- Units
- Topics
- Questions
- Flashcards
- AI conversations

Search should support partial matches.

Use database indexes where appropriate.

For document content, use semantic search.

---

# 21. ERROR HANDLING

Every API request must have proper error handling.

Never expose:

- API keys
- Stack traces
- Database errors
- Internal paths
- Sensitive information

User-facing errors should be understandable.

Example:

Instead of:

`ECONNREFUSED 127.0.0.1:5432`

show:

**"We couldn't connect to the database. Please try again."**

Log technical details securely on the server.

---

# 22. LOADING STATES

Every asynchronous operation needs a loading state.

Examples:

Uploading file...

Processing document...

Generating questions...

Analyzing previous papers...

Creating study plan...

Searching materials...

Do not leave users staring at a frozen interface.

---

# 23. EMPTY STATES

Every empty section should explain what the user can do.

Example:

No study materials yet.

**Upload your first document**

Button:

`Upload Material`

Avoid empty blank screens.

---

# 24. SECURITY

Follow secure development practices.

Never expose secrets in frontend code.

Use environment variables.

Validate user input.

Sanitize uploaded content.

Use authorization checks.

Restrict file access.

Protect API routes.

Add rate limits to expensive AI operations where appropriate.

Never allow arbitrary server-side code execution through user input.

---

# 25. API DESIGN

Keep APIs modular.

Example:

`/api/materials`

`/api/materials/upload`

`/api/materials/process`

`/api/ai/chat`

`/api/ai/questions`

`/api/ai/quiz`

`/api/ai/planner`

`/api/progress`

`/api/exams`

Use clear request and response structures.

Do not put all backend logic into one giant API route.

---

# 26. CODE QUALITY

Use:

- TypeScript
- Reusable components
- Reusable hooks
- Service layers
- Proper types
- Clear naming
- Small functions
- Modular files

Avoid:

- Giant components
- Duplicate code
- Magic numbers
- Hard-coded user data
- Hard-coded API responses
- Unnecessary dependencies

Before creating a new component, check whether an existing component can be reused.

---

# 27. COMPONENT GUIDELINES

Create reusable components for:

- Buttons
- Cards
- Modals
- Dialogs
- Inputs
- File upload
- Progress bars
- Charts
- Tables
- AI messages
- Document cards
- Subject cards
- Quiz questions

Keep components focused.

---

# 28. PERFORMANCE

Avoid unnecessary API calls.

Use:

- Pagination
- Lazy loading
- Caching
- Debounced search
- Optimized database queries

Do not load every document or every chat message at once.

Large documents should be processed asynchronously.

---

# 29. AI COST CONTROL

AI calls can become expensive.

Use AI only when necessary.

Do not send entire documents to the LLM.

Use:

Document

→ Chunk

→ Retrieve relevant chunks

→ Send only relevant context

Cache results when appropriate.

Use smaller/cheaper models for simple tasks and stronger models for complex reasoning when the platform supports multiple models.

---

# 30. TESTING

Before declaring a feature complete, test:

### Functional

Does it actually work?

### UI

Does it look correct?

### Responsive

Does it work on mobile?

### Security

Can another user access the data?

### Error

What happens if the request fails?

### Empty state

What happens when there is no data?

### Loading

What happens during processing?

### Edge cases

Test:

- Empty files
- Very large files
- Unsupported files
- Duplicate files
- No AI response
- Network failure
- Invalid input

---

# 31. GIT / VERSION CONTROL

Make small logical commits.

Examples:

`feat: add authentication`

`feat: add material upload`

`feat: add document processing`

`feat: add RAG chat`

`feat: add quiz system`

`fix: protect document access`

Do not make one massive commit containing the entire application.

---

# 32. BEFORE MODIFYING CODE

Before implementing a feature:

1. Inspect the existing project.
2. Understand the current architecture.
3. Find reusable components.
4. Check existing database schema.
5. Check existing API routes.
6. Check environment configuration.
7. Identify dependencies.
8. Plan the smallest safe change.

Do not blindly overwrite existing code.

---

# 33. WHEN SOMETHING BREAKS

Do NOT immediately rewrite the entire project.

First:

1. Identify the error.
2. Locate the root cause.
3. Check related code.
4. Make the smallest appropriate fix.
5. Test the affected feature.
6. Test related functionality.

Preserve working functionality.

---

# 34. AI AGENT BEHAVIOR

When working as an IDE coding agent:

- Inspect before modifying.
- Explain major architectural decisions briefly.
- Prefer simple solutions.
- Do not over-engineer.
- Reuse existing code.
- Do not introduce unnecessary libraries.
- Keep security in mind.
- Test after implementation.
- Never claim something works without verifying it.

If a requirement is ambiguous, choose the simplest production-safe interpretation and document the assumption.

---

# 35. DEFINITION OF DONE

A feature is NOT complete merely because the UI exists.

A feature is complete only when:

✓ UI exists

✓ Backend exists where required

✓ Database integration works

✓ Authentication/authorization works

✓ Error handling exists

✓ Loading state exists

✓ Empty state exists

✓ Mobile layout works

✓ Real data works

✓ Feature has been tested

✓ No existing functionality has been broken

---

# 36. PRIORITY RULE

When choosing between:

A. More features

B. Better reliability

Always choose **better reliability**.

A smaller application that works perfectly is better than a huge application full of broken features.

---

# 37. PRODUCT QUALITY TARGET

The final application should feel like a real startup product.

It should NOT feel like:

"An engineering college project with some AI added."

It should feel like:

**"A serious AI study platform that happens to be built by a student."**

The three most important user questions must always remain visible in the product:

### What should I study?

### Help me understand it.

### Am I ready for the exam?

Build every major feature around those three goals.