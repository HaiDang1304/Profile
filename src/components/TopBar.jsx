import { motion } from 'framer-motion';

function TopBar({ brand, initials, navigation, ctaLabel, onActionClick, onBrandSecretTrigger, locale, localeOptions, onLocaleChange, aria }) {
  return (
    <motion.header
      className="topbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a className="brand" href="#hero" aria-label={aria.brandHome} onClick={onBrandSecretTrigger}>
        <span className="brand__mark">{initials}</span>
        <span className="brand__label">{brand}</span>
      </a>

      <nav className="topbar__nav" aria-label={aria.primaryNavigation}>
        {navigation.map((item) => (
          <a key={item} href="#content" className="topbar__link">
            {item}
          </a>
        ))}
      </nav>

      <div className="topbar__controls">
        <div className="locale-switch" role="group" aria-label={aria.localeSwitch}>
          {localeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === locale ? 'locale-switch__button locale-switch__button--active' : 'locale-switch__button'}
              onClick={() => onLocaleChange(option.value)}
              aria-pressed={option.value === locale}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button className="topbar__action" type="button" onClick={onActionClick}>
          {ctaLabel}
        </button>
      </div>
    </motion.header>
  );
}

export default TopBar;