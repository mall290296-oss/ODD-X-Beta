import React, { useState, useMemo, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import questions from "./formulaire.json";

// --- CONFIGURATION & STYLES ---
const colorMap = {
  "rouge": "bg-red-100 text-red-700 border-red-400 hover:bg-red-200",
  "orange": "bg-orange-100 text-orange-700 border-orange-400 hover:bg-orange-200",
  "jaune": "bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200",
  "vert clair": "bg-green-100 text-green-700 border-green-400 hover:bg-green-200",
  "vert foncé": "bg-green-200 text-green-800 border-green-500 hover:bg-green-300",
  "blanc": "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
};

const oddIcons = {
  "ODD 1": "https://www.agenda-2030.fr/IMG/svg/odd1.svg?1614036680",
  "ODD 2": "https://www.agenda-2030.fr/IMG/svg/odd2.svg?1614036681",
  "ODD 3": "https://www.agenda-2030.fr/IMG/svg/odd3.svg?1614036681",
  "ODD 4": "https://www.agenda-2030.fr/IMG/svg/odd4.svg?1614036681",
  "ODD 5": "https://www.agenda-2030.fr/IMG/svg/odd5.svg?1614036682",
  "ODD 6": "https://www.agenda-2030.fr/IMG/svg/odd6.svg?1614036682",
  "ODD 7": "https://www.agenda-2030.fr/IMG/svg/odd7.svg?1614036682",
  "ODD 8": "https://www.agenda-2030.fr/IMG/svg/odd8.svg?1614036682",
  "ODD 9": "https://www.agenda-2030.fr/IMG/svg/odd9.svg?1614036682",
  "ODD 10": "https://www.agenda-2030.fr/IMG/svg/odd10.svg?1614036681",
  "ODD 11": "https://www.agenda-2030.fr/IMG/svg/odd11.svg?1614036681",
  "ODD 12": "https://www.agenda-2030.fr/IMG/svg/odd12.svg?1614036681",
  "ODD 13": "https://www.agenda-2030.fr/IMG/svg/odd13.svg?1614036681",
  "ODD 14": "https://www.agenda-2030.fr/IMG/svg/odd14.svg?1614036681",
  "ODD 15": "https://www.agenda-2030.fr/IMG/svg/odd15.svg?1614036681",
  "ODD 16": "https://www.agenda-2030.fr/IMG/svg/odd16.svg?1614036681",
  "ODD 17": "https://www.agenda-2030.fr/IMG/svg/odd17.svg?1614036681"
};

const oddDescriptions = {
  "ODD 1": "Mettre fin à la pauvreté sous toutes ses formes et partout.",
  "ODD 2": "Éliminer la faim, assurer la sécurité alimentaire et promouvoir une agriculture durable.",
  "ODD 3": "Permettre à tous de vivre en bonne santé et promouvoir le bien‑être à tout âge.",
  "ODD 4": "Assurer à tous une éducation inclusive, équitable et de qualité.",
  "ODD 5": "Parvenir à l’égalité des sexes et autonomiser toutes les femmes et les filles.",
  "ODD 6": "Garantir l’accès de tous à l’eau et à l’assainissement.",
  "ODD 7": "Garantir l’accès de tous à des services énergétiques fiables, durables et modernes.",
  "ODD 8": "Promouvoir une croissance économique durable et un travail décent pour tous.",
  "ODD 9": "Bâtir une infrastructure résiliente et encourager l’innovation.",
  "ODD 10": "Réduire les inégalités dans les pays et d’un pays à l’autre.",
  "ODD 11": "Faire en sorte que les villes soient sûres, résilientes et durables.",
  "ODD 12": "Instaurer des modes de consommation et de production durables.",
  "ODD 13": "Prendre d’urgence des mesures pour lutter contre les changements climatiques.",
  "ODD 14": "Conserver et exploiter de manière durable les ressources marines.",
  "ODD 15": "Préserver et restaurer les écosystèmes terrestres et la biodiversité.",
  "ODD 16": "Promouvoir l’avènement de sociétés pacifiques et l’accès à la justice pour tous.",
  "ODD 17": "Renforcer le Partenariat mondial pour le développement durable."
};

const getScoreVisuals = (score) => {
  if (score < 2) return { hex: "#dc2626", twBorder: "border-l-red-600", label: "Critique", twText: "text-red-600" };
  if (score < 3) return { hex: "#ea580c", twBorder: "border-l-orange-600", label: "À améliorer", twText: "text-orange-600" };
  if (score < 4) return { hex: "#ca8a04", twBorder: "border-l-yellow-600", label: "Passable", twText: "text-yellow-600" };
  if (score < 4.5) return { hex: "#16a34a", twBorder: "border-l-green-600", label: "Bon score", twText: "text-green-600" };
  return { hex: "#15803d", twBorder: "border-l-green-800", label: "Excellent", twText: "text-green-800" };
};

const LOGO_URL = "https://programmes.polytechnique.edu/sites/default/files/2022-06/logo-polytechnique.svg";

function App() {
  const [activeTab, setActiveTab] = useState("Accueil");
  const [profiles, setProfiles] = useState(() => JSON.parse(localStorage.getItem("oddx_profiles_list") || "[]"));
  const [muralInfo, setMuralInfo] = useState(() => JSON.parse(localStorage.getItem("oddx_current_identite") || "{}"));
  const [citizenIdeas, setCitizenIdeas] = useState(() => JSON.parse(localStorage.getItem("oddx_ideas") || "[]"));
  const [selectedOddForm, setSelectedOddForm] = useState("");
  const [contactStatus, setContactStatus] = useState(null);

  // --- 2. LOGIQUE DE PROFILING (Clé unique par mairie) ---
  const storageKey = useMemo(() => {
    const name = muralInfo["Nom de la commune"];
    return name ? `oddx_answers_${name.replace(/\s+/g, '_').toLowerCase()}` : "oddx_answers_default";
  }, [muralInfo]);

  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem(storageKey) || "{}"));

  const identityFields = {
    "Informations Générales": ["Nom de la commune", "Email officiel", "Code Insee", "Code Postal", "Département", "Région", "Maire actuel", "Nombre d'élus", "Nombre d'agents municipaux"],
    "Démographie": ["Population totale", "Densité (hab/km²)", "Part des -25 ans (%)", "Part des +65 ans (%)", "Nombre de ménages"],
    "Géographie & Urbanisme": ["Superficie totale (ha)", "Surface agricole utile (ha)", "Surface forestière (ha)", "Nombre de logements", "Part de logements sociaux (%)"],
    "Économie & Services": ["Nombre d'entreprises", "Taux de chômage (%)", "Revenu fiscal médian", "Nombre d'écoles", "Équipements sportifs"],
    "Environnement & Énergie": ["Consommation énergétique (MWh)", "Part ENR (%)", "Déchets (t/an)", "Taux de tri (%)", "Linéaire pistes cyclables (km)", "Espaces verts (m²)"]
  };

  const allRequiredFields = Object.values(identityFields).flat();

  useEffect(() => {
    const savedAnswers = localStorage.getItem(storageKey);
    setAnswers(savedAnswers ? JSON.parse(savedAnswers) : {});
  }, [storageKey]);

  useEffect(() => {
    const name = muralInfo["Nom de la commune"];
    localStorage.setItem("oddx_current_identite", JSON.stringify(muralInfo));
    localStorage.setItem(storageKey, JSON.stringify(answers));
    localStorage.setItem("oddx_ideas", JSON.stringify(citizenIdeas));

    if (name && name.trim() !== "") {
      if (!profiles.includes(name)) {
        const newProfiles = [...profiles, name];
        setProfiles(newProfiles);
        localStorage.setItem("oddx_profiles_list", JSON.stringify(newProfiles));
      }
      const allIdentities = JSON.parse(localStorage.getItem("oddx_all_identities") || "{}");
      allIdentities[name] = muralInfo;
      localStorage.setItem("oddx_all_identities", JSON.stringify(allIdentities));
    }
  }, [answers, muralInfo, citizenIdeas, storageKey, profiles]);

  // --- 1. SYSTÈME DE VOTES & IDÉES ---
  const handleVote = (id) => {
    setCitizenIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, votes: (idea.votes || 0) + 1 } : idea));
  };

  const handleAddIdea = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newIdea = {
      id: Date.now(),
      odd: selectedOddForm,
      text: formData.get("ideaText"),
      date: new Date().toLocaleDateString(),
      votes: 0
    };
    setCitizenIdeas([newIdea, ...citizenIdeas]);
    e.target.reset();
    setSelectedOddForm("");
  };

  // --- 3. BARRE DE PROGRESSION ---
  const progressPercent = useMemo(() => {
    const total = questions.length;
    const answered = Object.keys(answers).length;
    return Math.round((answered / total) * 100);
  }, [answers]);

  const handleSwitchProfile = (profileName) => {
    if (!profileName) { setMuralInfo({}); setAnswers({}); return; }
    const allIdentities = JSON.parse(localStorage.getItem("oddx_all_identities") || "{}");
    if (allIdentities[profileName]) setMuralInfo(allIdentities[profileName]);
  };

  const isFullyIdentified = useMemo(() => allRequiredFields.every(field => muralInfo[field] && muralInfo[field].toString().trim() !== ""), [muralInfo, allRequiredFields]);

  // --- CALCUL DES RÉSULTATS ---
  const { oddAverages, globalScore, lowPerformingODDs } = useMemo(() => {
    const scores = {}; const counts = {};
    questions.forEach((q) => {
      const val = answers[q.id];
      if (val !== undefined && val !== null && val > 0) {
        q.odds.forEach((odd) => { scores[odd] = (scores[odd] || 0) + val; counts[odd] = (counts[odd] || 0) + 1; });
      }
    });
    const averages = Object.keys(scores).map((odd) => ({ odd: `ODD ${odd}`, value: Number((scores[odd] / counts[odd]).toFixed(2)) }));
    return {
      oddAverages: averages.sort((a, b) => a.odd.localeCompare(b.odd, undefined, {numeric: true})),
      globalScore: averages.length > 0 ? (averages.reduce((acc, item) => acc + item.value, 0) / averages.length).toFixed(2) : 0,
      lowPerformingODDs: averages.filter(item => item.value < 4.0).sort((a, b) => a.value - b.value)
    };
  }, [answers]);

  const chartOption = {
    backgroundColor: "transparent",
    tooltip: { 
      trigger: "item",
      formatter: (params) => {
        const desc = oddDescriptions[params.name] || "";
        return `<div style="max-width:200px; white-space:normal;"><b>${params.name}</b><br/>Score: ${params.value}<br/><small>${desc}</small></div>`;
      }
    },
    series: [{
      type: "pie", radius: [40, 150], roseType: "area",
      itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
      data: oddAverages.map((item) => ({ value: item.value, name: item.odd, itemStyle: { color: getScoreVisuals(item.value).hex } })),
    }],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <nav className="border-b border-slate-200 px-8 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab("Accueil")}>
            <img src={LOGO_URL} alt="Logo" className="h-10 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-black tracking-tighter text-blue-600">ODD-X</span>
          </div>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            {["Accueil", "À Propos", "Diagnostic", "Résultats", "Priorités", "Institutions", "Citoyens", "Contact"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab === "Institutions" ? "Partenaires" : tab)} className={`${(activeTab === tab || (activeTab === "Partenaires" && tab === "Institutions")) ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-blue-500"} pb-1 transition-all`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* --- ACCUEIL --- */}
        {activeTab === "Accueil" && (
          <div className="text-center py-20 space-y-8 animate-in fade-in duration-1000">
            <h1 className="text-8xl font-black tracking-tighter uppercase leading-none text-slate-900">ODD-X</h1>
            <p className="text-2xl text-slate-500 max-w-2xl mx-auto font-light italic">Le diagnostic de durabilité pour les collectivités territoriales.</p>
            <div className="pt-6">
              <button onClick={() => setActiveTab("Diagnostic")} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-black text-lg transition-all hover:scale-105 shadow-xl shadow-blue-200">DÉMARRER LE DIAGNOSTIC</button>
            </div>
          </div>
        )}

        {/* --- 4. À PROPOS (Fixé sans animation d'image) --- */}
        {activeTab === "À Propos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center py-12">
            <div className="space-y-8 animate-in slide-in-from-left-4">
              <h2 className="text-6xl font-black italic underline decoration-blue-500 decoration-8 underline-offset-8 uppercase leading-tight">Notre Mission</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">ODD-X transforme les données communales en leviers d'action. En alignant votre stratégie sur les Objectifs de Développement Durable, nous créons ensemble des territoires résilients.</p>
            </div>
            <div className="rounded-[40px] overflow-hidden border border-slate-200 shadow-2xl">
              <img src="https://educatif.eedf.fr/wp-content/uploads/sites/157/2021/02/ODD.jpg" alt="ODD static" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        )}

        {/* --- DIAGNOSTIC --- */}
        {activeTab === "Diagnostic" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-widest">Collectivité active</h3>
                <select onChange={(e) => handleSwitchProfile(e.target.value)} value={muralInfo["Nom de la commune"] || ""} className="bg-slate-50 border border-slate-200 p-2 mt-2 rounded-lg text-sm font-bold w-64">
                  <option value="">-- Sélectionner une mairie --</option>
                  {profiles.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <button onClick={() => { setMuralInfo({}); setAnswers({}); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-blue-700">➕ Nouveau Profil</button>
            </div>
            {Object.entries(identityFields).map(([category, fields]) => (
              <div key={category} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <h3 className="text-blue-600 font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 text-sm">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fields.map(field => (
                    <div key={field} className="flex flex-col">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-2">{field}</label>
                      <input value={muralInfo[field] || ""} onChange={(e) => setMuralInfo({...muralInfo, [field]: e.target.value})} className="bg-slate-50 border p-3 rounded-xl focus:border-blue-500 outline-none text-sm font-bold" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center pt-8">
              <button disabled={!isFullyIdentified} onClick={() => setActiveTab("Questionnaire")} className={`px-12 py-5 rounded-2xl font-black uppercase transition-all ${isFullyIdentified ? "bg-blue-600 text-white scale-105" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>Accéder au Questionnaire</button>
            </div>
          </div>
        )}

        {/* --- QUESTIONNAIRE & PROGRESSION --- */}
        {activeTab === "Questionnaire" && (
           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
              {/* BARRE DE PROGRESSION FIXÉE */}
              <div className="sticky top-24 z-40 bg-white/80 backdrop-blur-md p-6 rounded-2xl border shadow-sm mb-10">
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span>Progression de l'audit</span>
                  <span className="text-blue-600">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-500" style={{width: `${progressPercent}%`}}></div>
                </div>
                <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase">Mairie de : {muralInfo["Nom de la commune"]}</p>
              </div>

              {questions.map((q) => (
                <div key={q.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <p className="text-xl font-bold mb-6 text-slate-800">{q.id}. {q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => {
                      const pts = idx === 5 ? 0 : idx + 1;
                      const sel = answers[q.id] === pts;
                      return (
                        <button key={idx} onClick={() => setAnswers({...answers, [q.id]: pts})} className={`p-4 rounded-xl border text-left transition-all font-bold uppercase text-[11px] ${sel ? "ring-4 ring-blue-100 border-blue-400 scale-[1.01]" : "opacity-90"} ${colorMap[opt.color] || "bg-slate-50"}`}>
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button onClick={() => setActiveTab("Résultats")} className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase mt-10 shadow-xl transition-all hover:bg-blue-700">Calculer les résultats</button>
           </div>
        )}

        {/* --- RÉSULTATS --- */}
        {activeTab === "Résultats" && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-end border-b-4 border-blue-600 pb-8">
              <h2 className="text-5xl font-black italic uppercase text-slate-900">Rapport : {muralInfo["Nom de la commune"]}</h2>
              <button onClick={() => window.print()} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase print:hidden">Export PDF</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-blue-600 p-16 rounded-[50px] flex flex-col items-center justify-center border border-white/20 shadow-2xl text-white">
                  <div className="text-9xl font-black leading-none">{globalScore}</div>
                  <span className="text-2xl font-bold uppercase mt-4 block">Score Global / 5.0</span>
              </div>
              <div className="lg:col-span-2 bg-white rounded-[50px] p-8 border border-slate-200 shadow-sm flex items-center justify-center">
                <ReactECharts option={chartOption} style={{ height: "600px", width: "100%" }} />
              </div>
            </div>
          </div>
        )}

        {/* --- CITOYENS & VOTES --- */}
        {activeTab === "Citoyens" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in">
             <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200 h-fit shadow-sm">
                <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-blue-600">Proposer une idée</h3>
                <form onSubmit={handleAddIdea} className="space-y-4">
                  <select value={selectedOddForm} onChange={(e) => setSelectedOddForm(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-xl font-bold text-sm" required>
                    <option value="">Choisir un ODD...</option>
                    {Object.keys(oddDescriptions).map(odd => <option key={odd} value={odd}>{odd}</option>)}
                  </select>
                  <textarea name="ideaText" placeholder="Votre proposition pour la commune..." rows="6" className="w-full bg-slate-50 border p-4 rounded-xl font-bold text-sm" required></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-black uppercase shadow-lg hover:bg-blue-700">Publier</button>
                </form>
             </div>
             <div className="lg:col-span-2 space-y-4">
                <h3 className="text-2xl font-black uppercase italic border-b border-slate-200 pb-4">Boîte à idées citoyenne</h3>
                {citizenIdeas.map((idea) => (
                  <div key={idea.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center transition-all hover:border-blue-200">
                    <div className="flex gap-4">
                       <img src={oddIcons[idea.odd]} alt="" className="w-12 h-12 rounded-lg" />
                       <div>
                         <p className="font-bold italic text-slate-700">"{idea.text}"</p>
                         <div className="flex gap-3 mt-2">
                           <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">{idea.odd}</span>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{idea.date}</span>
                         </div>
                       </div>
                    </div>
                    {/* BOUTON DE VOTE INCORPORÉ */}
                    <button onClick={() => handleVote(idea.id)} className="flex flex-col items-center bg-slate-50 p-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group">
                      <span className="text-2xl group-hover:scale-125 transition-transform">👍</span>
                      <span className="text-xs font-black mt-1">{idea.votes || 0}</span>
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- CONTACT RÉTABLI --- */}
        {activeTab === "Contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-12 items-center animate-in fade-in">
            <div className="space-y-8 text-slate-600 text-xl font-light">
              <h2 className="text-7xl font-black uppercase italic underline decoration-blue-500 leading-tight text-slate-900">Contact</h2>
              <div className="space-y-4">
                <p>📍 Campus de l'École polytechnique, 91128 Palaiseau</p>
                <p>✉️ <a href="mailto:info@odd-x.com" className="font-bold text-blue-600 hover:underline">info@odd-x.com</a></p>
                <p>📞 +33 (0)1 69 33 33 33</p>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setContactStatus('sending');
              setTimeout(() => { setContactStatus('sent'); e.target.reset(); }, 1500);
            }} className="bg-white p-12 rounded-[50px] border border-slate-200 space-y-4 shadow-xl">
              {contactStatus === 'sent' ? (
                <div className="text-center py-10 space-y-4 animate-in zoom-in">
                  <div className="text-6xl">✅</div>
                  <h3 className="text-2xl font-black text-blue-600 uppercase">Message Envoyé !</h3>
                  <p className="text-slate-500">Nos experts reviendront vers vous sous 48h.</p>
                  <button type="button" onClick={() => setContactStatus(null)} className="text-blue-600 font-black uppercase text-xs border-b border-blue-600">Envoyer un autre message</button>
                </div>
              ) : (
                <>
                  <input type="text" placeholder="NOM DE LA COLLECTIVITÉ" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100" required />
                  <input type="email" placeholder="EMAIL DE CONTACT" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100" required />
                  <textarea placeholder="VOTRE DEMANDE..." rows="5" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100" required></textarea>
                  <button type="submit" disabled={contactStatus === 'sending'} className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                    {contactStatus === 'sending' ? 'ENVOI EN COURS...' : 'ENVOYER LE MESSAGE'}
                  </button>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;