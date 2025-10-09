import { useState, useCallback, useRef, useLayoutEffect } from 'react';

export const usePopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const open = Boolean(anchorEl);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useLayoutEffect(() => {
    const handleEvents = (event: MouseEvent | KeyboardEvent) => {
      if (event.type === 'keydown' && (event as KeyboardEvent).key !== 'Escape') return;
      
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleEvents);
      document.addEventListener('keydown', handleEvents);
    }
    return () => {
      document.removeEventListener('mousedown', handleEvents);
      document.removeEventListener('keydown', handleEvents);
    };
  }, [open, handleClose, anchorEl]);

  useLayoutEffect(() => {
    if (open && anchorEl && popoverRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      // Use a default small rect for the first render if popover has no size yet
      const popoverRect = popoverRef.current.getBoundingClientRect().width > 0 
        ? popoverRef.current.getBoundingClientRect()
        : { width: 288, height: 400, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => {} };
        
      const { innerWidth, innerHeight } = window;

      let top = anchorRect.bottom + 8;
      let left = anchorRect.left;

      // Adjust left position if it overflows right edge
      if (left + popoverRect.width > innerWidth) {
        left = innerWidth - popoverRect.width - 16;
      }
      
      // Adjust top position if it overflows bottom edge, flip to top
      if (top + popoverRect.height > innerHeight) {
        top = anchorRect.top - popoverRect.height - 8;
      }

      // Ensure it's not off-screen after adjustments
      if (top < 8) top = 8;
      if (left < 8) left = 8;
      
      setPosition({ top, left });
    }
  }, [open, anchorEl]);

  const getPopoverProps = () => ({
    ref: popoverRef,
    style: {
      position: 'fixed' as const,
      top: `${position.top}px`,
      left: `${position.left}px`,
      zIndex: 100,
      visibility: open ? 'visible' : 'hidden',
      opacity: open ? 1 : 0,
      transition: 'opacity 150ms ease-in-out, visibility 150ms',
    },
  });

  return { open, handleOpen, handleClose, getPopoverProps };
};
