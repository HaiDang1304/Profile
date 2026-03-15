import { useState } from 'react';
import { motion } from 'framer-motion';

const initialFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function ContactSection({ contact, onSubmit }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
    setFormData(initialFormState);
    setIsSubmitted(true);
  }

  return (
    <motion.section
      id="contact-section"
      className="contact-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <div className="section-head section-head--stacked">
        <h2>{contact.title}</h2>
        <p>{contact.description}</p>
      </div>

      <form className="dashboard-form contact-form" onSubmit={handleSubmit}>
        <div className="dashboard-form__grid dashboard-form__grid--two">
          <label className="dashboard-field">
            <span>{contact.nameLabel}</span>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label className="dashboard-field">
            <span>{contact.emailLabel}</span>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </label>
        </div>

        <label className="dashboard-field">
          <span>{contact.subjectLabel}</span>
          <input name="subject" value={formData.subject} onChange={handleChange} required />
        </label>

        <label className="dashboard-field">
          <span>{contact.messageLabel}</span>
          <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required />
        </label>

        <div className="contact-form__actions">
          <button type="submit" className="dashboard-button dashboard-button--primary">
            {contact.submitButton}
          </button>

          {isSubmitted ? <p className="contact-form__success">{contact.successMessage}</p> : null}
        </div>
      </form>
    </motion.section>
  );
}

export default ContactSection;