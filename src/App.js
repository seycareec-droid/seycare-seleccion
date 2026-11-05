import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const ICON_B64 = "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";
const LOGO_B64 = "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";
const ICON_SRC = `data:image/png;base64,${ICON_B64}`;
const LOGO_SRC = `data:image/png;base64,${LOGO_B64}`;
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON;

const T = {
  teal:"#1fa8c0",tealDark:"#167a8e",tealDeep:"#0d5a6b",
  tealLight:"#e6f7fa",tealMid:"#b3e8f0",
  ink:"#1a1a2e",inkLight:"#4a4a6a",
  soft:"#f5fbfc",white:"#ffffff",border:"#cceef4",
  warn:"#ef4444",success:"#10b981",gold:"#f59e0b",
  purple:"#8b5cf6",orange:"#f97316",rose:"#f43f5e",
};

const ESPECIALIDADES = ["Gel","Acrílico","Nail Art","Polygel","Pedicura","Semipermanente","Esculpidas","Press-on","Diseño 3D","Chrome / Espejo"];
const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const HORAS_ENTRADA = ["7:00","7:30","8:00","8:30","9:00","9:30","10:00"];
const HORAS_SALIDA  = ["15:00","16:00","17:00","18:00","19:00","20:00","21:00","Sin límite fijo"];
const TRANSPORTES = [
  {value:"propio_carro",label:"Carro propio",icon:"🚗"},
  {value:"moto",label:"Moto",icon:"🏍️"},
  {value:"transporte_publico",label:"Transporte público",icon:"🚌"},
  {value:"uber_taxi",label:"Uber / Taxi / InDriver",icon:"🚕"},
  {value:"bicicleta",label:"Bicicleta u otro",icon:"🚲"},
];
const MODALIDADES = [
  {value:"comision_40",label:"40% comisión",icon:"🎯",desc:"Seycare provee todos los materiales"},
  {value:"comision_45",label:"45% comisión",icon:"📦",desc:"Seycare provee materiales parcialmente"},
  {value:"comision_50",label:"50% comisión",icon:"💼",desc:"Manicurista trae sus propios materiales"},
  {value:"medio_tiempo",label:"Medio tiempo",icon:"⏰",desc:"Contrato de medio tiempo"},
  {value:"hibrido",label:"Esquema híbrido",icon:"🔀",desc:"Base + comisión a convenir"},
];
const ESTADOS = {
  recibida:       {label:"Recibida",        color:T.inkLight,bg:"#f3f4f6",  grupo:"activa"},
  preseleccionada:{label:"Preseleccionada", color:T.teal,   bg:T.tealLight, grupo:"activa"},
  citada:         {label:"Citada",          color:T.purple, bg:"#f5f3ff",   grupo:"activa"},
  confirmo:       {label:"Confirmó",        color:"#7c3aed",bg:"#ede9fe",   grupo:"activa"},
  entrevistada:   {label:"Entrevistada",    color:T.tealDark,bg:"#e0f2f7",  grupo:"activa"},
  finalista:      {label:"Finalista ⭐",    color:T.gold,   bg:"#fffbeb",   grupo:"finalista"},
  lista_espera:   {label:"Lista de espera", color:T.orange, bg:"#fff7ed",   grupo:"finalista"},
  contratada:     {label:"Contratada ✓",   color:T.success,bg:"#ecfdf5",   grupo:"cerrada"},
  no_asistio:     {label:"No asistió",      color:T.warn,   bg:"#fef2f2",   grupo:"cerrada"},
  retirada:       {label:"Se retiró",       color:"#9ca3af",bg:"#f9fafb",   grupo:"cerrada"},
  descartada:     {label:"Descartada",      color:"#6b7280",bg:"#f3f4f6",   grupo:"cerrada"},
};
const CRITERIOS = [
  {key:"experiencia",   label:"Experiencia y formación", icon:"🎓"},
  {key:"disponibilidad",label:"Disponibilidad horaria",  icon:"🕐"},
  {key:"economia",      label:"Compatibilidad económica",icon:"💰"},
  {key:"actitud",       label:"Presentación / actitud",  icon:"✨"},
];
const SECTORES_QUITO = [
  "La Magdalena","Chillogallo","Villaflora","Guamaní","Nueva Aurora",
  "Atahualpa","El Pintado","El Calzado","Barrio Nuevo","Solanda",
  "Mercado Central","La Ferroviaria","Chilibulo","Otro sector",
];
const initialForm = {
  nombre:"",telefono:"",edad:"",especialidades:[],experiencia:"",
  certificacion_tipo:"",certificacion_detalle:"",
  dias:[],hora_entrada:"",hora_salida:"",
  modalidades:[],salario_esperado:"",
  transporte:"",zona_residencia:"",disponibilidad_inmediata:"",
  portfolio_link:"",info_adicional:"",
};

const iS = {width:"100%",padding:"12px 16px",borderRadius:10,border:`1.5px solid ${T.border}`,fontSize:15,outline:"none",background:T.white,color:T.ink,boxSizing:"border-box",fontFamily:"inherit"};

function puntajeTotal(cal){
  if(!cal||Object.keys(cal).length===0)return 0;
  const vals=Object.values(cal).filter(v=>v>0);
  if(!vals.length)return 0;
  return Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*20);
}

function Field({label,sub,children}){
  return(<div style={{marginBottom:22}}><label style={{display:"block",fontSize:12,fontWeight:700,color:T.tealDark,marginBottom:sub?2:8,letterSpacing:1,textTransform:"uppercase"}}>{label}</label>{sub&&<p style={{fontSize:12,color:T.inkLight,margin:"0 0 8px",lineHeight:1.5}}>{sub}</p>}{children}</div>);
}
function Chip({children,active,onClick}){
  return(<button onClick={onClick} style={{padding:"9px 16px",borderRadius:24,fontSize:13,cursor:"pointer",border:`1.5px solid ${active?T.teal:T.border}`,background:active?T.teal:T.white,color:active?T.white:T.inkLight,fontWeight:active?700:400,transition:"all 0.15s"}}>{children}</button>);
}
function PuntajeBadge({puntaje}){
  const color=puntaje>=80?T.success:puntaje>=60?T.teal:puntaje>=40?T.gold:T.inkLight;
  return(<div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,background:color+"20",border:`1px solid ${color}40`}}><span style={{fontWeight:700,fontSize:13,color}}>{puntaje>0?`${puntaje}pts`:"Sin eval."}</span></div>);
}
function StarRating({value,onChange,size=22}){
  const [hover,setHover]=useState(0);
  return(<div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>onChange(n)} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)} style={{background:"none",border:"none",cursor:"pointer",fontSize:size,padding:1,color:(hover||value)>=n?"#f59e0b":"#d1d5db",transition:"color 0.1s"}}>★</button>))}</div>);
}
function FavBtn({active,onClick}){
  return(<button onClick={e=>{e.stopPropagation();onClick();}} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,padding:2,transition:"transform 0.15s",transform:active?"scale(1.2)":"scale(1)"}}>{active?"❤️":"🤍"}</button>);
}


function WhatsAppBtn({candidata,tipo="entrevista"}){
  const numero=candidata.telefono.replace(/\D/g,"");
  const msgs={
    entrevista:encodeURIComponent(`Hola ${candidata.nombre} 👋\n\nSoy del equipo de *Seycare Nails®*. Revisamos tu solicitud y nos gustaría conocerte en persona. 💅✨\n\nEstamos en *Serapio Japerabi y Canelo esq., Barrio Nuevo, 2do piso, Quito*.\n\n¿Tienes disponibilidad para una entrevista?\n📅 _[agrega fechas]_\n🕐 _[agrega horarios]_\n\nConfírmanos para apartar tu espacio. Avísanos con 24 hrs si surge algún imprevisto.\n\n¡Esperamos conocerte! 🌊`),
    oferta:encodeURIComponent(`Hola ${candidata.nombre} 👋\n\n¡Excelentes noticias! Queremos hacerte una oferta para unirte a *Seycare Nails®*. 🎉💅\n\n¿Tienes disponibilidad esta semana?\n\n¡Esperamos contar contigo! 🌊✨`),
    espera:encodeURIComponent(`Hola ${candidata.nombre} 👋\n\nGracias por tu interés en *Seycare Nails®*. Quedas en nuestra lista de espera y serás la primera en consideración si se abre una posición. 💅\n\n¡Gracias por tu tiempo! 🌊`),
  };
  const labels={entrevista:"Invitar a entrevista",oferta:"Enviar oferta de trabajo",espera:"Notificar lista de espera"};
  const colors={entrevista:"#25d366",oferta:T.teal,espera:T.gold};
  return(<a href={`https://wa.me/${numero}?text=${msgs[tipo]}`} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"14px",borderRadius:14,background:colors[tipo],color:T.white,fontWeight:700,fontSize:14,textDecoration:"none",marginBottom:10,boxShadow:`0 4px 16px ${colors[tipo]}44`}}><span style={{fontSize:20}}>💬</span>{labels[tipo]}</a>);
}

function AdminLogin({onSuccess,onBack}){
  const [email,setEmail]=useState("");const [password,setPassword]=useState("");
  const [error,setError]=useState("");const [loading,setLoading]=useState(false);
  const entrar=async(e)=>{
    e.preventDefault();setError("");setLoading(true);
    try{
      const {error:err}=await supabase.auth.signInWithPassword({email:email.trim(),password});
      if(err){setError("Correo o contraseña incorrectos.");return;}
      const {data:esAdmin}=await supabase.rpc("es_admin_seleccion");
      if(esAdmin!==true){await supabase.auth.signOut();setError("Esta cuenta no tiene acceso.");return;}
      onSuccess();
    }catch(ex){setError("No se pudo iniciar sesión. Intenta de nuevo.");}
    finally{setLoading(false);}
  };
  const inp={width:"100%",boxSizing:"border-box",padding:"14px 16px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:15,outline:"none",marginBottom:12};
  return(<div style={{minHeight:"100vh",background:T.tealDeep,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
    <form onSubmit={entrar} style={{textAlign:"center",padding:32,maxWidth:340,width:"100%"}}>
      <img src={ICON_SRC} alt="Seycare" style={{width:52,marginBottom:20,filter:"brightness(0) invert(1)",opacity:0.9}}/>
      <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,marginBottom:24,letterSpacing:1,textTransform:"uppercase"}}>Acceso restringido</p>
      <input type="email" autoComplete="username" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} style={inp}/>
      <input type="password" autoComplete="current-password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} style={inp}/>
      {error&&<div style={{color:"#fca5a5",fontSize:13,marginBottom:12}}>{error}</div>}
      <button type="submit" disabled={loading||!email||!password} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:loading?"#999":T.teal,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>{loading?"Entrando...":"Entrar"}</button>
      <button type="button" onClick={onBack} style={{marginTop:16,background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Volver</button>
    </form>
  </div>);
}

// ── PORTFOLIO UPLOAD WIDGET ──────────────────────────────────
const MAX_ARCHIVOS=4;
const MAX_BYTES=3*1024*1024;
async function compressImage(file){
  return new Promise(resolve=>{
    const reader=new FileReader();
    reader.onerror=()=>resolve(file);
    reader.onload=e=>{
      const img=new Image();
      img.onerror=()=>resolve(file);
      img.onload=()=>{
        const canvas=document.createElement("canvas");
        let w=img.width,h=img.height;
        const max=1400;
        if(w>max||h>max){const r=Math.min(max/w,max/h);w=Math.round(w*r);h=Math.round(h*r);}
        canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        canvas.toBlob(blob=>resolve(blob?new File([blob],file.name.replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"}):file),"image/jpeg",0.8);
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function PortfolioUpload({link,onLink,files,onFiles}){
  const ref=useRef();
  const [msg,setMsg]=useState("");
  const agregar=async(lista)=>{
    setMsg("");
    const nuevos=[];
    for(const f of Array.from(lista||[])){
      const okTipo=f.type==="application/pdf"||f.type.startsWith("image/");
      if(!okTipo){setMsg("Solo se aceptan fotos o PDF.");continue;}
      const procesado=f.type.startsWith("image/")?await compressImage(f):f;
      if(procesado.size>MAX_BYTES){setMsg("Un archivo supera los 3 MB y no se agregó.");continue;}
      nuevos.push(procesado);
    }
    const total=[...files,...nuevos];
    if(total.length>MAX_ARCHIVOS)setMsg("Máximo "+MAX_ARCHIVOS+" archivos.");
    onFiles(total.slice(0,MAX_ARCHIVOS));
    if(ref.current)ref.current.value="";
  };
  return(
    <div style={{display:"grid",gap:10}}>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>🔗</span>
        <input style={{...iS,paddingLeft:42}} placeholder="Link de portafolio (Instagram, TikTok, Drive...)" value={link} onChange={e=>onLink(e.target.value)}/>
      </div>
      <div onClick={()=>files.length<MAX_ARCHIVOS&&ref.current.click()} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:12,border:`1.5px dashed ${files.length?T.teal:T.border}`,background:files.length?T.tealLight:T.white,cursor:"pointer"}}>
        <span style={{fontSize:20}}>{files.length?"📎":"⬆️"}</span>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:files.length?T.tealDark:T.ink}}>{files.length?files.length+" archivo(s) listo(s)":"Subir CV o fotos de tus trabajos"}</div>
          <div style={{fontSize:11,color:T.inkLight}}>Fotos o PDF · hasta {MAX_ARCHIVOS} archivos · opcional</div>
        </div>
      </div>
      <input ref={ref} type="file" multiple accept="application/pdf,image/*" style={{display:"none"}} onChange={e=>agregar(e.target.files)}/>
      {files.map((f,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,fontSize:12,color:T.inkLight,padding:"6px 10px",background:T.white,border:`1px solid ${T.border}`,borderRadius:10}}>
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
          <button type="button" onClick={()=>onFiles(files.filter((_,j)=>j!==i))} style={{border:"none",background:"transparent",color:T.rose,fontWeight:700,cursor:"pointer",fontSize:14}}>✕</button>
        </div>
      ))}
      {msg&&<div style={{fontSize:12,color:T.rose}}>{msg}</div>}
    </div>
  );
}

function ArchivosCandidata({rutas}){
  const [urls,setUrls]=useState([]);
  useEffect(()=>{
    let vivo=true;
    (async()=>{
      const out=[];
      for(const r of rutas||[]){
        const {data}=await supabase.storage.from("portafolios").createSignedUrl(r,3600);
        if(data?.signedUrl)out.push({r,url:data.signedUrl});
      }
      if(vivo)setUrls(out);
    })();
    return()=>{vivo=false;};
  },[JSON.stringify(rutas)]); // eslint-disable-line
  if(!urls.length)return null;
  return(
    <div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
      {urls.map((u,i)=>(<a key={u.r} href={u.url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:20,background:"#f5f3ff",border:"1px solid #ddd6fe",color:T.purple,fontSize:13,fontWeight:700,textDecoration:"none"}}>📎 Archivo {i+1}</a>))}
    </div>
  );
}

// ── CANDIDATE FORM ───────────────────────────────────────────
function CandidateForm(){
  const [form,setForm]=useState(initialForm);
  const [step,setStep]=useState(1);
  const [submitted,setSubmitted]=useState(false);
  const [loading,setLoading]=useState(false);
  const [codigo,setCodigo]=useState("");
  const [errorMsg,setErrorMsg]=useState("");
  const [archivos,setArchivos]=useState([]);
  const [avisoArchivos,setAvisoArchivos]=useState("");

  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleArr=(k,v)=>setForm(f=>({...f,[k]:f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v]}));

  const handleSubmit=async()=>{
    setLoading(true);setErrorMsg("");
    try{
      const {data,error}=await supabase.rpc("registrar_candidata",{p:{
        nombre:form.nombre,telefono:form.telefono,edad:form.edad,
        zona_residencia:form.zona_residencia,transporte:form.transporte,
        especialidades:form.especialidades,experiencia:form.experiencia,
        certificacion_tipo:form.certificacion_tipo,certificacion_detalle:form.certificacion_detalle,
        dias:form.dias,hora_entrada:form.hora_entrada,hora_salida:form.hora_salida,
        disponibilidad_inmediata:form.disponibilidad_inmediata,
        modalidades:form.modalidades,salario_esperado:form.salario_esperado,
        portfolio_link:form.portfolio_link,
        info_adicional:form.info_adicional,
      }});
      if(error)throw error;
      const fila=Array.isArray(data)?data[0]:data;
      const cod=fila?.codigo_seguimiento||"";
      if(cod&&archivos.length>0){
        const subidos=[];
        for(const f of archivos){
          const ext=(f.name.split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,5)||"bin";
          const ruta=cod+"/"+Date.now().toString(36)+Math.random().toString(36).slice(2,8)+"."+ext;
          const {error:upErr}=await supabase.storage.from("portafolios").upload(ruta,f,{contentType:f.type,upsert:false});
          if(!upErr)subidos.push(ruta);else console.error(upErr);
        }
        if(subidos.length>0){
          const {error:adjErr}=await supabase.rpc("adjuntar_archivos",{p_codigo:cod,p_paths:subidos});
          if(adjErr)console.error(adjErr);
        }
        if(subidos.length<archivos.length)setAvisoArchivos("Tu solicitud se envió, pero algunos archivos no se pudieron subir. Envíalos por WhatsApp.");
      }
      setCodigo(cod);setSubmitted(true);
    }catch(e){
      console.error(e);
      setErrorMsg(String(e?.message||"").includes("convocatoria_cerrada")?"La convocatoria está cerrada por el momento. Escríbenos por WhatsApp para más información.":"Hubo un error al enviar. Por favor intenta de nuevo.");
    }finally{setLoading(false);}
  };

  if(submitted)return(
    <div style={{minHeight:"100vh",background:T.soft,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{textAlign:"center",maxWidth:380}}>
        <img src={ICON_SRC} alt="Seycare" style={{width:72,marginBottom:20}}/>
        <h2 style={{fontSize:26,color:T.ink,marginBottom:12,fontWeight:700}}>¡Solicitud enviada!</h2>
        <p style={{color:T.inkLight,lineHeight:1.7,fontSize:15}}>Gracias por tu interés en <strong>Seycare Nails®</strong>. Nos pondremos en contacto pronto por WhatsApp.</p>
        <div style={{marginTop:28,padding:"18px 24px",background:T.white,borderRadius:16,border:`1px solid ${T.border}`}}>
          <p style={{color:T.teal,fontSize:12,margin:0,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Tu código de seguimiento</p>
          <p style={{fontFamily:"monospace",fontSize:28,fontWeight:700,color:T.ink,margin:"8px 0 0"}}>{codigo}</p>
        </div>
        {avisoArchivos&&<p style={{fontSize:13,color:T.rose,marginTop:16}}>{avisoArchivos}</p>}
        <p style={{fontSize:13,color:T.inkLight,marginTop:20}}>📍 Serapio Japerabi y Canelo esq., Barrio Nuevo, 2do piso</p>
      </div>
    </div>
  );

  const steps=[{num:1,label:"Sobre ti"},{num:2,label:"Habilidades"},{num:3,label:"Horario"},{num:4,label:"Condiciones"}];

  return(
    <div style={{minHeight:"100vh",background:T.soft,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
      <div style={{background:`linear-gradient(150deg,${T.tealDeep} 0%,${T.teal} 100%)`,padding:"28px 24px 0",color:T.white}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <img src={ICON_SRC} alt="Seycare" style={{width:40,height:40,objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
          <div><div style={{fontSize:11,letterSpacing:2,opacity:0.75,textTransform:"uppercase"}}>Proceso de selección · Quito</div><div style={{fontSize:20,fontWeight:700}}>Seycare Nails®</div></div>
        </div>
        <div style={{display:"flex",gap:0}}>{steps.map((s,i)=>(<div key={s.num} style={{flex:1,textAlign:"center",position:"relative"}}><div style={{width:30,height:30,borderRadius:"50%",margin:"0 auto 6px",display:"flex",alignItems:"center",justifyContent:"center",background:step>s.num?T.success:step===s.num?T.white:"rgba(255,255,255,0.2)",color:step>s.num?T.white:step===s.num?T.tealDeep:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:13}}>{step>s.num?"✓":s.num}</div><div style={{fontSize:10,opacity:step===s.num?1:0.55,fontWeight:step===s.num?700:400,paddingBottom:12}}>{s.label}</div>{i<steps.length-1&&<div style={{position:"absolute",top:15,left:"50%",width:"100%",height:2,background:"rgba(255,255,255,0.2)",zIndex:0}}/>}</div>))}</div>
        <svg viewBox="0 0 400 24" style={{display:"block",marginBottom:-1}}><path d="M0,12 C100,24 300,0 400,12 L400,24 L0,24 Z" fill={T.soft}/></svg>
      </div>

      <div style={{maxWidth:480,margin:"0 auto",padding:"20px 16px 100px"}}>
        {step===1&&<>
          <h2 style={{fontSize:22,color:T.ink,margin:"0 0 6px",fontWeight:700}}>Cuéntanos sobre ti</h2>
          <p style={{color:T.inkLight,fontSize:14,margin:"0 0 24px"}}>Esta información nos ayuda a conocerte antes de la entrevista.</p>
          <Field label="Nombre completo"><input style={iS} placeholder="Ej. Gabriela Torres" value={form.nombre} onChange={e=>set("nombre",e.target.value)}/></Field>
          <Field label="WhatsApp"><input style={iS} placeholder="+593 99 000 0000" value={form.telefono} onChange={e=>set("telefono",e.target.value)}/></Field>
          <Field label="Edad"><input style={iS} placeholder="Ej. 25 años" value={form.edad} onChange={e=>set("edad",e.target.value)}/></Field>
          <Field label="¿En qué sector del sur de Quito vives?">
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{SECTORES_QUITO.map(s=>(<Chip key={s} active={form.zona_residencia===s} onClick={()=>set("zona_residencia",s)}>{s}</Chip>))}</div>
          </Field>
          <Field label="¿Cómo llegas al trabajo?">
            <div style={{display:"grid",gap:8}}>{TRANSPORTES.map(t=>(<label key={t.value} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:12,cursor:"pointer",border:`2px solid ${form.transporte===t.value?T.teal:T.border}`,background:form.transporte===t.value?T.tealLight:T.white}}><input type="radio" style={{display:"none"}} checked={form.transporte===t.value} onChange={()=>set("transporte",t.value)}/><span style={{fontSize:20}}>{t.icon}</span><span style={{fontWeight:600,fontSize:14,color:form.transporte===t.value?T.tealDark:T.ink}}>{t.label}</span>{form.transporte===t.value&&<span style={{marginLeft:"auto",color:T.teal,fontWeight:700}}>✓</span>}</label>))}</div>
          </Field>
        </>}

        {step===2&&<>
          <h2 style={{fontSize:22,color:T.ink,margin:"0 0 6px",fontWeight:700}}>Tus habilidades</h2>
          <p style={{color:T.inkLight,fontSize:14,margin:"0 0 24px"}}>Queremos conocer tu nivel y especialidades.</p>
          <Field label="Años de experiencia">
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["Menos de 1 año","1-2 años","3-5 años","Más de 5 años"].map(o=>(<Chip key={o} active={form.experiencia===o} onClick={()=>set("experiencia",o)}>{o}</Chip>))}</div>
          </Field>
          <Field label="Certificaciones y formación" sub="Selecciona tu nivel y describe tus cursos o certificados.">
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>{["Certificada formalmente","Cursos especializados","Autodidacta","En proceso"].map(o=>(<Chip key={o} active={form.certificacion_tipo===o} onClick={()=>set("certificacion_tipo",o)}>{o}</Chip>))}</div>
            <textarea style={{...iS,height:90,resize:"vertical",fontSize:14}} placeholder="Ej: Curso de uñas acrílicas en Academia Bella, certificado en nail art 2023..." value={form.certificacion_detalle} onChange={e=>set("certificacion_detalle",e.target.value)}/>
          </Field>
          <Field label="¿Qué servicios dominas?">
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{ESPECIALIDADES.map(e=>(<Chip key={e} active={form.especialidades.includes(e)} onClick={()=>toggleArr("especialidades",e)}>{e}</Chip>))}</div>
          </Field>
          <Field label="Portafolio de trabajo" sub="Opcional — comparte tu trabajo para que podamos conocerte mejor.">
            <PortfolioUpload link={form.portfolio_link} onLink={v=>set("portfolio_link",v)} files={archivos} onFiles={setArchivos}/>
          </Field>
        </>}

        {step===3&&<>
          <h2 style={{fontSize:22,color:T.ink,margin:"0 0 6px",fontWeight:700}}>Tu disponibilidad</h2>
          <p style={{color:T.inkLight,fontSize:14,margin:"0 0 24px"}}>Cuéntanos cuándo y hasta qué hora puedes trabajar.</p>
          <Field label="Días disponibles"><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{DIAS.map(d=>(<Chip key={d} active={form.dias.includes(d)} onClick={()=>toggleArr("dias",d)}>{d}</Chip>))}</div></Field>
          <Field label="¿Desde qué hora puedes entrar?"><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{HORAS_ENTRADA.map(h=>(<Chip key={h} active={form.hora_entrada===h} onClick={()=>set("hora_entrada",h)}>{h}</Chip>))}</div></Field>
          <Field label="¿Hasta qué hora puedes quedarte?"><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{HORAS_SALIDA.map(h=>(<Chip key={h} active={form.hora_salida===h} onClick={()=>set("hora_salida",h)}>{h}</Chip>))}</div></Field>
          <Field label="¿Cuándo puedes iniciar?"><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["Sí, de inmediato","En 1 semana","En 2 semanas","En 1 mes"].map(o=>(<Chip key={o} active={form.disponibilidad_inmediata===o} onClick={()=>set("disponibilidad_inmediata",o)}>{o}</Chip>))}</div></Field>
        </>}

        {step===4&&<>
          <h2 style={{fontSize:22,color:T.ink,margin:"0 0 6px",fontWeight:700}}>Condiciones de trabajo</h2>
          <p style={{color:T.inkLight,fontSize:14,margin:"0 0 24px"}}>¿Cómo te gustaría trabajar con nosotras?</p>
          <Field label="Modalidad preferida" sub="Puedes elegir más de una.">
            <div style={{display:"grid",gap:10}}>{MODALIDADES.map(m=>(<label key={m.value} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 16px",borderRadius:14,cursor:"pointer",border:`2px solid ${form.modalidades.includes(m.value)?T.teal:T.border}`,background:form.modalidades.includes(m.value)?T.tealLight:T.white}}><input type="checkbox" style={{display:"none"}} checked={form.modalidades.includes(m.value)} onChange={()=>toggleArr("modalidades",m.value)}/><span style={{fontSize:22,marginTop:2}}>{m.icon}</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:form.modalidades.includes(m.value)?T.tealDark:T.ink}}>{m.label}</div><div style={{fontSize:12,color:T.inkLight,marginTop:2}}>{m.desc}</div></div>{form.modalidades.includes(m.value)&&<span style={{color:T.teal,fontWeight:700}}>✓</span>}</label>))}</div>
          </Field>
          {(form.modalidades.includes("medio_tiempo")||form.modalidades.includes("hibrido"))&&(
            <Field label="Salario base esperado (USD mensual)"><input style={iS} placeholder="Ej. $220" value={form.salario_esperado} onChange={e=>set("salario_esperado",e.target.value)}/></Field>
          )}
          <Field label="¿Algo más que quieras contarnos?" sub="Condiciones especiales o lo que consideres importante.">
            <textarea style={{...iS,height:90,resize:"vertical"}} placeholder="Ej: Tengo mis propias herramientas, busco medio tiempo los fines de semana..." value={form.info_adicional} onChange={e=>set("info_adicional",e.target.value)}/>
          </Field>
        </>}

        {errorMsg&&<div style={{background:"#fef2f2",border:`1px solid ${T.warn}`,borderRadius:10,padding:"12px 16px",marginBottom:16,color:T.warn,fontSize:14}}>{errorMsg}</div>}
        <div style={{display:"flex",gap:12,marginTop:28}}>
          {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:"14px",borderRadius:12,border:`2px solid ${T.border}`,background:T.white,color:T.inkLight,fontWeight:700,fontSize:15,cursor:"pointer"}}>← Atrás</button>}
          {step<4
            ?<button onClick={()=>setStep(s=>s+1)} style={{flex:2,padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${T.teal},${T.tealDeep})`,color:T.white,fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:`0 4px 16px ${T.teal}55`}}>Continuar →</button>
            :<button onClick={handleSubmit} disabled={loading} style={{flex:2,padding:"14px",borderRadius:12,border:"none",background:loading?"#ccc":`linear-gradient(135deg,${T.teal},${T.tealDeep})`,color:T.white,fontWeight:700,fontSize:15,cursor:loading?"not-allowed":"pointer"}}>{loading?"Enviando...":"💅 Enviar solicitud"}</button>
          }
        </div>
      </div>
    </div>
  );
}

// ── TEST SITUACIONAL ─────────────────────────────────────────
const TEST_PREGUNTAS = [
  // LEALTAD / CONFIDENCIALIDAD
  {id:"lc1",categoria:"lealtad",pregunta:"Una clienta te pide que la atiendas en tu casa porque sería más cómodo y barato para las dos. ¿Qué harías?",opciones:[{texto:"Le explico que no puedo atenderla fuera del salón y la invito a venir a Seycare.",puntos:5},{texto:"Le digo que lo pensaré y le aviso después.",puntos:2},{texto:"Acepto, siempre que sea solo esa vez.",puntos:0},{texto:"Acepto si ella me asegura que no lo va a decir.",puntos:0}]},
  {id:"lc2",categoria:"lealtad",pregunta:"Una amiga te dice que en otro salón te pagarían más. Llevas 3 meses en Seycare y te sientes cómoda. ¿Qué haces?",opciones:[{texto:"Evalúo ambas opciones con calma y, si me voy, aviso con tiempo y de buenas maneras.",puntos:4},{texto:"Me quedo porque valoro el ambiente, aunque la oferta sea tentadora.",puntos:5},{texto:"Me voy sin decir nada para no tener problemas.",puntos:0},{texto:"Acepto en secreto y trabajo en los dos lugares al mismo tiempo.",puntos:0}]},
  {id:"lc3",categoria:"lealtad",pregunta:"Escuchas una conversación entre dos compañeras sobre un problema personal de una clienta. ¿Qué haces?",opciones:[{texto:"Me retiro discretamente y no comento eso con nadie.",puntos:5},{texto:"Lo cuento solo a mi mejor amiga porque sé que no va a decir nada.",puntos:0},{texto:"Me quedo escuchando pero prometo guardarlo para mí.",puntos:2},{texto:"Lo publico en mis historias de forma genérica.",puntos:0}]},
  // HONESTIDAD / TRANSPARENCIA
  {id:"ht1",categoria:"honestidad",pregunta:"Cometes un error en el diseño de una uña y la clienta aún no lo ha notado. ¿Qué haces?",opciones:[{texto:"Se lo digo de inmediato y corrijo el error sin costo adicional.",puntos:5},{texto:"Espero a ver si ella lo nota.",puntos:1},{texto:"Distraigo su atención para que no lo vea.",puntos:0},{texto:"Se lo digo pero le cobro por la corrección.",puntos:2}]},
  {id:"ht2",categoria:"honestidad",pregunta:"Al cerrar caja notas que hay $5 de más que no cuadran. ¿Qué haces?",opciones:[{texto:"Los reporto inmediatamente a la encargada.",puntos:5},{texto:"Los guardo y espero a ver si alguien los reclama.",puntos:0},{texto:"Los dejo en la caja y no digo nada.",puntos:2},{texto:"Me los llevo porque «igual nadie va a notar».",puntos:0}]},
  {id:"ht3",categoria:"honestidad",pregunta:"Una clienta pregunta si un producto que usas es de marca. La verdad es que es genérico. ¿Qué haces?",opciones:[{texto:"Le digo la verdad y explico que es de buena calidad aunque no sea de marca.",puntos:5},{texto:"Cambio el tema para no responder.",puntos:1},{texto:"Le digo que sí es de marca para no perder la clienta.",puntos:0},{texto:"Le digo que no lo sé.",puntos:2}]},
  // PUNTUALIDAD / RESPONSABILIDAD
  {id:"pr1",categoria:"puntualidad",pregunta:"Tienes una clienta a las 9:00 a.m. y vas a llegar 15 minutos tarde. ¿Qué haces?",opciones:[{texto:"Aviso con anticipación, me disculpo y organizo para que no vuelva a pasar.",puntos:5},{texto:"Llego tarde y me disculpo al entrar.",puntos:2},{texto:"Le digo que el tráfico estuvo terrible y ya.",puntos:1},{texto:"No digo nada y espero que no se moleste.",puntos:0}]},
  {id:"pr2",categoria:"puntualidad",pregunta:"Tienes un compromiso personal el sábado pero tu turno está asignado. ¿Qué haces?",opciones:[{texto:"Aviso con días de anticipación y busco a alguien que me cubra.",puntos:5},{texto:"Aviso el mismo día que no puedo ir.",puntos:1},{texto:"Simplemente no llego.",puntos:0},{texto:"Voy aunque esté cansada porque el trabajo es primero.",puntos:4}]},
  {id:"pr3",categoria:"puntualidad",pregunta:"Terminaste todos tus clientes del día con una hora de sobra. ¿Qué haces?",opciones:[{texto:"Organizo mi estación, ayudo en lo que se necesite o practico nuevas técnicas.",puntos:5},{texto:"Me siento a revisar el celular hasta que termine el turno.",puntos:1},{texto:"Le pido a la encargada que me deje salir antes.",puntos:2},{texto:"Aprovecho para chatear con compañeras.",puntos:1}]},
  // ACTITUD DE SERVICIO
  {id:"as1",categoria:"actitud",pregunta:"Una clienta llega de mal humor y empieza a quejarse de todo, incluyendo del trabajo de otra manicurista. ¿Qué haces?",opciones:[{texto:"La escucho con paciencia, no me uno a las críticas y ofrezco lo mejor de mí.",puntos:5},{texto:"Le doy la razón en todo para que se calme.",puntos:2},{texto:"Le digo que tiene razón y que esa compañera siempre hace mal su trabajo.",puntos:0},{texto:"Me molesto internamente pero no digo nada.",puntos:3}]},
  {id:"as2",categoria:"actitud",pregunta:"Una clienta pide un diseño muy complicado que nunca has hecho. ¿Qué le dices?",opciones:[{texto:"Le digo la verdad, le muestro diseños que sí domino y ofrezco intentarlo si ella entiende que puede quedar diferente.",puntos:5},{texto:"Acepto sin mencionar que no lo he hecho y espero que quede bien.",puntos:1},{texto:"Le digo que no puedo hacerlo y punto.",puntos:2},{texto:"Le cobro extra porque es difícil y lo intento.",puntos:2}]},
  {id:"as3",categoria:"actitud",pregunta:"Hay una clienta que siempre llega tarde, habla mucho y hace que todo se demore. ¿Qué haces?",opciones:[{texto:"La atiendo con la misma amabilidad de siempre, pero con la encargada conversamos sobre sus horarios.",puntos:5},{texto:"Le demuestro con mi actitud que estoy incómoda.",puntos:1},{texto:"Le digo directamente que está abusando.",puntos:1},{texto:"La atiendo rápido para terminar cuanto antes aunque el trabajo no quede perfecto.",puntos:0}]},
  // DISPOSICIÓN A CRECER
  {id:"dc1",categoria:"crecimiento",pregunta:"Seycare organiza una capacitación un sábado. No es obligatoria pero les piden asistir. ¿Qué haces?",opciones:[{texto:"Voy porque sé que aprender me beneficia a mí y al equipo.",puntos:5},{texto:"Voy solo si me pagan ese día.",puntos:1},{texto:"No voy porque es mi día libre.",puntos:0},{texto:"Voy si mis compañeras también van.",puntos:2}]},
  {id:"dc2",categoria:"crecimiento",pregunta:"Tu supervisora te hace una observación sobre cómo haces una técnica. Llevas tiempo haciéndolo así y sientes que funciona. ¿Cómo reaccionas?",opciones:[{texto:"Escucho la observación, la tomo en cuenta y lo intento de la manera que me sugieren.",puntos:5},{texto:"Le explico por qué lo hago así y negociamos.",puntos:4},{texto:"Asiento pero sigo igual.",puntos:1},{texto:"Me molesta que me corrijan delante de alguien.",puntos:0}]},
  {id:"dc3",categoria:"crecimiento",pregunta:"¿Dónde te ves en 2 años dentro de la industria de la belleza?",opciones:[{texto:"Quiero especializarme en más técnicas y quizás liderar un equipo.",puntos:5},{texto:"Quiero tener suficientes clientas fijas para vivir bien.",puntos:4},{texto:"No lo he pensado mucho.",puntos:1},{texto:"Quiero tener mi propio salón independiente lo antes posible.",puntos:2}]},
  // FIT CULTURAL SEYCARE
  {id:"fc1",categoria:"fit",pregunta:"Seycare tiene una regla: antes de salir, todas revisan que el área de trabajo esté perfecta. ¿Cómo te sientes con eso?",opciones:[{texto:"Me parece bien, es parte del trabajo y da buena imagen.",puntos:5},{texto:"Está bien pero que sea rápido.",puntos:3},{texto:"Me parece innecesario si ya atendí a mis clientas.",puntos:1},{texto:"Depende de cómo esté el día.",puntos:2}]},
  {id:"fc2",categoria:"fit",pregunta:"Una compañera tiene un día muy difícil y su ánimo está afectando el ambiente. ¿Qué haces?",opciones:[{texto:"Le pregunto discretamente si está bien y le ofrezco apoyo sin descuidar mis clientas.",puntos:5},{texto:"No me meto, es su problema.",puntos:1},{texto:"Le digo que no puede mostrar eso en el trabajo.",puntos:2},{texto:"Le cuento a la encargada para que ella lo maneje.",puntos:3}]},
  {id:"fc3",categoria:"fit",pregunta:"Una clienta te pregunta si puede seguirte en redes sociales y trabajar contigo de forma independiente. ¿Qué respondes?",opciones:[{texto:"Con gusto puedes seguirme, pero mi trabajo se hace aquí en Seycare. Aquí te atiendo con todo.",puntos:5},{texto:"Le doy mi número personal para coordinar.",puntos:0},{texto:"Le digo que hablaré con mi jefa antes de responder.",puntos:3},{texto:"Acepto porque igual no creo que sea un problema.",puntos:0}]},
];

const CAT_META = {
  lealtad:     {label:"Lealtad y confidencialidad",  icon:"🔒", color:"#7c3aed"},
  honestidad:  {label:"Honestidad y transparencia",   icon:"🤝", color:"#0891b2"},
  puntualidad: {label:"Puntualidad y responsabilidad",icon:"⏰", color:"#059669"},
  actitud:     {label:"Actitud de servicio",           icon:"✨", color:"#d97706"},
  crecimiento: {label:"Disposición a crecer",          icon:"🌱", color:"#16a34a"},
  fit:         {label:"Fit cultural Seycare",          icon:"💎", color:"#db2777"},
};

const FOLLOW_UPS = {
  lealtad:["¿Alguna vez tuviste que guardar información sensible en un trabajo anterior? ¿Cómo lo manejaste?","¿Qué harías si una compañera te pidiera que cubrieras algo que te parece incorrecto?","Si una clienta te pide descuento y saltar el sistema, ¿cómo respondes?"],
  honestidad:["Cuéntame de una situación donde tuviste que decir algo difícil pero necesario.","¿Cómo manejarías un error que cometiste y que afectó a una clienta?","Si olvidaras registrar un servicio, ¿qué harías?"],
  puntualidad:["¿Cómo organizas tu tiempo para cumplir con todos tus compromisos?","¿Qué haces cuando el día se pone más pesado de lo esperado?","¿Has trabajado con turnos fijos antes? ¿Cómo te fue?"],
  actitud:["Cuéntame de una clienta difícil que hayas tenido. ¿Cómo lo resolviste?","¿Cómo te sientes cuando recibes críticas de tu trabajo?","¿Qué haces para que una clienta nueva se sienta bienvenida?"],
  crecimiento:["¿Cuál fue la última técnica o habilidad nueva que aprendiste?","¿Qué harías si vieras que en otro salón hacen algo mejor que aquí?","¿Cómo reaccionas cuando algo no te sale bien a la primera?"],
  fit:["¿Qué esperas de la cultura y ambiente de trabajo ideal para ti?","¿Cómo manejarías un conflicto con una compañera?","¿Qué significa para ti trabajar en equipo?"],
};

function CandidateTest({candidataId,candidataNombre,onComplete,onExit}){
  const [respuestas,setRespuestas]=useState({});
  const [pregIdx,setPregIdx]=useState(0);
  const [fase,setFase]=useState("intro");
  const [guardando,setGuardando]=useState(false);
  const [operadorVisible,setOperadorVisible]=useState(false);
  const total=TEST_PREGUNTAS.length;
  const preg=TEST_PREGUNTAS[pregIdx];
  const respondidas=Object.keys(respuestas).length;

  const seleccionar=(pregId,opIdx)=>{
    setRespuestas(r=>({...r,[pregId]:opIdx}));
    setTimeout(()=>{if(pregIdx<total-1)setPregIdx(i=>i+1);},300);
  };

  const finalizar=async()=>{
    setGuardando(true);
    const resultado={};
    TEST_PREGUNTAS.forEach(p=>{const idx=respuestas[p.id];resultado[p.id]={categoria:p.categoria,opcion:idx??null,puntos:idx!=null?p.opciones[idx].puntos:0};});
    const catScores={};
    Object.keys(CAT_META).forEach(catKey=>{
      const pregsInCat=TEST_PREGUNTAS.filter(p=>p.categoria===catKey);
      const suma=pregsInCat.reduce((acc,p)=>acc+(resultado[p.id]?.puntos||0),0);
      catScores[catKey]=pregsInCat.length>0?+(suma/pregsInCat.length).toFixed(2):0;
    });
    resultado._catScores=catScores;
    try{await supabase.from("candidatas").update({resultado_test:resultado,test_completado:true}).eq("id",candidataId);}catch(e){console.error(e);}
    setGuardando(false);setFase("gracias");if(onComplete)onComplete();
  };

  if(fase==="intro")return(
    <div style={{minHeight:"100vh",background:T.soft,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        <img src={ICON_SRC} alt="Seycare" style={{width:64,marginBottom:20}}/>
        <h2 style={{fontSize:24,fontWeight:700,color:T.ink,margin:"0 0 12px"}}>Evaluación Seycare</h2>
        <p style={{color:T.inkLight,lineHeight:1.7,fontSize:15,margin:"0 0 8px"}}>Hola <strong>{candidataNombre}</strong> 👋</p>
        <p style={{color:T.inkLight,lineHeight:1.7,fontSize:14,margin:"0 0 28px"}}>A continuación encontrarás {total} situaciones breves. No hay respuestas correctas o incorrectas — queremos conocer cómo piensas y actúas. Sé honesta, tómate tu tiempo.</p>
        <div style={{background:T.white,borderRadius:16,padding:"16px 20px",marginBottom:28,border:`1px solid ${T.border}`,textAlign:"left"}}>
          {[`📱 ${total} preguntas rápidas`,`⏱️ Aprox. 5-7 minutos`,`🔒 Tus respuestas son confidenciales`].map(t=>(<div key={t} style={{padding:"8px 0",fontSize:14,color:T.ink,borderBottom:`1px solid ${T.tealLight}`}}>{t}</div>))}
        </div>
        <button onClick={()=>setFase("test")} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${T.teal},${T.tealDeep})`,color:T.white,fontWeight:700,fontSize:16,cursor:"pointer",boxShadow:`0 4px 16px ${T.teal}55`}}>Comenzar evaluación →</button>
      </div>
    </div>
  );

  if(fase==="gracias")return(
    <div style={{minHeight:"100vh",background:T.soft,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
      <div style={{maxWidth:380,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>💅</div>
        <h2 style={{fontSize:26,fontWeight:700,color:T.ink,margin:"0 0 12px"}}>¡Gracias, {candidataNombre}!</h2>
        <p style={{color:T.inkLight,lineHeight:1.7,fontSize:15,margin:"0 0 24px"}}>Completaste la evaluación. Ahora devuélvele el iPad a Andrés para continuar con la entrevista.</p>
        <div style={{background:`linear-gradient(135deg,${T.teal},${T.tealDeep})`,borderRadius:16,padding:"20px",color:T.white,marginBottom:28}}>
          <p style={{margin:0,fontSize:14,lineHeight:1.6,fontWeight:500}}>🌊 Gracias por tu tiempo y honestidad. Valoramos mucho a las personas que se conocen a sí mismas. ¡Mucho éxito!</p>
        </div>
        <img src={LOGO_SRC} alt="Seycare Nails" style={{height:32,opacity:0.4,marginBottom:32}}/>
        {/* Botón oculto para operador — toca 3 veces el logo o el botón discreto */}
        {!operadorVisible
          ? <button onClick={()=>setOperadorVisible(true)} style={{background:"transparent",border:"none",color:"transparent",fontSize:10,cursor:"pointer",padding:"12px 24px",userSelect:"none"}}>·</button>
          : <button onClick={onExit} style={{padding:"14px 32px",borderRadius:14,border:`1.5px solid ${T.border}`,background:T.white,color:T.inkLight,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>← Volver al panel (Andrés)</button>
        }
      </div>
    </div>
  );

  const pct=Math.round((respondidas/total)*100);
  const optSel=respuestas[preg.id]??null;
  const cat=CAT_META[preg.categoria];

  return(
    <div style={{minHeight:"100vh",background:T.soft,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
      <div style={{background:`linear-gradient(150deg,${T.tealDeep},${T.teal})`,padding:"20px 20px 0",color:T.white}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <img src={ICON_SRC} alt="Seycare" style={{width:32,filter:"brightness(0) invert(1)"}}/>
          <div style={{fontSize:13,fontWeight:700,opacity:0.85}}>Evaluación Seycare Nails®</div>
          <div style={{marginLeft:"auto",fontSize:13,fontWeight:700}}>{respondidas}/{total}</div>
        </div>
        <div style={{height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,overflow:"hidden",marginBottom:0}}>
          <div style={{width:`${pct}%`,height:"100%",background:T.white,borderRadius:2,transition:"width 0.4s"}}/>
        </div>
        <svg viewBox="0 0 400 16" style={{display:"block",marginBottom:-1}}><path d="M0,8 C100,16 300,0 400,8 L400,16 L0,16 Z" fill={T.soft}/></svg>
      </div>
      <div style={{maxWidth:480,margin:"0 auto",padding:"20px 16px 80px"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:20,background:cat.color+"18",border:`1px solid ${cat.color}33`,marginBottom:16}}>
          <span>{cat.icon}</span>
          <span style={{fontSize:11,fontWeight:700,color:cat.color,letterSpacing:0.5}}>{cat.label.toUpperCase()}</span>
        </div>
        <div style={{background:T.white,borderRadius:18,padding:"24px 20px",marginBottom:20,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:12,color:T.inkLight,marginBottom:10,fontWeight:700}}>PREGUNTA {pregIdx+1} DE {total}</div>
          <p style={{fontSize:17,color:T.ink,lineHeight:1.6,margin:0,fontWeight:500}}>{preg.pregunta}</p>
        </div>
        <div style={{display:"grid",gap:10}}>
          {preg.opciones.map((op,idx)=>{
            const sel=optSel===idx;
            return(<button key={idx} onClick={()=>seleccionar(preg.id,idx)} style={{padding:"16px 18px",borderRadius:14,border:`2px solid ${sel?T.teal:T.border}`,background:sel?T.teal:T.white,color:sel?T.white:T.ink,textAlign:"left",fontSize:14,lineHeight:1.5,cursor:"pointer",fontWeight:sel?600:400,transition:"all 0.15s",boxShadow:sel?`0 4px 16px ${T.teal}44`:"none"}}><span style={{fontWeight:700,marginRight:8,opacity:0.5}}>{String.fromCharCode(65+idx)}.</span>{op.texto}</button>);
          })}
        </div>
        <div style={{display:"flex",gap:12,marginTop:24}}>
          {pregIdx>0&&<button onClick={()=>setPregIdx(i=>i-1)} style={{padding:"12px 20px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.white,color:T.inkLight,fontWeight:700,fontSize:14,cursor:"pointer"}}>← Anterior</button>}
          {respondidas===total&&<button onClick={finalizar} disabled={guardando} style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${T.teal},${T.tealDeep})`,color:T.white,fontWeight:700,fontSize:15,cursor:guardando?"not-allowed":"pointer",boxShadow:`0 4px 16px ${T.teal}55`}}>{guardando?"Guardando...":"✓ Finalizar evaluación"}</button>}
        </div>
      </div>
    </div>
  );
}

// ── Semáforo ─────────────────────────────────────────────────────
const SEMAFORO=[
  {v:"bien",    label:"Bien",    emoji:"✅", bg:"#dcfce7", border:"#16a34a", text:"#15803d"},
  {v:"explorar",label:"Explorar",emoji:"⚠️", bg:"#fef9c3", border:"#ca8a04", text:"#a16207"},
  {v:"alerta",  label:"Alerta",  emoji:"🚨", bg:"#fee2e2", border:"#dc2626", text:"#b91c1c"},
];
function SemaforoBtn({value,onChange,size="md"}){
  const pad=size==="sm"?"4px 9px":"6px 14px";
  const fz=size==="sm"?11:13;
  return(
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {SEMAFORO.map(s=>{
        const sel=value===s.v;
        return(
          <button key={s.v} onClick={()=>onChange(sel?null:s.v)}
            style={{padding:pad,borderRadius:20,border:`2px solid ${sel?s.border:"#e5e7eb"}`,background:sel?s.bg:"#fff",color:sel?s.text:"#9ca3af",fontSize:fz,fontWeight:sel?700:500,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",boxShadow:sel?`0 2px 8px ${s.border}33`:"none"}}>
            {s.emoji} {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ── InterviewGuide — 3 pasos ──────────────────────────────────────
// paso 0 = BRIEFING (antes de que entre la candidata)
// paso 1 = ENTREVISTA (categorías con alerta + preguntas dirigidas)
// paso 2 = VEREDICTO (semáforo x categoría + nota general)
function InterviewGuide({candidata,onBack,onSave}){
  const resultado=candidata.resultado_test||{};
  const catScores=resultado._catScores||{};
  const catKeys=Object.keys(CAT_META);

  // cal: { [catKey+"_cal"]: "bien"|"explorar"|"alerta", [catKey+"_nota"]: str }
  const [cal,setCal]=useState(candidata.entrevista_cal||{});
  const [notaGral,setNotaGral]=useState(candidata.entrevista_notas||"");
  const [guardado,setGuardado]=useState(false);
  const [paso,setPaso]=useState(0);   // 0=briefing 1=entrevista 2=veredicto
  const [catIdx,setCatIdx]=useState(0);

  const scoreColor=s=>s>=80?T.success:s>=60?T.teal:s>=40?T.gold:T.warn;
  const catScore=(k)=>Math.round((catScores[k]||0)*20);

  // Categorías ordenadas peor→mejor para enfocar la entrevista
  const catsSorted=[...catKeys].sort((a,b)=>catScore(a)-catScore(b));
  // Alertas = preguntas con puntos 0 o 1
  const alertasPorCat=(catKey)=>TEST_PREGUNTAS.filter(p=>{
    if(p.categoria!==catKey)return false;
    const r=resultado[p.id];return r&&r.puntos<=1;
  });
  const totalAlertas=catKeys.reduce((acc,k)=>acc+alertasPorCat(k).length,0);

  const setCatCal=(k,v)=>setCal(c=>({...c,[k+"_cal"]:v}));
  const setCatNota=(k,v)=>setCal(c=>({...c,[k+"_nota"]:v}));

  const guardar=async()=>{
    await supabase.from("candidatas").update({entrevista_cal:cal,entrevista_notas:notaGral}).eq("id",candidata.id);
    setGuardado(true);setTimeout(()=>setGuardado(false),2500);
    if(onSave)onSave({entrevista_cal:cal,entrevista_notas:notaGral});
  };

  // Puntaje entrevista = promedio de los semáforos asignados (bien=3, explorar=2, alerta=1)
  const semVal=(v)=>v==="bien"?3:v==="explorar"?2:v==="alerta"?1:0;
  const puntajeEntrevista=()=>{
    const vals=catKeys.map(k=>semVal(cal[k+"_cal"])).filter(v=>v>0);
    if(!vals.length)return null;
    const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
    return avg>=2.5?"bien":avg>=1.5?"explorar":"alerta";
  };

  // ── Paso 0: Briefing ─────────────────────────────────────────────
  if(paso===0){
    const testPct=candidata.test_completado
      ?Math.round(catKeys.reduce((a,k)=>a+(catScores[k]||0),0)/catKeys.length*20)
      :null;
    const semColorBg=s=>s>=80?"#dcfce7":s>=60?"#d0f4f4":s>=40?"#fef9c3":"#fee2e2";
    const semColorTxt=s=>s>=80?"#15803d":s>=60?T.tealDark:s>=40?"#92400e":"#991b1b";
    return(
      <div style={{minHeight:"100vh",background:T.soft,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
        <div style={{background:`linear-gradient(150deg,${T.tealDeep},${T.teal})`,padding:"20px 20px 0",color:T.white}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <button onClick={onBack} style={{background:"rgba(255,255,255,0.15)",border:"none",color:T.white,padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:13}}>← Volver</button>
            <div style={{fontSize:13,fontWeight:700,opacity:0.85}}>Guía de Entrevista</div>
            <div style={{width:72}}/>
          </div>
          <div style={{marginBottom:6}}><div style={{fontSize:19,fontWeight:700}}>{candidata.nombre}</div><div style={{fontSize:12,opacity:0.7}}>#{candidata.codigo_seguimiento}</div></div>
          <div style={{fontSize:12,opacity:0.6,marginBottom:16}}>PASO 1 DE 3 — Briefing previo</div>
          <svg viewBox="0 0 400 16" style={{display:"block",marginBottom:-1}}><path d="M0,8 C100,16 300,0 400,8 L400,16 L0,16 Z" fill={T.soft}/></svg>
        </div>

        <div style={{maxWidth:480,margin:"0 auto",padding:"20px 16px 40px"}}>
          {!candidata.test_completado&&(
            <div style={{background:"#fef9c3",border:"1px solid #fde047",borderRadius:14,padding:"14px 16px",marginBottom:18,fontSize:14,color:"#854d0e"}}>
              ⚠️ La candidata <strong>no completó el test</strong>. Usa solo las preguntas de seguimiento en la entrevista.
            </div>
          )}

          {candidata.test_completado&&(
            <>
              {/* Puntaje global */}
              <div style={{background:T.white,borderRadius:18,padding:"20px",marginBottom:16,border:`1px solid ${T.border}`,textAlign:"center"}}>
                <div style={{fontSize:12,color:T.inkLight,fontWeight:700,letterSpacing:0.5,marginBottom:8}}>RESULTADO DEL TEST</div>
                <div style={{fontSize:52,fontWeight:900,color:scoreColor(testPct),lineHeight:1}}>{testPct}%</div>
                <div style={{fontSize:13,color:T.inkLight,marginTop:6}}>{totalAlertas} respuesta{totalAlertas!==1?"s":""} con alerta detectada{totalAlertas!==1?"s":""}</div>
              </div>

              {/* Categorías rankeadas */}
              <div style={{background:T.white,borderRadius:18,padding:"18px",marginBottom:16,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:12,color:T.inkLight,fontWeight:700,letterSpacing:0.5,marginBottom:14}}>ÁREAS — PEOR A MEJOR</div>
                {catsSorted.map((k,i)=>{
                  const cm=CAT_META[k];const pct=catScore(k);const alertas=alertasPorCat(k);
                  return(
                    <div key={k} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                      <div style={{width:24,height:24,borderRadius:8,background:pct>=80?"#dcfce7":pct>=60?"#d0f4f4":pct>=40?"#fef9c3":"#fee2e2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{cm.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontSize:13,fontWeight:600,color:T.ink}}>{cm.label}</span>
                          <span style={{fontSize:13,fontWeight:700,color:scoreColor(pct)}}>{pct}%</span>
                        </div>
                        <div style={{height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:scoreColor(pct),borderRadius:3,transition:"width 0.5s"}}/>
                        </div>
                      </div>
                      {alertas.length>0&&<span style={{fontSize:11,fontWeight:700,color:"#b91c1c",background:"#fee2e2",border:"1px solid #fca5a5",padding:"2px 7px",borderRadius:10,whiteSpace:"nowrap",flexShrink:0}}>🚨 {alertas.length}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Alertas concretas */}
              {totalAlertas>0&&(
                <div style={{background:"#fff7ed",borderRadius:18,padding:"18px",marginBottom:16,border:"1px solid #fed7aa"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#c2410c",letterSpacing:0.5,marginBottom:12}}>🎯 EXPLORAR EN LA ENTREVISTA</div>
                  {catKeys.filter(k=>alertasPorCat(k).length>0).map(k=>{
                    const cm=CAT_META[k];
                    return(
                      <div key={k} style={{marginBottom:14}}>
                        <div style={{fontSize:12,fontWeight:700,color:cm.color,marginBottom:6}}>{cm.icon} {cm.label}</div>
                        {alertasPorCat(k).map(p=>{
                          const r=resultado[p.id];const idx=r?.opcion??null;
                          return(
                            <div key={p.id} style={{background:"#fff",borderRadius:10,padding:"10px 12px",marginBottom:6,border:"1px solid #fed7aa"}}>
                              <div style={{fontSize:12,color:T.inkLight,marginBottom:4,lineHeight:1.4}}>{p.pregunta}</div>
                              {idx!=null&&<div style={{fontSize:12,fontWeight:600,color:"#c2410c",fontStyle:"italic"}}>Respondió: "{p.opciones[idx].texto}"</div>}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <button onClick={()=>{setPaso(1);setCatIdx(0);}} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${T.teal},${T.tealDeep})`,color:T.white,fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:`0 4px 16px ${T.teal}44`}}>
            Comenzar entrevista →
          </button>
        </div>
      </div>
    );
  }

  // ── Paso 1: Entrevista por categoría ─────────────────────────────
  if(paso===1){
    const catKey=catsSorted[catIdx]; // peor primero
    const cm=CAT_META[catKey];
    const pct=catScore(catKey);
    const alertas=alertasPorCat(catKey);
    const follows=FOLLOW_UPS[catKey]||[];
    const total=catsSorted.length;
    const calActual=cal[catKey+"_cal"]||null;
    const notaActual=cal[catKey+"_nota"]||"";
    const semData=SEMAFORO.find(s=>s.v===calActual);
    const esUltima=catIdx===total-1;

    return(
      <div style={{minHeight:"100vh",background:T.soft,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
        <div style={{background:`linear-gradient(150deg,${T.tealDeep},${T.teal})`,padding:"20px 20px 0",color:T.white}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <button onClick={()=>catIdx>0?setCatIdx(i=>i-1):setPaso(0)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:T.white,padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:13}}>← Atrás</button>
            <div style={{fontSize:13,fontWeight:700,opacity:0.85}}>{catIdx+1} / {total}</div>
            <button onClick={guardar} style={{background:guardado?"rgba(110,231,183,0.4)":"rgba(255,255,255,0.15)",border:"none",color:T.white,padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:700}}>{guardado?"✓":"💾"}</button>
          </div>
          {/* Progress dots */}
          <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:12}}>
            {catsSorted.map((_,i)=><div key={i} style={{width:i===catIdx?20:6,height:6,borderRadius:3,background:i<=catIdx?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)",transition:"width 0.3s"}}/>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{cm.icon}</div>
            <div>
              <div style={{fontSize:16,fontWeight:700}}>{cm.label}</div>
              {candidata.test_completado&&<div style={{fontSize:12,opacity:0.75}}>Test: {pct}% {alertas.length>0?`· 🚨 ${alertas.length} alerta${alertas.length>1?"s":""}`:"· Sin alertas"}</div>}
            </div>
          </div>
          <svg viewBox="0 0 400 16" style={{display:"block",marginBottom:-1}}><path d="M0,8 C100,16 300,0 400,8 L400,16 L0,16 Z" fill={T.soft}/></svg>
        </div>

        <div style={{maxWidth:480,margin:"0 auto",padding:"18px 16px 40px"}}>
          {/* Alertas de esta categoría */}
          {candidata.test_completado&&alertas.length>0&&(
            <div style={{background:"#fff7ed",borderRadius:16,padding:"16px",marginBottom:16,border:"1px solid #fed7aa"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#c2410c",letterSpacing:0.5,marginBottom:10}}>🎯 LO QUE DIJO EN EL TEST — EXPLORAR</div>
              {alertas.map(p=>{
                const r=resultado[p.id];const idx=r?.opcion??null;
                return(
                  <div key={p.id} style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid #fed7aa"}}>
                    <div style={{fontSize:13,color:T.ink,lineHeight:1.45,marginBottom:5}}>{p.pregunta}</div>
                    {idx!=null&&<div style={{fontSize:13,fontStyle:"italic",color:"#c2410c",fontWeight:600,padding:"6px 10px",background:"#fff",borderRadius:8,border:"1px solid #fca5a5"}}>"{p.opciones[idx].texto}"</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Preguntas de seguimiento */}
          <div style={{background:T.white,borderRadius:16,padding:"16px",marginBottom:16,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,fontWeight:700,color:cm.color,letterSpacing:0.5,marginBottom:12}}>💬 PREGUNTA{follows.length>1?"S":""} PARA LA ENTREVISTA</div>
            {follows.map((q,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<follows.length-1?`1px solid ${T.tealLight}`:"none"}}>
                <div style={{width:22,height:22,borderRadius:8,background:cm.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:cm.color,flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:14,color:T.ink,lineHeight:1.55}}>{q}</span>
              </div>
            ))}
          </div>

          {/* Calificación de esta categoría */}
          <div style={{background:semData?semData.bg:T.white,borderRadius:16,padding:"16px",marginBottom:16,border:`2px solid ${semData?semData.border+"66":T.border}`,transition:"all 0.2s"}}>
            <div style={{fontSize:11,fontWeight:700,color:T.inkLight,letterSpacing:0.5,marginBottom:12}}>¿CÓMO RESPONDIÓ EN LA ENTREVISTA?</div>
            <SemaforoBtn value={calActual} onChange={v=>setCatCal(catKey,v)}/>
          </div>

          {/* Nota de esta categoría */}
          <div style={{background:T.white,borderRadius:16,padding:"16px",marginBottom:20,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,fontWeight:700,color:T.inkLight,letterSpacing:0.5,marginBottom:10}}>📝 NOTA (opcional)</div>
            <textarea value={notaActual} onChange={e=>setCatNota(catKey,e.target.value)} rows={3} placeholder="Observación libre sobre esta área..."
              style={{width:"100%",border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",fontSize:13,color:T.ink,resize:"none",outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:T.soft}}/>
          </div>

          <button
            onClick={()=>{if(esUltima)setPaso(2);else setCatIdx(i=>i+1);}}
            disabled={!calActual}
            style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:calActual?`linear-gradient(135deg,${T.teal},${T.tealDeep})`:"#e5e7eb",color:calActual?T.white:"#9ca3af",fontWeight:700,fontSize:15,cursor:calActual?"pointer":"not-allowed",boxShadow:calActual?`0 4px 16px ${T.teal}44`:"none",transition:"all 0.2s"}}>
            {esUltima?"Ver veredicto →":`Siguiente: ${CAT_META[catsSorted[catIdx+1]]?.label||""} →`}
          </button>
          {!calActual&&<div style={{textAlign:"center",fontSize:12,color:T.inkLight,marginTop:8}}>Selecciona ✅ ⚠️ o 🚨 para continuar</div>}
        </div>
      </div>
    );
  }

  // ── Paso 2: Veredicto final ───────────────────────────────────────
  const veredictoGlobal=puntajeEntrevista();
  const vData=SEMAFORO.find(s=>s.v===veredictoGlobal);
  return(
    <div style={{minHeight:"100vh",background:T.soft,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
      <div style={{background:`linear-gradient(150deg,${T.tealDeep},${T.teal})`,padding:"20px 20px 0",color:T.white}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <button onClick={()=>setPaso(1)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:T.white,padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:13}}>← Revisar</button>
          <div style={{fontSize:13,fontWeight:700,opacity:0.85}}>Veredicto Final</div>
          <button onClick={guardar} style={{background:guardado?"rgba(110,231,183,0.4)":"rgba(255,255,255,0.15)",border:"none",color:T.white,padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:700}}>{guardado?"✓ Guardado":"💾 Guardar"}</button>
        </div>
        <div style={{marginBottom:6}}><div style={{fontSize:18,fontWeight:700}}>{candidata.nombre}</div></div>
        <div style={{fontSize:12,opacity:0.6,marginBottom:16}}>PASO 3 DE 3 — Evaluación de la entrevista</div>
        <svg viewBox="0 0 400 16" style={{display:"block",marginBottom:-1}}><path d="M0,8 C100,16 300,0 400,8 L400,16 L0,16 Z" fill={T.soft}/></svg>
      </div>

      <div style={{maxWidth:480,margin:"0 auto",padding:"20px 16px 40px"}}>
        {/* Veredicto global */}
        {vData&&(
          <div style={{background:vData.bg,borderRadius:18,padding:"20px",marginBottom:18,border:`2px solid ${vData.border}`,textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:6}}>{vData.emoji}</div>
            <div style={{fontSize:22,fontWeight:800,color:vData.text}}>Perfil general: {vData.label}</div>
            <div style={{fontSize:13,color:vData.text,opacity:0.8,marginTop:6}}>Basado en el promedio de las 6 categorías</div>
          </div>
        )}

        {/* Tabla de resultados */}
        <div style={{background:T.white,borderRadius:18,padding:"18px",marginBottom:16,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:T.inkLight,letterSpacing:0.5,marginBottom:14}}>RESUMEN POR CATEGORÍA</div>
          {catKeys.map(k=>{
            const cm=CAT_META[k];
            const testPct=candidata.test_completado?catScore(k):null;
            const entV=cal[k+"_cal"]||null;
            const eData=SEMAFORO.find(s=>s.v===entV);
            const nota=cal[k+"_nota"]||"";
            return(
              <div key={k} style={{marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.tealLight}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:nota?6:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>{cm.icon}</span>
                    <span style={{fontSize:13,fontWeight:600,color:T.ink}}>{cm.label}</span>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {testPct!=null&&<span style={{fontSize:11,fontWeight:700,color:scoreColor(testPct),background:scoreColor(testPct)+"15",padding:"2px 7px",borderRadius:8}}>Test {testPct}%</span>}
                    {eData&&<span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:10,background:eData.bg,border:`1px solid ${eData.border}`,color:eData.text}}>{eData.emoji} {eData.label}</span>}
                    {!eData&&<button onClick={()=>{setPaso(1);setCatIdx(catsSorted.indexOf(k));}} style={{fontSize:11,color:T.inkLight,background:"transparent",border:`1px solid ${T.border}`,borderRadius:10,padding:"2px 8px",cursor:"pointer"}}>+ calificar</button>}
                  </div>
                </div>
                {nota&&<div style={{fontSize:12,color:T.inkLight,fontStyle:"italic",paddingLeft:24,lineHeight:1.45}}>{nota}</div>}
              </div>
            );
          })}
        </div>

        {/* Nota general */}
        <div style={{background:T.white,borderRadius:18,padding:"18px",marginBottom:20,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:T.inkLight,letterSpacing:0.5,marginBottom:12}}>📝 NOTAS GENERALES DE LA ENTREVISTA</div>
          <textarea style={{...iS,height:120,resize:"vertical",fontSize:13}} placeholder="Impresión general, lenguaje no verbal, próximos pasos..." value={notaGral} onChange={e=>setNotaGral(e.target.value)}/>
        </div>

        <button onClick={guardar} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:guardado?T.success:`linear-gradient(135deg,${T.teal},${T.tealDeep})`,color:T.white,fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:`0 4px 16px ${T.teal}44`,transition:"background 0.3s"}}>
          {guardado?"✓ Evaluación guardada":"💾 Guardar evaluación"}
        </button>
        <button onClick={onBack} style={{width:"100%",padding:"14px",borderRadius:14,border:`1.5px solid ${T.border}`,background:"transparent",color:T.inkLight,fontWeight:600,fontSize:14,cursor:"pointer",marginTop:10}}>
          Volver al perfil de la candidata
        </button>
      </div>
    </div>
  );
}

// ── OPERATOR PANEL ───────────────────────────────────────────
function OperatorPanel(){
  const [candidatas,setCandidatas]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("lista");
  const [selected,setSelected]=useState(null);
  const [filtro,setFiltro]=useState("todas");
  const [notasDraft,setNotasDraft]=useState("");
  const [notasSaved,setNotasSaved]=useState(false);
  const [calDraft,setCalDraft]=useState({});
  const [confirmDelete,setConfirmDelete]=useState(false);
  const [vistaEntrevista,setVistaEntrevista]=useState(null); // null | "test" | "guia"

  const [convs,setConvs]=useState([]);
  const [convId,setConvId]=useState(null);

  const cargarConvs=async()=>{
    const {data}=await supabase.from("convocatorias").select("*").order("id",{ascending:false});
    if(data){setConvs(data);const act=data.find(c=>c.activa)||data[0];if(act)setConvId(act.id);}
  };
  useEffect(()=>{cargarConvs();},[]);

  const cargar=async()=>{
    if(convId===null)return;
    setLoading(true);
    const {data,error}=await supabase.from("candidatas").select("*").eq("convocatoria_id",convId).order("created_at",{ascending:false});
    if(error)console.error(error);
    if(data)setCandidatas(data);
    setLoading(false);
  };
  useEffect(()=>{cargar();},[convId]);

  const abrirPerfil=(c)=>{setSelected(c);setNotasDraft(c.notas_operador||"");setCalDraft(c.calificacion||{});setNotasSaved(false);setConfirmDelete(false);};

  const cambiarEstado=async(id,nuevoEstado)=>{
    await supabase.from("candidatas").update({estado:nuevoEstado}).eq("id",id);
    setCandidatas(p=>p.map(c=>c.id===id?{...c,estado:nuevoEstado}:c));
    if(selected&&selected.id===id)setSelected(p=>({...p,estado:nuevoEstado}));
  };
  const toggleFavorita=async(id,actual)=>{
    const nuevo=!actual;
    await supabase.from("candidatas").update({favorita:nuevo}).eq("id",id);
    setCandidatas(p=>p.map(c=>c.id===id?{...c,favorita:nuevo}:c));
    if(selected&&selected.id===id)setSelected(p=>({...p,favorita:nuevo}));
  };
  const guardarNotas=async()=>{
    await supabase.from("candidatas").update({notas_operador:notasDraft}).eq("id",selected.id);
    setCandidatas(p=>p.map(c=>c.id===selected.id?{...c,notas_operador:notasDraft}:c));
    setSelected(p=>({...p,notas_operador:notasDraft}));
    setNotasSaved(true);setTimeout(()=>setNotasSaved(false),2000);
  };
  const guardarCal=async(id,key,val)=>{
    const next={...calDraft,[key]:val};
    setCalDraft(next);
    await supabase.from("candidatas").update({calificacion:next}).eq("id",id);
    setCandidatas(p=>p.map(c=>c.id===id?{...c,calificacion:next}:c));
    setSelected(p=>({...p,calificacion:next}));
  };
  const eliminar=async(id)=>{
    await supabase.from("candidatas").delete().eq("id",id);
    setCandidatas(p=>p.filter(c=>c.id!==id));
    setSelected(null);
  };

  const grupos={activa:"En proceso",finalista:"Finalistas",cerrada:"Cerradas"};
  const counts=Object.fromEntries(Object.keys(ESTADOS).map(k=>[k,candidatas.filter(c=>c.estado===k).length]));
  const totalFinalistas=candidatas.filter(c=>c.estado==="finalista"||c.estado==="lista_espera").length;
  const favoritas=candidatas.filter(c=>c.favorita);
  const filtradas=candidatas.filter(c=>{
    if(filtro==="todas")return true;
    if(filtro==="favoritas")return c.favorita;
    if(filtro==="activas")return ESTADOS[c.estado]?.grupo==="activa";
    if(filtro==="cerradas")return ESTADOS[c.estado]?.grupo==="cerrada";
    return c.estado===filtro;
  });

  // Perfil
  if(selected){
    if(vistaEntrevista==="test") return(
      <CandidateTest
        candidataId={selected.id}
        candidataNombre={selected.nombre.split(" ")[0]}
        onComplete={()=>{
          // Refresh data silently — candidata still sees "gracias" screen
          supabase.from("candidatas").select("*").eq("id",selected.id).single().then(({data})=>{
            if(data){setSelected(data);setCandidatas(p=>p.map(c=>c.id===data.id?data:c));}
          });
          // Do NOT close here — CandidateTest handles its own "gracias" screen.
          // Operator taps "Volver al panel" from inside CandidateTest.
        }}
        onExit={()=>setVistaEntrevista(null)}
      />
    );
    if(vistaEntrevista==="guia") return(
      <InterviewGuide
        candidata={selected}
        onBack={()=>setVistaEntrevista(null)}
        onSave={(updates)=>{
          setSelected(p=>({...p,...updates}));
          setCandidatas(p=>p.map(c=>c.id===selected.id?{...c,...updates}:c));
        }}
      />
    );
    const c=selected;
    const estObj=ESTADOS[c.estado]||ESTADOS["recibida"];
    const pts=puntajeTotal(c.calificacion||{});
    const tipoWA=c.estado==="finalista"?"oferta":c.estado==="lista_espera"?"espera":"entrevista";
    const mostrarWA=["preseleccionada","citada","finalista","lista_espera"].includes(c.estado);

    const SecConEval=({title,calKey,children})=>(
      <div style={{background:T.white,borderRadius:16,padding:"18px",marginBottom:14,border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:T.tealDark,letterSpacing:1,textTransform:"uppercase"}}>{title}</div>
          {calKey&&<div style={{display:"flex",alignItems:"center",gap:4}}>
            <StarRating value={calDraft[calKey]||0} onChange={v=>guardarCal(c.id,calKey,v)} size={18}/>
            {(calDraft[calKey]||0)>0&&<span style={{fontSize:11,color:T.inkLight,minWidth:24}}>{calDraft[calKey]}/5</span>}
          </div>}
        </div>
        {children}
      </div>
    );
    const DRow=({l,v})=>v?(<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid ${T.tealLight}`}}><span style={{fontSize:12,color:T.inkLight,flexShrink:0}}>{l}</span><span style={{fontSize:13,color:T.ink,fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</span></div>):null;

    return(
      <div style={{minHeight:"100vh",background:T.soft,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
        <div style={{background:`linear-gradient(150deg,${T.tealDeep},${T.teal})`,padding:"20px 20px 0",color:T.white}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button onClick={()=>setSelected(null)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:T.white,padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:13}}>← Volver</button>
            <FavBtn active={c.favorita} onClick={()=>toggleFavorita(c.id,c.favorita)}/>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div><h2 style={{margin:0,fontSize:22,fontWeight:700}}>{c.nombre}{c.favorita?" ❤️":""}</h2><p style={{margin:"3px 0 0",opacity:0.7,fontSize:13}}>#{c.codigo_seguimiento} · {new Date(c.created_at).toLocaleDateString("es-EC")}</p></div>
            <PuntajeBadge puntaje={pts}/>
          </div>
          <svg viewBox="0 0 400 20" style={{display:"block",marginBottom:-1}}><path d="M0,10 C100,20 300,0 400,10 L400,20 L0,20 Z" fill={T.soft}/></svg>
        </div>

        <div style={{maxWidth:480,margin:"0 auto",padding:"16px 16px 80px"}}>
          <div style={{background:estObj.bg,border:`1.5px solid ${estObj.color}44`,borderRadius:14,padding:"10px 16px",marginBottom:12}}><span style={{color:estObj.color,fontWeight:700,fontSize:14}}>● {estObj.label}</span></div>
          {mostrarWA&&<WhatsAppBtn candidata={c} tipo={tipoWA}/>}

          {/* Botones de entrevista */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <button onClick={()=>setVistaEntrevista("test")} style={{padding:"13px 10px",borderRadius:12,border:"1.5px solid #7c3aed",background:c.test_completado?"#f5f3ff":T.white,color:"#7c3aed",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <span>{c.test_completado?"✓ Test":"📋 Test"}</span>
              <span style={{fontSize:10,opacity:0.7,fontWeight:400}}>{c.test_completado?"Completado · ver de nuevo":"Dar iPad a candidata"}</span>
            </button>
            <button onClick={()=>setVistaEntrevista("guia")} style={{padding:"13px 10px",borderRadius:12,border:`1.5px solid ${T.teal}`,background:T.white,color:T.teal,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <span>🎯 Entrevista</span>
              <span style={{fontSize:10,opacity:0.7,fontWeight:400}}>Guía del operador</span>
            </button>
          </div>

          {/* Resultados de entrevista */}
          {c.entrevista_cal&&Object.keys(c.entrevista_cal).some(k=>k.endsWith("_cal"))&&(()=>{
            const cal=c.entrevista_cal||{};
            const semVal=v=>v==="bien"?3:v==="explorar"?2:v==="alerta"?1:0;
            const semIcon=v=>v==="bien"?"✅":v==="explorar"?"⚠️":v==="alerta"?"🚨":"—";
            const semColor=v=>v==="bien"?"#059669":v==="explorar"?"#d97706":v==="alerta"?"#dc2626":"#9ca3af";
            const semBg=v=>v==="bien"?"#d1fae5":v==="explorar"?"#fef3c7":v==="alerta"?"#fee2e2":"#f3f4f6";
            const vals=Object.keys(CAT_META).map(k=>semVal(cal[k+"_cal"])).filter(v=>v>0);
            const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;
            const veredicto=avg>=2.5?"bien":avg>=1.5?"explorar":avg>0?"alerta":null;
            return(
              <div style={{background:T.white,borderRadius:16,padding:"18px",marginBottom:10,border:`2px solid ${veredicto?semColor(veredicto)+"44":T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.tealDark,letterSpacing:1,textTransform:"uppercase"}}>🎯 Entrevista</div>
                  {veredicto&&<span style={{padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:700,background:semBg(veredicto),color:semColor(veredicto)}}>{semIcon(veredicto)} {veredicto==="bien"?"Perfil Sólido":veredicto==="explorar"?"Revisar":"Alerta"}</span>}
                  <button onClick={()=>setVistaEntrevista("guia")} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:10,padding:"4px 10px",fontSize:12,color:T.inkLight,cursor:"pointer"}}>✏️ Editar</button>
                </div>
                {Object.keys(CAT_META).map(k=>{
                  const v=cal[k+"_cal"];
                  const nota=cal[k+"_nota"];
                  if(!v)return null;
                  return(
                    <div key={k} style={{padding:"10px 0",borderBottom:`1px solid ${T.tealLight}`}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <span style={{fontSize:13,color:T.ink}}>{CAT_META[k].icon} {CAT_META[k].label}</span>
                        <span style={{padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700,background:semBg(v),color:semColor(v)}}>{semIcon(v)}</span>
                      </div>
                      {nota&&<p style={{margin:"6px 0 0",fontSize:12,color:T.inkLight,lineHeight:1.5,paddingLeft:4}}>{nota}</p>}
                    </div>
                  );
                })}
                {c.entrevista_notas&&(
                  <div style={{marginTop:12,padding:"10px 12px",background:T.tealLight,borderRadius:10}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.tealDark,marginBottom:4}}>NOTAS GENERALES</div>
                    <p style={{margin:0,fontSize:13,color:T.tealDark,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{c.entrevista_notas}</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Evaluación */}
          <div style={{background:T.white,borderRadius:16,padding:"18px",marginBottom:14,border:`1px solid ${T.gold}44`}}>
            <div style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>⭐ Evaluación</div>
            {CRITERIOS.map(cr=>(<div key={cr.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.tealLight}`}}>
              <span style={{fontSize:13,color:T.ink}}>{cr.icon} {cr.label}</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}><StarRating value={calDraft[cr.key]||0} onChange={v=>guardarCal(c.id,cr.key,v)} size={20}/>{(calDraft[cr.key]||0)>0&&<span style={{fontSize:11,color:T.inkLight,minWidth:20}}>{calDraft[cr.key]}/5</span>}</div>
            </div>))}
            <div style={{marginTop:12,padding:"10px 14px",background:T.tealLight,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:T.tealDark,fontWeight:700}}>Puntaje total</span>
              <PuntajeBadge puntaje={puntajeTotal(calDraft)}/>
            </div>
          </div>

          {/* Estado */}
          <div style={{background:T.white,borderRadius:16,padding:"18px",marginBottom:14,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:T.tealDark,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>📋 Mover en el proceso</div>
            {Object.entries(grupos).map(([grupo,labelGrupo])=>(<div key={grupo} style={{marginBottom:12}}><div style={{fontSize:11,color:T.inkLight,fontWeight:700,marginBottom:6}}>{labelGrupo}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.entries(ESTADOS).filter(([,v])=>v.grupo===grupo).map(([k,v])=>(<button key={k} onClick={()=>cambiarEstado(c.id,k)} style={{padding:"7px 13px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:`1.5px solid ${v.color}`,background:c.estado===k?v.color:T.white,color:c.estado===k?T.white:v.color}}>{v.label}</button>))}</div></div>))}
          </div>

          {/* Notas */}
          <div style={{background:T.white,borderRadius:16,padding:"18px",marginBottom:14,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:T.tealDark,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>📝 Mis notas</div>
            <textarea style={{...iS,height:90,resize:"vertical",fontSize:13}} placeholder="Impresiones, observaciones, seguimiento..." value={notasDraft} onChange={e=>{setNotasDraft(e.target.value);setNotasSaved(false);}}/>
            <button onClick={guardarNotas} style={{marginTop:8,padding:"9px 20px",borderRadius:10,border:"none",background:notasSaved?T.success:T.teal,color:T.white,fontWeight:700,fontSize:13,cursor:"pointer",transition:"background 0.3s"}}>{notasSaved?"✓ Guardado":"Guardar notas"}</button>
          </div>

          <SecConEval title="📞 Contacto">
            <DRow l="Teléfono" v={c.telefono}/><DRow l="Edad" v={c.edad?`${c.edad} años`:null}/><DRow l="Sector" v={c.zona_residencia}/><DRow l="Transporte" v={TRANSPORTES.find(t=>t.value===c.transporte)?.label}/>
          </SecConEval>

          <SecConEval title="💅 Habilidades" calKey="experiencia">
            <DRow l="Experiencia" v={c.experiencia}/><DRow l="Nivel" v={c.certificacion_tipo}/>
            {c.certificacion_detalle&&<div style={{marginTop:10,padding:"12px",background:T.tealLight,borderRadius:10}}><p style={{margin:0,fontSize:13,color:T.tealDark,lineHeight:1.6}}>{c.certificacion_detalle}</p></div>}
            {(c.especialidades||[]).length>0&&<div style={{marginTop:12}}><div style={{fontSize:11,color:T.inkLight,marginBottom:8,fontWeight:700}}>ESPECIALIDADES</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{c.especialidades.map(e=>(<span key={e} style={{padding:"4px 12px",background:T.tealLight,border:`1px solid ${T.tealMid}`,borderRadius:20,fontSize:12,color:T.tealDark,fontWeight:600}}>{e}</span>))}</div></div>}
            <ArchivosCandidata rutas={c.archivos}/>
            {/* Portafolio */}
            {(c.portfolio_link||c.cv_url)&&<div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
              {c.portfolio_link&&<a href={c.portfolio_link} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:20,background:T.tealLight,border:`1px solid ${T.tealMid}`,color:T.tealDark,fontSize:13,fontWeight:700,textDecoration:"none"}}>🔗 Ver portafolio</a>}
              {c.cv_url&&<a href={c.cv_url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:20,background:"#f5f3ff",border:"1px solid #ddd6fe",color:T.purple,fontSize:13,fontWeight:700,textDecoration:"none"}}>📎 Ver CV / archivo</a>}
            </div>}
          </SecConEval>

          <SecConEval title="🕐 Disponibilidad" calKey="disponibilidad">
            <DRow l="Días" v={(c.dias||[]).join(", ")}/><DRow l="Entrada" v={c.hora_entrada}/><DRow l="Hasta" v={c.hora_salida}/><DRow l="Inicio" v={c.disponibilidad_inmediata}/>
          </SecConEval>

          <SecConEval title="💰 Condiciones económicas" calKey="economia">
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>{(c.modalidades||[]).map(m=>{const mod=MODALIDADES.find(x=>x.value===m);return mod?(<span key={m} style={{padding:"5px 14px",background:T.tealLight,border:`1px solid ${T.tealMid}`,borderRadius:20,fontSize:12,color:T.tealDark,fontWeight:700}}>{mod.icon} {mod.label}</span>):null;})}</div>
            <DRow l="Salario base" v={c.salario_esperado}/>
          </SecConEval>

          {c.info_adicional&&<div style={{background:T.white,borderRadius:16,padding:"18px",marginBottom:14,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:T.tealDark,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>💬 Info adicional</div>
            <p style={{margin:0,color:T.inkLight,fontSize:14,lineHeight:1.7,fontStyle:"italic"}}>"{c.info_adicional}"</p>
          </div>}

          {/* Eliminar */}
          <div style={{marginTop:24,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
            {!confirmDelete
              ?<button onClick={()=>setConfirmDelete(true)} style={{width:"100%",padding:"12px",borderRadius:12,border:`1.5px solid ${T.warn}`,background:T.white,color:T.warn,fontWeight:700,fontSize:13,cursor:"pointer"}}>🗑️ Eliminar registro</button>
              :<div style={{background:"#fef2f2",borderRadius:12,padding:"16px",textAlign:"center"}}>
                <p style={{margin:"0 0 12px",fontSize:14,color:T.warn,fontWeight:700}}>¿Eliminar a {c.nombre} permanentemente?</p>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setConfirmDelete(false)} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.white,color:T.inkLight,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
                  <button onClick={()=>eliminar(c.id)} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:T.warn,color:T.white,fontWeight:700,cursor:"pointer"}}>Sí, eliminar</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

  // Lista
  return(
    <div style={{minHeight:"100vh",background:T.soft,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
      <div style={{background:`linear-gradient(150deg,${T.tealDeep},${T.teal})`,padding:"28px 20px 0",color:T.white}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><img src={ICON_SRC} alt="Seycare" style={{width:36,height:36,objectFit:"contain",filter:"brightness(0) invert(1)"}}/><div><div style={{fontSize:11,letterSpacing:2,opacity:0.7,textTransform:"uppercase"}}>Panel interno · Quito</div><div style={{fontSize:18,fontWeight:700}}>Seycare Nails®</div></div></div>
          <button onClick={cargar} style={{background:"rgba(255,255,255,0.15)",border:"none",color:T.white,padding:"8px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700}}>↻ Actualizar</button>
        </div>
        {convs.length>0&&<select value={convId??""} onChange={e=>{setSelected(null);setConvId(Number(e.target.value));}} style={{width:"100%",marginBottom:12,padding:"10px 12px",borderRadius:10,border:"none",fontSize:14,fontWeight:700}}>
          {convs.map(c=><option key={c.id} value={c.id}>{c.nombre}{c.activa?" (activa)":" (cerrada)"}</option>)}
        </select>}
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:12}}>
          {[{label:"Total",val:candidatas.length,color:"rgba(255,255,255,0.9)"},{label:"En proceso",val:candidatas.filter(c=>ESTADOS[c.estado]?.grupo==="activa").length,color:T.tealMid},{label:"❤️ Favoritas",val:favoritas.length,color:"#fda4af"},{label:"Finalistas",val:totalFinalistas,color:"#fde68a"},{label:"No asistió",val:counts.no_asistio||0,color:"#fca5a5"},{label:"Contratadas",val:counts.contratada||0,color:"#6ee7b7"}].map(s=>(<div key={s.label} style={{minWidth:80,textAlign:"center",background:"rgba(255,255,255,0.12)",borderRadius:12,padding:"10px 8px",flexShrink:0}}><div style={{fontSize:20,fontWeight:700,color:s.color}}>{s.val}</div><div style={{fontSize:10,opacity:0.75}}>{s.label}</div></div>))}
        </div>
        <div style={{display:"flex",gap:0,borderBottom:"1px solid rgba(255,255,255,0.2)"}}>
          {[{id:"lista",label:"Candidatas"},{id:"finalistas",label:`⭐ Finalistas${totalFinalistas>0?` (${totalFinalistas})`:""}`}].map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"12px",border:"none",background:"transparent",cursor:"pointer",color:tab===t.id?T.white:"rgba(255,255,255,0.6)",fontWeight:tab===t.id?700:400,fontSize:14,borderBottom:tab===t.id?`3px solid ${T.white}`:"3px solid transparent"}}>{t.label}</button>))}
        </div>
        <svg viewBox="0 0 400 16" style={{display:"block",marginBottom:-1}}><path d="M0,8 C100,16 300,0 400,8 L400,16 L0,16 Z" fill={T.soft}/></svg>
      </div>

      <div style={{maxWidth:480,margin:"0 auto",padding:"16px"}}>
        {loading&&<div style={{textAlign:"center",padding:"48px 24px",color:T.inkLight}}><div style={{fontSize:32,marginBottom:12}}>⏳</div><p>Cargando candidatas...</p></div>}

        {!loading&&tab==="finalistas"&&(()=>{
          const fins=[...candidatas.filter(c=>c.estado==="finalista"||c.estado==="lista_espera")].sort((a,b)=>puntajeTotal(b.calificacion)-puntajeTotal(a.calificacion));
          if(!fins.length)return(<div style={{textAlign:"center",padding:"48px 24px",color:T.inkLight}}><div style={{fontSize:48,marginBottom:12}}>⭐</div><p style={{fontWeight:700,color:T.ink}}>Sin finalistas aún</p><p style={{fontSize:14}}>Marca candidatas como "Finalista ⭐" desde su perfil.</p></div>);
          return fins.map((c,idx)=>{
            const pts=puntajeTotal(c.calificacion);
            return(<div key={c.id} style={{background:T.white,borderRadius:16,padding:"16px",marginBottom:14,border:`2px solid ${idx===0?T.gold:T.border}`,boxShadow:idx===0?`0 4px 20px ${T.gold}33`:"0 1px 8px rgba(31,168,192,0.06)"}}>
              {idx===0&&<div style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1,marginBottom:8}}>🏆 MEJOR PUNTAJE</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div><div style={{fontWeight:700,fontSize:16,color:T.ink}}>{c.nombre}{c.favorita?" ❤️":""}</div><div style={{fontSize:12,color:T.inkLight,marginTop:2}}>{c.zona_residencia} · {c.experiencia}</div></div>
                <PuntajeBadge puntaje={pts}/>
              </div>
              <div style={{display:"grid",gap:5,marginBottom:14}}>{CRITERIOS.map(cr=>{const val=(c.calificacion&&c.calificacion[cr.key])||0;return(<div key={cr.key} style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,width:18}}>{cr.icon}</span><div style={{flex:1,height:5,borderRadius:3,background:"#e5e7eb",overflow:"hidden"}}><div style={{width:`${val*20}%`,height:"100%",background:val>=4?T.success:val>=3?T.teal:val>=2?T.gold:T.warn,borderRadius:3}}/></div><span style={{fontSize:11,color:T.inkLight,width:24,textAlign:"right"}}>{val>0?`${val}/5`:"—"}</span></div>);})}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={()=>abrirPerfil(c)} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${T.teal}`,background:T.white,color:T.teal,fontWeight:700,fontSize:13,cursor:"pointer"}}>Ver perfil</button>
                {c.estado==="finalista"&&<><a href={`https://wa.me/${c.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(`Hola ${c.nombre} 👋\n\n¡Excelentes noticias! Queremos hacerte una oferta para unirte a *Seycare Nails®*. 🎉💅\n\n¿Tienes disponibilidad esta semana?\n\n¡Esperamos contar contigo! 🌊✨`)}`} target="_blank" rel="noreferrer" style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:T.teal,color:T.white,fontWeight:700,fontSize:13,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 Oferta</a><button onClick={()=>cambiarEstado(c.id,"lista_espera")} style={{padding:"10px 12px",borderRadius:10,border:`1.5px solid ${T.orange}`,background:T.white,color:T.orange,fontWeight:700,fontSize:12,cursor:"pointer"}}>→ Espera</button><button onClick={()=>cambiarEstado(c.id,"retirada")} style={{padding:"10px 12px",borderRadius:10,border:`1.5px solid ${T.warn}`,background:T.white,color:T.warn,fontWeight:700,fontSize:12,cursor:"pointer"}}>✕</button></>}
                {c.estado==="lista_espera"&&<><button onClick={()=>cambiarEstado(c.id,"finalista")} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${T.gold}`,background:T.white,color:T.gold,fontWeight:700,fontSize:13,cursor:"pointer"}}>↑ Finalista</button><button onClick={()=>cambiarEstado(c.id,"descartada")} style={{padding:"10px 12px",borderRadius:10,border:`1.5px solid ${T.inkLight}`,background:T.white,color:T.inkLight,fontWeight:700,fontSize:13,cursor:"pointer"}}>✕</button></>}
              </div>
            </div>);
          });
        })()}

        {!loading&&tab==="lista"&&<>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:16}}>
            {[{k:"todas",label:`Todas (${candidatas.length})`,color:T.teal},{k:"favoritas",label:`❤️ Favoritas (${favoritas.length})`,color:T.rose},{k:"activas",label:"En proceso",color:T.teal},...Object.entries(ESTADOS).map(([k,v])=>({k,label:`${v.label} (${counts[k]||0})`,color:v.color})),{k:"cerradas",label:"Cerradas",color:T.inkLight}].map(f=>(<button key={f.k} onClick={()=>setFiltro(f.k)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",border:`1.5px solid ${filtro===f.k?f.color:T.border}`,background:filtro===f.k?f.color:T.white,color:filtro===f.k?T.white:f.color}}>{f.label}</button>))}
          </div>
          {filtradas.length===0&&<div style={{textAlign:"center",padding:"48px 24px",color:T.inkLight}}><div style={{fontSize:40,marginBottom:12}}>📋</div><p>No hay candidatas en esta categoría.</p></div>}
          {[...filtradas].sort((a,b)=>{if(a.favorita&&!b.favorita)return -1;if(!a.favorita&&b.favorita)return 1;return puntajeTotal(b.calificacion)-puntajeTotal(a.calificacion);}).map(c=>{
            const estObj=ESTADOS[c.estado]||ESTADOS["recibida"];
            const pts=puntajeTotal(c.calificacion);
            return(<div key={c.id} style={{background:T.white,borderRadius:16,padding:"16px",marginBottom:12,border:`1.5px solid ${c.favorita?T.rose:c.estado==="finalista"?T.gold:T.border}`,boxShadow:c.favorita?`0 4px 16px ${T.rose}22`:c.estado==="finalista"?`0 4px 16px ${T.gold}22`:"0 1px 8px rgba(31,168,192,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{flex:1,cursor:"pointer"}} onClick={()=>abrirPerfil(c)}>
                  <div style={{fontWeight:700,fontSize:16,color:T.ink}}>{c.nombre}{c.favorita?" ❤️":""}</div>
                  <div style={{fontSize:12,color:T.inkLight,marginTop:2}}>{c.zona_residencia||"—"} · {c.telefono}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,color:estObj.color,background:estObj.bg,whiteSpace:"nowrap"}}>{estObj.label}</span>
                  {pts>0&&<PuntajeBadge puntaje={pts}/>}
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10,cursor:"pointer"}} onClick={()=>abrirPerfil(c)}>
                {(c.especialidades||[]).slice(0,3).map(e=>(<span key={e} style={{padding:"3px 10px",background:T.tealLight,borderRadius:20,fontSize:11,color:T.tealDark,fontWeight:600,border:`1px solid ${T.tealMid}`}}>{e}</span>))}
                {(c.especialidades||[]).length>3&&<span style={{padding:"3px 10px",background:"#f0f0f0",borderRadius:20,fontSize:11,color:"#888"}}>+{c.especialidades.length-3}</span>}
                {(c.portfolio_link||c.cv_url)&&<span style={{padding:"3px 10px",background:"#f5f3ff",borderRadius:20,fontSize:11,color:T.purple,fontWeight:600,border:"1px solid #ddd6fe"}}>📎 Portafolio</span>}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:12,fontSize:12,color:T.inkLight,cursor:"pointer"}} onClick={()=>abrirPerfil(c)}>
                  {c.hora_entrada&&<span>⏰ {c.hora_entrada}–{c.hora_salida}</span>}
                  {c.transporte&&<span>{TRANSPORTES.find(t=>t.value===c.transporte)?.icon}</span>}
                  {(c.modalidades||[]).length>0&&<span>💰 {MODALIDADES.find(m=>m.value===c.modalidades[0])?.label}</span>}
                  {c.notas_operador&&<span style={{color:T.teal,fontWeight:700}}>📝</span>}
                </div>
                <FavBtn active={c.favorita} onClick={()=>toggleFavorita(c.id,c.favorita)}/>
              </div>
            </div>);
          })}
        </>}
      </div>
    </div>
  );
}

export default function App(){
  const [vista,setVista]=useState("selector");
  const [adminAuth,setAdminAuth]=useState(false);
  const [logoTaps,setLogoTaps]=useState(0);
  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{
      if(!data||!data.session)return;
      const {data:esAdmin}=await supabase.rpc("es_admin_seleccion");
      if(esAdmin===true)setAdminAuth(true);
    });
  },[]);
  const handleLogo=useCallback(()=>{setLogoTaps(n=>{const next=n+1;if(next>=5){setVista("admin");return 0;}return next;});},[]);

  if(vista==="candidata")return <CandidateForm/>;
  if(vista==="admin"){
    if(!adminAuth)return <AdminLogin onSuccess={()=>setAdminAuth(true)} onBack={()=>setVista("selector")}/>;
    return(<div><div style={{position:"fixed",bottom:16,right:16,zIndex:100}}><button onClick={async()=>{await supabase.auth.signOut();setVista("selector");setAdminAuth(false);}} style={{background:T.tealDeep,color:T.white,border:"none",borderRadius:20,padding:"10px 18px",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 16px rgba(13,90,107,0.4)`}}>← Salir</button></div><OperatorPanel/></div>);
  }
  return(
    <div style={{minHeight:"100vh",background:T.soft,fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
      <div style={{background:`linear-gradient(150deg,${T.tealDeep} 0%,${T.teal} 60%,${T.tealLight} 100%)`,padding:"56px 24px 80px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <img src={LOGO_SRC} alt="Seycare Nails" onClick={handleLogo} style={{height:60,objectFit:"contain",marginBottom:20,filter:"brightness(0) invert(1)",cursor:"default",userSelect:"none"}}/>
        <h1 style={{color:T.white,fontSize:28,fontWeight:300,margin:"0 0 8px",letterSpacing:1}}>Únete a nuestro equipo</h1>
        <p style={{color:"rgba(255,255,255,0.8)",fontSize:15,maxWidth:320,margin:"0 auto"}}>Buscamos manicuristas talentosas para Seycare Nails® en el sur de Quito</p>
      </div>
      <svg viewBox="0 0 400 40" style={{display:"block",marginTop:-2,background:T.soft}}><path d="M0,0 C100,40 300,0 400,20 L400,0 Z" fill={T.teal}/></svg>
      <div style={{maxWidth:380,margin:"-32px auto 0",padding:"0 20px 60px"}}>
        <button onClick={()=>setVista("candidata")} style={{width:"100%",padding:"24px 20px",borderRadius:20,border:"none",textAlign:"left",background:`linear-gradient(135deg,${T.teal},${T.tealDeep})`,color:T.white,cursor:"pointer",boxShadow:`0 8px 32px ${T.teal}55`}}>
          <div style={{fontSize:32,marginBottom:8}}>👩‍💅</div>
          <div style={{fontWeight:700,fontSize:18,marginBottom:4}}>Soy manicurista</div>
          <div style={{fontSize:13,opacity:0.85,lineHeight:1.5}}>Aplica ahora y forma parte de nuestro equipo en Barrio Nuevo, Quito. El proceso toma menos de 5 minutos.</div>
          <div style={{marginTop:14,display:"inline-block",padding:"7px 18px",background:"rgba(255,255,255,0.2)",borderRadius:20,fontSize:13,fontWeight:700}}>Iniciar solicitud →</div>
        </button>
        <div style={{textAlign:"center",marginTop:24,fontSize:12,color:T.inkLight}}>
          <p style={{margin:"0 0 4px"}}>📍 Serapio Japerabi y Canelo esq., Barrio Nuevo, 2do piso</p>
          <p style={{margin:0,opacity:0.7}}>Barrio Nuevo · Quito, Ecuador</p>
        </div>
        <div style={{textAlign:"center",marginTop:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <img src={ICON_SRC} alt="" style={{width:18,opacity:0.25}}/>
          <span style={{fontSize:12,color:T.inkLight}}>Seycare Nails® · Proceso de selección</span>
        </div>
      </div>
    </div>
  );
}
