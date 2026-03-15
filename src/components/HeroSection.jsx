import { motion } from 'framer-motion';
import Icon from './Icon';

function HeroSection({ profile, socialLinks, stats, aria }) {
  return (
    <motion.section
      className="hero-card"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="hero-card__identity">
        <div className="avatar-wrap">
          <img className="avatar-wrap__image" src={profile.avatar} alt={profile.name} />
          <span className="avatar-wrap__status" aria-label={profile.availabilityLabel} />
        </div>

        <div className="hero-card__summary">
          <div className="hero-card__heading">
            <h1>{profile.name}</h1>
            <span>{profile.username}</span>
          </div>

          <p className="hero-card__bio">{profile.bio}</p>

          <div className="social-row" aria-label={aria.socialLinks}>
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} aria-label={item.label} className="social-row__link">
                <Icon name={item.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-card__stats" aria-label={aria.profileStats}>
        {stats.map((stat) => (
          <div key={stat.label} className="stat-block">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export default HeroSection;