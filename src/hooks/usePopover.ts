import { useState, useCallback, useRef, useEffect } from 'react';

export const usePopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        open &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [open, handleClose, anchorEl]);

  const getPopoverProps = () => {
    if (!anchorEl) return { style: { display: 'none' } };
    const rect = anchorEl.getBoundingClientRect();
    return {
      ref: popoverRef,
      style: {
        position: 'absolute' as const,
        top: rect.bottom + 8,
        left: rect.left,
        zIndex: 50,
      },
    };
  };

  return {
    open,
    handleOpen,
    handleClose,
    anchorEl,
    getPopoverProps,
  };
};
