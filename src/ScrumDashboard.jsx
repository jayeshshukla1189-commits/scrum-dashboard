import { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const TEAM = [
  { id: "JS", name: "Jayesh S.", role: "Project Lead", color: "#3B82F6" },
  { id: "MR", name: "Maria R.", role: "SW Engineer", color: "#10B981" },
  { id: "KP", name: "Kai P.", role: "HW Engineer", color: "#F59E0B" },
  { id: "AN", name: "Anya N.", role: "Test Engineer", color: "#8B5CF6" },
  { id: "DM", name: "Dmitri M.", role: "AUTOSAR Dev", color: "#EF4444" },
];

const PRIORITY = {
  Critical: { color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  High:     { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  Medium:   { color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  Low:      { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
};

const TYPE = {
  "🐛 Bug": "#EF4444",
  "✨ Feature": "#3B82F6",
  "🔧 Task": "#8B5CF6",
  "📋 Story": "#10B981",
  "⚠️ Risk": "#F59E0B",
};

const INIT_TICKETS = [
  { id: "ADAS-101", type: "📋 Story", title: "LiDAR ECU boot sequence validation", col: "done", priority: "High", points: 8, assignee: "MR", epic: "LiDAR Integration", tags: ["AUTOSAR","ECU"] },
  { id: "ADAS-102", type: "🔧 Task", title: "CAN bus timing analysis – sensor fusion module", col: "done", priority: "Critical", points: 5, assignee: "KP", epic: "CAN/Ethernet", tags: ["CAN","Timing"] },
  { id: "ADAS-103", type: "✨ Feature", title: "AUTOSAR BSW configuration for RTE layer", col: "done", priority: "High", points: 13, assignee: "DM", epic: "AUTOSAR Stack", tags: ["AUTOSAR","BSW"] },
  { id: "ADAS-104", type: "🐛 Bug", title: "DCM response timeout under stress load", col: "review", priority: "Critical", points: 5, assignee: "AN", epic: "Diagnostics", tags: ["DCM","UDS"] },
  { id: "ADAS-105", type: "🔧 Task", title: "OEM milestone report – Sprint 7 KPIs", col: "review", priority: "Medium", points: 3, assignee: "JS", epic: "Program Mgmt", tags: ["Reporting","OEM"] },
  { id: "ADAS-106", type: "📋 Story", title: "Interior camera ECU – SWC integration test", col: "inprogress", priority: "High", points: 8, assignee: "MR", epic: "Camera Integration", tags: ["SWC","Testing"] },
  { id: "ADAS-107", type: "✨ Feature", title: "Ethernet switch config – 100BASE-T1 automotive", col: "inprogress", priority: "High", points: 8, assignee: "KP", epic: "CAN/Ethernet", tags: ["Ethernet","Network"] },
  { id: "ADAS-108", type: "⚠️ Risk", title: "Supplier delay risk – sensor module delivery", col: "inprogress", priority: "Critical", points: 2, assignee: "JS", epic: "Program Mgmt", tags: ["Risk","Supplier"] },
  { id: "ADAS-109", type: "🔧 Task", title: "ISO 26262 ASIL-B safety analysis review", col: "todo", priority: "Critical", points: 5, assignee: "AN", epic: "Functional Safety", tags: ["ISO26262","ASIL"] },
  { id: "ADAS-110", type: "📋 Story", title: "ASPICE Level 2 process compliance audit", col: "todo", priority: "High", points: 5, assignee: "JS", epic: "Program Mgmt", tags: ["ASPICE","Audit"] },
  { id: "ADAS-111", type: "🐛 Bug", title: "UDS DTC freeze frame data corruption", col: "todo", priority: "High", points: 3, assignee: "DM", epic: "Diagnostics", tags: ["UDS","DEM"] },
  { id: "ADAS-112", type: "✨ Feature", title: "CI pipeline – nightly ECU build & flash", col: "backlog", priority: "Medium", points: 8, assignee: "MR", epic: "DevOps", tags: ["CI/CD","Jenkins"] },
  { id: "ADAS-113", type: "🔧 Task", title: "CANoe test script – radar object detection", col: "backlog", priority: "Medium", points: 5, assignee: "AN", epic: "LiDAR Integration", tags: ["CANoe","Test"] },
  { id: "ADAS-114", type: "📋 Story", title: "BMW OEM gateway review – Q3 milestone", col: "backlog", priority: "High", points: 3, assignee: "JS", epic: "Program Mgmt", tags: ["OEM","BMW"] },
  { id: "ADAS-115", type: "⚠️ Risk", title: "ROM budget exceeded – BSW modules", col: "backlog", priority: "Medium", points: 2, assignee: "DM", epic: "AUTOSAR Stack", tags: ["Risk","Memory"] },
];

const COLS = [
  { id: "backlog",    label: "Backlog",     icon: "📦", color: "#475569" },
  { id: "todo",       label: "To Do",       icon: "📋", color: "#6366F1" },
  { id: "inprogress", label: "In Progress", icon: "⚡", color: "#F59E0B" },
  { id: "review",     label: "In Review",   icon: "🔍", color: "#8B5CF6" },
  { id: "done",       label: "Done",        icon: "✅", color: "#10B981" },
];

const BURNDOWN = [
  { day: "D1", remaining: 84, ideal: 84 },
  { day: "D2", remaining: 79, ideal: 75 },
  { day: "D3", remaining: 72, ideal: 67 },
  { day: "D4", remaining: 68, ideal: 58 },
  { day: "D5", remaining: 60, ideal: 50 },
  { day: "D6", remaining: 51, ideal: 42 },
  { day: "D7", remaining: 45, ideal: 33 },
  { day: "D8", remaining: 38, ideal: 25 },
  { day: "D9", remaining: 28, ideal: 17 },
  { day: "D10",remaining: 21, ideal: 8  },
];

const VELOCITY = [
  { sprint: "S4", pts: 48 }, { sprint: "S5", pts: 55 }, { sprint: "S6", pts: 51 },
  { sprint: "S7", pts: 62 }, { sprint: "S8", pts: 58 }, { sprint: "S8 (curr)", pts: 34 },
];

export default function ScrumBoard() {
  const [tickets, setTickets] = useState(INIT_TICKETS);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("board"); // board | metrics
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [filterAssignee, setFilterAssignee] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ type: "🔧 Task", title: "", priority: "Medium", assignee: "JS", points: 3, epic: "", tags: "" });

  const move = (id, col) => { setTickets(t => t.map(x => x.id === id ? { ...x, col } : x)); setSelected(null); };

  const addTicket = () => {
    if (!newTicket.title) return;
    const id = "ADAS-" + (116 + tickets.filter(t=>t.id.startsWith("ADAS-1")).length);
    setTickets(t => [...t, { ...newTicket, id, col: "backlog", tags: newTicket.tags.split(",").map(s=>s.trim()).filter(Boolean) }]);
    setShowAddTicket(false);
    setNewTicket({ type: "🔧 Task", title: "", priority: "Medium", assignee: "JS", points: 3, epic: "", tags: "" });
  };

  const visible = tickets.filter(t =>
    (filterAssignee === "All" || t.assignee === filterAssignee) &&
    (filterPriority === "All" || t.priority === filterPriority)
  );

  const totalPts = tickets.reduce((a,t) => a + t.points, 0);
  const donePts  = tickets.filter(t=>t.col==="done").reduce((a,t) => a + t.points, 0);
  const prog = Math.round((donePts / totalPts) * 100);

  const sel = selected ? tickets.find(t => t.id === selected) : null;

  return (
    <div style={{ minHeight:"100vh", background:"#080C14", fontFamily:"'Sora',system-ui,sans-serif", color:"#E2E8F0", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:#0F1623; }
        ::-webkit-scrollbar-thumb { background:#334155; border-radius:4px; }
        .ticket-card { transition: transform 0.15s, box-shadow 0.15s; cursor:pointer; }
        .ticket-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.4) !important; }
        .col-drop { transition: background 0.15s; }
        .col-drop.over { background: rgba(59,130,246,0.08) !important; border-color: rgba(59,130,246,0.4) !important; }
        .nav-btn { transition: all 0.2s; }
        .nav-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .tag { display:inline-block; background:rgba(255,255,255,0.06); color:#94A3B8; border:1px solid rgba(255,255,255,0.08); border-radius:4px; padding:1px 6px; font-size:10px; font-family:'JetBrains Mono'; margin:2px 2px 0 0; }
      `}</style>

      {/* TOP NAV */}
      <div style={{ background:"rgba(255,255,255,0.02)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"0 24px", display:"flex", alignItems:"center", height:"54px", gap:"24px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#3B82F6,#6366F1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🚗</div>
          <div>
            <div style={{ fontSize:"13px", fontWeight:"700", letterSpacing:"-0.02em", color:"#F1F5F9" }}>ADAS-ECU Platform</div>
            <div style={{ fontSize:"10px", color:"#475569", fontFamily:"'JetBrains Mono'" }}>BMW LiDAR · Sprint 8</div>
          </div>
        </div>
        <div style={{ flex:1 }}/>
        {["board","metrics"].map(v => (
          <button key={v} onClick={()=>setView(v)} className="nav-btn" style={{ background: view===v ? "rgba(59,130,246,0.15)" : "transparent", border: view===v ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent", color: view===v ? "#60A5FA" : "#64748B", padding:"6px 14px", borderRadius:"8px", fontSize:"12px", fontWeight:"600", cursor:"pointer", fontFamily:"'Sora'", textTransform:"capitalize" }}>{v === "board" ? "🗂 Sprint Board" : "📊 Metrics"}</button>
        ))}
        <button onClick={()=>setShowAddTicket(true)} style={{ background:"linear-gradient(135deg,#3B82F6,#6366F1)", color:"#fff", border:"none", borderRadius:"8px", padding:"7px 14px", fontSize:"12px", fontWeight:"700", cursor:"pointer", fontFamily:"'Sora'", boxShadow:"0 4px 12px rgba(99,102,241,0.4)" }}>+ New Ticket</button>
      </div>

      {/* SPRINT HEADER */}
      <div style={{ padding:"14px 24px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:"24px", background:"rgba(255,255,255,0.01)" }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
            <span style={{ fontSize:"13px", fontWeight:"700", color:"#F1F5F9" }}>Sprint 8 · Weeks 3–4 of 4</span>
            <span style={{ background:"rgba(16,185,129,0.15)", color:"#34D399", border:"1px solid rgba(16,185,129,0.3)", padding:"2px 8px", borderRadius:"20px", fontSize:"10px", fontWeight:"700" }}>ACTIVE</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ flex:1, height:"6px", background:"rgba(255,255,255,0.08)", borderRadius:"3px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${prog}%`, background:"linear-gradient(90deg,#3B82F6,#10B981)", borderRadius:"3px", transition:"width 0.5s" }}/>
            </div>
            <span style={{ fontSize:"11px", fontFamily:"'JetBrains Mono'", color:"#64748B" }}>{donePts}/{totalPts} pts · {prog}%</span>
          </div>
        </div>
        {/* Team avatars */}
        <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
          <span style={{ fontSize:"10px", color:"#475569", marginRight:"4px" }}>TEAM</span>
          {TEAM.map(m => (
            <div key={m.id} onClick={()=>setFilterAssignee(filterAssignee===m.id?"All":m.id)}
              title={m.name} style={{ width:"28px", height:"28px", borderRadius:"50%", background:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"700", color:"#fff", cursor:"pointer", border: filterAssignee===m.id ? `2px solid white` : "2px solid transparent", opacity: filterAssignee!=="All" && filterAssignee!==m.id ? 0.4 : 1, transition:"all 0.2s" }}>
              {m.id}
            </div>
          ))}
          {filterAssignee !== "All" && <button onClick={()=>setFilterAssignee("All")} style={{ fontSize:"10px", color:"#64748B", background:"none", border:"none", cursor:"pointer", padding:"0 4px" }}>✕</button>}
        </div>
        {/* Priority filter */}
        <select value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#94A3B8", borderRadius:"8px", padding:"5px 10px", fontSize:"12px", fontFamily:"'Sora'", outline:"none" }}>
          <option value="All">All Priorities</option>
          {Object.keys(PRIORITY).map(p=><option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {view === "board" ? (
        /* ── BOARD VIEW ── */
        <div style={{ flex:1, display:"flex", gap:"0", overflow:"hidden", padding:"16px 16px 0" }}>
          {COLS.map(col => {
            const colTickets = visible.filter(t=>t.col===col.id);
            const colPts = colTickets.reduce((a,t)=>a+t.points,0);
            return (
              <div key={col.id} className="col-drop" onDragOver={e=>{e.preventDefault();setDragOver(col.id);}} onDrop={e=>{e.preventDefault();if(dragging)move(dragging,col.id);setDragging(null);setDragOver(null);}} onDragLeave={()=>setDragOver(null)}
                style={{ flex:1, minWidth:"180px", background: dragOver===col.id ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)", border:`1px solid ${dragOver===col.id?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.06)"}`, borderRadius:"12px", margin:"0 5px", display:"flex", flexDirection:"column", overflow:"hidden", maxHeight:"calc(100vh - 180px)" }}>
                {/* Col Header */}
                <div style={{ padding:"12px 14px 10px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:col.color }}/>
                      <span style={{ fontSize:"11px", fontWeight:"700", color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.08em" }}>{col.label}</span>
                    </div>
                    <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
                      <span style={{ background:"rgba(255,255,255,0.08)", color:"#64748B", borderRadius:"20px", padding:"1px 7px", fontSize:"10px", fontFamily:"'JetBrains Mono'" }}>{colTickets.length}</span>
                      <span style={{ color:col.color, fontSize:"10px", fontFamily:"'JetBrains Mono'" }}>{colPts}pt</span>
                    </div>
                  </div>
                </div>
                {/* Tickets */}
                <div style={{ flex:1, overflowY:"auto", padding:"10px 10px" }}>
                  {colTickets.map(t => {
                    const pr = PRIORITY[t.priority];
                    const member = TEAM.find(m=>m.id===t.assignee);
                    return (
                      <div key={t.id} className="ticket-card" draggable
                        onDragStart={()=>setDragging(t.id)} onDragEnd={()=>{setDragging(null);setDragOver(null);}}
                        onClick={()=>setSelected(t.id===selected?null:t.id)}
                        style={{ background: selected===t.id ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.04)", border:`1px solid ${selected===t.id?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.07)"}`, borderRadius:"10px", padding:"11px 12px", marginBottom:"8px", boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                          <span style={{ fontSize:"9px", fontFamily:"'JetBrains Mono'", color:"#475569" }}>{t.id}</span>
                          <span style={{ fontSize:"9px", background:pr.bg, color:pr.color, padding:"1px 6px", borderRadius:"4px", fontWeight:"700", border:`1px solid ${pr.border}`, whiteSpace:"nowrap" }}>{t.priority}</span>
                        </div>
                        <div style={{ fontSize:"12px", fontWeight:"600", color:"#E2E8F0", lineHeight:"1.45", marginBottom:"8px" }}>{t.title}</div>
                        <div style={{ display:"flex", flexWrap:"wrap" }}>
                          {t.tags.slice(0,2).map(tag=><span key={tag} className="tag">{tag}</span>)}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"8px" }}>
                          <span style={{ fontSize:"10px", color:TYPE[t.type]||"#64748B" }}>{t.type}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                            <span style={{ fontSize:"10px", fontFamily:"'JetBrains Mono'", color:"#475569" }}>{t.points}pt</span>
                            <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:member?.color||"#475569", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8px", fontWeight:"700", color:"#fff" }}>{t.assignee}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── METRICS VIEW ── */
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
          {/* Sprint Progress */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"20px", gridColumn:"1/-1" }}>
            <div style={{ display:"flex", gap:"24px", justifyContent:"space-around", flexWrap:"wrap" }}>
              {[["Total Points", totalPts, "#64748B"], ["Completed", donePts, "#10B981"], ["Remaining", totalPts-donePts, "#F59E0B"], ["In Progress", tickets.filter(t=>t.col==="inprogress").reduce((a,t)=>a+t.points,0), "#3B82F6"], ["Tickets Done", tickets.filter(t=>t.col==="done").length + "/" + tickets.length, "#8B5CF6"]].map(([label, val, color]) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"28px", fontWeight:"800", color, letterSpacing:"-0.04em", fontFamily:"'Sora'" }}>{val}</div>
                  <div style={{ fontSize:"11px", color:"#475569", marginTop:"2px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Burndown */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"20px" }}>
            <div style={{ fontSize:"13px", fontWeight:"700", color:"#94A3B8", marginBottom:"14px", textTransform:"uppercase", letterSpacing:"0.06em" }}>📉 Sprint Burndown</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={BURNDOWN}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="day" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#1E293B",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",color:"#E2E8F0",fontSize:12}}/>
                <Line type="monotone" dataKey="ideal" stroke="#334155" strokeDasharray="5 5" dot={false} strokeWidth={1.5} name="Ideal"/>
                <Line type="monotone" dataKey="remaining" stroke="#3B82F6" dot={{fill:"#3B82F6",r:3}} strokeWidth={2.5} name="Actual"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Velocity */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"20px" }}>
            <div style={{ fontSize:"13px", fontWeight:"700", color:"#94A3B8", marginBottom:"14px", textTransform:"uppercase", letterSpacing:"0.06em" }}>⚡ Team Velocity</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={VELOCITY} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="sprint" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#1E293B",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",color:"#E2E8F0",fontSize:12}}/>
                <Bar dataKey="pts" fill="#3B82F6" radius={[6,6,0,0]} name="Story Points"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Team Load */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"20px" }}>
            <div style={{ fontSize:"13px", fontWeight:"700", color:"#94A3B8", marginBottom:"14px", textTransform:"uppercase", letterSpacing:"0.06em" }}>👥 Team Workload</div>
            {TEAM.map(m => {
              const assigned = tickets.filter(t=>t.assignee===m.id && t.col!=="done");
              const pts = assigned.reduce((a,t)=>a+t.points,0);
              const maxPts = 21;
              return (
                <div key={m.id} style={{ marginBottom:"12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:"700", color:"#fff" }}>{m.id}</div>
                      <span style={{ fontSize:"12px", color:"#CBD5E1" }}>{m.name}</span>
                    </div>
                    <span style={{ fontSize:"11px", fontFamily:"'JetBrains Mono'", color:"#64748B" }}>{pts}pt · {assigned.length} tickets</span>
                  </div>
                  <div style={{ height:"5px", background:"rgba(255,255,255,0.07)", borderRadius:"3px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${Math.min((pts/maxPts)*100,100)}%`, background:m.color, borderRadius:"3px" }}/>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Priority breakdown */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"20px" }}>
            <div style={{ fontSize:"13px", fontWeight:"700", color:"#94A3B8", marginBottom:"14px", textTransform:"uppercase", letterSpacing:"0.06em" }}>🚦 Priority Breakdown</div>
            {Object.keys(PRIORITY).map(p => {
              const count = tickets.filter(t=>t.priority===p).length;
              const pr = PRIORITY[p];
              return (
                <div key={p} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                  <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:pr.color, flexShrink:0 }}/>
                  <span style={{ fontSize:"12px", color:"#CBD5E1", flex:1 }}>{p}</span>
                  <div style={{ width:"80px", height:"5px", background:"rgba(255,255,255,0.07)", borderRadius:"3px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(count/tickets.length)*100}%`, background:pr.color, borderRadius:"3px" }}/>
                  </div>
                  <span style={{ fontSize:"11px", fontFamily:"'JetBrains Mono'", color:"#475569", width:"16px", textAlign:"right" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TICKET DETAIL DRAWER */}
      {sel && (
        <div style={{ position:"fixed", right:0, top:0, bottom:0, width:"340px", background:"#0F1623", borderLeft:"1px solid rgba(255,255,255,0.08)", padding:"24px", overflowY:"auto", zIndex:50, boxShadow:"-12px 0 40px rgba(0,0,0,0.4)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
            <span style={{ fontSize:"11px", fontFamily:"'JetBrains Mono'", color:"#475569" }}>{sel.id}</span>
            <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", color:"#64748B", fontSize:"18px", cursor:"pointer" }}>✕</button>
          </div>
          <div style={{ fontSize:"16px", fontWeight:"700", color:"#F1F5F9", lineHeight:"1.4", marginBottom:"16px" }}>{sel.title}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
            {[["Epic", sel.epic], ["Type", sel.type], ["Points", sel.points + " pts"], ["Priority", sel.priority]].map(([k,v])=>(
              <div key={k} style={{ background:"rgba(255,255,255,0.04)", borderRadius:"8px", padding:"10px" }}>
                <div style={{ fontSize:"10px", color:"#475569", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>{k}</div>
                <div style={{ fontSize:"12px", fontWeight:"600", color:"#CBD5E1" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:"16px" }}>
            <div style={{ fontSize:"11px", color:"#475569", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"8px" }}>Move to</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {COLS.map(c=>(
                <button key={c.id} onClick={()=>move(sel.id,c.id)}
                  style={{ background: sel.col===c.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", border:`1px solid ${sel.col===c.id?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.1)"}`, color: sel.col===c.id?"#60A5FA":"#94A3B8", padding:"5px 10px", borderRadius:"8px", fontSize:"11px", fontWeight:"600", cursor:"pointer", fontFamily:"'Sora'" }}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:"11px", color:"#475569", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"8px" }}>Tags</div>
            <div>{sel.tags.map(tag=><span key={tag} className="tag">{tag}</span>)}</div>
          </div>
        </div>
      )}

      {/* ADD TICKET MODAL */}
      {showAddTicket && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
          <div style={{ background:"#131B2A", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"16px", padding:"28px", width:"420px", boxShadow:"0 25px 60px rgba(0,0,0,0.6)" }}>
            <h3 style={{ color:"#F1F5F9", fontSize:"16px", fontWeight:"700", margin:"0 0 20px", letterSpacing:"-0.02em" }}>+ New Ticket</h3>
            {[["Title *","title","text","Short description..."],["Epic","epic","text","e.g. LiDAR Integration"]].map(([l,k,t,p])=>(
              <div key={k} style={{ marginBottom:"12px" }}>
                <label style={{ fontSize:"11px", color:"#64748B", display:"block", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</label>
                <input type={t} value={newTicket[k]} onChange={e=>setNewTicket(n=>({...n,[k]:e.target.value}))} placeholder={p}
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"9px 12px", color:"#E2E8F0", fontSize:"13px", fontFamily:"'Sora'", outline:"none" }}/>
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"12px" }}>
              <div>
                <label style={{ fontSize:"11px", color:"#64748B", display:"block", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Type</label>
                <select value={newTicket.type} onChange={e=>setNewTicket(n=>({...n,type:e.target.value}))}
                  style={{ width:"100%", background:"#080C14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"9px 10px", color:"#E2E8F0", fontSize:"13px", fontFamily:"'Sora'", outline:"none" }}>
                  {Object.keys(TYPE).map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:"11px", color:"#64748B", display:"block", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Priority</label>
                <select value={newTicket.priority} onChange={e=>setNewTicket(n=>({...n,priority:e.target.value}))}
                  style={{ width:"100%", background:"#080C14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"9px 10px", color:"#E2E8F0", fontSize:"13px", fontFamily:"'Sora'", outline:"none" }}>
                  {Object.keys(PRIORITY).map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:"11px", color:"#64748B", display:"block", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Assignee</label>
                <select value={newTicket.assignee} onChange={e=>setNewTicket(n=>({...n,assignee:e.target.value}))}
                  style={{ width:"100%", background:"#080C14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"9px 10px", color:"#E2E8F0", fontSize:"13px", fontFamily:"'Sora'", outline:"none" }}>
                  {TEAM.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:"11px", color:"#64748B", display:"block", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Story Points</label>
                <select value={newTicket.points} onChange={e=>setNewTicket(n=>({...n,points:+e.target.value}))}
                  style={{ width:"100%", background:"#080C14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"9px 10px", color:"#E2E8F0", fontSize:"13px", fontFamily:"'Sora'", outline:"none" }}>
                  {[1,2,3,5,8,13,21].map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:"18px" }}>
              <label style={{ fontSize:"11px", color:"#64748B", display:"block", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Tags (comma separated)</label>
              <input value={newTicket.tags} onChange={e=>setNewTicket(n=>({...n,tags:e.target.value}))} placeholder="AUTOSAR, CAN, Safety…"
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"9px 12px", color:"#E2E8F0", fontSize:"13px", fontFamily:"'Sora'", outline:"none" }}/>
            </div>
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={addTicket} style={{ flex:1, background:"linear-gradient(135deg,#3B82F6,#6366F1)", color:"#fff", border:"none", borderRadius:"10px", padding:"11px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"'Sora'" }}>Create Ticket</button>
              <button onClick={()=>setShowAddTicket(false)} style={{ background:"rgba(255,255,255,0.06)", color:"#64748B", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"11px 18px", fontSize:"13px", cursor:"pointer", fontFamily:"'Sora'" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
