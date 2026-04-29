import { FinalExamClient } from '@/components/final-exam-client';
import { examQuestions } from '@/lib/exam-questions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Final Exam | AI Automation 101',
  description: 'Test your knowledge and earn your AI Automation 101 certificate.',
};

export default function FinalExam() {
  return <FinalExamClient courseId="ai-automation" questions={examQuestions['ai-automation']} />;
}
