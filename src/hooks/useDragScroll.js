import { useRef, useState } from 'react';

const useDragScroll = () => {
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (event, ref) => {
    if (event.button !== 0) return;
    const node = ref.current;
    if (!node) return;
    event.preventDefault();
    isDownRef.current = true;
    setIsDragging(false);
    startXRef.current = event.clientX;
    startScrollLeftRef.current = node.scrollLeft;
    node.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event, ref) => {
    const node = ref.current;
    if (!node || !isDownRef.current) return;
    event.preventDefault();
    const dx = event.clientX - startXRef.current;
    if (Math.abs(dx) > 4) setIsDragging(true);
    node.scrollLeft = startScrollLeftRef.current - dx;
  };

  const endDrag = (event, ref) => {
    const node = ref.current;
    if (node) node.releasePointerCapture?.(event.pointerId);
    isDownRef.current = false;
    setTimeout(() => setIsDragging(false), 0);
  };

  return { isDragging, onPointerDown, onPointerMove, endDrag };
};

export default useDragScroll;
