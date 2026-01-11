"use client";

import { useEffect, useState } from "react";

// XP and Level System
const XP_PER_LEVEL = 100;
const ACTIONS = {
  visit: 10,
  scroll: 1,
  click: 5,
  hover: 2,
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_visit",
    title: "Welcome!",
    description: "You found my portfolio",
    icon: "🎮",
    unlocked: true,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Scrolled through the page",
    icon: "🧭",
    unlocked: false,
  },
  {
    id: "curious",
    title: "Curious Mind",
    description: "Clicked on 5 things",
    icon: "🔍",
    unlocked: false,
  },
  {
    id: "project_viewer",
    title: "Project Hunter",
    description: "Viewed all projects",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Visiting after midnight",
    icon: "🦉",
    unlocked: false,
  },
];

export function GameHUD() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [clicks, setClicks] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Calculate level from XP
  useEffect(() => {
    const newLevel = Math.floor(xp / XP_PER_LEVEL) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [xp, level]);

  // Initial XP for visiting
  useEffect(() => {
    setXp((prev) => prev + ACTIONS.visit);

    // Night owl achievement
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      unlockAchievement("night_owl");
    }
  }, []);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 200) {
        setHasScrolled(true);
        setXp((prev) => prev + ACTIONS.scroll * 10);
        unlockAchievement("explorer");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // Track clicks
  useEffect(() => {
    const handleClick = () => {
      setClicks((prev) => {
        const newClicks = prev + 1;
        if (newClicks >= 5) {
          unlockAchievement("curious");
        }
        return newClicks;
      });
      setXp((prev) => prev + ACTIONS.click);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const achievement = prev.find((a) => a.id === id);
      if (achievement && !achievement.unlocked) {
        setNewAchievement({ ...achievement, unlocked: true });
        setTimeout(() => setNewAchievement(null), 4000);
        return prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a));
      }
      return prev;
    });
  };

  const xpProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <>
      {/* XP Bar - Top of screen */}
      <div className="game-hud">
        <div className="xp-container">
          {/* Level badge */}
          <div className="level-badge">
            <span className="level-number">{level}</span>
            <span className="level-label">LVL</span>
          </div>

          {/* XP bar */}
          <div className="xp-bar-container">
            <div className="xp-bar">
              <div
                className="xp-bar-fill"
                style={{ width: `${xpProgress * 100}%` }}
              />
              <div className="xp-bar-glow" style={{ width: `${xpProgress * 100}%` }} />
            </div>
            <span className="xp-text">
              {xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP
            </span>
          </div>

          {/* Achievement counter */}
          <div className="achievement-counter">
            <span className="achievement-icon">🏆</span>
            <span className="achievement-count">
              {unlockedCount}/{achievements.length}
            </span>
          </div>
        </div>
      </div>

      {/* Level Up Animation */}
      {showLevelUp && (
        <div className="level-up-overlay">
          <div className="level-up-content">
            <div className="level-up-text">LEVEL UP!</div>
            <div className="level-up-number">{level}</div>
            <div className="level-up-particles">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="level-up-particle"
                  style={{
                    "--angle": `${(360 / 20) * i}deg`,
                    "--delay": `${i * 0.05}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="achievement-popup">
          <div className="achievement-popup-content">
            <div className="achievement-popup-icon">{newAchievement.icon}</div>
            <div className="achievement-popup-info">
              <div className="achievement-popup-title">Achievement Unlocked!</div>
              <div className="achievement-popup-name">{newAchievement.title}</div>
              <div className="achievement-popup-desc">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Scanlines overlay */}
      <div className="scanlines" />
    </>
  );
}

// Mini floating stats
export function FloatingStats() {
  const [stats, setStats] = useState({
    visitors: 1337,
    projects: 10,
    commits: 420,
  });

  return (
    <div className="floating-stats">
      <div className="stat-item">
        <span className="stat-value">{stats.visitors.toLocaleString()}</span>
        <span className="stat-label">VISITORS</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value">{stats.projects}</span>
        <span className="stat-label">PROJECTS</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value">{stats.commits}</span>
        <span className="stat-label">COMMITS</span>
      </div>
    </div>
  );
}
