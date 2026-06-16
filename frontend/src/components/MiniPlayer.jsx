import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

let miniPlayerVideo = null;

export function useMiniPlayer() {
  const [video, setVideo] = useState(miniPlayerVideo);
  const setMiniPlayerVideo = (v) => {
    miniPlayerVideo = v;
    setVideo(v);
  };
  const clearMiniPlayer = () => setMiniPlayerVideo(null);
  return { video, setMiniPlayerVideo, clearMiniPlayer };
}

export default function MiniPlayer() {
  const { video } = useMiniPlayer();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (video) {
      setVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), 5000);
    }
  }, [video]);

  if (!video || !visible) return null;

  return (
    <div
      className="mini-player"
      onClick={() => {
        navigate(`/watch/${video.id}`);
        setVisible(false);
      }}
    >
      <video
        src={video.video_url}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay
        muted
        loop
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: 'rgba(0,0,0,0.6)',
          border: 'none',
          color: '#fff',
          borderRadius: '50%',
          width: 24,
          height: 24,
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>
    </div>
  );
}
