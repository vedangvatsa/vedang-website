'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'course-progress';

interface CourseProgress {
  [courseId: string]: {
    [moduleSlug: string]: boolean;
  };
}

function getProgress(): CourseProgress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: CourseProgress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const all = getProgress();
    setProgress(all[courseId] || {});
    setLoaded(true);
  }, [courseId]);

  const toggleModule = useCallback((moduleSlug: string) => {
    setProgress(prev => {
      const updated = { ...prev, [moduleSlug]: !prev[moduleSlug] };
      const all = getProgress();
      all[courseId] = updated;
      saveProgress(all);
      return updated;
    });
  }, [courseId]);

  const markComplete = useCallback((moduleSlug: string) => {
    setProgress(prev => {
      if (prev[moduleSlug]) return prev;
      const updated = { ...prev, [moduleSlug]: true };
      const all = getProgress();
      all[courseId] = updated;
      saveProgress(all);
      return updated;
    });
  }, [courseId]);

  const isComplete = useCallback((moduleSlug: string) => {
    return !!progress[moduleSlug];
  }, [progress]);

  const markExamPassed = useCallback(() => {
    setProgress(prev => {
      const updated = { ...prev, __exam_passed: true };
      const all = getProgress();
      all[courseId] = updated;
      saveProgress(all);
      return updated;
    });
  }, [courseId]);

  const isExamPassed = useCallback(() => {
    return !!progress.__exam_passed;
  }, [progress]);

  // Filter out internal keys from module count
  const completedCount = Object.entries(progress)
    .filter(([key, val]) => !key.startsWith('__') && val)
    .length;

  return { progress, loaded, toggleModule, markComplete, isComplete, completedCount, markExamPassed, isExamPassed };
}

