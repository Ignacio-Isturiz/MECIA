// src/pages/EmprendedorDashboard.jsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { llmService } from '@/services/llmService';
import { datasetsService } from '@/services/datasetsService';

import DashboardLayout, { Icons, TabBar } from '@/components/dashboard/DashboardLayout';
import ChatMap from '@/components/ChatMap';

const NAV = [
  { id:'inicio',      label:'Inicio',           icon:<Icons.Dashboard/> },
  { id:'emprendedor', label:'Abre Tu Negocio',  icon:<Icons.Rocket/> },
  { id:'insights',    label:'Inteligencia',     icon:<Icons.Chart/> },
  { id:'negocios',    label:'Negocios',         icon:<Icons.Store/> },
  { id:'cobertura',   label:'Cobertura EPM',    icon:<Icons.Bolt/> },
];

const SUGERENCIAS_EMP = [
  'Quiero montar una cafetería en Medellín',
  '¿Cuántas cafeterías hay en el Poblado?',
  'Negocio de ropa en Aranjuez, estratos 3 y 4',
  '¿Dónde abro una tienda con bajo presupuesto?',
];

/* ════════════════════════════════
   CHATBOT EMPRENDEDOR — solo chat
════════════════════════════════ */
function ChatEmprendedor({ conversationId, onConversationChange }) {
  const [messages, setMessages] = useState([{
    role:'bot',
    text:'¡Hola emprendedor! Soy tu asesor de negocios. Cuéntame tu idea y te ayudo a elegir la mejor zona en Medellín con datos reales.',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState(conversationId);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  // Cargar historial cuando cambia conversationId
  useEffect(() => {
    if (conversationId !== convId) {
      setConvId(conversationId);
      if (!conversationId) {
        setMessages([{
          role:'bot',
          text:'¡Hola emprendedor! Soy tu asesor de negocios. Cuéntame tu idea y te ayudo a elegir la mejor zona.',
        }]);
        return;
      }
      llmService.getConversation(conversationId)
        .then(res => { if(res.success && res.data.messages) setMessages(res.data.messages); })
        .catch(() => {});
    }
  }, [conversationId]);

  const enviar = async (texto) => {
    const prompt = texto.trim();
    if (!prompt || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role:'user', text:prompt }]);
    setLoading(true);
    try {
      const res = await llmService.entrepreneurChat({ prompt, conversation_id:convId });
      const data = res?.data;
      if(data?.conversation_id && data.conversation_id !== convId) {
        setConvId(data.conversation_id);
        onConversationChange?.(data.conversation_id);
      }
      setMessages(prev => [...prev, {
        role:'bot',
        text: data?.output || 'No pude procesar tu consulta. Describe mejor tu idea.',
        recomendaciones: data?.recomendaciones_especificas || [],
        costos: data?.prediccion_costo_mensual || {},
        mapData: data?.map_data,
      }]);
    } catch {
      setMessages(prev => [...prev, { role:'bot', text:'Error al procesar. Intenta de nuevo.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="db-chat-wrap">
      <div className="db-chat-messages">
        {messages.map((msg,i) => (
          <div key={i} className={`db-msg ${msg.role}`}>
            <div className="db-msg-bubble">
              {msg.text}
              {msg.role==='bot' && msg.costos?.total_servicios && (
                <div className="db-chat-costs">
                  <div style={{fontWeight:600,marginBottom:6,fontSize:11.5,color:'var(--text-mid)',textTransform:'uppercase',letterSpacing:'.05em'}}>
                    Costos mensuales estimados
                  </div>
                  {msg.costos.energia_estimada && (
                    <div className="db-chat-costs-row"><span>Energía</span><span>${msg.costos.energia_estimada.toLocaleString('es-CO')}</span></div>
                  )}
                  {msg.costos.agua_estimada && (
                    <div className="db-chat-costs-row"><span>Agua</span><span>${msg.costos.agua_estimada.toLocaleString('es-CO')}</span></div>
                  )}
                  {msg.costos.gas_estimada && (
                    <div className="db-chat-costs-row"><span>Gas</span><span>${msg.costos.gas_estimada.toLocaleString('es-CO')}</span></div>
                  )}
                  <div className="db-chat-costs-total">
                    <span>Total mensual</span>
                    <span>${msg.costos.total_servicios.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              )}
              {msg.role==='bot' && msg.recomendaciones?.length > 0 && (
                <div className="db-chat-recs">
                  <div className="db-chat-recs-title">Recomendaciones</div>
                  <ul>{msg.recomendaciones.map((r,j) => <li key={j}>{r}</li>)}</ul>
                </div>
              )}
              {msg.role==='bot' && msg.mapData?.locations?.length > 0 && (
                <ChatMap locations={msg.mapData.locations}/>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="db-msg bot">
            <div className="db-chat-typing">
              <div className="db-typing-dot"/><div className="db-typing-dot"/><div className="db-typing-dot"/>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      {messages.length <= 1 && (
        <div className="db-chat-suggestions">
          {SUGERENCIAS_EMP.map((s,i) => (
            <button key={i} className="db-suggestion" onClick={() => enviar(s)} disabled={loading}>{s}</button>
          ))}
        </div>
      )}
      <div className="db-chat-input-area">
        <input
          className="db-chat-input" type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); enviar(input); }}}
          placeholder="Cuéntame tu idea de negocio..." disabled={loading}
        />
        <button className="db-chat-send" onClick={() => enviar(input)} disabled={loading||!input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   LISTA DE CONVERSACIONES (styled)
════════════════════════════════ */
function ConvList({ currentId, onSelect, onNew, onDelete }) {
  const [convs, setConvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    llmService.getConversations()
      .then(r => { if(r.success) setConvs(r.data||[]); })
      .catch(()=>{})
      .finally(() => setLoading(false));
  }, []);

  const del = async (e,id) => {
    e.stopPropagation();
    if(!confirm('¿Eliminar conversación?')) return;
    try { await llmService.deleteConversation(id); setConvs(p=>p.filter(c=>c.id!==id)); onDelete?.(id); } catch{}
  };

  return (
    <div className="db-convlist">
      <div className="db-convlist-header">
        <button className="db-new-chat-btn" onClick={onNew}>+ Nuevo Chat</button>
      </div>
      <div className="db-convlist-body">
        {loading ? (
          <div style={{fontSize:12,color:'var(--text-dim)',textAlign:'center',padding:'14px 0'}}>Cargando...</div>
        ) : convs.length===0 ? (
          <div style={{fontSize:12,color:'var(--text-dim)',textAlign:'center',padding:'14px 0'}}>Sin conversaciones previas</div>
        ) : convs.map(c=>(
          <div key={c.id} className={`db-conv-item${currentId===c.id?' active':''}`} onClick={()=>onSelect(c.id)}>
            <div style={{flex:1,minWidth:0}}>
              <div className="db-conv-title">{c.title||'Sin título'}</div>
              <div className="db-conv-date">{new Date(c.created_at).toLocaleDateString('es-CO',{month:'short',day:'numeric'})}</div>
            </div>
            <button className="db-conv-del" onClick={e=>del(e,c.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   INSIGHTS WIDGET (barras)
════════════════════════════════ */
function InsightsWidget() {
  const [years, setYears]               = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [limit, setLimit]               = useState(5);
  const [loading, setLoading]           = useState(true);
  const [summary, setSummary]           = useState(null);
  const [topActividades, setTopAct]     = useState([]);
  const [topComunas, setTopCom]         = useState([]);
  const [overview, setOverview]         = useState(null);

  useEffect(() => { datasetsService.getEmpresarialYears().then(r=>setYears(r?.data||[])).catch(()=>{}); }, []);

  useEffect(() => {
    const y = selectedYear==='' ? null : Number(selectedYear);
    setLoading(true);
    Promise.all([
      datasetsService.getEmprendedorOverview(y, limit),
      datasetsService.getEmpresarialSummary(y),
      datasetsService.getEmpresarialTopActividades(y, limit),
      datasetsService.getEmpresarialTopComunas(y, limit),
    ]).then(([ov,sum,act,com])=>{
      setOverview(ov?.data||null); setSummary(sum?.data||null);
      setTopAct(act?.data||[]); setTopCom(com?.data||[]);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, [selectedYear, limit]);

  const maxA = useMemo(()=>Math.max(...topActividades.map(i=>i.total_empresas||0),1),[topActividades]);
  const maxC = useMemo(()=>Math.max(...topComunas.map(i=>i.total_empresas||0),1),[topComunas]);

  if(loading) return <div style={{fontSize:13,color:'var(--text-dim)'}}>Cargando datos empresariales...</div>;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {/* Controles */}
      <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <select className="db-news-select" value={selectedYear} onChange={e=>setSelectedYear(e.target.value)}>
          <option value="">Todos los años</option>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--text-mid)'}}>
          <span>Top</span>
          <input type="range" min="3" max="10" value={limit} onChange={e=>setLimit(Number(e.target.value))} style={{accentColor:'var(--accent)',width:80}}/>
          <b style={{color:'var(--text-h)'}}>{limit}</b>
        </div>
      </div>

      {/* Stats */}
      {summary && (
        <div className="db-insights-stats" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          {[
            {label:'Total empresas',    value:`${(summary.total_empresas/1000).toFixed(1)}k`},
            {label:'Actividades',       value:summary.total_actividades},
            {label:'Comuna top empr.',  value:summary.comuna_top?.nombre||'N/A', small:true},
            {label:'+ criminalidad',    value:overview?.criminalidad?.comuna_mas_afectada||'N/A', small:true, cls:'red'},
          ].map((s,i)=>(
            <div key={i} className="db-insights-stat">
              <div className="db-insights-stat-label">{s.label}</div>
              <div className={`db-insights-stat-value${s.cls?' '+s.cls:''}`} style={s.small?{fontSize:13,marginTop:2}:{}}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actividades */}
      <div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:10}}>
          Top Actividades Económicas
        </div>
        {topActividades.map((item,i)=>{
          const w = Math.max(8,Math.round(((item.total_empresas||0)/maxA)*100));
          return (
            <div key={i} className="db-bar-item">
              <div className="db-bar-row">
                <span style={{maxWidth:260,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.descripcion}</span>
                <b>{(item.total_empresas||0).toLocaleString('es-CO')}</b>
              </div>
              <div className="db-bar-track"><div className="db-bar-fill" style={{width:`${w}%`}}/></div>
              <div className="db-bar-sub">CIIU {item.ciiu} · {item.top_comuna}</div>
            </div>
          );
        })}
      </div>

      {/* Comunas */}
      <div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:10}}>
          Top Comunas por Empresas
        </div>
        {topComunas.map((item,i)=>{
          const w = Math.max(8,Math.round(((item.total_empresas||0)/maxC)*100));
          return (
            <div key={i} className="db-bar-item">
              <div className="db-bar-row">
                <span>{item.comuna}</span>
                <b>{(item.total_empresas||0).toLocaleString('es-CO')}</b>
              </div>
              <div className="db-bar-track">
                <div className="db-bar-fill" style={{width:`${w}%`,background:'linear-gradient(90deg,#239677,#00C896)'}}/></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   NEGOCIOS CERCANOS (barras)
════════════════════════════════ */
function NegociosWidget() {
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState({comuna:'',categoria:'',fecha_recoleccion:''});
  const [available, setAvailable]   = useState({comunas:[],categorias:[],fechas_recoleccion:[]});
  const [summary, setSummary]       = useState(null);
  const [topBarrios, setTopBarrios] = useState([]);
  const [topTipos, setTopTipos]     = useState([]);

  useEffect(() => {
    datasetsService.getNegociosMedellinFilters().then(r=>{
      const d=r?.data||{};
      setAvailable({comunas:d.comunas||[],categorias:d.categorias||[],fechas_recoleccion:d.fechas_recoleccion||[]});
      setFilters(p=>({...p,fecha_recoleccion:d.fechas_recoleccion?.[0]||''}));
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  useEffect(() => {
    if(loading) return;
    const q={comuna:filters.comuna||null,categoria:filters.categoria||null,fecha_recoleccion:filters.fecha_recoleccion||null};
    Promise.all([
      datasetsService.getNegociosMedellinSummary(q),
      datasetsService.getNegociosMedellinTopBarrios({...q,limit:6}),
      datasetsService.getNegociosMedellinTopTipos({...q,limit:6}),
    ]).then(([s,b,t])=>{
      setSummary(s?.data||null);
      setTopBarrios(b?.data||[]);
      setTopTipos(t?.data||[]);
    }).catch(()=>{});
  }, [loading, filters]);

  const maxB = useMemo(()=>Math.max(...topBarrios.map(i=>i.total_cantidad||0),1),[topBarrios]);
  const maxT = useMemo(()=>Math.max(...topTipos.map(i=>i.total_cantidad||0),1),[topTipos]);
  const setF = (key,val) => setFilters(p=>({...p,[key]:val}));

  if(loading) return <div style={{fontSize:13,color:'var(--text-dim)'}}>Cargando negocios...</div>;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {/* Filtros */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <select className="db-news-select" value={filters.comuna} onChange={e=>setF('comuna',e.target.value)}>
          <option value="">Todas las comunas</option>
          {available.comunas.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        <select className="db-news-select" value={filters.categoria} onChange={e=>setF('categoria',e.target.value)}>
          <option value="">Todas las categorías</option>
          {available.categorias.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        {available.fechas_recoleccion.length>0 && (
          <select className="db-news-select" value={filters.fecha_recoleccion} onChange={e=>setF('fecha_recoleccion',e.target.value)}>
            {available.fechas_recoleccion.map(f=><option key={f} value={f}>{f}</option>)}
          </select>
        )}
      </div>

      {/* Stats */}
      {summary && (
        <div className="db-insights-stats" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          {[
            {label:'Registros',    value:(summary.total_registros||0).toLocaleString('es-CO')},
            {label:'Cantidad',     value:(summary.total_cantidad||0).toLocaleString('es-CO')},
            {label:'Barrios únicos',value:summary.barrios_unicos||0},
            {label:'Tipos',        value:summary.tipos_unicos||0},
          ].map((s,i)=>(
            <div key={i} className="db-insights-stat">
              <div className="db-insights-stat-label">{s.label}</div>
              <div className="db-insights-stat-value">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Barras */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:10}}>
            Top Barrios
          </div>
          {topBarrios.map((item,i)=>{
            const w=Math.max(8,Math.round(((item.total_cantidad||0)/maxB)*100));
            return (
              <div key={i} className="db-bar-item">
                <div className="db-bar-row">
                  <span style={{fontSize:12.5}}>C{item.comuna} · {item.barrio}</span>
                  <b>{item.total_cantidad}</b>
                </div>
                <div className="db-bar-track"><div className="db-bar-fill" style={{width:`${w}%`}}/></div>
              </div>
            );
          })}
        </div>
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:10}}>
            Top Tipos
          </div>
          {topTipos.map((item,i)=>{
            const w=Math.max(8,Math.round(((item.total_cantidad||0)/maxT)*100));
            return (
              <div key={i} className="db-bar-item">
                <div className="db-bar-row">
                  <span style={{fontSize:12.5,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.tipo_negocio}</span>
                  <b>{item.total_cantidad}</b>
                </div>
                <div className="db-bar-track">
                  <div className="db-bar-fill" style={{width:`${w}%`,background:'linear-gradient(90deg,#239677,#00C896)'}}/></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   COBERTURA EPM
════════════════════════════════ */
function CoberturaWidget() {
  const [view, setView]               = useState('estratificacion');
  const [loading, setLoading]         = useState(true);
  const [periodo, setPeriodo]         = useState('');
  const [periodos, setPeriodos]       = useState([]);
  const [summary, setSummary]         = useState(null);
  const [porServicio, setPorServicio] = useState([]);
  const [tarifaDs, setTarifaDs]       = useState('acueducto');
  const [tarifaYear, setTarifaYear]   = useState('');
  const [tarifaYears, setTarifaYears] = useState([]);
  const [tarifaSummary, setTarifaSummary] = useState(null);
  const [tarifaEstrato, setTarifaEstrato] = useState([]);

  useEffect(()=>{
    datasetsService.getEstratificacionSummary(periodo||null).then(r=>{
      const d=r?.data||null; setSummary(d); setPeriodos(d?.available_periodos||[]);
    }).catch(()=>{}).finally(()=>setLoading(false));
    datasetsService.getEstratificacionPorServicio(periodo||null).then(r=>setPorServicio(r?.data||[])).catch(()=>{});
  },[periodo]);

  useEffect(()=>{
    const y=tarifaYear===''?null:Number(tarifaYear);
    datasetsService.getTarifasSummary(tarifaDs,y).then(r=>{
      const d=r?.data||null; setTarifaSummary(d); setTarifaYears(d?.available_years||[]);
    }).catch(()=>{});
    datasetsService.getTarifasPorEstrato(tarifaDs,y).then(r=>setTarifaEstrato(r?.data||[])).catch(()=>{});
  },[tarifaDs,tarifaYear]);

  const maxS = useMemo(()=>Math.max(...porServicio.map(i=>i.total_suscriptores||0),1),[porServicio]);
  const maxE = useMemo(()=>Math.max(...tarifaEstrato.filter(i=>i.estrato).map(i=>i.tarifa_promedio||0),1),[tarifaEstrato]);

  if(loading) return <div style={{fontSize:13,color:'var(--text-dim)'}}>Cargando datos EPM...</div>;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {/* Toggle */}
      <div style={{display:'flex',gap:8}}>
        {[['estratificacion','Estratificación'],['tarifas','Tarifas EPM']].map(([id,label])=>(
          <button key={id} className={`db-fpill${view===id?' active':''}`} onClick={()=>setView(id)}>{label}</button>
        ))}
      </div>

      {view==='estratificacion' && (
        <>
          <select className="db-news-select" value={periodo} onChange={e=>setPeriodo(e.target.value)}>
            <option value="">Todos los periodos</option>
            {periodos.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
          {summary && (
            <div className="db-insights-stats">
              {[
                {label:'Suscriptores',  value:`${((summary.total_suscriptores||0)/1000).toFixed(0)}k`},
                {label:'Cobertura prom.',value:`${Number(summary.cobertura_promedio||0).toFixed(1)}%`},
                {label:'Servicio líder', value:porServicio[0]?.servicio||'N/A', small:true},
                {label:'Periodo',        value:periodo||'Todos',                 small:true},
              ].map((s,i)=>(
                <div key={i} className="db-insights-stat">
                  <div className="db-insights-stat-label">{s.label}</div>
                  <div className="db-insights-stat-value" style={s.small?{fontSize:13,marginTop:2}:{}}>{s.value}</div>
                </div>
              ))}
            </div>
          )}
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:10}}>
              Suscriptores por servicio
            </div>
            {porServicio.slice(0,5).map((item,i)=>{
              const w=Math.max(8,Math.round(((item.total_suscriptores||0)/maxS)*100));
              return (
                <div key={i} className="db-bar-item">
                  <div className="db-bar-row"><span>{item.servicio}</span><b>{(item.total_suscriptores||0).toLocaleString('es-CO')}</b></div>
                  <div className="db-bar-track"><div className="db-bar-fill" style={{width:`${w}%`}}/></div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view==='tarifas' && (
        <>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <select className="db-news-select" value={tarifaDs} onChange={e=>setTarifaDs(e.target.value)}>
              <option value="acueducto">Acueducto</option>
              <option value="gas">Gas</option>
              <option value="energia">Energía</option>
            </select>
            <select className="db-news-select" value={tarifaYear} onChange={e=>setTarifaYear(e.target.value)}>
              <option value="">Todos los años</option>
              {tarifaYears.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {tarifaSummary && (
            <div className="db-insights-stats">
              {[
                {label:'Dataset',         value:tarifaDs,              small:true},
                {label:'Tarifa promedio', value:`$${Number(tarifaSummary.tarifa_promedio||0).toLocaleString('es-CO')}`},
                {label:'Registros',       value:(tarifaSummary.total_registros||0).toLocaleString('es-CO')},
                {label:'Años disponibles',value:tarifaYears.length||0},
              ].map((s,i)=>(
                <div key={i} className="db-insights-stat">
                  <div className="db-insights-stat-label">{s.label}</div>
                  <div className="db-insights-stat-value" style={s.small?{fontSize:13,marginTop:2}:{}}>{s.value}</div>
                </div>
              ))}
            </div>
          )}
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:10}}>
              Tarifa promedio por estrato
            </div>
            {tarifaEstrato.filter(i=>i.estrato).map((item,i)=>{
              const w=Math.max(8,Math.round(((item.tarifa_promedio||0)/maxE)*100));
              return (
                <div key={i} className="db-bar-item">
                  <div className="db-bar-row"><span>Estrato {item.estrato}</span><b>${Number(item.tarifa_promedio||0).toLocaleString('es-CO')}</b></div>
                  <div className="db-bar-track">
                    <div className="db-bar-fill" style={{width:`${w}%`,background:'linear-gradient(90deg,#239677,#00C896)'}}/></div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════
   EMPRENDEDOR DASHBOARD
════════════════════════════════ */
export default function EmprendedorDashboard() {
  const navigate = useNavigate();
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [mod, setMod]       = useState('inicio');
  const [negTab, setNegTab] = useState('negocios');
  const [convId, setConvId] = useState(null);

  // Datos para inicio
  const [summary, setSummary]       = useState(null);
  const [topComunas, setTopComunas] = useState([]);

  useEffect(() => {
    authService.getMe().then(setUser).catch(()=>navigate('/login')).finally(()=>setLoading(false));
  }, [navigate]);

  // Carga datos de inicio
  useEffect(() => {
    datasetsService.getEmpresarialSummary(null)
      .then(r => { if(r?.data) setSummary(r.data); }).catch(()=>{});
    datasetsService.getEmpresarialTopComunas(null, 4)
      .then(r => setTopComunas(r?.data||[])).catch(()=>{});
  }, []);

  const handleLogout = () => { authService.logout(); navigate('/login'); };

  if(loading) return <div className="db-loading"><div className="db-spinner"/>Cargando inteligencia empresarial…</div>;
  if(!user) return null;

  const firstName = user.full_name?.split(' ')[0] || 'Emprendedor';

  const META = {
    inicio:      { accent:'Hola,', title:firstName,          subtitle:'Panel ejecutivo para emprendedores de Medellín' },
    emprendedor: { accent:'',      title:'Abre Tu Negocio',  subtitle:'Consultor IA · Análisis de viabilidad · Datos reales de Medellín' },
    insights:    { accent:'',      title:'Inteligencia',     subtitle:'Actividad económica cruzada con contexto de seguridad' },
    negocios:    { accent:'',      title:'Datos de Negocios',subtitle:'Negocios cercanos · Cobertura EPM · Tarifas por estrato' },
    cobertura:   { accent:'',      title:'Cobertura y Tarifas EPM', subtitle:'Estratificación · Servicios · Tendencias de tarifas' },
  };
  const m = META[mod];

  /* ══ COL-R (iguales para todos los módulos) ══ */
  const rightCol = (
    <>
      {/* Nota */}
      <div className="db-rc db-card-note" style={{flexShrink:0}}>
        <div className="db-card-header">
          <span className="db-card-title">Panel Emprendedor</span>
          <button className="db-edit-btn"><Icons.Pencil/></button>
        </div>
        <div className="db-note-body">
          Datos <b>reales de Medellín</b> para tomar mejores decisiones de negocio. Consulta el asesor IA para análisis de viabilidad.
        </div>
        <div className="db-note-footer">
          <span className="db-note-time">Medellín · Valle de Aburrá</span>
          <div className="db-note-badge"><span className="ck">✓</span> IA Activa</div>
        </div>
      </div>

      {/* Stats empresariales */}
      {summary && (
        <div className="db-rc" style={{flexShrink:0}}>
          <div className="db-card-header" style={{marginBottom:10}}>
            <span className="db-card-title">Resumen Empresarial</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
            {[
              {label:'Total empresas', value:`${(summary.total_empresas/1000).toFixed(1)}k`},
              {label:'Actividades',    value:summary.total_actividades},
            ].map((s,i)=>(
              <div key={i} className="db-stat-item">
                <div className="db-stat-label">{s.label}</div>
                <div className="db-stat-value" style={{fontSize:18}}>{s.value}</div>
              </div>
            ))}
          </div>
          {/* Top comunas mini */}
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:8}}>
            Top comunas
          </div>
          {topComunas.map((item,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12.5,marginBottom:6,color:'var(--text)'}}>
              <span>{item.comuna}</span>
              <b style={{color:'var(--accent)'}}>{(item.total_empresas||0).toLocaleString('es-CO')}</b>
            </div>
          ))}
        </div>
      )}

      {/* Módulos disponibles */}
      <div className="db-rc" style={{flexShrink:0}}>
        <div className="db-card-header" style={{marginBottom:10}}>
          <span className="db-card-title">Módulos activos</span>
        </div>
        {[
          {id:'emprendedor', icon:<Icons.Rocket/>,  label:'Asesor IA'},
          {id:'insights',    icon:<Icons.Chart/>,   label:'Inteligencia'},
          {id:'negocios',    icon:<Icons.Store/>,   label:'Negocios'},
          {id:'cobertura',   icon:<Icons.Bolt/>,    label:'Cobertura EPM'},
        ].map(item=>(
          <button
            key={item.id}
            onClick={() => setMod(item.id)}
            style={{
              display:'flex',alignItems:'center',gap:10,width:'100%',
              background:'transparent',border:'none',cursor:'pointer',
              padding:'7px 0',borderBottom:'1px solid var(--sep)',
              color:mod===item.id?'var(--accent)':'var(--text-mid)',
              fontSize:13,fontWeight:mod===item.id?600:400,
              fontFamily:'Inter,sans-serif',textAlign:'left',transition:'color .18s'
            }}
          >
            <span style={{color:mod===item.id?'var(--accent)':'var(--text-dim)',width:16}}>{item.icon}</span>
            {item.label}
            {mod===item.id && <span style={{marginLeft:'auto',fontSize:10,color:'var(--accent)'}}>●</span>}
          </button>
        ))}
      </div>
    </>
  );

  /* ══ COL-L ══ */

  // ── INICIO: overview real ──
  const inicioLeft = (
    <>
      <div className="db-filter-bar">
        <div className="db-fpill" onClick={()=>setMod('emprendedor')}><span className="db-dot"/>Abre Tu Negocio</div>
        <div className="db-fpill" onClick={()=>setMod('insights')}>Inteligencia</div>
        <div className="db-fpill" onClick={()=>setMod('negocios')}>Negocios</div>
        <div className="db-fset"><Icons.Sliders/></div>
        <button className="db-btn-primary" onClick={()=>setMod('emprendedor')}>Consultar Asesor IA →</button>
      </div>

      {/* Chatbot como feature principal */}
      <div className="db-card" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div className="db-card-header">
          <div>
            <div className="db-card-title">Asesor de Negocios — Consultor IA</div>
            <div className="db-card-subtitle">Análisis de viabilidad · Recomendaciones de zona · Datos reales EPM y empresariales</div>
          </div>
          <div style={{
            background:'var(--active-bg)', border:'1px solid var(--active-bd)',
            borderRadius:6, padding:'3px 8px', fontSize:11, fontWeight:700, color:'var(--accent)'
          }}>IA</div>
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <ChatEmprendedor conversationId={convId} onConversationChange={setConvId}/>
        </div>
      </div>

      {/* Módulos de datos */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,flexShrink:0}}>
        {[
          { icon:<Icons.Chart/>, title:'Inteligencia Empresarial', desc:'Actividad económica por zona cruzada con datos de seguridad.', action:()=>setMod('insights') },
          { icon:<Icons.Store/>, title:'Negocios y Cobertura',    desc:'Negocios cercanos, cobertura EPM y tarifas por estrato.',       action:()=>setMod('negocios') },
        ].map((item,i)=>(
          <div key={i} className="db-card" onClick={item.action}
            style={{cursor:'pointer',padding:'16px 18px',display:'flex',alignItems:'flex-start',gap:14}}
          >
            <div style={{
              width:38,height:38,borderRadius:10,background:'var(--active-bg)',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:'var(--accent)',flexShrink:0
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:'var(--text-h)',marginBottom:4}}>{item.title}</div>
              <div style={{fontSize:12.5,color:'var(--text-mid)',lineHeight:1.5}}>{item.desc}</div>
              <div style={{fontSize:11,color:'var(--accent)',fontWeight:600,marginTop:6}}>Ver datos →</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // ── EMPRENDEDOR: chat + historial, solo eso ──
  const emprendedorLeft = (
    <div className="db-card" style={{flex:1,display:'flex',overflow:'hidden',padding:0}}>
      <ConvList
        currentId={convId}
        onSelect={setConvId}
        onNew={() => setConvId(null)}
        onDelete={id => { if(convId===id) setConvId(null); }}
      />
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',borderLeft:'1px solid var(--sep)'}}>
        <div style={{padding:'14px 18px',borderBottom:'1px solid var(--sep)',flexShrink:0}}>
          <div className="db-card-title">Consultor de Negocios IA</div>
          <div className="db-card-subtitle">Análisis de viabilidad · Recomendaciones de zona · Costos EPM</div>
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <ChatEmprendedor conversationId={convId} onConversationChange={setConvId}/>
        </div>
      </div>
    </div>
  );

  // ── INSIGHTS: solo datos ──
  const insightsLeft = (
    <div className="db-card" style={{flex:1,overflowY:'auto'}}>
      <div className="db-card-header">
        <div>
          <div className="db-card-title">Inteligencia Empresarial</div>
          <div className="db-card-subtitle">Top actividades · Comunas · Datos cruzados con seguridad</div>
        </div>
      </div>
      <InsightsWidget/>
    </div>
  );

  // ── NEGOCIOS: tabs Negocios | Cobertura ──
  const negociosLeft = (
    <div className="db-card" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <TabBar
        tabs={[{id:'negocios',label:'Negocios Cercanos'},{id:'cobertura',label:'Cobertura y Tarifas'}]}
        active={negTab} onChange={setNegTab}
      />
      <div className="db-tab-content" style={{flex:1,overflow:'auto'}}>
        {negTab==='negocios'  && <NegociosWidget/>}
        {negTab==='cobertura' && <CoberturaWidget/>}
      </div>
    </div>
  );

  // ── COBERTURA standalone ──
  const coberturaLeft = (
    <div className="db-card" style={{flex:1,overflowY:'auto'}}>
      <div className="db-card-header">
        <div>
          <div className="db-card-title">Cobertura y Tarifas EPM</div>
          <div className="db-card-subtitle">Estratificación · Servicios públicos · Tendencias de tarifas</div>
        </div>
      </div>
      <CoberturaWidget/>
    </div>
  );

  const leftMap = {
    inicio:      inicioLeft,
    emprendedor: emprendedorLeft,
    insights:    insightsLeft,
    negocios:    negociosLeft,
    cobertura:   coberturaLeft,
  };

  return (
    <DashboardLayout
      user={user} navItems={NAV} activeItem={mod}
      onSelect={setMod} onLogout={handleLogout}
      pageTitleAccent={m.accent} pageTitle={m.title} pageSubtitle={m.subtitle}
      breadcrumb={`Emprendedor / ${m.title}`}
      colL={leftMap[mod]} colR={rightCol}
    />
  );
}