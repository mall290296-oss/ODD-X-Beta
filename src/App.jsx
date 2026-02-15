import React, { useState, useMemo, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import questions from "./formulaire.json";

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
  if (score < 2) return { hex: "#dc2626", twBorder: "border-l-red-600", label: "Score Critique", twText: "text-red-600" };
  if (score < 3) return { hex: "#ea580c", twBorder: "border-l-orange-600", label: "Score à améliorer", twText: "text-orange-600" };
  if (score < 4) return { hex: "#ca8a04", twBorder: "border-l-yellow-600", label: "Score à améliorer", twText: "text-yellow-600" };
  if (score < 4.5) return { hex: "#16a34a", twBorder: "border-l-green-600", label: "Bon score", twText: "text-green-600" };
  return { hex: "#15803d", twBorder: "border-l-green-800", label: "Excellent score", twText: "text-green-800" };
};

const LOGO_URL = "https://programmes.polytechnique.edu/sites/default/files/2022-06/logo-polytechnique.svg";

function App() {
  const [activeTab, setActiveTab] = useState("Accueil");
  const [profiles, setProfiles] = useState(() => JSON.parse(localStorage.getItem("oddx_profiles_list") || "[]"));
  const [muralInfo, setMuralInfo] = useState(() => JSON.parse(localStorage.getItem("oddx_current_identite") || "{}"));
  const [citizenIdeas, setCitizenIdeas] = useState(() => JSON.parse(localStorage.getItem("oddx_ideas") || "[]"));
  const [selectedOddForm, setSelectedOddForm] = useState("");

  // --- LOGIQUE DE PROFILING UNIQUE ---
  const storageKey = useMemo(() => {
    const name = muralInfo["Nom de la commune"];
    return name ? `oddx_answers_${name.replace(/\s+/g, '_').toLowerCase()}` : "oddx_answers_default";
  }, [muralInfo]);

  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem(storageKey) || "{}"));

  // Synchronisation des réponses lors du changement de commune
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setAnswers(saved ? JSON.parse(saved) : {});
  }, [storageKey]);

  // --- BARRE DE PROGRESSION ---
  const progressPercent = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / questions.length) * 100);
  }, [answers]);

  const identityFields = {
    "Informations Générales": ["Nom de la commune", "Email officiel", "Code Insee", "Code Postal", "Département", "Région", "Maire actuel", "Nombre d'élus", "Nombre d'agents municipaux"],
    "Démographie": ["Population totale", "Densité (hab/km²)", "Part des -25 ans (%)", "Part des +65 ans (%)", "Nombre de ménages"],
    "Géographie & Urbanisme": ["Superficie totale (ha)", "Surface agricole utile (ha)", "Surface forestière (ha)", "Nombre de logements", "Part de logements sociaux (%)"],
    "Économie & Services": ["Nombre d'entreprises", "Taux de chômage (%)", "Revenu fiscal médian", "Nombre d'écoles", "Équipements sportifs"],
    "Environnement & Énergie": ["Consommation énergétique (MWh)", "Part ENR (%)", "Déchets (t/an)", "Taux de tri (%)", "Linéaire pistes cyclables (km)", "Espaces verts (m²)"]
  };

  const allRequiredFields = Object.values(identityFields).flat();

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

  const handleSwitchProfile = (profileName) => {
    if (!profileName) { setMuralInfo({}); setAnswers({}); return; }
    const allIdentities = JSON.parse(localStorage.getItem("oddx_all_identities") || "{}");
    if (allIdentities[profileName]) setMuralInfo(allIdentities[profileName]);
  };

  const handleNewProfile = () => { if (window.confirm("Créer un nouveau profil vierge ?")) { setMuralInfo({}); setAnswers({}); } };

  const handleDeleteCurrentProfile = () => {
    const name = muralInfo["Nom de la commune"];
    if (!name) return;
    if (window.confirm(`Supprimer définitivement le profil de "${name}" ?`)) {
      const newProfiles = profiles.filter(p => p !== name);
      setProfiles(newProfiles);
      localStorage.setItem("oddx_profiles_list", JSON.stringify(newProfiles));
      const allIdentities = JSON.parse(localStorage.getItem("oddx_all_identities") || "{}");
      delete allIdentities[name];
      localStorage.setItem("oddx_all_identities", JSON.stringify(allIdentities));
      localStorage.removeItem(storageKey);
      setMuralInfo({}); setAnswers({});
    }
  };

  const isFullyIdentified = useMemo(() => allRequiredFields.every(field => muralInfo[field] && muralInfo[field].toString().trim() !== ""), [muralInfo, allRequiredFields]);

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
        const icon = oddIcons[params.name] || "";
        return `<div style="max-width:280px; white-space:normal; display:flex; gap:12px; align-items:flex-start;">
            <img src="${icon}" style="width:50px; height:50px; border-radius:6px;" />
            <div>
              <div style="font-weight:900; color:#2563eb;">${params.name}</div>
              <div style="font-weight:bold;">Score : ${params.value} / 5</div>
              <div style="font-size:11px; color:#64748b;">${desc}</div>
            </div>
          </div>`;
      }
    },
    series: [{
      type: "pie", radius: [40, 150], roseType: "area",
      itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
      label: { show: true, fontSize: 10, fontWeight: 'bold' },
      data: oddAverages.map((item) => ({ value: item.value, name: item.odd, itemStyle: { color: getScoreVisuals(item.value).hex } })),
    }],
  };

  // --- LOGIQUE VOTES ---
  const handleVote = (id) => {
    const updatedIdeas = citizenIdeas.map(idea => 
      idea.id === id ? { ...idea, votes: (idea.votes || 0) + 1 } : idea
    );
    setCitizenIdeas(updatedIdeas);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <nav className="border-b border-slate-200 px-8 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab("Accueil")}>
            <img src={LOGO_URL} alt="Logo" className="w-12 h-10 object-contain" />
            <span className="text-2xl font-black tracking-tighter text-blue-600">ODD-X</span>
          </div>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            {["Accueil", "À Propos", "Diagnostic", "Résultats", "Priorités", "Partenaires", "Citoyens", "Contact"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-blue-500"} pb-1 transition-all`}>
                {tab === "Partenaires" ? "Institutions" : tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === "Accueil" && (
          <div className="text-center py-20 space-y-8">
            <div className="flex justify-center mb-4"><div className="w-48 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center p-6 border border-slate-100"><img src={LOGO_URL} alt="Poly" className="w-full h-full object-contain" /></div></div>
            <h1 className="text-8xl font-black tracking-tighter uppercase leading-none text-slate-900">ODD-X</h1>
            <p className="text-2xl text-slate-500 max-w-2xl mx-auto font-light italic">Le diagnostic de durabilité pour les collectivités territoriales.</p>
            <div className="pt-6"><button onClick={() => setActiveTab("Diagnostic")} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-black text-lg shadow-xl">DÉMARRER LE DIAGNOSTIC</button></div>
          </div>
        )}

        {activeTab === "À Propos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center py-12">
            <div className="space-y-8">
              <h2 className="text-6xl font-black italic underline decoration-blue-500 decoration-8 underline-offset-8 uppercase leading-tight text-slate-900">Notre Engagement</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">ODD-X transforme les données communales en leviers d'action. En alignant votre stratégie sur les Objectifs de Développement Durable, nous créons ensemble des territoires résilients.</p>
            </div>
            {/* Image Fixe - Sans animations */}
            <div className="rounded-[40px] overflow-hidden border border-slate-200 shadow-2xl bg-white">
              <img src="https://educatif.eedf.fr/wp-content/uploads/sites/157/2021/02/ODD.jpg" alt="ODD" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        )}

        {activeTab === "Diagnostic" && (
          <div className="max-w-5xl mx-auto space-y-8">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div>
                  <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-widest">Mairie Active</h3>
                  <select onChange={(e) => handleSwitchProfile(e.target.value)} value={muralInfo["Nom de la commune"] || ""} className="bg-slate-50 border border-slate-200 p-2 mt-2 rounded-lg text-sm font-bold w-64 outline-none">
                    <option value="">-- Sélectionner --</option>
                    {profiles.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {muralInfo["Nom de la commune"] && <button onClick={handleDeleteCurrentProfile} className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white">Supprimer</button>}
              </div>
              <button onClick={handleNewProfile} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase shadow-lg">➕ Nouvelle Mairie</button>
            </div>
            {Object.entries(identityFields).map(([category, fields]) => (
              <div key={category} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <h3 className="text-blue-600 font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 text-sm">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fields.map(field => (
                    <div key={field} className="flex flex-col">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-2">{field}</label>
                      <input value={muralInfo[field] || ""} onChange={(e) => setMuralInfo({...muralInfo, [field]: e.target.value})} className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm font-bold" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center pt-8">
              <button disabled={!isFullyIdentified} onClick={() => setActiveTab("Questionnaire")} className={`px-12 py-5 rounded-2xl font-black uppercase transition-all shadow-2xl ${isFullyIdentified ? "bg-blue-600 text-white scale-105" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>{isFullyIdentified ? "Passer au Questionnaire" : "Remplir tous les champs"}</button>
            </div>
          </div>
        )}

        {activeTab === "Questionnaire" && (
           <div className="space-y-6">
              {/* Barre de progression fixe */}
              <div className="sticky top-20 z-40 bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-lg mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-blue-600">Avancement du diagnostic : {progressPercent}%</span>
                  <span className="text-[10px] font-black text-slate-400 italic">{muralInfo["Nom de la commune"]}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              {questions.map((q) => (
                <div key={q.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="flex gap-2 mb-4">{q.odds.map(o => <span key={o} className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-black">ODD {o}</span>)}</div>
                  <p className="text-xl font-bold mb-6 text-slate-800">{q.id}. {q.question.replace(/^Q\d+\s?[-–]\s?/, "")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => {
                      const pts = idx === 5 ? 0 : idx + 1; const sel = answers[q.id] === pts;
                      return (
                        <button key={idx} onClick={() => setAnswers({...answers, [q.id]: pts})} className={`p-4 rounded-xl border text-left transition-all font-bold uppercase text-[11px] flex items-center gap-3 ${sel ? "ring-4 ring-blue-100 border-blue-400 scale-[1.01]" : "opacity-90"} ${colorMap[opt.color] || "bg-slate-50"}`}>
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 flex items-center justify-center bg-white">{sel && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}</div>
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button onClick={() => setActiveTab("Résultats")} className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase mt-10 shadow-xl">Calculer les résultats</button>
           </div>
        )}

        {/* ... (Sections Résultats, Priorités, Partenaires restent identiques au précédent) ... */}

        {activeTab === "Citoyens" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200 h-fit shadow-sm">
                <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-blue-600">Proposer une idée</h3>
                {selectedOddForm && (
                  <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl">
                    <img src={oddIcons[selectedOddForm]} alt="" className="w-16 h-16 rounded-lg" />
                    <p className="text-xs font-bold text-slate-600">{oddDescriptions[selectedOddForm]}</p>
                  </div>
                )}
                <form onSubmit={handleAddIdea} className="space-y-4">
                  <select value={selectedOddForm} onChange={(e) => setSelectedOddForm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-sm outline-none" required>
                    <option value="">Choisir un ODD...</option>
                    {Object.keys(oddDescriptions).map(odd => <option key={odd} value={odd}>{odd} - {oddDescriptions[odd].substring(0, 40)}...</option>)}
                  </select>
                  <textarea name="ideaText" placeholder="Votre proposition..." rows="6" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none" required></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-black uppercase shadow-lg">Publier l'idée</button>
                </form>
             </div>
             <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-black uppercase italic border-b border-slate-200 pb-4 text-slate-900">Boîte à idées citoyenne</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {citizenIdeas.map((idea) => (
                    <div key={idea.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="flex gap-4 mb-4">
                         <img src={oddIcons[idea.odd]} alt="" className="w-10 h-10 rounded-md shrink-0" />
                         <p className="font-bold italic text-slate-700 leading-tight">"{idea.text}"</p>
                      </div>
                      <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-4">
                        <button onClick={() => handleVote(idea.id)} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all group">
                          <span className="text-lg group-hover:scale-125 transition-transform">👍</span>
                          <span className="text-xs font-black">{idea.votes || 0}</span>
                        </button>
                        <div className="text-right">
                          <span className="block bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase mb-1">{idea.odd}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase">Le {idea.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
        
        {/* ... (Section Contact reste identique) ... */}
      </div>
    </div>
  );
}

export default App;