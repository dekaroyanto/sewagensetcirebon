import { useEffect } from 'react';

let activeLocks = 0;
let originalOverflow = '';
let originalPaddingRight = '';

/**
 * Safely locks body scrolling with reference counting.
 * Supports multiple nested or concurrent modals without race conditions.
 */
export const lockBodyScroll = () => {
  if (typeof document === 'undefined') return;

  if (activeLocks === 0) {
    // Only capture original style if it wasn't already locked
    const currentOverflow = document.body.style.overflow;
    if (currentOverflow !== 'hidden') {
      originalOverflow = currentOverflow;
    } else {
      originalOverflow = '';
    }

    originalPaddingRight = document.body.style.paddingRight || '';

    // Compensate for scrollbar disappearance to prevent content jumping on desktop
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    document.body.style.overflow = 'hidden';
  }

  activeLocks++;
};

/**
 * Safely unlocks body scrolling when all locks are released.
 */
export const unlockBodyScroll = () => {
  if (typeof document === 'undefined') return;

  activeLocks = Math.max(0, activeLocks - 1);

  if (activeLocks === 0) {
    // Guaranteed restore to clean state
    document.body.style.overflow = originalOverflow === 'hidden' ? '' : originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  }
};

/**
 * Force reset body scroll styles (useful on page unmount / navigation safeguard).
 */
export const resetBodyScroll = () => {
  if (typeof document === 'undefined') return;
  activeLocks = 0;
  originalOverflow = '';
  originalPaddingRight = '';
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

/**
 * React hook to lock body scroll while active, and automatically release on unmount.
 */
export const useBodyScrollLock = (isLocked: boolean = true) => {
  useEffect(() => {
    if (!isLocked) return;

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
};
