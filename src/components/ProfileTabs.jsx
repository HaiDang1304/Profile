import { motion } from 'framer-motion';

function ProfileTabs({ tabs, activeTab = 0 }) {
  return (
    <motion.div
      className="profile-tabs"
      id="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      {tabs.map((tab, index) => (
        <button
          key={tab}
          type="button"
          className={index === activeTab ? 'profile-tabs__item profile-tabs__item--active' : 'profile-tabs__item'}
        >
          {tab}
        </button>
      ))}
    </motion.div>
  );
}

export default ProfileTabs;