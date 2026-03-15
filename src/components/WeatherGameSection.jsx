import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const weatherCodeMap = {
  0: { vi: 'Trời quang', en: 'Clear sky', icon: '☀️' },
  1: { vi: 'Ít mây', en: 'Mainly clear', icon: '🌤️' },
  2: { vi: 'Mây rải rác', en: 'Partly cloudy', icon: '⛅' },
  3: { vi: 'Nhiều mây', en: 'Overcast', icon: '☁️' },
  45: { vi: 'Sương mù', en: 'Fog', icon: '🌫️' },
  48: { vi: 'Sương mù đóng băng', en: 'Depositing rime fog', icon: '🌫️' },
  51: { vi: 'Mưa phùn nhẹ', en: 'Light drizzle', icon: '🌦️' },
  53: { vi: 'Mưa phùn vừa', en: 'Moderate drizzle', icon: '🌦️' },
  55: { vi: 'Mưa phùn nặng hạt', en: 'Dense drizzle', icon: '🌧️' },
  61: { vi: 'Mưa nhẹ', en: 'Slight rain', icon: '🌧️' },
  63: { vi: 'Mưa vừa', en: 'Moderate rain', icon: '🌧️' },
  65: { vi: 'Mưa to', en: 'Heavy rain', icon: '🌧️' },
  71: { vi: 'Tuyết nhẹ', en: 'Slight snow', icon: '🌨️' },
  73: { vi: 'Tuyết vừa', en: 'Moderate snow', icon: '🌨️' },
  75: { vi: 'Tuyết dày', en: 'Heavy snow', icon: '❄️' },
  80: { vi: 'Mưa rào nhẹ', en: 'Slight rain showers', icon: '🌦️' },
  81: { vi: 'Mưa rào vừa', en: 'Moderate rain showers', icon: '🌧️' },
  82: { vi: 'Mưa rào to', en: 'Violent rain showers', icon: '⛈️' },
  95: { vi: 'Dông', en: 'Thunderstorm', icon: '⛈️' },
  96: { vi: 'Dông mưa đá nhẹ', en: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { vi: 'Dông mưa đá nặng', en: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

const leaderboardStorageKey = 'portfolio-dino-top-scores';

function getWeatherInfo(code, locale) {
  const item = weatherCodeMap[code] ?? { vi: 'Không xác định', en: 'Unknown', icon: '🌡️' };
  return { label: item[locale] ?? item.en, icon: item.icon };
}

function WeatherGameSection({ locale, sections }) {
  const [queryCity, setQueryCity] = useState('Vinh Long');
  const [city, setCity] = useState('Vinh Long');
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('Player');
  const [isScoreSaved, setIsScoreSaved] = useState(false);
  const [isGameFocused, setIsGameFocused] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const rawValue = window.localStorage.getItem(leaderboardStorageKey);
      return rawValue ? JSON.parse(rawValue) : [];
    } catch {
      return [];
    }
  });

  const canvasRef = useRef(null);
  const gameRef = useRef({
    dinoX: 64,
    dinoY: 194,
    dinoWidth: 28,
    dinoHeight: 34,
    velocity: 0,
    gravity: 0.46,
    jump: -8.8,
    floorY: 228,
    obstacles: [],
    nextSpawn: 80,
    frame: 0,
    score: 0,
    speed: 5.4,
    clouds: [
      { x: 220, y: 48, size: 24 },
      { x: 420, y: 36, size: 18 },
    ],
    running: false,
    raf: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(leaderboardStorageKey, JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    setBestScore(leaderboard[0]?.score ?? 0);
  }, [leaderboard]);

  const todayForecast = useMemo(() => {
    if (!weatherData?.daily) {
      return [];
    }

    return weatherData.daily.time.slice(0, 4).map((day, index) => {
      const code = weatherData.daily.weathercode[index];
      const info = getWeatherInfo(code, locale);

      return {
        day,
        min: Math.round(weatherData.daily.temperature_2m_min[index]),
        max: Math.round(weatherData.daily.temperature_2m_max[index]),
        rain: weatherData.daily.precipitation_probability_max[index] ?? 0,
        label: info.label,
        icon: info.icon,
      };
    });
  }, [weatherData, locale]);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      setIsLoading(true);
      setWeatherError('');

      try {
        const geocodeResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        const geocodeData = await geocodeResponse.json();
        const firstResult = geocodeData?.results?.[0];

        if (!firstResult) {
          throw new Error('City not found');
        }

        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${firstResult.latitude}&longitude=${firstResult.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        const forecastData = await forecastResponse.json();

        if (!cancelled) {
          setWeatherData({
            location: `${firstResult.name}${firstResult.country ? `, ${firstResult.country}` : ''}`,
            ...forecastData,
          });
        }
      } catch {
        if (!cancelled) {
          setWeatherError(sections.weatherFetchError);
          setWeatherData(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [city, sections.weatherFetchError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    const game = gameRef.current;

    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Chrome Dino-inspired monochrome background.
      context.fillStyle = '#f7f7f7';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.strokeStyle = '#555';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, game.floorY + 0.5);
      context.lineTo(canvas.width, game.floorY + 0.5);
      context.stroke();

      context.fillStyle = '#6d6d6d';
      game.clouds.forEach((cloud) => {
        context.fillRect(cloud.x, cloud.y, cloud.size, 6);
        context.fillRect(cloud.x + 6, cloud.y - 4, cloud.size - 12, 4);
      });

      context.fillStyle = '#8f8f8f';
      for (let x = -(game.frame % 24); x < canvas.width; x += 24) {
        context.fillRect(x, game.floorY + 6, 10, 2);
      }

      context.fillStyle = '#3f3f3f';
      game.obstacles.forEach((obstacle) => {
        // Simple cactus shape.
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        context.fillRect(obstacle.x - 4, obstacle.y + 10, 4, 10);
        context.fillRect(obstacle.x + obstacle.width, obstacle.y + 16, 4, 12);
      });

      context.fillStyle = '#2f2f2f';
      context.fillRect(game.dinoX, game.dinoY, game.dinoWidth, game.dinoHeight);
      context.fillRect(game.dinoX + 18, game.dinoY + game.dinoHeight - 2, 4, 6);
      context.fillRect(game.dinoX + 8, game.dinoY + game.dinoHeight - 2, 4, 6);
      context.fillStyle = '#f7f7f7';
      context.fillRect(game.dinoX + 16, game.dinoY + 8, 4, 4);

      const paddedScore = String(game.score).padStart(5, '0');
      context.fillStyle = '#4a4a4a';
      context.font = '700 20px monospace';
      context.fillText(paddedScore, canvas.width - 78, 24);
    }

    function createObstacle() {
      const height = 28 + Math.random() * 34;
      const width = 16 + Math.random() * 10;
      return {
        x: canvas.width + 24,
        y: game.floorY - height,
        width,
        height,
        scored: false,
      };
    }

    function checkCollision(obstacle) {
      return (
        game.dinoX < obstacle.x + obstacle.width &&
        game.dinoX + game.dinoWidth > obstacle.x &&
        game.dinoY < obstacle.y + obstacle.height &&
        game.dinoY + game.dinoHeight > obstacle.y
      );
    }

    function stopGame() {
      game.running = false;
      cancelAnimationFrame(game.raf);
      setIsPlaying(false);
      setIsGameOver(true);
      setScore(game.score);
    }

    function loop() {
      if (!game.running) {
        return;
      }

      game.frame += 1;
      game.speed = Math.min(9.2, game.speed + 0.0012);
      game.velocity += game.gravity;
      game.dinoY += game.velocity;

      game.clouds = game.clouds.map((cloud) => ({
        ...cloud,
        x: cloud.x - 0.5,
      }));

      game.clouds = game.clouds.map((cloud) => {
        if (cloud.x + cloud.size < -20) {
          return {
            ...cloud,
            x: canvas.width + Math.random() * 80,
            y: 28 + Math.random() * 38,
          };
        }

        return cloud;
      });

      if (game.dinoY + game.dinoHeight >= game.floorY) {
        game.dinoY = game.floorY - game.dinoHeight;
        game.velocity = 0;
      }

      if (game.frame >= game.nextSpawn) {
        game.obstacles.push(createObstacle());
        game.nextSpawn = game.frame + 90 + Math.floor(Math.random() * 45);
      }

      game.obstacles = game.obstacles
        .map((obstacle) => ({ ...obstacle, x: obstacle.x - game.speed }))
        .filter((obstacle) => obstacle.x + obstacle.width > -20);

      for (const obstacle of game.obstacles) {
        if (!obstacle.scored && obstacle.x + obstacle.width < game.dinoX) {
          obstacle.scored = true;
          game.score += 1;
          setScore(game.score);
        }

        if (checkCollision(obstacle)) {
          stopGame();
          draw();
          return;
        }
      }

      draw();
      game.raf = requestAnimationFrame(loop);
    }

    draw();

    if (isPlaying) {
      game.running = true;
      game.raf = requestAnimationFrame(loop);
    }

    return () => {
      game.running = false;
      cancelAnimationFrame(game.raf);
    };
  }, [isPlaying, sections.gameScore]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code !== 'Space') {
        return;
      }

      const target = event.target;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isTypingTarget || !isGameFocused) {
        return;
      }

      event.preventDefault();
      jumpDino();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameFocused, isPlaying]);

  function handleSearch(event) {
    event.preventDefault();
    const nextCity = queryCity.trim();
    if (nextCity) {
      setCity(nextCity);
    }
  }

  function resetGame() {
    const game = gameRef.current;
    game.dinoY = game.floorY - game.dinoHeight;
    game.velocity = 0;
    game.obstacles = [];
    game.nextSpawn = 80;
    game.frame = 0;
    game.score = 0;
    game.speed = 5.4;
    setScore(0);
    setIsGameOver(false);
    setIsScoreSaved(false);
    setIsGameFocused(true);
    setIsPlaying(true);
  }

  function jumpDino() {
    const game = gameRef.current;

    if (!isPlaying) {
      resetGame();
      game.velocity = game.jump;
      return;
    }

    if (game.dinoY + game.dinoHeight >= game.floorY - 1) {
      game.velocity = game.jump;
    }
  }

  function saveScore() {
    if (score <= 0 || isScoreSaved) {
      return;
    }

    const normalizedName = playerName.trim() || 'Player';

    setLeaderboard((previous) => {
      const next = [
        ...previous,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          player: normalizedName,
          score,
          createdAt: new Date().toISOString(),
        },
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      return next;
    });

    setIsScoreSaved(true);
  }

  const weatherInfo = weatherData?.current
    ? getWeatherInfo(weatherData.current.weather_code, locale)
    : { label: '-', icon: '🌡️' };

  return (
    <motion.section
      className="section-card section-card--flat"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
    >
      <div className="widgets-grid">
        <article className="widget-card weather-widget">
          <div className="section-head section-head--stacked">
            <h2>{sections.weatherTitle}</h2>
            <p>{sections.weatherDescription}</p>
          </div>

          <form className="weather-search" onSubmit={handleSearch}>
            <input
              value={queryCity}
              onChange={(event) => setQueryCity(event.target.value)}
              placeholder={sections.weatherCityPlaceholder}
            />
            <button type="submit">{sections.weatherSearchButton}</button>
          </form>

          {isLoading ? <p className="widget-note">{sections.weatherLoading}</p> : null}
          {weatherError ? <p className="widget-note widget-note--error">{weatherError}</p> : null}

          {weatherData?.current ? (
            <>
              <div className="weather-current">
                <div>
                  <strong>{weatherData.location}</strong>
                  <p>
                    {weatherInfo.icon} {weatherInfo.label}
                  </p>
                </div>
                <h3>{Math.round(weatherData.current.temperature_2m)}°C</h3>
              </div>

              <div className="weather-facts">
                <span>
                  {sections.weatherHumidity}: {weatherData.current.relative_humidity_2m}%
                </span>
                <span>
                  {sections.weatherWind}: {Math.round(weatherData.current.wind_speed_10m)} km/h
                </span>
              </div>

              <div className="forecast-grid">
                {todayForecast.map((day) => (
                  <article key={day.day} className="forecast-card">
                    <small>{new Date(day.day).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}</small>
                    <p>{day.icon}</p>
                    <strong>
                      {day.max}° / {day.min}°
                    </strong>
                    <span>{day.rain}%</span>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </article>

        <article className="widget-card game-widget">
          <div className="section-head section-head--stacked">
            <h2>{sections.gameTitle}</h2>
            <p>{sections.gameDescription}</p>
          </div>

          <canvas
            ref={canvasRef}
            className="runner-canvas"
            width="520"
            height="260"
            onMouseDown={jumpDino}
            onTouchStart={jumpDino}
            onMouseEnter={() => setIsGameFocused(true)}
            onMouseLeave={() => setIsGameFocused(false)}
          />

          <div className="game-controls">
            <button type="button" onClick={resetGame}>
              {isGameOver ? sections.gameRestart : sections.gameStart}
            </button>
            <button type="button" onClick={jumpDino}>
              {sections.gameJump}
            </button>
            <p>
              {sections.gameTip} | {sections.gameBest}: {bestScore}
            </p>
          </div>

          {isGameOver ? (
            <>
              <p className="widget-note widget-note--error">{sections.gameOver}</p>
              <div className="score-submit">
                <label>
                  {sections.gamePlayerLabel}
                  <input value={playerName} onChange={(event) => setPlayerName(event.target.value)} />
                </label>
                <button type="button" onClick={saveScore}>
                  {isScoreSaved ? sections.gameSaved : sections.gameSaveScore}
                </button>
              </div>
            </>
          ) : null}

          <div className="leaderboard">
            <h3>{sections.gameTopScoreTitle}</h3>
            {leaderboard.length === 0 ? (
              <p>{sections.gameNoScores}</p>
            ) : (
              <ol>
                {leaderboard.map((item) => (
                  <li key={item.id}>
                    <span>{item.player}</span>
                    <strong>{item.score}</strong>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </article>
      </div>
    </motion.section>
  );
}

export default WeatherGameSection;