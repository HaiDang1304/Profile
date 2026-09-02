const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const asBoolean = (value) => value === true || value === 1 || value === '1';
const asTags = (tags) => JSON.stringify(Array.isArray(tags) ? tags : String(tags || '').split(',').map((tag) => tag.trim()).filter(Boolean));
const slugify = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const parseProject = (row) => ({ ...row, tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [] });

router.get('/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', database: process.env.DB_NAME || 'haidang_portfolio' });
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const [[admin]] = await pool.query('SELECT * FROM admins WHERE username=?', [username]);
  if (!admin || !(await bcrypt.compare(String(password || ''), admin.password_hash))) return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không đúng.' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET || 'local-xampp-development-secret', { expiresIn: '8h' });
  return res.json({ token, admin: { id: admin.id, username: admin.username } });
});

router.get('/profile', async (_req, res) => {
  const [[profile]] = await pool.query('SELECT * FROM profile WHERE id=1');
  res.json(profile);
});

router.put('/admin/profile', requireAdmin, async (req, res) => {
  const p = req.body;
  await pool.query(`UPDATE profile SET name_vi=?,name_en=?,role=?,bio_vi=?,bio_en=?,avatar_url=?,email=?,location_vi=?,location_en=?,github=?,linkedin=?,facebook=?,availability=? WHERE id=1`,
    [p.name_vi, p.name_en, p.role, p.bio_vi, p.bio_en, p.avatar_url, p.email, p.location_vi, p.location_en, p.github, p.linkedin, p.facebook, asBoolean(p.availability)]);
  const [[profile]] = await pool.query('SELECT * FROM profile WHERE id=1');
  res.json(profile);
});

router.get('/projects', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM projects WHERE published=1 ORDER BY sort_order,created_at DESC');
  res.json(rows.map(parseProject));
});

router.get('/admin/projects', requireAdmin, async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM projects ORDER BY sort_order,created_at DESC');
  res.json(rows.map(parseProject));
});

router.post('/admin/projects', requireAdmin, async (req, res) => {
  const p = req.body;
  const [result] = await pool.query(`INSERT INTO projects (title,category,description_vi,description_en,tags,project_url,source_url,image_url,featured,published,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [p.title, p.category, p.description_vi, p.description_en, asTags(p.tags), p.project_url || '', p.source_url || '', p.image_url || '', asBoolean(p.featured), asBoolean(p.published), Number(p.sort_order || 0)]);
  const [[project]] = await pool.query('SELECT * FROM projects WHERE id=?', [result.insertId]);
  res.status(201).json(parseProject(project));
});

router.put('/admin/projects/:id', requireAdmin, async (req, res) => {
  const p = req.body;
  await pool.query(`UPDATE projects SET title=?,category=?,description_vi=?,description_en=?,tags=?,project_url=?,source_url=?,image_url=?,featured=?,published=?,sort_order=? WHERE id=?`,
    [p.title, p.category, p.description_vi, p.description_en, asTags(p.tags), p.project_url || '', p.source_url || '', p.image_url || '', asBoolean(p.featured), asBoolean(p.published), Number(p.sort_order || 0), req.params.id]);
  const [[project]] = await pool.query('SELECT * FROM projects WHERE id=?', [req.params.id]);
  res.json(parseProject(project));
});

router.delete('/admin/projects/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id=?', [req.params.id]);
  res.status(204).end();
});

router.get('/posts', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM posts WHERE published=1 ORDER BY created_at DESC');
  res.json(rows);
});

router.get('/admin/posts', requireAdmin, async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
  res.json(rows);
});

router.post('/admin/posts', requireAdmin, async (req, res) => {
  const p = req.body;
  const [result] = await pool.query(`INSERT INTO posts (title,slug,excerpt_vi,excerpt_en,content_vi,content_en,image_url,published) VALUES (?,?,?,?,?,?,?,?)`,
    [p.title, slugify(p.slug || p.title), p.excerpt_vi, p.excerpt_en, p.content_vi, p.content_en, p.image_url || '', asBoolean(p.published)]);
  const [[post]] = await pool.query('SELECT * FROM posts WHERE id=?', [result.insertId]);
  res.status(201).json(post);
});

router.put('/admin/posts/:id', requireAdmin, async (req, res) => {
  const p = req.body;
  await pool.query(`UPDATE posts SET title=?,slug=?,excerpt_vi=?,excerpt_en=?,content_vi=?,content_en=?,image_url=?,published=? WHERE id=?`,
    [p.title, slugify(p.slug || p.title), p.excerpt_vi, p.excerpt_en, p.content_vi, p.content_en, p.image_url || '', asBoolean(p.published), req.params.id]);
  const [[post]] = await pool.query('SELECT * FROM posts WHERE id=?', [req.params.id]);
  res.json(post);
});

router.delete('/admin/posts/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM posts WHERE id=?', [req.params.id]);
  res.status(204).end();
});

router.post('/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (![name, email, subject, message].every((value) => String(value || '').trim())) return res.status(400).json({ error: 'Vui lòng điền đủ thông tin.' });
  const [result] = await pool.query('INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)', [String(name).trim(), String(email).trim(), String(subject).trim(), String(message).trim()]);
  return res.status(201).json({ id: result.insertId, message: 'Đã nhận tin nhắn.' });
});

router.get('/admin/messages', requireAdmin, async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  res.json(rows);
});

router.patch('/admin/messages/:id/read', requireAdmin, async (req, res) => {
  await pool.query('UPDATE messages SET is_read=? WHERE id=?', [asBoolean(req.body.is_read), req.params.id]);
  res.json({ id: Number(req.params.id), is_read: asBoolean(req.body.is_read) });
});

router.delete('/admin/messages/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM messages WHERE id=?', [req.params.id]);
  res.status(204).end();
});

router.get('/admin/stats', requireAdmin, async (_req, res) => {
  const [projectRows] = await pool.query('SELECT COUNT(*) total FROM projects');
  const [postRows] = await pool.query('SELECT COUNT(*) total FROM posts');
  const [messageRows] = await pool.query('SELECT COUNT(*) total FROM messages');
  const [unreadRows] = await pool.query('SELECT COUNT(*) total FROM messages WHERE is_read=0');
  res.json({ projects: projectRows[0].total, posts: postRows[0].total, messages: messageRows[0].total, unread: unreadRows[0].total });
});

router.post('/visitors', async (req, res) => {
  const { name, color, accessory } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
  if (!name || !String(name).trim()) return res.status(400).json({ error: 'Vui lòng nhập tên' });
  
  const [[existing]] = await pool.query('SELECT id FROM visitors WHERE ip=?', [ip]);
  if (existing) return res.status(429).json({ error: 'Bạn đã điểm danh rồi! (Mỗi thiết bị/IP chỉ được 1 lần)' });

  const [result] = await pool.query('INSERT INTO visitors (ip, name, color, accessory) VALUES (?,?,?,?)', [ip, String(name).trim(), String(color || '#ffffff'), String(accessory || 'none')]);
  const [[visitor]] = await pool.query('SELECT * FROM visitors WHERE id=?', [result.insertId]);
  return res.status(201).json(visitor);
});

router.get('/visitors', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, name, ip, color, accessory, created_at FROM visitors ORDER BY created_at DESC LIMIT 50');
  res.json(rows);
});

// Reactions
router.get('/reactions', async (_req, res) => {
  const [rows] = await pool.query('SELECT project_id, type, count FROM reactions');
  res.json(rows);
});

router.post('/reactions/:projectId', async (req, res) => {
  const projectId = Number(req.params.projectId);
  const { type } = req.body; // 'heart', 'fire', 'rocket'
  if (!['heart', 'fire', 'rocket'].includes(type)) return res.status(400).json({ error: 'Invalid reaction type' });
  
  await pool.query('INSERT INTO reactions (project_id, type, count) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1', [projectId, type]);
  const [[row]] = await pool.query('SELECT count FROM reactions WHERE project_id=? AND type=?', [projectId, type]);
  res.json({ project_id: projectId, type, count: row.count });
});

// Bug Smasher
router.get('/bugs', async (_req, res) => {
  const [[row]] = await pool.query("SELECT stat_value FROM global_stats WHERE stat_key='bugs_smashed'");
  res.json({ bugs_smashed: row ? row.stat_value : 0 });
});

router.post('/bugs', async (_req, res) => {
  await pool.query("INSERT INTO global_stats (stat_key, stat_value) VALUES ('bugs_smashed', 1) ON DUPLICATE KEY UPDATE stat_value = stat_value + 1");
  const [[row]] = await pool.query("SELECT stat_value FROM global_stats WHERE stat_key='bugs_smashed'");
  res.json({ bugs_smashed: row.stat_value });
});

// Sticky Notes
router.get('/notes', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, text, color, x, y FROM sticky_notes');
  res.json(rows);
});

router.post('/notes', async (req, res) => {
  const { text, color, x, y } = req.body;
  if (!text || !String(text).trim()) return res.status(400).json({ error: 'Text required' });
  const [result] = await pool.query('INSERT INTO sticky_notes (text, color, x, y) VALUES (?, ?, ?, ?)', [String(text).trim().substring(0, 100), color || '#ffff88', Number(x)||0, Number(y)||0]);
  const [[note]] = await pool.query('SELECT * FROM sticky_notes WHERE id=?', [result.insertId]);
  res.json(note);
});

module.exports = router;
