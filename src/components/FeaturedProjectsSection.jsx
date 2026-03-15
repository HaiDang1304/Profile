import { motion } from 'framer-motion';
import Icon from './Icon';

function FeaturedProjectsSection({ projects, sections, aria }) {
  return (
    <motion.section
      className="section-card section-card--flat"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <div className="section-head">
        <h2>{sections.featuredProjects}</h2>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className="project-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <div className="project-card__top">
              <span className="project-card__icon">
                <Icon name={project.icon} />
              </span>
              {project.href ? (
                <a
                  className="project-card__link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${aria.openProject} ${project.title}`}
                >
                  <Icon name="external" />
                </a>
              ) : null}
            </div>

            {project.href ? (
              <a href={project.href} target="_blank" rel="noreferrer" className="project-card__title-link">
                <h3>{project.title}</h3>
              </a>
            ) : (
              <h3>{project.title}</h3>
            )}
            <p>{project.description}</p>

            <div className="tag-row">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-row__item">
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export default FeaturedProjectsSection;