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
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (video) {
      setVisible(true);
      setPaused(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), 8000);
    }
  }, [video]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setPaused(false);
    } else {
      vid.pause();
      setPaused(true);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

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
        ref={videoRef}
        src={video.video_url}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay
        muted
        loop
        playsInline
      />
      <button
        onClick={togglePlay}
        style={{
          position: 'absolute', bottom: 6, left: 6,
          background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff',
          borderRadius: '50%', width: 28, height: 28, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
        title={paused ? 'Reproduzir' : 'Pausar'}
      >
        {paused ? '▶️' : '⏸'}
      </button>
      <button
        onClick={handleClose}
        style={{
          position: 'absolute', top: 6, right: 6,
          background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff',
          borderRadius: '50%', width: 24, height: 24, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
        title="Fechar"
      >
        ✕
      </button>
    </div>
  );
}
