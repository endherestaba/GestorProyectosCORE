import { useState, useEffect } from "react";

// ─── INITIAL DATA ───────────────────────────────────────────────────────────

const DEFAULT_CONFIG = {
  yellowDays: 3,
  redDays: 7,
  users: [
    { id: 1, name: "Ana Torres", role: "editor" },
    { id: 2, name: "Luis Méndez", role: "viewer" },
    { id: 3, name: "Carlos Ríos", role: "editor" },
    { id: 4, name: "María López", role: "viewer" },
  ],
};

const STAGES = [
  "Análisis",
  "Diseño",
  "Desarrollo",
  "QA / Pruebas",
  "Despliegue",
  "Cierre",
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: "CRM · Marketing",
    color: "#E05A2B",
    stages: [
      { stage: "Análisis", done: true, blocker: "", responsible: "Ana Torres", daysInStage: 0, expectedDays: 2 },
      { stage: "Diseño", done: true, blocker: "", responsible: "Luis Méndez", daysInStage: 0, expectedDays: 3 },
      { stage: "Desarrollo", done: false, blocker: "Acceso a entorno prod bloqueado por IT", responsible: "Carlos Ríos", daysInStage: 8, expectedDays: 5 },
      { stage: "QA / Pruebas", done: false, blocker: "", responsible: "María López", daysInStage: 0, expectedDays: 4 },
      { stage: "Despliegue", done: false, blocker: "", responsible: "Carlos Ríos", daysInStage: 0, expectedDays: 1 },
      { stage: "Cierre", done: false, blocker: "", responsible: "Ana Torres", daysInStage: 0, expectedDays: 1 },
    ],
  },
  {
    id: 2,
    name: "Portal · Clientes",
    color: "#7C3AED",
    stages: [
      { stage: "Análisis", done: true, blocker: "", responsible: "Ana Torres", daysInStage: 0, expectedDays: 3 },
      { stage: "Diseño", done: false, blocker: "Pendiente aprobación UX por stakeholder", responsible: "María López", daysInStage: 4, expectedDays: 3 },
      { stage: "Desarrollo", done: false, blocker: "", responsible: "Luis Méndez", daysInStage: 0, expectedDays: 7 },
      { stage: "QA / Pruebas", done: false, blocker: "", responsible: "Carlos Ríos", daysInStage: 0, expectedDays: 3 },
      { stage: "Despliegue", done: false, blocker: "", responsible: "Ana Torres", daysInStage: 0, expectedDays: 2 },
      { stage: "Cierre", done: false, blocker: "", responsible: "Ana Torres", daysInStage: 0, expectedDays: 1 },
    ],
  },
  {
    id: 3,
    name: "API · Pagos",
    color: "#0891B2",
    stages: [
      { stage: "Análisis", done: true, blocker: "", responsible: "Carlos Ríos", daysInStage: 0, expectedDays: 2 },
      { stage: "Diseño", done: true, blocker: "", responsible: "Ana Torres", daysInStage: 0, expectedDays: 2 },
      { stage: "Desarrollo", done: true, blocker: "", responsible: "Luis Méndez", daysInStage: 0, expectedDays: 10 },
      { stage: "QA / Pruebas", done: false, blocker: "Credenciales sandbox vencidas", responsible: "María López", daysInStage: 2, expectedDays: 5 },
      { stage: "Despliegue", done: false, blocker: "", responsible: "Carlos Ríos", daysInStage: 0, expectedDays: 1 },
      { stage: "Cierre", done: false, blocker: "", responsible: "Ana Torres", daysInStage: 0, expectedDays: 1 },
    ],
  },
  {
    id: 4,
    name: "App · Mobile",
    color: "#059669",
    stages: [
      { stage: "Análisis", done: true, blocker: "", responsible: "María López", daysInStage: 0, expectedDays: 3 },
      { stage: "Diseño", done: false, blocker: "", responsible: "Ana Torres", daysInStage: 1, expectedDays: 5 },
      { stage: "Desarrollo", done: false, blocker: "", responsible: "Luis Méndez", daysInStage: 0, expectedDays: 14 },
      { stage: "QA / Pruebas", done: false, blocker: "", responsible: "Carlos Ríos", daysInStage: 0, expectedDays: 5 },
      { stage: "Despliegue", done: false, blocker: "", responsible: "Carlos Ríos", daysInStage: 0, expectedDays: 2 },
      { stage: "Cierre", done: false, blocker: "", responsible: "Ana Torres", daysInStage: 0, expectedDays: 1 },
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getTrafficLight(stageData, config) {
  if (stageData.done) return "green";
  if (!stageData.blocker) return "neutral";
  const d = stageData.daysInStage;
  if (d >= config.redDays) return "red";
  if (d >= config.yellowDays) return "yellow";
  return "yellow";
}

const LIGHT_STYLES = {
  green: { bg: "#F0FDF4", border: "#22C55E", dot: "#22C55E", label: "Completado" },
  yellow: { bg: "#FFFBEB", border: "#F59E0B", dot: "#F59E0B", label: "Atención" },
  red: { bg: "#FEF2F2", border: "#EF4444", dot: "#EF4444", label: "Crítico" },
  neutral: { bg: "#F8FAFC", border: "#CBD5E1", dot: "#94A3B8", label: "En espera" },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function TrafficDot({ light }) {
  const s = LIGHT_STYLES[light];
  return (
    <span style={{
      display: "inline-block",
      width: 10, height: 10,
      borderRadius: "50%",
      backgroundColor: s.dot,
      flexShrink: 0,
      boxShadow: light !== "neutral" ? `0 0 0 3px ${s.dot}22` : "none",
    }} />
  );
}

function StageCard({ stageData, config, onClick }) {
  const light = getTrafficLight(stageData, config);
  const s = LIGHT_STYLES[light];
  const isActive = !stageData.done;

  return (
    <div
      onClick={() => onClick && onClick()}
      style={{
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        borderRadius: 10,
        padding: "11px 14px",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.15s",
        position: "relative",
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = `0 4px 16px ${s.dot}33`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Stage name + dot */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
        <TrafficDot light={light} />
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#475569",
        }}>{stageData.stage}</span>
      </div>

      {/* Blocker */}
      {stageData.blocker && (
        <p style={{
          fontSize: 12,
          color: "#334155",
          lineHeight: 1.45,
          margin: "0 0 9px",
        }}>
          {stageData.blocker}
        </p>
      )}

      {stageData.done && (
        <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 9px" }}>Etapa completada ✓</p>
      )}

      {/* Tags row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        <Tag color="#6366F1" icon="👤">{stageData.responsible}</Tag>
        {isActive && stageData.blocker && (
          <Tag color={s.dot} icon="⏱">
            {stageData.daysInStage}d transcurridos
          </Tag>
        )}
        {isActive && !stageData.blocker && stageData.expectedDays > 0 && (
          <Tag color="#94A3B8" icon="📅">
            ~{stageData.expectedDays}d estimados
          </Tag>
        )}
      </div>
    </div>
  );
}

function Tag({ color, icon, children }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 20,
      background: color + "18",
      color: color,
      border: `1px solid ${color}44`,
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 9 }}>{icon}</span>
      {children}
    </span>
  );
}

function ProjectColumn({ project, config, onStageClick }) {
  const activeIdx = project.stages.findIndex(s => !s.done);
  const progress = project.stages.filter(s => s.done).length;
  const pct = Math.round((progress / STAGES.length) * 100);

  return (
    <div style={{
      width: 230,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}>
      {/* Header */}
      <div style={{
        background: project.color,
        borderRadius: "10px 10px 0 0",
        padding: "12px 16px 10px",
        marginBottom: 0,
      }}>
        <div style={{ color: "white", fontWeight: 700, fontSize: 13, letterSpacing: "0.01em" }}>
          {project.name}
        </div>
        <div style={{ marginTop: 8, background: "rgba(255,255,255,0.25)", borderRadius: 4, height: 4 }}>
          <div style={{
            width: `${pct}%`,
            height: "100%",
            background: "white",
            borderRadius: 4,
            transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 10, marginTop: 4 }}>
          {progress}/{STAGES.length} etapas · {pct}%
        </div>
      </div>

      {/* Connector + cards */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        paddingLeft: 14,
      }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute",
          left: 6,
          top: 0,
          bottom: 0,
          width: 2,
          background: `linear-gradient(to bottom, ${project.color}88, ${project.color}11)`,
          borderRadius: 2,
        }} />

        {project.stages.map((stageData, i) => {
          const light = getTrafficLight(stageData, config);
          const dotColor = LIGHT_STYLES[light].dot;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 0, marginTop: i === 0 ? 10 : 8 }}>
              {/* Connector dot */}
              <div style={{
                width: 10, height: 10,
                borderRadius: "50%",
                background: dotColor,
                border: `2px solid white`,
                boxShadow: `0 0 0 2px ${dotColor}`,
                flexShrink: 0,
                marginTop: 11,
                marginLeft: -5,
                zIndex: 1,
              }} />
              <div style={{ flex: 1, marginLeft: 8 }}>
                <StageCard
                  stageData={stageData}
                  config={config}
                  onClick={() => onStageClick(project.id, i)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── EDIT MODAL ──────────────────────────────────────────────────────────────

function EditModal({ project, stageIdx, config, onSave, onClose, allUsers }) {
  const stage = project.stages[stageIdx];
  const [form, setForm] = useState({ ...stage });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(15,23,42,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999,
      backdropFilter: "blur(3px)",
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "white",
        borderRadius: 14,
        padding: "28px 28px 24px",
        width: 380,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {project.name}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>
              {stage.stage}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#F1F5F9", border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748B",
          }}>×</button>
        </div>

        <Field label="Estopeante / Bloqueante">
          <textarea
            value={form.blocker}
            onChange={e => set("blocker", e.target.value)}
            placeholder="Describe el bloqueante (vacío si no hay)..."
            style={textareaStyle}
            rows={3}
          />
        </Field>

        <Field label="Responsable">
          <select value={form.responsible} onChange={e => set("responsible", e.target.value)} style={inputStyle}>
            {allUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
          </select>
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Días transcurridos">
            <input type="number" min={0} value={form.daysInStage}
              onChange={e => set("daysInStage", +e.target.value)}
              style={inputStyle} />
          </Field>
          <Field label="Días estimados">
            <input type="number" min={0} value={form.expectedDays}
              onChange={e => set("expectedDays", +e.target.value)}
              style={inputStyle} />
          </Field>
        </div>

        <Field label="Estado de la etapa">
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {[true, false].map(v => (
              <button key={String(v)}
                onClick={() => set("done", v)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid",
                  borderColor: form.done === v ? (v ? "#22C55E" : "#64748B") : "#E2E8F0",
                  background: form.done === v ? (v ? "#F0FDF4" : "#F8FAFC") : "white",
                  color: form.done === v ? (v ? "#16A34A" : "#334155") : "#94A3B8",
                  fontWeight: 600, fontSize: 12, cursor: "pointer",
                }}>
                {v ? "✓ Completado" : "⏳ En curso"}
              </button>
            ))}
          </div>
        </Field>

        <button
          onClick={() => onSave(form)}
          style={{
            width: "100%", padding: "11px 0", marginTop: 8,
            background: project.color, color: "white",
            border: "none", borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            letterSpacing: "0.02em",
          }}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px",
  border: "1.5px solid #E2E8F0", borderRadius: 8,
  fontSize: 13, color: "#0F172A", background: "#F8FAFC",
  outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.5,
};

// ─── CONFIG PANEL ────────────────────────────────────────────────────────────

function ConfigPanel({ config, setConfig, projects, setProjects }) {
  const [localConfig, setLocalConfig] = useState({ ...config });
  const [newUser, setNewUser] = useState({ name: "", role: "viewer" });
  const [newProject, setNewProject] = useState({ name: "", color: "#6366F1" });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addUser = () => {
    if (!newUser.name.trim()) return;
    setLocalConfig(c => ({
      ...c,
      users: [...c.users, { id: Date.now(), ...newUser }],
    }));
    setNewUser({ name: "", role: "viewer" });
  };

  const removeUser = id => {
    setLocalConfig(c => ({ ...c, users: c.users.filter(u => u.id !== id) }));
  };

  const addProject = () => {
    if (!newProject.name.trim()) return;
    const proj = {
      id: Date.now(),
      name: newProject.name,
      color: newProject.color,
      stages: STAGES.map(s => ({
        stage: s, done: false, blocker: "",
        responsible: localConfig.users[0]?.name || "Sin asignar",
        daysInStage: 0, expectedDays: 5,
      })),
    };
    setProjects(ps => [...ps, proj]);
    setNewProject({ name: "", color: "#6366F1" });
  };

  const removeProject = id => setProjects(ps => ps.filter(p => p.id !== id));

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 8px" }}>
      <Section title="Semáforo de alertas" icon="🚦">
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>
          Configura cuántos días en una etapa con estopeante activa cada nivel de alerta.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <LightConfigRow
            color="#F59E0B"
            label="Alerta Amarilla"
            desc="días para activar"
            value={localConfig.yellowDays}
            onChange={v => setLocalConfig(c => ({ ...c, yellowDays: v }))}
          />
          <LightConfigRow
            color="#EF4444"
            label="Alerta Roja"
            desc="días para activar"
            value={localConfig.redDays}
            onChange={v => setLocalConfig(c => ({ ...c, redDays: v }))}
          />
        </div>
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8, fontWeight: 600 }}>Vista previa del semáforo:</div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { light: "green", text: "Completado" },
              { light: "neutral", text: "Sin estopeante" },
              { light: "yellow", text: `≥ ${localConfig.yellowDays}d con estopeante` },
              { light: "red", text: `≥ ${localConfig.redDays}d con estopeante` },
            ].map(({ light, text }) => (
              <div key={light} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrafficDot light={light} />
                <span style={{ fontSize: 11, color: "#475569" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Usuarios" icon="👥">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {localConfig.users.map(u => (
            <div key={u.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 14px", background: "#F8FAFC",
              border: "1px solid #E2E8F0", borderRadius: 9,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#6366F120", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#6366F1", flexShrink: 0,
              }}>
                {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{u.name}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "capitalize" }}>{u.role}</div>
              </div>
              <button onClick={() => removeUser(u.id)} style={{
                background: "#FEF2F2", color: "#EF4444", border: "none",
                borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 11, fontWeight: 600,
              }}>Eliminar</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Nombre completo"
            value={newUser.name}
            onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
            style={{ ...inputStyle, flex: 1 }}
          />
          <select value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))} style={{ ...inputStyle, width: 110 }}>
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button onClick={addUser} style={addBtnStyle}>+ Agregar</button>
        </div>
      </Section>

      <Section title="Proyectos" icon="📁">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {projects.map(p => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 14px", background: "#F8FAFC",
              border: "1px solid #E2E8F0", borderRadius: 9,
            }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: p.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>
                {p.stages.filter(s => s.done).length}/{STAGES.length} etapas
              </div>
              <button onClick={() => removeProject(p.id)} style={{
                background: "#FEF2F2", color: "#EF4444", border: "none",
                borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 11, fontWeight: 600,
              }}>Eliminar</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Nombre del proyecto"
            value={newProject.name}
            onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
            style={{ ...inputStyle, flex: 1 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#64748B", whiteSpace: "nowrap" }}>Color:</span>
            <input type="color" value={newProject.color}
              onChange={e => setNewProject(p => ({ ...p, color: e.target.value }))}
              style={{ width: 36, height: 34, padding: 2, border: "1.5px solid #E2E8F0", borderRadius: 8, cursor: "pointer" }}
            />
          </div>
          <button onClick={addProject} style={addBtnStyle}>+ Agregar</button>
        </div>
      </Section>

      <div style={{ textAlign: "right", marginTop: 8 }}>
        <button onClick={save} style={{
          background: "#0F172A", color: "white",
          border: "none", borderRadius: 10,
          padding: "11px 28px", fontWeight: 700, fontSize: 14,
          cursor: "pointer", letterSpacing: "0.02em",
          transition: "opacity 0.15s",
        }}>
          {saved ? "✓ Guardado" : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{
      background: "white", borderRadius: 14,
      border: "1.5px solid #E2E8F0",
      padding: "22px 22px 20px",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function LightConfigRow({ color, label, desc, value, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px", border: `1.5px solid ${color}44`,
      borderRadius: 10, background: color + "08",
    }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, boxShadow: `0 0 0 3px ${color}33`, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#94A3B8" }}>{desc}</div>
      </div>
      <input
        type="number" min={1} max={30} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{
          width: 52, padding: "6px 8px", textAlign: "center",
          border: `1.5px solid ${color}66`, borderRadius: 8,
          fontWeight: 700, fontSize: 15, color: color,
          background: "white", fontFamily: "inherit", outline: "none",
        }}
      />
      <span style={{ fontSize: 11, color: "#94A3B8" }}>días</span>
    </div>
  );
}

const addBtnStyle = {
  padding: "8px 14px", background: "#0F172A", color: "white",
  border: "none", borderRadius: 8, fontWeight: 600, fontSize: 12,
  cursor: "pointer", whiteSpace: "nowrap",
};

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [modal, setModal] = useState(null); // { projectId, stageIdx }

  const openModal = (projectId, stageIdx) => setModal({ projectId, stageIdx });
  const closeModal = () => setModal(null);

  const saveStage = (projectId, stageIdx, data) => {
    setProjects(ps => ps.map(p => {
      if (p.id !== projectId) return p;
      const stages = [...p.stages];
      stages[stageIdx] = data;
      return { ...p, stages };
    }));
    closeModal();
  };

  const modalProject = modal ? projects.find(p => p.id === modal.projectId) : null;

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "#F1F5F9",
      minHeight: "100vh",
    }}>
      {/* Top bar */}
      <div style={{
        background: "#0F172A",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 0,
        height: 52,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13,
          }}>⚡</div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 14, letterSpacing: "0.01em" }}>
            Dev Tracker
          </span>
          <span style={{
            background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)",
            fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5,
            letterSpacing: "0.06em",
          }}>BETA</span>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "dashboard", label: "📊 Panel", },
            { id: "config", label: "⚙️ Configuración" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "6px 14px", border: "none", borderRadius: 8,
              background: tab === t.id ? "rgba(255,255,255,0.15)" : "transparent",
              color: tab === t.id ? "white" : "rgba(255,255,255,0.5)",
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: 12, cursor: "pointer",
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 20px 40px" }}>
        {tab === "dashboard" && (
          <>
            {/* Summary bar */}
            <div style={{
              display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap",
            }}>
              {[
                { label: "Proyectos activos", value: projects.length, color: "#6366F1" },
                { label: "Etapas completadas", value: projects.reduce((a, p) => a + p.stages.filter(s => s.done).length, 0), color: "#22C55E" },
                { label: "Estopeantes críticos", value: projects.reduce((a, p) => a + p.stages.filter(s => !s.done && s.blocker && s.daysInStage >= config.redDays).length, 0), color: "#EF4444" },
                { label: "En atención", value: projects.reduce((a, p) => a + p.stages.filter(s => !s.done && s.blocker && s.daysInStage >= config.yellowDays && s.daysInStage < config.redDays).length, 0), color: "#F59E0B" },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: "white", borderRadius: 10, padding: "12px 18px",
                  border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, maxWidth: 80, lineHeight: 1.3 }}>{stat.label}</div>
                </div>
              ))}

              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
                {[
                  { light: "green", text: "Completo" },
                  { light: "neutral", text: "Sin estopeante" },
                  { light: "yellow", text: `≥${config.yellowDays}d atención` },
                  { light: "red", text: `≥${config.redDays}d crítico` },
                ].map(({ light, text }) => (
                  <div key={light} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <TrafficDot light={light} />
                    <span style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Columns */}
            <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16, alignItems: "flex-start" }}>
              {projects.map(project => (
                <ProjectColumn
                  key={project.id}
                  project={project}
                  config={config}
                  onStageClick={openModal}
                />
              ))}
            </div>
          </>
        )}

        {tab === "config" && (
          <ConfigPanel
            config={config}
            setConfig={setConfig}
            projects={projects}
            setProjects={setProjects}
          />
        )}
      </div>

      {/* Modal */}
      {modal && modalProject && (
        <EditModal
          project={modalProject}
          stageIdx={modal.stageIdx}
          config={config}
          allUsers={config.users}
          onSave={(data) => saveStage(modal.projectId, modal.stageIdx, data)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
