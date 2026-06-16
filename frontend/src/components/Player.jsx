import { useState, useRef, useEffect } from 'react';
import { IconLike, IconShare } from './Icons';

export default function Player({ src, poster, onLike, liked, likeCount, onShare, onPiP, onTheater, chapters = [] }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * duration;
    videoRef.current.currentTime = seekTime;
  };

  const handleVolume = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newVolume = (e.clientX - rect.left) / rect.width;
    videoRef.current.volume = Math.min(1, Math.max(0, newVolume));
    setVolume(videoRef.current.volume);
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="player-container">
      <video ref={videoRef} src={src} poster={poster} onClick={togglePlay} className="player-video" />
      <div className="player-controls">
        <button onClick={togglePlay} className="control-btn">{playing ? '⏸' : '▶️'}</button>
        <span className="time">{formatTime(currentTime)} / {formatTime(duration)}</span>
        <div className="progress-bar" onClick={handleSeek}>
          <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }} />
          {chapters.map(ch => (
            <div key={ch.time} className="chapter-marker" style={{ left: `${(ch.time / duration) * 100}%` }} title={ch.title} />
          ))}
        </div>
        <button onClick={onTheater} className="control-btn" title="Modo teatro">📺</button>
        <button onClick={onPiP} className="control-btn" title="Picture-in-Picture">📌</button>
        <div className="volume-bar" onClick={handleVolume}>
          <div className="volume-fill" style={{ width: `${volume * 100}%` }} />
        </div>
      </div>
      <div className="player-actions">
        <button onClick={onLike} className={`btn-action ${liked ? 'active' : ''}`}>
          <IconLike size={16} color={liked ? '#000' : '#fff'} filled={liked} /> {likeCount}
        </button>
        <button onClick={onShare} className="btn-action"><IconShare size={16} /> Compartilhar</button>
      </div>
    </div>
  );
}
