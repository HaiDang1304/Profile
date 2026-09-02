import { useCallback, useEffect, useState } from 'react';
import { BarChart3, Check, Edit3, ExternalLink, FileText, FolderKanban, Inbox, LogOut, Menu, Plus, Save, Settings, Trash2, UserRound, X } from 'lucide-react';
import { apiRequest } from '../lib/api';
import '../styles/admin.css';

const tabs = [
  ['overview', 'Tổng quan', <BarChart3 size={18} />], ['profile', 'Hồ sơ', <UserRound size={18} />], ['projects', 'Dự án', <FolderKanban size={18} />],
  ['posts', 'Bài viết', <FileText size={18} />], ['messages', 'Liên hệ', <Inbox size={18} />],
];
const emptyProject = { title: '', category: 'WEB APP', description_vi: '', description_en: '', tags: '', project_url: '', source_url: '', image_url: '', featured: false, published: true, sort_order: 0 };
const emptyPost = { title: '', slug: '', excerpt_vi: '', excerpt_en: '', content_vi: '', content_en: '', image_url: '', published: false };

function Field({ label, children, wide = false }) {
  return <label className={wide ? 'admin-field admin-field--wide' : 'admin-field'}><span>{label}</span>{children}</label>;
}

function Login() {
  return (
    <main className="admin-login" style={{ backgroundColor: '#000', color: '#10b981', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'monospace', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ef4444' }}>ACCESS DENIED</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>ADMIN PORTAL IS LOCKED.</p>
      <p style={{ fontSize: '1rem', color: '#888' }}>Please return to the home page, open the terminal (`~`), and type `login` to authenticate.</p>
      <a href="/" style={{ marginTop: '2rem', padding: '10px 20px', border: '1px solid #10b981', color: '#10b981', textDecoration: 'none', borderRadius: '4px' }}>&lt; Return to Home</a>
    </main>
  );
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('portfolio-admin-token') || '');
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('portfolio-admin-user') || 'null'));
  const [tab, setTab] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [data, setData] = useState({ profile: null, projects: [], posts: [], messages: [], stats: {} });
  const [editor, setEditor] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => { localStorage.removeItem('portfolio-admin-token'); localStorage.removeItem('portfolio-admin-user'); setToken(''); setAdmin(null); }, []);
  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      const [profile, projects, posts, messages, stats] = await Promise.all([
        apiRequest('/profile'), apiRequest('/admin/projects', { token }), apiRequest('/admin/posts', { token }), apiRequest('/admin/messages', { token }), apiRequest('/admin/stats', { token }),
      ]);
      setData({ profile, projects, posts, messages, stats });
    } catch (error) { if (/đăng nhập|hết hạn|401/i.test(error.message)) logout(); else setNotice(error.message); }
  }, [token, logout]);
  useEffect(() => { loadData(); }, [loadData]);

  const onLogin = ({ token: nextToken, admin: nextAdmin }) => {
    localStorage.setItem('portfolio-admin-token', nextToken); localStorage.setItem('portfolio-admin-user', JSON.stringify(nextAdmin)); setToken(nextToken); setAdmin(nextAdmin);
  };
  const request = async (path, options, success) => {
    setLoading(true); setNotice('');
    try { await apiRequest(path, { ...options, token }); setNotice(success); setEditor(null); await loadData(); }
    catch (error) { setNotice(error.message); } finally { setLoading(false); }
  };
  const remove = (type, id) => {
    if (window.confirm('Xóa mục này khỏi cơ sở dữ liệu? Thao tác không thể hoàn tác.')) request(`/admin/${type}/${id}`, { method: 'DELETE' }, 'Đã xóa thành công.');
  };

  if (!token) return <Login onLogin={onLogin} />;

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${mobileNav ? 'is-open' : ''}`}><div className="admin-brand"><span>HD</span><div><b>CONTROL</b><small>CENTER v1.0</small></div><button onClick={() => setMobileNav(false)}><X /></button></div><nav>{tabs.map(([id, label, icon]) => <button key={id} className={tab === id ? 'is-active' : ''} onClick={() => { setTab(id); setEditor(null); setMobileNav(false); }}>{icon}<span>{label}</span>{id === 'messages' && Number(data.stats.unread) > 0 && <i>{data.stats.unread}</i>}</button>)}</nav><div className="admin-sidebar__bottom"><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} />Xem portfolio</a><button onClick={logout}><LogOut size={16} />Đăng xuất</button></div></aside>
    <div className="admin-main"><header className="admin-header"><button className="admin-menu" onClick={() => setMobileNav(true)}><Menu /></button><div><small>ADMIN / {tab.toUpperCase()}</small><h1>{tabs.find(([id]) => id === tab)?.[1]}</h1></div><div className="admin-user"><span>{admin?.username?.slice(0, 2).toUpperCase()}</span><div><b>{admin?.username}</b><small>SUPER ADMIN</small></div></div></header>
      <main className="admin-content">{notice && <div className="admin-alert"><Check size={16} />{notice}<button onClick={() => setNotice('')}><X size={15} /></button></div>}
        {tab === 'overview' && <Overview data={data} setTab={setTab} />}
        {tab === 'profile' && data.profile && <ProfileEditor profile={data.profile} loading={loading} onSave={(profile) => request('/admin/profile', { method: 'PUT', body: JSON.stringify(profile) }, 'Đã cập nhật hồ sơ.')} />}
        {tab === 'projects' && <Collection title="DỰ ÁN" button="THÊM DỰ ÁN" onAdd={() => setEditor({ type: 'project', value: emptyProject })}>{data.projects.map((item) => <CollectionRow key={item.id} title={item.title} subtitle={item.category} status={item.published} onEdit={() => setEditor({ type: 'project', value: { ...item, tags: item.tags.join(', ') } })} onDelete={() => remove('projects', item.id)} />)}</Collection>}
        {tab === 'posts' && <Collection title="BÀI VIẾT" button="VIẾT BÀI MỚI" onAdd={() => setEditor({ type: 'post', value: emptyPost })}>{data.posts.map((item) => <CollectionRow key={item.id} title={item.title} subtitle={new Date(item.created_at).toLocaleDateString('vi-VN')} status={item.published} onEdit={() => setEditor({ type: 'post', value: item })} onDelete={() => remove('posts', item.id)} />)}</Collection>}
        {tab === 'messages' && <Messages items={data.messages} onRead={(item) => request(`/admin/messages/${item.id}/read`, { method: 'PATCH', body: JSON.stringify({ is_read: !item.is_read }) }, 'Đã cập nhật tin nhắn.')} onDelete={(id) => remove('messages', id)} />}
      </main>
    </div>
    {editor?.type === 'project' && <ProjectEditor value={editor.value} loading={loading} onClose={() => setEditor(null)} onSave={(value) => request(`/admin/projects${value.id ? `/${value.id}` : ''}`, { method: value.id ? 'PUT' : 'POST', body: JSON.stringify(value) }, value.id ? 'Đã sửa dự án.' : 'Đã thêm dự án.')} />}
    {editor?.type === 'post' && <PostEditor value={editor.value} loading={loading} onClose={() => setEditor(null)} onSave={(value) => request(`/admin/posts${value.id ? `/${value.id}` : ''}`, { method: value.id ? 'PUT' : 'POST', body: JSON.stringify(value) }, value.id ? 'Đã sửa bài viết.' : 'Đã đăng bài viết.')} />}
  </div>;
}

function Overview({ data, setTab }) {
  const cards = [['DỰ ÁN', data.stats.projects || 0, <FolderKanban />, 'projects'], ['BÀI VIẾT', data.stats.posts || 0, <FileText />, 'posts'], ['TIN NHẮN', data.stats.messages || 0, <Inbox />, 'messages'], ['CHƯA ĐỌC', data.stats.unread || 0, <BarChart3 />, 'messages']];
  return <><div className="admin-stats">{cards.map(([label, value, icon, target]) => <button key={label} onClick={() => setTab(target)}><div>{icon}<span>{label}</span></div><b>{String(value).padStart(2, '0')}</b><small>XEM CHI TIẾT →</small></button>)}</div><section className="admin-panel"><div className="admin-panel__title"><div><span>DATABASE_STATUS</span><h2>Kết nối XAMPP MySQL</h2></div><i className="admin-online">● ONLINE</i></div><div className="admin-db"><div><small>DATABASE</small><b>haidang_portfolio</b></div><div><small>ENGINE</small><b>MariaDB / MySQL</b></div><div><small>API</small><b>localhost:4000</b></div></div></section></>;
}

function ProfileEditor({ profile, onSave, loading }) {
  const [value, setValue] = useState(profile);
  const input = (key) => ({ value: value[key] || '', onChange: (e) => setValue({ ...value, [key]: e.target.value }) });
  return <form className="admin-panel admin-form" onSubmit={(e) => { e.preventDefault(); onSave(value); }}><div className="admin-panel__title"><div><span>PROFILE.JSON</span><h2>Thông tin hiển thị</h2></div><Settings /></div><div className="admin-form-grid"><Field label="HỌ TÊN (VI)"><input {...input('name_vi')} /></Field><Field label="HỌ TÊN (EN)"><input {...input('name_en')} /></Field><Field label="VAI TRÒ" wide><input {...input('role')} /></Field><Field label="GIỚI THIỆU (VI)" wide><textarea rows="4" {...input('bio_vi')} /></Field><Field label="GIỚI THIỆU (EN)" wide><textarea rows="4" {...input('bio_en')} /></Field><Field label="ẢNH ĐẠI DIỆN"><input {...input('avatar_url')} /></Field><Field label="EMAIL"><input type="email" {...input('email')} /></Field><Field label="ĐỊA ĐIỂM (VI)"><input {...input('location_vi')} /></Field><Field label="ĐỊA ĐIỂM (EN)"><input {...input('location_en')} /></Field><Field label="GITHUB"><input {...input('github')} /></Field><Field label="LINKEDIN"><input {...input('linkedin')} /></Field><Field label="FACEBOOK" wide><input {...input('facebook')} /></Field></div><label className="admin-check"><input type="checkbox" checked={Boolean(value.availability)} onChange={(e) => setValue({ ...value, availability: e.target.checked })} />Sẵn sàng nhận dự án</label><button className="admin-primary" disabled={loading}><Save size={17} />LƯU THAY ĐỔI</button></form>;
}

function Collection({ title, button, onAdd, children }) { return <section className="admin-panel"><div className="admin-panel__title"><div><span>CONTENT_MANAGER</span><h2>{title}</h2></div><button className="admin-primary admin-primary--small" onClick={onAdd}><Plus size={16} />{button}</button></div><div className="admin-list">{children?.length ? children : <div className="admin-empty">Chưa có dữ liệu.</div>}</div></section>; }
function CollectionRow({ title, subtitle, status, onEdit, onDelete }) { return <article className="admin-list-row"><div><span className="admin-id">◆</span><div><h3>{title}</h3><p>{subtitle}</p></div></div><span className={status ? 'admin-status is-live' : 'admin-status'}>{status ? 'ĐANG HIỆN' : 'BẢN NHÁP'}</span><div className="admin-actions"><button onClick={onEdit} aria-label="Sửa"><Edit3 /></button><button className="is-danger" onClick={onDelete} aria-label="Xóa"><Trash2 /></button></div></article>; }

function EditorShell({ title, children, onClose, onSubmit, loading }) { return <div className="admin-modal"><form className="admin-modal__window" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}><div className="admin-window-bar"><span>{title}</span><button type="button" onClick={onClose}><X /></button></div><div className="admin-modal__body">{children}</div><div className="admin-modal__footer"><button type="button" onClick={onClose}>HỦY</button><button className="admin-primary" disabled={loading}><Save size={16} />{loading ? 'ĐANG LƯU...' : 'LƯU DỮ LIỆU'}</button></div></form></div>; }
function ProjectEditor({ value: initial, onSave, onClose, loading }) { const [value, setValue] = useState(initial); const input = (key) => ({ value: value[key] || '', onChange: (e) => setValue({ ...value, [key]: e.target.value }) }); return <EditorShell title="PROJECT_EDITOR.EXE" onClose={onClose} onSubmit={() => onSave(value)} loading={loading}><div className="admin-form-grid"><Field label="TÊN DỰ ÁN"><input required {...input('title')} /></Field><Field label="LOẠI DỰ ÁN"><input required {...input('category')} /></Field><Field label="MÔ TẢ TIẾNG VIỆT" wide><textarea required rows="3" {...input('description_vi')} /></Field><Field label="MÔ TẢ TIẾNG ANH" wide><textarea required rows="3" {...input('description_en')} /></Field><Field label="CÔNG NGHỆ (PHÂN CÁCH DẤU PHẨY)" wide><input {...input('tags')} /></Field><Field label="LINK DEMO"><input {...input('project_url')} /></Field><Field label="LINK SOURCE"><input {...input('source_url')} /></Field><Field label="URL HÌNH ẢNH"><input {...input('image_url')} /></Field><Field label="THỨ TỰ"><input type="number" {...input('sort_order')} /></Field></div><div className="admin-check-row"><label className="admin-check"><input type="checkbox" checked={Boolean(value.featured)} onChange={(e) => setValue({ ...value, featured: e.target.checked })} />Nổi bật</label><label className="admin-check"><input type="checkbox" checked={Boolean(value.published)} onChange={(e) => setValue({ ...value, published: e.target.checked })} />Hiển thị</label></div></EditorShell>; }
function PostEditor({ value: initial, onSave, onClose, loading }) { const [value, setValue] = useState(initial); const input = (key) => ({ value: value[key] || '', onChange: (e) => setValue({ ...value, [key]: e.target.value }) }); return <EditorShell title="POST_EDITOR.EXE" onClose={onClose} onSubmit={() => onSave(value)} loading={loading}><div className="admin-form-grid"><Field label="TIÊU ĐỀ" wide><input required {...input('title')} /></Field><Field label="SLUG"><input {...input('slug')} placeholder="Tự tạo từ tiêu đề" /></Field><Field label="URL HÌNH ẢNH"><input {...input('image_url')} /></Field><Field label="TÓM TẮT (VI)" wide><textarea required rows="3" {...input('excerpt_vi')} /></Field><Field label="TÓM TẮT (EN)" wide><textarea required rows="3" {...input('excerpt_en')} /></Field><Field label="NỘI DUNG (VI)" wide><textarea required rows="7" {...input('content_vi')} /></Field><Field label="NỘI DUNG (EN)" wide><textarea required rows="7" {...input('content_en')} /></Field></div><label className="admin-check"><input type="checkbox" checked={Boolean(value.published)} onChange={(e) => setValue({ ...value, published: e.target.checked })} />Xuất bản ngay</label></EditorShell>; }
function Messages({ items, onRead, onDelete }) { return <section className="admin-panel"><div className="admin-panel__title"><div><span>INBOX</span><h2>TIN NHẮN LIÊN HỆ</h2></div></div><div className="admin-messages">{items.length ? items.map((item) => <article className={item.is_read ? 'is-read' : ''} key={item.id}><header><div><span>{item.name.slice(0, 2).toUpperCase()}</span><div><h3>{item.name}</h3><a href={`mailto:${item.email}`}>{item.email}</a></div></div><time>{new Date(item.created_at).toLocaleString('vi-VN')}</time></header><h4>{item.subject}</h4><p>{item.message}</p><footer><button onClick={() => onRead(item)}>{item.is_read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}</button><button className="is-danger" onClick={() => onDelete(item.id)}><Trash2 size={14} />Xóa</button></footer></article>) : <div className="admin-empty">Chưa có tin nhắn.</div>}</div></section>; }
