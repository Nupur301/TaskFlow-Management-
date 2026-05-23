import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080";

const api = axios.create({ baseURL: API });

// Attach JWT token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH SCREEN ───────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      onLogin(data.username);
    } catch (e) {
      setError(e.response?.data || "Something went wrong");
    }
  };

  return (
    <div style={styles.authWrap}>
      <div style={styles.authCard}>
        <h1 style={styles.logo}>✅ TaskFlow</h1>
        <p style={styles.tagline}>Manage your tasks, your way.</p>
        <div style={styles.tabs}>
          <button style={isLogin ? styles.tabActive : styles.tab} onClick={() => setIsLogin(true)}>Login</button>
          <button style={!isLogin ? styles.tabActive : styles.tab} onClick={() => setIsLogin(false)}>Register</button>
        </div>
        <input style={styles.input} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btnPrimary} onClick={submit}>{isLogin ? "Login" : "Create Account"}</button>
      </div>
    </div>
  );
}

// ─── TASK CARD ─────────────────────────────────────────────────
function TaskCard({ task, onDelete, onStatusChange }) {
  const statusColors = { TODO: "#f59e0b", IN_PROGRESS: "#3b82f6", DONE: "#22c55e" };
  const priorityColors = { LOW: "#64748b", MEDIUM: "#f59e0b", HIGH: "#ef4444" };

  return (
    <div style={styles.taskCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={styles.taskTitle}>{task.title}</h3>
        <button style={styles.deleteBtn} onClick={() => onDelete(task.id)}>✕</button>
      </div>
      {task.description && <p style={styles.taskDesc}>{task.description}</p>}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ ...styles.badge, background: statusColors[task.status] + "22", color: statusColors[task.status] }}>
          {task.status.replace("_", " ")}
        </span>
        <span style={{ ...styles.badge, background: priorityColors[task.priority] + "22", color: priorityColors[task.priority] }}>
          {task.priority}
        </span>
      </div>
      <select
        style={styles.statusSelect}
        value={task.status}
        onChange={e => onStatusChange(task, e.target.value)}>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────
function Dashboard({ username, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => { fetchTasks(); fetchStats(); }, []);

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };

  const fetchStats = async () => {
    const { data } = await api.get("/tasks/stats");
    setStats(data);
  };

  const createTask = async () => {
    if (!title.trim()) return;
    await api.post("/tasks", { title, description, priority, status: "TODO" });
    setTitle(""); setDescription(""); setPriority("MEDIUM");
    fetchTasks(); fetchStats();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks(); fetchStats();
  };

  const updateStatus = async (task, newStatus) => {
    await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
    fetchTasks(); fetchStats();
  };

  const filtered = filter === "ALL" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div style={styles.dashWrap}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>✅ TaskFlow</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#94a3b8" }}>👤 {username}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total", value: stats.total || 0, color: "#38bdf8" },
          { label: "Todo", value: stats.todo || 0, color: "#f59e0b" },
          { label: "In Progress", value: stats.inProgress || 0, color: "#3b82f6" },
          { label: "Done", value: stats.done || 0, color: "#22c55e" },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Create Task */}
      <div style={styles.createCard}>
        <h2 style={styles.sectionTitle}>Add New Task</h2>
        <input style={styles.input} placeholder="Task title *" value={title} onChange={e => setTitle(e.target.value)} />
        <input style={styles.input} placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <select style={{ ...styles.input, flex: 1 }} value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <button style={{ ...styles.btnPrimary, flex: 1 }} onClick={createTask}>+ Add Task</button>
        </div>
      </div>

      {/* Filter + Tasks */}
      <div style={styles.filterBar}>
        {["ALL", "TODO", "IN_PROGRESS", "DONE"].map(f => (
          <button key={f} style={filter === f ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter(f)}>{f.replace("_", " ")}</button>
        ))}
      </div>

      <div style={styles.taskGrid}>
        {filtered.length === 0
          ? <p style={{ color: "#64748b", gridColumn: "1/-1" }}>No tasks yet. Create one above!</p>
          : filtered.map(t => (
            <TaskCard key={t.id} task={t} onDelete={deleteTask} onStatusChange={updateStatus} />
          ))}
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const handleLogin = (u) => setUsername(u);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
  };

  return username
    ? <Dashboard username={username} onLogout={handleLogout} />
    : <AuthScreen onLogin={handleLogin} />;
}

// ─── STYLES ────────────────────────────────────────────────────
const styles = {
  authWrap: { minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" },
  authCard: { background: "#1e293b", borderRadius: 16, padding: "2.5rem", width: 380, border: "1px solid #334155" },
  logo: { color: "#38bdf8", fontSize: "1.8rem", marginBottom: "0.25rem" },
  tagline: { color: "#64748b", marginBottom: "1.5rem", fontSize: "0.9rem" },
  tabs: { display: "flex", marginBottom: "1.25rem", gap: "0.5rem" },
  tab: { flex: 1, padding: "0.6rem", background: "transparent", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", cursor: "pointer" },
  tabActive: { flex: 1, padding: "0.6rem", background: "#38bdf8", border: "none", borderRadius: 8, color: "#0f172a", fontWeight: 700, cursor: "pointer" },
  input: { width: "100%", padding: "0.75rem 1rem", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", fontSize: "0.95rem", marginBottom: "0.75rem", boxSizing: "border-box" },
  btnPrimary: { width: "100%", padding: "0.75rem", background: "#38bdf8", border: "none", borderRadius: 8, color: "#0f172a", fontWeight: 700, fontSize: "1rem", cursor: "pointer" },
  error: { color: "#ef4444", fontSize: "0.85rem", marginBottom: "0.75rem" },
  dashWrap: { minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI', sans-serif", color: "#e2e8f0", padding: "0 1.5rem 3rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 0", borderBottom: "1px solid #1e293b", marginBottom: "1.5rem" },
  logoutBtn: { padding: "0.4rem 1rem", background: "transparent", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", cursor: "pointer" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" },
  statCard: { background: "#1e293b", borderRadius: 12, padding: "1.25rem", textAlign: "center", border: "1px solid #334155" },
  statValue: { fontSize: "2.25rem", fontWeight: 700 },
  statLabel: { color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem", textTransform: "uppercase" },
  createCard: { background: "#1e293b", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #334155" },
  sectionTitle: { color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: "1rem" },
  filterBar: { display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" },
  filterBtn: { padding: "0.4rem 1rem", background: "transparent", border: "1px solid #334155", borderRadius: 999, color: "#94a3b8", cursor: "pointer", fontSize: "0.85rem" },
  filterActive: { padding: "0.4rem 1rem", background: "#38bdf8", border: "none", borderRadius: 999, color: "#0f172a", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 },
  taskGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" },
  taskCard: { background: "#1e293b", borderRadius: 12, padding: "1.25rem", border: "1px solid #334155" },
  taskTitle: { fontSize: "1rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.25rem" },
  taskDesc: { fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem" },
  badge: { padding: "0.2rem 0.6rem", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600 },
  deleteBtn: { background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "1rem", padding: "0 0.25rem" },
  statusSelect: { width: "100%", marginTop: "0.75rem", padding: "0.4rem 0.75rem", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", fontSize: "0.85rem" },
};