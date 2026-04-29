'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { ExamQuestion } from '@/lib/exam-questions';
import { CertificateGenerator } from '@/components/certificate-generator';
import { courseConfigs, CourseId } from '@/lib/course-config';
import { AlertTriangle, CheckCircle2, XCircle, RotateCcw, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FinalExamClientProps {
  courseId: CourseId;
  questions: ExamQuestion[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function FinalExamClient({ courseId, questions }: FinalExamClientProps) {
  const config = courseConfigs[courseId];
  const { completedCount, loaded, markExamPassed, isExamPassed } = useCourseProgress(courseId);
  const totalModules = config.modules.length;
  const allModulesComplete = completedCount >= totalModules;

  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [nameError, setNameError] = useState('');

  // Shuffle questions on mount (but keep correct answer tracking)
  const shuffledQuestions = useMemo(() => {
    return shuffleArray(questions.map((q, originalIdx) => ({ ...q, originalIdx })));
  }, [questions]);

  const totalQuestions = questions.length;
  const passingScore = Math.ceil(totalQuestions * 0.85); // ~85% to pass
  const passed = score >= passingScore;
  const alreadyPassed = loaded && isExamPassed();

  // Gate: must complete all modules
  if (loaded && !allModulesComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Lock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-6" />
        <h1 className="text-2xl font-bold mb-4">Final Exam Locked</h1>
        <p className="text-muted-foreground mb-2">
          Complete all {totalModules} modules to unlock the final exam.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Progress: {completedCount}/{totalModules} modules complete
        </p>
        <Link 
          href={config.basePath}
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>
      </div>
    );
  }

  // Already passed — go straight to certificate
  if (alreadyPassed && !showCertificate && !submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-6" />
        <h1 className="text-2xl font-bold mb-4">You already passed this exam</h1>
        <p className="text-muted-foreground mb-8">Enter your name to generate your certificate.</p>
        <NameInput 
          studentName={studentName} 
          setStudentName={setStudentName}
          nameError={nameError}
          onSubmit={() => {
            const trimmed = studentName.trim();
            if (trimmed.length < 2) {
              setNameError('Please enter your full name (at least 2 characters)');
              return;
            }
            if (trimmed.length > 50) {
              setNameError('Name must be 50 characters or fewer');
              return;
            }
            setNameError('');
            setShowCertificate(true);
          }} 
        />
      </div>
    );
  }

  // Show certificate
  if (showCertificate) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Your Certificate</h1>
          <p className="text-muted-foreground">Share it on LinkedIn to show your achievement.</p>
        </div>
        <CertificateGenerator 
          studentName={studentName.trim()} 
          courseTitle={config.courseTitle} 
          courseId={courseId} 
        />
        <div className="mt-8 text-center">
          <Link 
            href={config.basePath}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to {config.courseTitle}
          </Link>
        </div>
      </div>
    );
  }

  const handleSelect = (questionIdx: number, optionIdx: number) => {
    if (submitted) return;
    const updated = [...selectedAnswers];
    updated[questionIdx] = optionIdx;
    setSelectedAnswers(updated);
  };

  const handleSubmit = () => {
    // Validate all questions answered
    if (selectedAnswers.some(a => a === null)) return;

    let correct = 0;
    shuffledQuestions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    if (correct >= Math.ceil(shuffledQuestions.length * 0.85)) {
      markExamPassed();
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  };

  const allAnswered = selectedAnswers.every(a => a !== null);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{config.courseTitle}: Final Exam</h1>
        <p className="text-muted-foreground">
          Answer at least {passingScore} out of {totalQuestions} questions correctly to earn your certificate.
        </p>
      </div>

      <div className="space-y-8">
        {shuffledQuestions.map((q, qIdx) => {
          const isCorrect = submitted && selectedAnswers[qIdx] === q.correctIndex;
          const isWrong = submitted && selectedAnswers[qIdx] !== null && selectedAnswers[qIdx] !== q.correctIndex;

          return (
            <div key={qIdx} className={`p-6 rounded-lg border ${
              submitted 
                ? isCorrect ? 'border-green-500/30 bg-green-500/5' : isWrong ? 'border-red-500/30 bg-red-500/5' : 'border-muted'
                : 'border-muted'
            }`}>
              <p className="font-medium mb-4">
                <span className="text-muted-foreground mr-2">{qIdx + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[qIdx] === oIdx;
                  const isAnswer = q.correctIndex === oIdx;
                  const showCorrect = submitted && isAnswer;
                  const showWrong = submitted && isSelected && !isAnswer;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-all ${
                        showCorrect
                          ? 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400'
                          : showWrong
                            ? 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400'
                            : isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                      } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-muted-foreground font-mono text-xs">{String.fromCharCode(65 + oIdx)}</span>
                        {opt}
                        {showCorrect && <CheckCircle2 className="h-4 w-4 ml-auto shrink-0 text-green-500" />}
                        {showWrong && <XCircle className="h-4 w-4 ml-auto shrink-0 text-red-500" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / Results */}
      {!submitted ? (
        <div className="mt-8">
          {!allAnswered && (
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Answer all questions before submitting
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              allAnswered
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            Submit Exam
          </button>
        </div>
      ) : (
        <div className={`mt-8 p-6 rounded-lg border ${passed ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
          <div className="flex items-center gap-3 mb-3">
            {passed ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <h2 className="text-lg font-bold">
              {passed ? 'Congratulations! You passed!' : 'Not quite. Keep learning!'}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Score: {score}/{totalQuestions} ({Math.round((score / totalQuestions) * 100)}%)
            {!passed && ` — You need at least ${passingScore}/${totalQuestions} to pass.`}
          </p>

          {passed ? (
            <NameInput 
              studentName={studentName} 
              setStudentName={setStudentName}
              nameError={nameError}
              onSubmit={() => {
                const trimmed = studentName.trim();
                if (trimmed.length < 2) {
                  setNameError('Please enter your full name (at least 2 characters)');
                  return;
                }
                if (trimmed.length > 50) {
                  setNameError('Name must be 50 characters or fewer');
                  return;
                }
                if (!/^[a-zA-Z\s.\-']+$/.test(trimmed)) {
                  setNameError('Name can only contain letters, spaces, hyphens, apostrophes, and periods');
                  return;
                }
                setNameError('');
                setShowCertificate(true);
              }} 
            />
          ) : (
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Exam
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function NameInput({ studentName, setStudentName, nameError, onSubmit }: {
  studentName: string;
  setStudentName: (v: string) => void;
  nameError: string;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-2">Enter your full name for the certificate</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="Your full name"
          maxLength={50}
          className="flex-1 px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={onSubmit}
          disabled={!studentName.trim()}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            studentName.trim()
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Generate Certificate
        </button>
      </div>
      {nameError && (
        <p className="text-sm text-red-500 mt-2">{nameError}</p>
      )}
    </div>
  );
}
