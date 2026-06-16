import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

// ========================
// CONTEXTO DE AUTENTICAÇÃO
// ========================
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => listener?.unsubscribe();
  }, []);
  const login = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const register = (email, password) => supabase.auth.signUp({ email, password });
  const logout = () => supabase.auth.signOut();
  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

// ========================
// SISTEMA DE SOM (Web Audio API)
// ========================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function useSound() {
  const playLike = useCallback(() => { playTone(880, 'sine', 0.15); setTimeout(() => playTone(1100, 'sine', 0.1), 100); }, []);
  const playClick = useCallback(() => playTone(600, 'square', 0.08), []);
  const playUpload = useCallback(() => { playTone(400, 'triangle', 0.2); setTimeout(() => playTone(600, 'triangle', 0.3), 150); }, []);
  const playNotify = useCallback(() => { playTone(1000, 'sine', 0.2); setTimeout(() => playTone(1200, 'sine', 0.2), 150); }, []);
  return { playLike, playClick, playUpload, playNotify };
}

// ========================
// COMPONENTES INTERNOS (Logo, Sidebar, Navbar)
// ========================
function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" style={{ animation: 'neonPulse 2s infinite' }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M20 2L6 12V30L20 38L34 30V12L20 2Z" fill="#0f0f0f" stroke="#00e676" strokeWidth="2" filter="url(#glow)"/>
      <path d="M20 10L12 17V27L20 32L28 27V17L20 10Z" fill="#00e676" opacity="0.8"/>
      <text x="20" y="25" textAnchor="middle" fill="#0f0f0f" fontSize="10" fontWeight="900">S</text>
    </svg>
  );
}

function Sidebar({ open, close, user }) {
  const { playClick } = useSound();
  return (
    <>
      {open && <div onClick={close} style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', zIndex:140 }} />}
      <aside style={{
        width: 260,
        background: '#0f0f0f',
        padding: '20px 0',
        height: 'calc(100vh - 60px)',
        position: 'fixed',
        left: 0,
        top: 60,
        zIndex: 150,
        overflowY: 'auto',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        transform: open ? 'translateX(0)' : 'translateX(-280px)',
        transition: 'transform 0.3s ease',
      }}>
        <NavItem to="/" icon="🏠" label="Início" onClick={() => { close(); playClick(); }} />
        <NavItem to="/subscriptions" icon="📺" label="Inscrições" onClick={() => { close(); playClick(); }} />
        {user && <NavItem to={`/channel/${user.id}`} icon="👤" label="Meu canal" onClick={() => { close(); playClick(); }} />}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', margin:'10px 12px' }} />
        <NavItem to="/liked" icon="👍" label="Curtidos" onClick={() => { close(); playClick(); }} />
        <NavItem to="/history" icon="🕘" label="Histórico" onClick={() => { close(); playClick(); }} />
      </aside>
    </>
  );
}

function NavItem({ to, icon, label, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      margin: '2px 8px',
      borderRadius: 10,
      textDecoration: 'none',
      color: isActive ? '#00e676' : '#b0b0b0',
      background: isActive ? '#1a1a1a' : 'transparent',
      transition: 'background 0.2s',
    }}>
      <span style={{ marginRight: 12 }}>{icon}</span> {label}
    </Link>
  );
}

// ========================
// PÁGINAS (INLINE COM ANIMAÇÕES)
// ========================
function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const { playClick } = useSound();

  useEffect(() => {
    const endpoint = search
      ? `${import.meta.env.VITE_API_URL}/videos?search=${search}`
      : `${import.meta.env.VITE_API_URL}/videos`;
    axios.get(endpoint).then(res => setVideos(res.data)).finally(() => setLoading(false));
  }, [search]);

  if (loading) return <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:24 }}>
    {Array(8).fill().map((_, i) => <div key={i} style={{ background:'#0f0f0f', borderRadius:16, paddingTop:'56.25%', position:'relative', overflow:'hidden' }}><div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)', backgroundSize:'400% 100%', animation:'shimmer 2s infinite' }} /></div>)}
  </div>;

  return (
    <div>
      {search && <h2 style={{ marginBottom:20 }}>Resultados para: "{search}"</h2>}
      {videos.length === 0 ? (
        <div style={{ textAlign:'center', marginTop:80, color:'#888' }}>
          <p>Nenhum vídeo encontrado.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:24 }}>
          {videos.map((v, i) => (
            <Link to={`/watch/${v.id}`} key={v.id} onClick={playClick} style={{
              background: '#0f0f0f',
              borderRadius: 16,
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,230,118,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ position:'relative', paddingTop:'56.25%', background:'#111' }}>
                <img src={v.thumbnail_url || 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'} alt="" style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div style={{ padding: '14px 16px', display:'flex', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#252525' }} />
                <div>
                  <h3 style={{ fontSize:'0.95rem', fontWeight:600, margin:'0 0 4px' }}>{v.title}</h3>
                  <p style={{ fontSize:'0.8rem', color:'#aaa', margin:0 }}>{v.profiles?.username || 'SPARZAS'}</p>
                  <p style={{ fontSize:'0.8rem', color:'#aaa', margin:0 }}>{v.views || 0} visualizações</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const { playLike, playClick } = useSound();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/videos/${id}`).then(res => setVideo(res.data));
  }, [id]);

  const toggleLike = () => {
    if (!user) return;
    playLike();
    setLiked(!liked);
    // Partículas
    const newParticles = Array.from({ length: 12 }, () => ({
      id: Math.random(),
      x: 50 + Math.random() * 20 - 10,
      y: 50 + Math.random() * 20 - 10,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  };

  if (!video) return <div style={{ textAlign:'center', padding:40 }}>Carregando...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000', marginBottom: 24, position:'relative' }}>
        <video controls src={video.video_url} style={{ width:'100%', display:'block' }} />
      </div>
      <h1 style={{ fontSize:'1.8rem', marginBottom: 16 }}>{video.title}</h1>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:'#252525' }} />
          <div>
            <strong>{video.profiles?.username || 'Usuário'}</strong>
            <p style={{ fontSize:'0.8rem', color:'#aaa', margin:0 }}>{video.views} visualizações</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, position:'relative' }}>
          <button onClick={toggleLike} style={{
            background: liked ? '#00e676' : 'transparent',
            border: liked ? 'none' : '1px solid #333',
            color: liked ? '#000' : '#fff',
            padding: '8px 18px',
            borderRadius: 24,
            cursor:'pointer',
            fontWeight:500,
            transition:'all 0.2s',
          }}>
            👍 {liked ? 'Curtido' : 'Curtir'}
          </button>
          <button onClick={playClick} style={{
            background:'transparent', border:'1px solid #333', color:'#fff', padding:'8px 18px', borderRadius:24, cursor:'pointer',
          }}>🔗 Compartilhar</button>
          {/* Partículas do like */}
          {particles.map(p => (
            <span key={p.id} style={{
              position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
              width:8, height:8, borderRadius:'50%', background:'#00e676',
              animation:'particle 0.6s ease-out forwards',
            }} />
          ))}
        </div>
      </div>
      <div style={{ background:'#0f0f0f', padding:20, borderRadius:16, marginBottom:20 }}>
        <p style={{ whiteSpace:'pre-wrap' }}>{video.description || 'Sem descrição'}</p>
      </div>
      <h3>Comentários</h3>
      <p style={{ color:'#888' }}>Em breve...</p>
    </div>
  );
}

function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { playUpload, playClick } = useSound();

  if (!user) { navigate('/login'); return null; }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    playUpload();
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('videos').upload(fileName, file);
    if (error) { alert(error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/videos`, {
      user_id: user.id,
      title,
      video_url: publicUrl,
      thumbnail_url: 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'
    });
    navigate(`/watch/${res.data.id}`);
  };

  return (
    <div style={{ maxWidth:600, margin:'0 auto' }}>
      <h1>📤 Enviar vídeo</h1>
      <form onSubmit={handleUpload}>
        <input style={inputStyle} placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{ margin:'20px 0' }} required />
        <button type="submit" disabled={uploading} onClick={playClick} style={{
          background:'#00e676', color:'#000', border:'none', padding:'12px 28px', borderRadius:24, fontWeight:600, cursor:'pointer'
        }}>
          {uploading ? 'Enviando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { playClick } = useSound();

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    try { await login(email, password); navigate('/'); } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ maxWidth:420, margin:'60px auto', padding:32, background:'#0f0f0f', borderRadius:24 }}>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{ width:'100%', padding:14, background:'#00e676', border:'none', borderRadius:24, color:'#000', fontWeight:600, marginTop:20, cursor:'pointer' }}>Entrar</button>
      </form>
      <p style={{ textAlign:'center', marginTop:20 }}>Não tem conta? <Link to="/register" style={{ color:'#00e676' }}>Registre-se</Link></p>
    </div>
  );
}

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const { playClick } = useSound();

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    try { await register(email, password); navigate('/login'); } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ maxWidth:420, margin:'60px auto', padding:32, background:'#0f0f0f', borderRadius:24 }}>
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="Senha (mín. 6)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        <button type="submit" style={{ width:'100%', padding:14, background:'#00e676', border:'none', borderRadius:24, color:'#000', fontWeight:600, marginTop:20, cursor:'pointer' }}>Registrar</button>
      </form>
      <p style={{ textAlign:'center', marginTop:20 }}>Já tem conta? <Link to="/login" style={{ color:'#00e676' }}>Faça login</Link></p>
    </div>
  );
}

function Channel() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`).then(res => { setChannel(res.data.profile); setVideos(res.data.videos); });
  }, [id]);
  if (!channel) return <p>Carregando...</p>;
  return (
    <div>
      <div style={{ background:'#0f0f0f', padding:24, borderRadius:16, display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#252525' }} />
        <h1>{channel.username}</h1>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:24 }}>
        {videos.map(v => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign:'center', marginTop:100 }}>
      <h1 style={{ fontSize:80, color:'#00e676' }}>404</h1>
      <p>Página não encontrada</p>
      <Link to="/" style={{ color:'#00e676' }}>Voltar</Link>
    </div>
  );
}

// Componente VideoCard reutilizável
function VideoCard({ video, index }) {
  const { playClick } = useSound();
  return (
    <Link to={`/watch/${video.id}`} onClick={playClick} style={{
      background: '#0f0f0f', borderRadius: 16, overflow: 'hidden', textDecoration: 'none', color: 'inherit',
      animation: `fadeInUp 0.4s ease ${index * 0.05}s both`,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,230,118,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ position:'relative', paddingTop:'56.25%', background:'#111' }}>
        <img src={video.thumbnail_url || 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'} alt="" style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover' }} />
      </div>
      <div style={{ padding: '14px 16px', display:'flex', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:'50%', background:'#252525' }} />
        <div>
          <h3 style={{ fontSize:'0.95rem', fontWeight:600, margin:'0 0 4px' }}>{video.title}</h3>
          <p style={{ fontSize:'0.8rem', color:'#aaa', margin:0 }}>{video.profiles?.username || 'SPARZAS'}</p>
          <p style={{ fontSize:'0.8rem', color:'#aaa', margin:0 }}>{video.views || 0} visualizações</p>
        </div>
      </div>
    </Link>
  );
}

// ========================
// LAYOUT PRINCIPAL
// ========================
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { playClick } = useSound();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    playClick();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search)}`);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      {/* Navbar */}
      <nav style={{
        height:60, background:'rgba(15,15,15,0.85)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', padding:'0 20px',
        position:'sticky', top:0, zIndex:200, gap:16
      }}>
        <button onClick={() => { setSidebarOpen(!sidebarOpen); playClick(); }} style={{ background:'none', border:'none', color:'#fff', fontSize:24 }}>☰</button>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <Logo />
          <span style={{ fontSize:'1.6rem', fontWeight:800, color:'#00e676', letterSpacing:-0.5 }}>SPARZAS</span>
        </Link>
        <form onSubmit={handleSearch} style={{ flex:1, display:'flex', justifyContent:'center' }}>
          <input type="text" placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} style={{
            width:'100%', maxWidth:480, padding:'10px 18px', background:'#121212', border:'1px solid #2a2a2a',
            borderRadius:'24px 0 0 24px', color:'#fff', fontSize:'0.95rem', outline:'none'
          }} />
          <button type="submit" style={{
            background:'#1a1a1a', border:'1px solid #2a2a2a', borderLeft:'none', borderRadius:'0 24px 24px 0',
            padding:'0 20px', color:'#fff', cursor:'pointer'
          }}>🔍</button>
        </form>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {user ? (
            <>
              <Link to="/upload" onClick={playClick} style={{ color:'#fff', textDecoration:'none' }}>+ Enviar</Link>
              <button onClick={() => { logout(); playClick(); }} style={{
                background:'transparent', border:'1px solid #333', color:'#fff', padding:'6px 14px', borderRadius:24, cursor:'pointer'
              }}>Sair</button>
            </>
          ) : (
            <Link to="/login" onClick={playClick} style={{
              background:'#00c853', color:'#000', padding:'10px 22px', borderRadius:24, fontWeight:600, textDecoration:'none'
            }}>Entrar</Link>
          )}
        </div>
      </nav>

      <div style={{ display:'flex', flex:1 }}>
        <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} user={user} />
        <main style={{ flex:1, padding:'24px 20px', overflowY:'auto' }} onClick={() => sidebarOpen && setSidebarOpen(false)}>
          <div style={{ animation:'fadeIn 0.4s ease' }} key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/channel/:id" element={<Channel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Estilos globais e animações */}
      <style>{`
        @keyframes neonPulse { 0%,100% { filter: drop-shadow(0 0 8px #00e676); } 50% { filter: drop-shadow(0 0 20px #00e676) drop-shadow(0 0 40px #1de9b6); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        @keyframes particle { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity:0; } }
        body { margin:0; background:#050505; color:#fff; font-family:'Inter', -apple-system, sans-serif; }
        a { color:#00e676; text-decoration:none; }
        @media (max-width: 768px) {
          main { padding: 16px; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
