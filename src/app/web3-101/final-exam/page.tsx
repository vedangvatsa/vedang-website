import { FinalExamClient } from '@/components/final-exam-client';
import { examQuestions } from '@/lib/exam-questions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Final Exam | Web3 101',
  description: 'Test your knowledge and earn your Web3 101 certificate.',
  alternates: { canonical: '/web3-101/final-exam' },
};

export default function FinalExam() {
  return <FinalExamClient courseId="web3-101" questions={examQuestions['web3-101']} />;
}
