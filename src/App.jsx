import { useEffect, useRef, useState } from 'react';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import BackgroundCanvas from './components/BackgroundCanvas';
import ContactSection from './components/ContactSection';
import FeaturedProjectsSection from './components/FeaturedProjectsSection';
import HeroSection from './components/HeroSection';
import HiddenLoginModal from './components/HiddenLoginModal';
import MusicSection from './components/MusicSection';
import PageFooter from './components/PageFooter';
import ProfileTabs from './components/ProfileTabs';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import WeatherGameSection from './components/WeatherGameSection';
import { adminAccess, localeOptions, localizedContent } from './data/profileData';

const CONTENT_STORAGE_KEY = 'portfolio-dashboard-content';
const CONTENT_VERSION_KEY = 'portfolio-dashboard-content-version';
const MESSAGES_STORAGE_KEY = 'portfolio-dashboard-messages';
const AUTH_STORAGE_KEY = 'portfolio-dashboard-auth';
const PAGE_VISITS_KEY = 'portfolio-page-visits';
const CONTENT_VERSION = 2;
const SECRET_TAP_REQUIRED = 3;
const SECRET_TAP_WINDOW_MS = 3000;

function cloneContent(source) {
  return JSON.parse(JSON.stringify(source));
}

function getStoredValue(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function getMergedLocaleContent(storedLocaleContent, localeKey) {
  const base = localizedContent[localeKey];
  const stored = storedLocaleContent ?? {};
  const mergedSections = {
    ...base.sections,
    ...(stored.sections ?? {}),
  };

  // Keep game labels synced with the latest code to avoid stale localStorage text.
  mergedSections.gameTitle = base.sections.gameTitle;
  mergedSections.gameDescription = base.sections.gameDescription;
  mergedSections.gameStart = base.sections.gameStart;
  mergedSections.gameRestart = base.sections.gameRestart;
  mergedSections.gameJump = base.sections.gameJump;
  mergedSections.gameTip = base.sections.gameTip;
  mergedSections.gameScore = base.sections.gameScore;
  mergedSections.gameBest = base.sections.gameBest;
  mergedSections.gameOver = base.sections.gameOver;
  mergedSections.gameTopScoreTitle = base.sections.gameTopScoreTitle;
  mergedSections.gamePlayerLabel = base.sections.gamePlayerLabel;
  mergedSections.gameSaveScore = base.sections.gameSaveScore;
  mergedSections.gameSaved = base.sections.gameSaved;
  mergedSections.gameNoScores = base.sections.gameNoScores;

  return {
    ...base,
    ...stored,
    profile: {
      ...base.profile,
      ...(stored.profile ?? {}),
    },
    sections: mergedSections,
    controls: {
      ...base.controls,
      ...(stored.controls ?? {}),
    },
    auth: {
      ...base.auth,
      ...(stored.auth ?? {}),
    },
    contact: {
      ...base.contact,
      ...(stored.contact ?? {}),
    },
    dashboard: {
      ...base.dashboard,
      ...(stored.dashboard ?? {}),
      metrics: {
        ...base.dashboard.metrics,
        ...(stored.dashboard?.metrics ?? {}),
      },
      profileEditor: {
        ...base.dashboard.profileEditor,
        ...(stored.dashboard?.profileEditor ?? {}),
        fields: {
          ...base.dashboard.profileEditor.fields,
          ...(stored.dashboard?.profileEditor?.fields ?? {}),
        },
      },
      postComposer: {
        ...base.dashboard.postComposer,
        ...(stored.dashboard?.postComposer ?? {}),
        fields: {
          ...base.dashboard.postComposer.fields,
          ...(stored.dashboard?.postComposer?.fields ?? {}),
        },
      },
      projectComposer: {
        ...base.dashboard.projectComposer,
        ...(stored.dashboard?.projectComposer ?? {}),
        fields: {
          ...base.dashboard.projectComposer.fields,
          ...(stored.dashboard?.projectComposer?.fields ?? {}),
        },
      },
      inbox: {
        ...base.dashboard.inbox,
        ...(stored.dashboard?.inbox ?? {}),
      },
    },
    footer: {
      ...base.footer,
      ...(stored.footer ?? {}),
    },
    aria: {
      ...base.aria,
      ...(stored.aria ?? {}),
    },
    navigation: Array.isArray(stored.navigation) ? stored.navigation : base.navigation,
    tabs: Array.isArray(stored.tabs) ? stored.tabs : base.tabs,
    stats: Array.isArray(stored.stats) ? stored.stats : base.stats,
    posts: Array.isArray(stored.posts) ? stored.posts : base.posts,
    profileInfo: Array.isArray(stored.profileInfo) ? stored.profileInfo : base.profileInfo,
    expertise: Array.isArray(stored.expertise) ? stored.expertise : base.expertise,
    projects: Array.isArray(stored.projects) ? stored.projects : base.projects,
    socialLinks: Array.isArray(stored.socialLinks) ? stored.socialLinks : base.socialLinks,
  };
}

function normalizeSiteContent(rawContent) {
  return {
    vi: getMergedLocaleContent(rawContent?.vi, 'vi'),
    en: getMergedLocaleContent(rawContent?.en, 'en'),
  };
}

function getInitialSiteContent() {
  const fallback = cloneContent(localizedContent);

  if (typeof window === 'undefined') {
    return normalizeSiteContent(fallback);
  }

  const storedVersion = Number(window.localStorage.getItem(CONTENT_VERSION_KEY) ?? 0);
  if (storedVersion !== CONTENT_VERSION) {
    window.localStorage.setItem(CONTENT_VERSION_KEY, String(CONTENT_VERSION));
    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(fallback));
    return normalizeSiteContent(fallback);
  }

  const storedContent = getStoredValue(CONTENT_STORAGE_KEY, fallback);
  return normalizeSiteContent(storedContent);
}

function App() {
  const [locale, setLocale] = useState('vi');
  const [viewMode, setViewMode] = useState('portfolio');
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStoredValue(AUTH_STORAGE_KEY, false));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [siteContent, setSiteContent] = useState(getInitialSiteContent);
  const [messages, setMessages] = useState(() => getStoredValue(MESSAGES_STORAGE_KEY, []));
  const [pageVisits, setPageVisits] = useState(() => {
    const storedValue = getStoredValue(PAGE_VISITS_KEY, 0);
    return Number.isFinite(storedValue) ? storedValue : 0;
  });
  const secretTapCountRef = useRef(0);
  const secretTapTimeoutRef = useRef(null);

  const content = getMergedLocaleContent(siteContent[locale], locale);
  const heroStats = [
    {
      value: pageVisits.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US'),
      label: content.sections.pageVisitsLabel,
    },
    {
      value: String(messages.length),
      label: content.sections.contactCountLabel,
    },
  ];
  const actionLabel = isAuthenticated
    ? viewMode === 'portfolio'
      ? content.controls.openDashboard
      : content.controls.backToPortfolio
    : content.profile.cta;

  useEffect(() => {
    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(siteContent));
    window.localStorage.setItem(CONTENT_VERSION_KEY, String(CONTENT_VERSION));
  }, [siteContent]);

  useEffect(() => {
    setSiteContent((previous) => normalizeSiteContent(previous));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    setPageVisits((previous) => previous + 1);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PAGE_VISITS_KEY, JSON.stringify(pageVisits));
  }, [pageVisits]);

  useEffect(() => {
    function handleKeyDown(event) {
      const isPrimaryShortcut = event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd';
      const isFallbackShortcut = event.altKey && event.key.toLowerCase() === 'd';

      if (isPrimaryShortcut || isFallbackShortcut) {
        event.preventDefault();

        if (isAuthenticated) {
          setViewMode('dashboard');
          return;
        }

        setIsLoginOpen(true);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  function handleToggleView() {
    if (!isAuthenticated) {
      handleContactClick();
      return;
    }

    setViewMode((current) => (current === 'portfolio' ? 'dashboard' : 'portfolio'));
  }

  function handleBrandSecretTrigger() {
    secretTapCountRef.current += 1;

    if (secretTapTimeoutRef.current) {
      window.clearTimeout(secretTapTimeoutRef.current);
    }

    if (secretTapCountRef.current >= SECRET_TAP_REQUIRED) {
      secretTapCountRef.current = 0;

      if (isAuthenticated) {
        setViewMode('dashboard');
      } else {
        setIsLoginOpen(true);
      }

      return;
    }

    secretTapTimeoutRef.current = window.setTimeout(() => {
      secretTapCountRef.current = 0;
    }, SECRET_TAP_WINDOW_MS);
  }

  function handleLogin(credentials) {
    const isValid =
      credentials.username === adminAccess.username && credentials.password === adminAccess.password;

    if (!isValid) {
      return false;
    }

    setIsAuthenticated(true);
    setIsLoginOpen(false);
    setViewMode('dashboard');
    return true;
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setViewMode('portfolio');
  }

  function handleSaveProfile(profileForm) {
    setSiteContent((previous) => {
      const next = cloneContent(previous);

      Object.keys(next).forEach((languageKey) => {
        next[languageKey].profile.name = profileForm.name;
        next[languageKey].profile.username = profileForm.username;
        next[languageKey].profile.avatar = profileForm.avatar;
        next[languageKey].profileInfo = next[languageKey].profileInfo.map((item) => {
          if (item.type === 'email') {
            return { ...item, value: profileForm.email };
          }

          if (item.type === 'website') {
            return { ...item, value: profileForm.website };
          }

          if (item.type === 'location') {
            return { ...item, value: profileForm.location };
          }

          return item;
        });
      });

      next[locale].profile.bio = profileForm.bio;
      return next;
    });
  }

  function handleAddPost(postForm) {
    setSiteContent((previous) => {
      const next = cloneContent(previous);
      next[locale].posts = [postForm, ...next[locale].posts];

      if (next[locale].stats[2]) {
        next[locale].stats[2].value = String(next[locale].posts.length);
      }

      return next;
    });
  }

  function handleAddProject(projectForm) {
    setSiteContent((previous) => {
      const next = cloneContent(previous);
      next[locale].projects = [projectForm, ...next[locale].projects];
      return next;
    });
  }

  function handleAddMessage(messageForm) {
    setMessages((previous) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...messageForm,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
  }

  function handleContactClick() {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="profile-shell" lang={locale}>
      <BackgroundCanvas />
      <div className="profile-shell__blur profile-shell__blur--one" />
      <div className="profile-shell__blur profile-shell__blur--two" />

      <div className="profile-page">
        <TopBar
          brand={content.profile.brand}
          initials={content.profile.initials}
          navigation={content.navigation}
          ctaLabel={actionLabel}
          onActionClick={handleToggleView}
          onBrandSecretTrigger={handleBrandSecretTrigger}
          locale={locale}
          localeOptions={localeOptions}
          onLocaleChange={setLocale}
          aria={content.aria}
        />

        <HiddenLoginModal
          auth={content.auth}
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSubmit={handleLogin}
        />

        <main id="hero">
          {viewMode === 'portfolio' ? (
            <>
              <section className="hero-flex">
                <div className="hero-flex__main">
                  <HeroSection
                    profile={content.profile}
                    socialLinks={content.socialLinks}
                    stats={heroStats}
                    aria={content.aria}
                  />
                </div>
                <div className="hero-flex__music">
                  <MusicSection sections={content.sections} />
                </div>
              </section>

              <ProfileTabs tabs={content.tabs} />

              <section className="content-grid">
                <div className="content-grid__main">
                  <WeatherGameSection locale={locale} sections={content.sections} />
                  <FeaturedProjectsSection projects={content.projects} sections={content.sections} aria={content.aria} />
                </div>

                <div className="content-grid__aside">
                  <Sidebar
                    profileInfo={content.profileInfo}
                    expertise={content.expertise}
                    sections={content.sections}
                    onContactClick={handleContactClick}
                  />
                </div>
              </section>

              <ContactSection contact={content.contact} onSubmit={handleAddMessage} />
            </>
          ) : (
            <AdminDashboard
              locale={locale}
              dashboard={content.dashboard}
              controls={content.controls}
              content={content}
              messages={messages}
              onSaveProfile={handleSaveProfile}
              onAddPost={handleAddPost}
              onAddProject={handleAddProject}
              onBackToPortfolio={() => setViewMode('portfolio')}
              onLogout={handleLogout}
            />
          )}
        </main>

        <PageFooter footer={content.footer} />
      </div>
    </div>
  );
}

export default App;