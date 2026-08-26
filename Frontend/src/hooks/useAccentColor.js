// hooks/useAccentColor.js
import { useState, useEffect } from 'react';
import { extractAccentColor } from '../Utilities/colorExtractor.js';

/**
 * Returns an accent color derived from imageUrl, recomputed whenever
 * imageUrl changes. Starts as `fallback` until extraction resolves.
 */
export function useAccentColor(imageUrl, fallback = '#666666') {
  const [accentColor, setAccentColor] = useState(fallback);

  useEffect(() => {
    setAccentColor(fallback);

    let cancelled = false;

    if (!imageUrl) {
      setAccentColor(fallback);
      return;
    }

    extractAccentColor(imageUrl, fallback).then((color) => {
      if (!cancelled) {
        setAccentColor(color);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [imageUrl, fallback]); // re-runs automatically whenever the song image changes

  return accentColor;
}