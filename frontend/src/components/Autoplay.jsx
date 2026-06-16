import { useEffect, useRef } from 'react';

export default function Autoplay({ videoRef, queue }) {
  const hasAutoplayed = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !queue?.length) return;
    const handleEnded = () => {
      if (!hasAutoplayed.current && queue.length > 0) {
        window.location.href = `/watch/${queue[0].id}`;
        hasAutoplayed.current = true;
      }
    };
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [queue, videoRef]);

  return null;
}
