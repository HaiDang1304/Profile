function Icon({ name }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (name) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M9 19c-4 1.5-4-2-6-2m12 4v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 3.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-6 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 3.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 17.13V21" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
          <rect {...commonProps} x="2" y="9" width="4" height="12" />
          <circle {...commonProps} cx="4" cy="4" r="2" />
        </svg>
      );
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M22 5.89c-.64.28-1.32.47-2.04.56a3.56 3.56 0 0 0 1.56-1.96 7.15 7.15 0 0 1-2.26.86A3.56 3.56 0 0 0 13.2 8.6a10.1 10.1 0 0 1-7.34-3.72 3.56 3.56 0 0 0 1.1 4.75 3.52 3.52 0 0 1-1.61-.45v.05a3.56 3.56 0 0 0 2.86 3.49 3.57 3.57 0 0 1-1.6.06 3.57 3.57 0 0 0 3.33 2.47A7.14 7.14 0 0 1 2 18.14a10.08 10.08 0 0 0 5.46 1.6c6.55 0 10.13-5.43 10.13-10.13v-.46A7.2 7.2 0 0 0 22 5.89Z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.64 22v-8.2h2.76l.41-3.2h-3.17V8.56c0-.93.26-1.56 1.6-1.56h1.71V4.14c-.3-.04-1.3-.14-2.47-.14-2.45 0-4.13 1.5-4.13 4.25v2.37H7.6v3.2h2.75V22h3.29Z"
          />
        </svg>
      );
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...commonProps} x="3" y="5" width="18" height="14" rx="3" />
          <path {...commonProps} d="m4 7 8 6 8-6" />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...commonProps} cx="12" cy="12" r="9" />
          <path {...commonProps} d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      );
    case 'pin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
          <circle {...commonProps} cx="12" cy="11" r="2.5" />
        </svg>
      );
    case 'bag':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M6 8h12l-1 11H7L6 8Z" />
          <path {...commonProps} d="M9 8a3 3 0 0 1 6 0" />
        </svg>
      );
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="m12 3 1.95 4.55L18.5 9.5l-4.55 1.95L12 16l-1.95-4.55L5.5 9.5l4.55-1.95L12 3Z" />
        </svg>
      );
    case 'external':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M14 5h5v5" />
          <path {...commonProps} d="M10 14 19 5" />
          <path {...commonProps} d="M19 14v5H5V5h5" />
        </svg>
      );
    case 'film':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...commonProps} x="3" y="5" width="18" height="14" rx="2" />
          <path {...commonProps} d="M7 5v14M17 5v14M3 10h4M17 10h4M3 14h4M17 14h4" />
        </svg>
      );
    default:
      return null;
  }
}

export default Icon;