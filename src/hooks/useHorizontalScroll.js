import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_SCROLL_RATIO = 0.8;

const useHorizontalScroll = ({ scrollRatio = DEFAULT_SCROLL_RATIO, deps = [] } = {}) => {
  const ref = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    const { scrollLeft, clientWidth, scrollWidth } = node;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const frame = requestAnimationFrame(update);
    const onScroll = () => update();
    node.addEventListener('scroll', onScroll, { passive: true });
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => update());
      resizeObserver.observe(node);
    } else {
      window.addEventListener('resize', update);
    }
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener('scroll', onScroll);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', update);
    };
  }, [update, ...deps]);

  const scrollBy = useCallback((direction) => {
    const node = ref.current;
    if (!node) return;
    const amount = Math.ceil(node.clientWidth * scrollRatio) * direction;
    if (typeof node.scrollBy === 'function') {
      node.scrollBy({ left: amount, behavior: 'smooth' });
    } else {
      node.scrollLeft = node.scrollLeft + amount;
    }
  }, [scrollRatio]);

  return { ref, canScrollLeft, canScrollRight, scrollBy, update };
};

export default useHorizontalScroll;
