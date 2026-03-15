import { motion } from 'framer-motion';

function PostListSection({ posts, sections }) {
  return (
    <motion.section
      className="section-card section-card--flat"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
    >
      <div className="section-head">
        <h2>{sections.recentPosts}</h2>
        <a href="#hero">{sections.viewAll}</a>
      </div>

      <div className="post-list">
        {posts.map((post, index) => (
          <motion.article
            key={post.title}
            className="post-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <div className="post-card__media">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="post-card__body">
              <p className="post-card__category">{post.category}</p>
              <h3>{post.title}</h3>
              <p className="post-card__description">{post.description}</p>
              <span className="post-card__meta">{post.meta}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export default PostListSection;