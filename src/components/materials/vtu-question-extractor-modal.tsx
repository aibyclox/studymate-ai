"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Flame,
  Star,
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Brain,
  HelpCircle,
  ExternalLink,
  Layers,
  GraduationCap,
} from "lucide-react";
import { VTUQuestion } from "@/types/database";

export interface VTUQuestionExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData?: {
    id?: string;
    title: string;
    fileName?: string;
    subjectName?: string;
    subjectCode?: string;
    unitTitle?: string;
    unitNumber?: number;
    subjectId?: string;
    unitId?: string;
  } | null;
}

export function VTUQuestionExtractorModal({
  isOpen,
  onClose,
  documentData,
}: VTUQuestionExtractorModalProps) {
  const [questions, setQuestions] = React.useState<VTUQuestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | "MUST_PREPARE" | "IMPORTANT" | "PYQ">("ALL");
  const [selectedModule, setSelectedModule] = React.useState<number | "ALL">("ALL");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [allCopied, setAllCopied] = React.useState(false);
  const [expandedPoints, setExpandedPoints] = React.useState<Record<string, boolean>>({});
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isGeneratingAnswer, setIsGeneratingAnswer] = React.useState<Record<string, boolean>>({});

  // Fetch or extract questions whenever modal opens with document data
  React.useEffect(() => {
    if (!isOpen || !documentData) return;

    let isMounted = true;
    setIsLoading(true);

    const extractQuestions = async () => {
      try {
        const res = await fetch("/api/questions/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            document_id: documentData.id,
            title: documentData.title,
            file_name: documentData.fileName,
            subject_id: documentData.subjectId,
            unit_id: documentData.unitId,
          }),
        });

        if (res.ok && isMounted) {
          const result = await res.json();
          if (result.data) {
            setQuestions(result.data);
            // Default to unit's module if available
            if (documentData.unitNumber && documentData.unitNumber >= 1 && documentData.unitNumber <= 5) {
              setSelectedModule(documentData.unitNumber);
            } else {
              setSelectedModule("ALL");
            }
          }
        }
      } catch (err) {
        console.error("Failed to extract VTU questions:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    extractQuestions();

    return () => {
      isMounted = false;
    };
  }, [isOpen, documentData]);

  const handleCopyQuestion = (q: VTUQuestion) => {
    const text = `${q.question_no ? q.question_no + " " : ""}${q.question} [${q.marks} Marks | ${q.blooms_level || "L2"} | ${q.vtu_exam_years.join(", ")}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (questions.length === 0) return;
    const allText = questions
      .map(
        (q) =>
          `${q.question_no || "Q"}: ${q.question}\nMarks: ${q.marks}M | Module: ${q.module} | Bloom's: ${
            q.blooms_level || "L2"
          } | Scheme: ${q.scheme || "2022 Scheme"}\nVTU Sessions: ${q.vtu_exam_years.join(
            ", "
          )}\nValuation Criteria:\n${q.key_marking_points.map((p) => `  - ${p}`).join("\n")}\n`
      )
      .join("\n---\n\n");

    navigator.clipboard.writeText(allText);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2500);
  };

  const handleDownloadRevisionSheet = () => {
    if (questions.length === 0) return;
    const content = `========================================================================
VISVESVARAYA TECHNOLOGICAL UNIVERSITY (VTU), BELAGAVI
B.E./B.Tech Examination - 2022 Scheme (Current Academic Syllabus)
Course: ${documentData?.subjectName || "Subject"} [${documentData?.subjectCode || "VTU 2022 Scheme"}]
Material: ${documentData?.title || "Uploaded Material"}
Source: Verified from vtu.ac.in Model Question Papers & University Exam Archives
========================================================================

INSTRUCTIONS:
1. Answer any FIVE full questions, choosing at least ONE question from each MODULE.
2. Marks are indicated against each question.
3. Draw neat sketches and flowcharts wherever necessary.

========================================================================
QUESTIONS BREAKDOWN BY MODULE:
========================================================================

${questions
  .map(
    (q) => `------------------------------------------------------------------------
${q.question_no ? q.question_no : "QUESTION"} [${q.marks} MARKS] - MODULE ${q.module}
Bloom's Level: ${q.blooms_level || "L2 (Understand)"} | CO Mapping: ${q.co_mapping || "CO" + q.module}
Priority: ${q.priority}
VTU Exam Papers: ${q.vtu_exam_years.join(", ")}
Repeat Frequency: ${q.repeat_frequency}

${q.question}

OFFICIAL VTU VALUATION CRITERIA:
${q.key_marking_points.map((pt) => `  * ${pt}`).join("\n")}

MODEL ANSWER / EXAMINER SUMMARY HINT:
  ${q.sample_answer_hint || "Refer to lecture notes"}
`
  )
  .join("\n")}
========================================================================
Generated by StudyMate AI - Your Personal Study Organizer & Exam Preparation Companion
========================================================================
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VTU_2022_Scheme_${(documentData?.subjectCode || "VTU").replace(/\s+/g, "_")}_${(
      documentData?.title || "ExamQuestions"
    ).replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateAnswer = async (q: VTUQuestion) => {
    if (answers[q.id]) {
      setExpandedPoints((prev) => ({ ...prev, [`ans_${q.id}`]: !prev[`ans_${q.id}`] }));
      return;
    }

    try {
      setIsGeneratingAnswer((prev) => ({ ...prev, [q.id]: true }));
      const res = await fetch("/api/questions/ai-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          subject_name: documentData?.subjectName,
          marks: q.marks,
          key_marking_points: q.key_marking_points,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.answer) {
          setAnswers((prev) => ({ ...prev, [q.id]: data.answer }));
          setExpandedPoints((prev) => ({ ...prev, [`ans_${q.id}`]: true }));
        }
      }
    } catch (err) {
      console.error("Failed to generate AI answer:", err);
    } finally {
      setIsGeneratingAnswer((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const togglePoints = (id: string) => {
    setExpandedPoints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter questions by priority AND selected module
  const filteredQuestions = questions.filter((q) => {
    const matchesPriority = activeFilter === "ALL" || q.priority === activeFilter;
    const matchesModule = selectedModule === "ALL" || q.module === selectedModule;
    return matchesPriority && matchesModule;
  });

  const mustPrepareCount = questions.filter((q) => q.priority === "MUST_PREPARE").length;
  const pyqCount = questions.filter((q) => q.priority === "PYQ").length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="VTU 2022 Scheme Exam PYQ & Question Intelligence"
      description="Extracted based on current academic year curriculum, official model papers, and university exam archives."
      className="max-w-3xl max-h-[90vh] flex flex-col"
    >
      <div className="space-y-4 pt-1 overflow-y-auto pr-1">
        {/* VTU 2022 Scheme Official Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-3.5 dark:border-indigo-900/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  2022 Scheme (Current)
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {documentData?.subjectCode || "VTU Course"} • {documentData?.subjectName || "Engineering"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Material: <strong className="text-slate-700 dark:text-slate-300">{documentData?.title}</strong>
                {documentData?.unitTitle ? ` • ${documentData.unitTitle}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900">
              <Check className="h-3 w-3" />
              vtu.ac.in Verified Pattern
            </span>
          </div>
        </div>

        {/* Module Selector Tabs (Modules 1 - 5) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Modules:
          </span>
          <button
            type="button"
            onClick={() => setSelectedModule("ALL")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors shrink-0 ${
              selectedModule === "ALL"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            All Modules ({questions.length})
          </button>
          {[1, 2, 3, 4, 5].map((mNum) => {
            const count = questions.filter((q) => q.module === mNum).length;
            return (
              <button
                key={mNum}
                type="button"
                onClick={() => setSelectedModule(mNum)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors shrink-0 ${
                  selectedModule === mNum
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                Module {mNum} {count > 0 ? `(${count})` : ""}
              </button>
            );
          })}
        </div>

        {/* Loading State Animation */}
        {isLoading ? (
          <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950">
              <Brain className="h-7 w-7 text-indigo-600 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600"></span>
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Matching against VTU 2022 Scheme Curriculum & Official Exam Archive...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Extracting Model Question Papers (MQP 1 & 2), Bloom's levels, and past university examination questions.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Priority Filter Tabs */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveFilter("ALL")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    activeFilter === "ALL"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  All Priorities
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("MUST_PREPARE")}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    activeFilter === "MUST_PREPARE"
                      ? "bg-rose-600 text-white"
                      : "text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  }`}
                >
                  <Flame className="h-3.5 w-3.5" />
                  Must Prepare ({mustPrepareCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("PYQ")}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    activeFilter === "PYQ"
                      ? "bg-amber-600 text-white"
                      : "text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  VTU PYQs ({pyqCount})
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">
                Showing {filteredQuestions.length} of {questions.length} questions
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-3.5 max-h-[52vh] overflow-y-auto pr-1">
              {filteredQuestions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No questions match this module and priority filter. Select "All Modules" or "All Priorities".
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const isAnsExpanded = !!expandedPoints[`ans_${q.id}`];
                  const isPointsExpanded = !!expandedPoints[q.id];
                  const isGenerating = !!isGeneratingAnswer[q.id];

                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-950/60"
                    >
                      {/* Question Header Bar: Numbering, Marks, Bloom's Level */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {q.question_no && (
                            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-black text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                              {q.question_no}
                            </span>
                          )}

                          <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">
                            {q.marks} MARKS
                          </span>

                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-400">
                            MODULE {q.module}
                          </span>

                          {q.blooms_level && (
                            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-900 dark:text-purple-300">
                              {q.blooms_level}
                            </span>
                          )}

                          {q.priority === "MUST_PREPARE" ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
                              <Flame className="h-3 w-3" />
                              MUST PREPARE
                            </span>
                          ) : q.priority === "PYQ" ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400">
                              <FileText className="h-3 w-3" />
                              VTU PYQ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:border-sky-900 dark:text-sky-400">
                              <Star className="h-3 w-3" />
                              IMPORTANT
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyQuestion(q)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400"
                          title="Copy question text"
                        >
                          {copiedId === q.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                        {q.question}
                      </p>

                      {/* Exam Sessions Tag */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-900 text-[11px]">
                        <span className="text-slate-400 font-medium">VTU Exam Sources:</span>
                        {q.vtu_exam_years.map((yr) => (
                          <span
                            key={yr}
                            className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {yr}
                          </span>
                        ))}
                        <span className="ml-auto text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">
                          {q.repeat_frequency}
                        </span>
                      </div>

                      {/* Controls: Marking Scheme & AI Answer */}
                      <div className="flex items-center gap-2 mt-3 pt-1">
                        <button
                          type="button"
                          onClick={() => togglePoints(q.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                          <span>Official Valuation Scheme</span>
                          {isPointsExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <span className="text-slate-300 dark:text-slate-700">•</span>

                        <button
                          type="button"
                          onClick={() => handleGenerateAnswer(q)}
                          disabled={isGenerating}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
                        >
                          <Brain className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                          <span>
                            {isGenerating
                              ? "Generating Model Answer..."
                              : answers[q.id]
                              ? "View Full Model Answer"
                              : "Generate AI Model Answer"}
                          </span>
                        </button>
                      </div>

                      {/* Marking Scheme Points Accordion */}
                      {isPointsExpanded && (
                        <div className="mt-2.5 rounded-lg bg-slate-50 p-3.5 text-xs dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 animate-in fade-in">
                          <span className="block font-bold text-slate-800 dark:text-slate-200">
                            Official VTU Valuation Breakdown ({q.marks} Marks):
                          </span>
                          <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                            {q.key_marking_points.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                          {q.sample_answer_hint && (
                            <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800 font-medium">
                              💡 Examiner Tip: {q.sample_answer_hint}
                            </p>
                          )}
                        </div>
                      )}

                      {/* AI Generated Model Answer */}
                      {isAnsExpanded && answers[q.id] && (
                        <div className="mt-2.5 rounded-lg bg-purple-50/70 p-4 text-xs dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between border-b border-purple-200 pb-2 dark:border-purple-900">
                            <span className="font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                              Exam-Ready Model Answer ({q.marks} Marks)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(answers[q.id]);
                                setCopiedId(`ans_${q.id}`);
                                setTimeout(() => setCopiedId(null), 2000);
                              }}
                              className="text-[11px] font-semibold text-purple-700 hover:underline dark:text-purple-300"
                            >
                              {copiedId === `ans_${q.id}` ? "Copied!" : "Copy Answer"}
                            </button>
                          </div>
                          <div className="text-[12px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                            {answers[q.id]}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Modal Bottom Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              disabled={isLoading || questions.length === 0}
              className="gap-1.5 text-xs flex-1 sm:flex-none"
            >
              {allCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{allCopied ? "Copied All!" : "Copy All"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadRevisionSheet}
              disabled={isLoading || questions.length === 0}
              className="gap-1.5 text-xs flex-1 sm:flex-none"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download 2022 Scheme Exam Sheet</span>
            </Button>
          </div>

          <Button type="button" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
