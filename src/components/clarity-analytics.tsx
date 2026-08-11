'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export function ClarityAnalytics() {
  useEffect(() => {
    Clarity.init('y0juupk53b');
  }, []);

  return null;
}
