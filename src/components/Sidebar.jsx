import { motion } from 'framer-motion';
import Icon from './Icon';

function getInfoIconName(type) {
  if (type === 'email') {
    return 'mail';
  }

  if (type === 'website') {
    return 'globe';
  }

  return 'pin';
}

function Sidebar({ profileInfo, expertise, sections, onContactClick }) {
  return (
    <aside className="content-grid__side">
      <motion.section
        className="sidebar-card"
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
      >
        <h2>{sections.information}</h2>

        <div className="info-list">
          {profileInfo.map((item) => (
            <div key={item.label} className="info-item">
              <span className={`info-item__icon info-item__icon--${item.tone}`}>
                <Icon name={getInfoIconName(item.type)} />
              </span>
              <div>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="sidebar-card"
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <h2>{sections.expertise}</h2>
        <div className="expertise-cloud">
          {expertise.map((skill) => (
            <span key={skill} className="expertise-cloud__item">
              {skill}
            </span>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="sidebar-card sidebar-card--cta"
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: 0.16 }}
      >
        <h2>{sections.hireTitle}</h2>
        <p>{sections.hireDescription}</p>
        <button type="button" onClick={onContactClick}>{sections.hireButton}</button>
      </motion.section>
    </aside>
  );
}

export default Sidebar;