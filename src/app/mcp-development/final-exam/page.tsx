import { FinalExamClient } from '@/components/final-exam-client';
import { examQuestions } from '@/lib/exam-questions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Final Exam | MCP Development 101',
  description: 'Test your knowledge and earn your MCP Development 101 certificate.',
  alternates: { canonical: '/mcp-development/final-exam' },
};

export default function FinalExam() {
  return <FinalExamClient courseId="mcp-development" questions={examQuestions['mcp-development']} />;
}
