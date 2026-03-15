import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const initialCredentials = {
  username: '',
  password: '',
};

function HiddenLoginModal({ auth, isOpen, onClose, onSubmit }) {
  const authText = {
    title: 'Admin Login',
    description: 'This area is restricted.',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    loginButton: 'Log in',
    cancelButton: 'Cancel',
    errorMessage: 'Incorrect login credentials.',
    ...(auth ?? {}),
  };

  const [credentials, setCredentials] = useState(initialCredentials);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCredentials(initialCredentials);
      setHasError(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));
    setHasError(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const isValid = onSubmit(credentials);

    if (!isValid) {
      setHasError(true);
    }
  }

  return (
    <div className="hidden-login" role="dialog" aria-modal="true" aria-labelledby="hidden-login-title">
      <div className="hidden-login__backdrop" onClick={onClose} />
      <motion.div
        className="hidden-login__panel"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="section-head section-head--stacked">
          <h3 id="hidden-login-title">{authText.title}</h3>
          <p>{authText.description}</p>
        </div>

        <form className="dashboard-form" onSubmit={handleSubmit}>
          <label className="dashboard-field">
            <span>{authText.usernameLabel}</span>
            <input name="username" value={credentials.username} onChange={handleChange} autoFocus required />
          </label>

          <label className="dashboard-field">
            <span>{authText.passwordLabel}</span>
            <input name="password" type="password" value={credentials.password} onChange={handleChange} required />
          </label>

          {hasError ? <p className="hidden-login__error">{authText.errorMessage}</p> : null}

          <div className="hidden-login__actions">
            <button type="button" className="dashboard-button dashboard-button--secondary" onClick={onClose}>
              {authText.cancelButton}
            </button>
            <button type="submit" className="dashboard-button dashboard-button--primary">
              {authText.loginButton}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default HiddenLoginModal;