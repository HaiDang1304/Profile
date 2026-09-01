const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Message = require('../models/Message');

// Ensure a profile document exists
async function getOrCreateProfile() {
  let profile = await Profile.findOne({ key: 'main' });
  if (!profile) {
    profile = new Profile({ key: 'main', visits: 0 });
    await profile.save();
  }
  return profile;
}

router.get('/profile', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/profile/visit', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.visits = (profile.visits || 0) + 1;
    await profile.save();
    res.json({ visits: profile.visits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(200);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'name and message are required' });
    }

    const saved = await Message.create({ name, email, message });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
