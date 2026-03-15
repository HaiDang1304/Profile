import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const postInitialState = {
  category: '',
  title: '',
  description: '',
  meta: '',
  image: '',
};

const projectInitialState = {
  title: '',
  description: '',
  tags: '',
  href: '',
  icon: 'bag',
};

function getInfoValue(profileInfo, type) {
  return profileInfo.find((item) => item.type === type)?.value ?? '';
}

function AdminDashboard({ locale, dashboard, controls, content, messages, onSaveProfile, onAddPost, onAddProject, onBackToPortfolio, onLogout }) {
  const [profileForm, setProfileForm] = useState({
    name: content.profile.name,
    username: content.profile.username,
    avatar: content.profile.avatar,
    bio: content.profile.bio,
    email: getInfoValue(content.profileInfo, 'email'),
    website: getInfoValue(content.profileInfo, 'website'),
    location: getInfoValue(content.profileInfo, 'location'),
  });
  const [postForm, setPostForm] = useState(postInitialState);
  const [projectForm, setProjectForm] = useState(projectInitialState);

  useEffect(() => {
    setProfileForm({
      name: content.profile.name,
      username: content.profile.username,
      avatar: content.profile.avatar,
      bio: content.profile.bio,
      email: getInfoValue(content.profileInfo, 'email'),
      website: getInfoValue(content.profileInfo, 'website'),
      location: getInfoValue(content.profileInfo, 'location'),
    });
  }, [content.profile, content.profileInfo, locale]);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePostChange(event) {
    const { name, value } = event.target;

    setPostForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleProjectChange(event) {
    const { name, value } = event.target;

    setProjectForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleProfileSubmit(event) {
    event.preventDefault();
    onSaveProfile(profileForm);
  }

  function handlePostSubmit(event) {
    event.preventDefault();

    onAddPost({
      ...postForm,
      image:
        postForm.image ||
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
    });
    setPostForm(postInitialState);
  }

  function handleProjectSubmit(event) {
    event.preventDefault();

    onAddProject({
      title: projectForm.title,
      description: projectForm.description,
      tags: projectForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      href: projectForm.href,
      icon: projectForm.icon,
    });
    setProjectForm(projectInitialState);
  }

  return (
    <section id="dashboard" className="dashboard-shell">
      <motion.div
        className="dashboard-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="dashboard-hero__content">
          <p className="dashboard-hero__eyebrow">
            {dashboard.localeNote}: <strong>{locale.toUpperCase()}</strong>
          </p>
          <h2>{dashboard.title}</h2>
          <p>{dashboard.subtitle}</p>
        </div>

        <div className="dashboard-hero__actions">
          <button type="button" className="dashboard-button dashboard-button--secondary" onClick={onBackToPortfolio}>
            {controls.backToPortfolio}
          </button>
          <button type="button" className="dashboard-button dashboard-button--danger" onClick={onLogout}>
            {controls.logout}
          </button>
        </div>
      </motion.div>

      <div className="dashboard-metrics">
        <article className="dashboard-metric">
          <strong>{content.posts.length}</strong>
          <span>{dashboard.metrics.posts}</span>
        </article>
        <article className="dashboard-metric">
          <strong>{content.projects.length}</strong>
          <span>{dashboard.metrics.projects}</span>
        </article>
        <article className="dashboard-metric">
          <strong>{messages.length}</strong>
          <span>{dashboard.metrics.messages}</span>
        </article>
      </div>

      <div className="dashboard-grid">
        <motion.section className="dashboard-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
          <div className="section-head section-head--stacked">
            <h3>{dashboard.profileEditor.title}</h3>
            <p>{dashboard.profileEditor.description}</p>
          </div>

          <form className="dashboard-form" onSubmit={handleProfileSubmit}>
            <div className="dashboard-form__grid dashboard-form__grid--two">
              <label className="dashboard-field">
                <span>{dashboard.profileEditor.fields.name}</span>
                <input name="name" value={profileForm.name} onChange={handleProfileChange} required />
              </label>
              <label className="dashboard-field">
                <span>{dashboard.profileEditor.fields.username}</span>
                <input name="username" value={profileForm.username} onChange={handleProfileChange} required />
              </label>
            </div>

            <label className="dashboard-field">
              <span>{dashboard.profileEditor.fields.avatar}</span>
              <input name="avatar" value={profileForm.avatar} onChange={handleProfileChange} required />
            </label>

            <div className="dashboard-form__grid dashboard-form__grid--three">
              <label className="dashboard-field">
                <span>{dashboard.profileEditor.fields.email}</span>
                <input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} required />
              </label>
              <label className="dashboard-field">
                <span>{dashboard.profileEditor.fields.website}</span>
                <input name="website" value={profileForm.website} onChange={handleProfileChange} required />
              </label>
              <label className="dashboard-field">
                <span>{dashboard.profileEditor.fields.location}</span>
                <input name="location" value={profileForm.location} onChange={handleProfileChange} required />
              </label>
            </div>

            <label className="dashboard-field">
              <span>{dashboard.profileEditor.fields.bio}</span>
              <textarea name="bio" value={profileForm.bio} onChange={handleProfileChange} rows="4" required />
            </label>

            <button type="submit" className="dashboard-button dashboard-button--primary">
              {dashboard.profileEditor.saveButton}
            </button>
          </form>
        </motion.section>

        <motion.section className="dashboard-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          <div className="section-head section-head--stacked">
            <h3>{dashboard.postComposer.title}</h3>
            <p>{dashboard.postComposer.description}</p>
          </div>

          <form className="dashboard-form" onSubmit={handlePostSubmit}>
            <label className="dashboard-field">
              <span>{dashboard.postComposer.fields.category}</span>
              <input name="category" value={postForm.category} onChange={handlePostChange} required />
            </label>

            <label className="dashboard-field">
              <span>{dashboard.postComposer.fields.title}</span>
              <input name="title" value={postForm.title} onChange={handlePostChange} required />
            </label>

            <label className="dashboard-field">
              <span>{dashboard.postComposer.fields.description}</span>
              <textarea name="description" value={postForm.description} onChange={handlePostChange} rows="4" required />
            </label>

            <div className="dashboard-form__grid dashboard-form__grid--two">
              <label className="dashboard-field">
                <span>{dashboard.postComposer.fields.meta}</span>
                <input name="meta" value={postForm.meta} onChange={handlePostChange} required />
              </label>

              <label className="dashboard-field">
                <span>{dashboard.postComposer.fields.image}</span>
                <input name="image" value={postForm.image} onChange={handlePostChange} />
              </label>
            </div>

            <button type="submit" className="dashboard-button dashboard-button--primary">
              {dashboard.postComposer.publishButton}
            </button>
          </form>
        </motion.section>

        <motion.section className="dashboard-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}>
          <div className="section-head section-head--stacked">
            <h3>{dashboard.projectComposer.title}</h3>
            <p>{dashboard.projectComposer.description}</p>
          </div>

          <form className="dashboard-form" onSubmit={handleProjectSubmit}>
            <label className="dashboard-field">
              <span>{dashboard.projectComposer.fields.title}</span>
              <input name="title" value={projectForm.title} onChange={handleProjectChange} required />
            </label>

            <label className="dashboard-field">
              <span>{dashboard.projectComposer.fields.description}</span>
              <textarea name="description" value={projectForm.description} onChange={handleProjectChange} rows="4" required />
            </label>

            <div className="dashboard-form__grid dashboard-form__grid--two">
              <label className="dashboard-field">
                <span>{dashboard.projectComposer.fields.tags}</span>
                <input name="tags" value={projectForm.tags} onChange={handleProjectChange} required />
              </label>

              <label className="dashboard-field">
                <span>{dashboard.projectComposer.fields.href}</span>
                <input name="href" value={projectForm.href} onChange={handleProjectChange} required />
              </label>
            </div>

            <label className="dashboard-field">
              <span>{dashboard.projectComposer.fields.icon}</span>
              <select name="icon" value={projectForm.icon} onChange={handleProjectChange}>
                <option value="bag">bag</option>
                <option value="film">film</option>
                <option value="spark">spark</option>
              </select>
            </label>

            <button type="submit" className="dashboard-button dashboard-button--primary">
              {dashboard.projectComposer.addButton}
            </button>
          </form>
        </motion.section>

        <motion.section className="dashboard-card dashboard-card--inbox" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}>
          <div className="section-head section-head--stacked">
            <h3>{dashboard.inbox.title}</h3>
          </div>

          {messages.length === 0 ? (
            <p className="dashboard-empty">{dashboard.inbox.empty}</p>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <article key={message.id} className="message-card">
                  <div className="message-card__top">
                    <div>
                      <h4>{message.subject}</h4>
                      <p>
                        {message.name} · {message.email}
                      </p>
                    </div>
                    <time dateTime={message.createdAt}>
                      {new Date(message.createdAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                    </time>
                  </div>
                  <p>{message.message}</p>
                </article>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </section>
  );
}

export default AdminDashboard;