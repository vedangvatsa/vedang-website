'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export function ClarityAnalytics() {
  useEffect(() => {
    try {
      Clarity.init('y0juupk53b');
    } catch {
      // Analytics must not take the page down.
    }
  }, []);

  return null;
}
