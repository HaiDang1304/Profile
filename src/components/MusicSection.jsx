import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_QUERY = 'lofi chill';

function MusicSection({ sections }) {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [pendingAutoplay, setPendingAutoplay] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    function handlePlay() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    function handleTimeUpdate() {
      setCurrentTime(audio.currentTime || 0);
    }

    function handleLoadedMetadata() {
      setDuration(audio.duration || 0);
    }

    function handleEnded() {
      setIsPlaying(false);
      setCurrentTime(0);
    }

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!currentTrack || !pendingAutoplay) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          setAutoplayBlocked(false);
        })
        .catch(() => {
          setAutoplayBlocked(true);
          setIsPlaying(false);
        })
        .finally(() => {
          setPendingAutoplay(false);
        });
      return;
    }

    setPendingAutoplay(false);
  }, [currentTrack, pendingAutoplay]);

  useEffect(() => {
    fetchTracks(DEFAULT_QUERY, true);
  }, []);

  async function fetchTracks(term, attemptAutoplay = false) {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=8`
      );
      const data = await response.json();

      const nextTracks = (data.results ?? [])
        .filter((item) => item.previewUrl)
        .map((item) => ({
          id: String(item.trackId),
          title: item.trackName,
          artist: item.artistName,
          artwork: item.artworkUrl100,
          previewUrl: item.previewUrl,
        }));

      setTracks(nextTracks);

      if (nextTracks.length > 0) {
        setCurrentTrack(nextTracks[0]);
        setCurrentTime(0);
        setDuration(0);
        setPendingAutoplay(attemptAutoplay);
        if (!attemptAutoplay) {
          setAutoplayBlocked(false);
        }
      } else {
        setCurrentTrack(null);
        setAutoplayBlocked(false);
        setError(sections.musicNoResult);
      }
    } catch {
      setError(sections.musicError);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    const normalized = query.trim();
    if (normalized) {
      fetchTracks(normalized, false);
    }
  }

  function handleSelectTrack(track) {
    setCurrentTrack(track);
    setPendingAutoplay(false);
    setAutoplayBlocked(false);
    setIsPlaying(false);
  }

  async function handleTogglePlay() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
    }
  }

  function handleSeek(event) {
    const audio = audioRef.current;
    const progress = progressRef.current;

    if (!audio || !progress || duration <= 0) {
      return;
    }

    const rect = progress.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const nextTime = ratio * duration;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function formatTime(value) {
    if (!Number.isFinite(value) || value <= 0) {
      return '0:00';
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <motion.section
      className="section-card music-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
    >
      <form className="music-search" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={sections.musicSearchPlaceholder}
        />
        <button type="submit" aria-label={sections.musicSearchButton} title={sections.musicSearchButton}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="music-search__icon">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </form>

      {isLoading ? <p className="widget-note">{sections.musicLoading}</p> : null}
      {error ? <p className="widget-note widget-note--error">{error}</p> : null}

      {currentTrack ? (
        <div className={`music-player${isPlaying ? ' music-player--playing' : ''}`}>
          <img src={currentTrack.artwork} alt={currentTrack.title} className="music-player__cover" />
          <div className="music-player__meta">
            <small>{sections.musicNowPlaying}</small>
            <strong>{currentTrack.title}</strong>
            <span>{currentTrack.artist}</span>
          </div>
          <div className="music-player__wave" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <button type="button" className="music-player__toggle" onClick={handleTogglePlay}>
            {isPlaying ? sections.musicPauseLabel : sections.musicPlayLabel}
          </button>

          <div className="music-player__timeline">
            <button type="button" className="music-player__mini-toggle" onClick={handleTogglePlay}>
              {isPlaying ? '||' : '>'}
            </button>

            <button
              type="button"
              className="music-progress"
              ref={progressRef}
              onClick={handleSeek}
              aria-label="Seek music"
            >
              <span className="music-progress__value" style={{ width: `${progressPercent}%` }} />
            </button>

            <span className="music-player__time">
              {formatTime(currentTime)} / {formatTime(duration || 29)}
            </span>
          </div>
        </div>
      ) : null}

      {autoplayBlocked ? <p className="widget-note">{sections.musicAutoplayBlocked}</p> : null}

      <audio ref={audioRef} className="music-audio" src={currentTrack?.previewUrl ?? ''} preload="metadata" />
    </motion.section>
  );
}

export default MusicSection;
