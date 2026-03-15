import { motion } from 'framer-motion';

function PageFooter({ footer }) {
  return (
    <motion.footer
      className="page-footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45 }}
    >
      <p>{footer.copyright}</p>

      <div className="page-footer__links">
        {footer.links.map((label) => (
          <a key={label} href="#hero">
            {label}
          </a>
        ))}
      </div>
    </motion.footer>
  );
}

export default PageFooter;