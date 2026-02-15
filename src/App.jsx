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
  "ODD 2": "Éliminer la faim, assurer la sécurité alimentaire, améliorer la nutrition et promouvoir une agriculture durable.",
  "ODD 3": "Permettre à tous de vivre en bonne santé et promouvoir le bien‑être à tout âge.",
  "ODD 4": "Assurer à tous une éducation inclusive, équitable et de qualité et des possibilités d’apprentissage tout au long de la vie.",
  "ODD 5": "Parvenir à l’égalité des sexes et autonomiser toutes les femmes et les filles.",
  "ODD 6": "Garantir l’accès de tous à l’eau et à l’assainissement et assurer une gestion durable des ressources en eau.",
  "ODD 7": "Garantir l’accès de tous à des services énergétiques fiables, durables et modernes, à un coût abordable.",
  "ODD 8": "Promouvoir une croissance économique soutenue, inclusive et durable, le plein emploi productif et un travail décent pour tous.",
  "ODD 9": "Bâtir une infrastructure résiliente, promouvoir une industrialisation durable qui profite à tous et encourager l’innovation.",
  "ODD 10": "Réduire les inégalités dans les pays et d’un pays à l’autre.",
  "ODD 11": "Faire en sorte que les villes et les établissements humains soient ouverts à tous, sûrs, résilients et durables.",
  "ODD 12": "Instaurer des modes de consommation et de production durables.",
  "ODD 13": "Prendre d’urgence des mesures pour lutter contre les changements climatiques et leurs répercussions.",
  "ODD 14": "Conserver et exploiter de manière durable les océans, les mers et les ressources marines.",
  "ODD 15": "Préserver et restaurer les écosystèmes terrestres, gérer durablement les forêts, lutter contre la désertification, enrayer et inverser la dégradation des terres et mettre fin à la perte de biodiversité.",
  "ODD 16": "Promouvoir l’avènement de sociétés pacifiques et ouvertes à tous, assurer l’accès de tous à la justice et mettre en place des institutions efficaces, responsables et ouvertes.",
  "ODD 17": "Renforcer les moyens de mettre en œuvre le Partenariat mondial pour le développement durable et le revitaliser."
};

const getScoreVisuals = (score) => {
  if (score < 2) return { hex: "#dc2626", twBorder: "border-l-red-600", label: "Score Critique", twText: "text-red-600" };
  if (score < 3) return { hex: "#ea580c", twBorder: "border-l-orange-600", label: "Score à améliorer", twText: "text-orange-600" };
  if (score < 4) return { hex: "#ca8a04", twBorder: "border-l-yellow-600", label: "Score à améliorer", twText: "text-yellow-600" };
  if (score < 4.5) return { hex: "#16a34a", twBorder: "border-l-green-600", label: "Bon score", twText: "text-green-600" };
  return { hex: "#15803d", twBorder: "border-l-green-800", label: "Excellent score", twText: "text-green-800" };
};

function App() {
  const [activeTab, setActiveTab] = useState("Accueil");
  const [profiles, setProfiles] = useState(() => JSON.parse(localStorage.getItem("oddx_profiles_list") || "[]"));
  const [muralInfo, setMuralInfo] = useState(() => JSON.parse(localStorage.getItem("oddx_current_identite") || "{}"));
  const [citizenIdeas, setCitizenIdeas] = useState(() => JSON.parse(localStorage.getItem("oddx_ideas") || "[]"));

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
      padding: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#1e293b' },
      formatter: (params) => {
        const desc = oddDescriptions[params.name] || "";
        const icon = oddIcons[params.name] || "";
        return `
          <div style="max-width:280px; white-space:normal; display:flex; gap:12px; align-items:flex-start;">
            <img src="${icon}" style="width:50px; height:50px; border-radius:6px; border:1px solid #f1f5f9;" />
            <div style="flex:1;">
              <div style="font-weight:900; color:#2563eb; margin-bottom:2px; font-size:14px;">${params.name}</div>
              <div style="font-weight:bold; font-size:12px; margin-bottom:6px;">Score : ${params.value} / 5</div>
              <div style="font-style:italic; font-size:11px; line-height:1.4; color:#64748b;">${desc}</div>
            </div>
          </div>
        `;
      }
    },
    series: [{
      type: "pie", radius: [40, 150], roseType: "area",
      itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
      label: { show: true, color: "#1e293b", fontSize: 10, fontWeight: 'bold' },
      data: oddAverages.map((item) => ({ value: item.value, name: item.odd, itemStyle: { color: getScoreVisuals(item.value).hex } })),
    }],
  };

  const handleAddIdea = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setCitizenIdeas([{ odd: formData.get("oddSelection"), text: formData.get("ideaText"), date: new Date().toLocaleDateString() }, ...citizenIdeas]);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <nav className="border-b border-slate-200 px-8 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-black tracking-tighter text-blue-600 cursor-pointer" onClick={() => setActiveTab("Accueil")}>ODD-X</span>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            {["Accueil", "À Propos", "Diagnostic", "Résultats", "Priorités", "Citoyens", "Contact"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-blue-500"} pb-1 transition-all`}>{tab}</button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === "Accueil" && (
          <div className="text-center py-24 space-y-8 animate-in fade-in duration-1000">
            <h1 className="text-8xl font-black tracking-tighter uppercase leading-none text-slate-900">ODD-X</h1>
            <p className="text-2xl text-slate-500 max-w-2xl mx-auto font-light italic">Le diagnostic de durabilité pour les collectivités territoriales.</p>
            <button onClick={() => setActiveTab("Diagnostic")} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-black text-lg transition-all hover:scale-105 shadow-xl shadow-blue-200">DÉMARRER LE DIAGNOSTIC</button>
          </div>
        )}

        {activeTab === "À Propos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center py-12 animate-in slide-in-from-left-10">
            <div className="space-y-8">
              <h2 className="text-6xl font-black italic underline decoration-blue-500 decoration-8 underline-offset-8 uppercase leading-tight text-slate-900">Notre Engagement</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">ODD-X transforme les données communales en leviers d'action. En alignant votre stratégie sur les Objectifs de Développement Durable, nous créons ensemble des territoires résilients.</p>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
                <p className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2">Méthodologie</p>
                <p className="text-sm italic text-slate-500">Analyse basée sur les 17 indicateurs de performance des ODD.</p>
              </div>
            </div>
            <div className="rounded-[40px] overflow-hidden border border-slate-200 shadow-2xl">
              <img src="https://educatif.eedf.fr/wp-content/uploads/sites/157/2021/02/ODD.jpg" alt="ODD Logo" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        )}

        {activeTab === "Diagnostic" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div>
                  <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-widest">Sélectionner une Mairie</h3>
                  <select onChange={(e) => handleSwitchProfile(e.target.value)} value={muralInfo["Nom de la commune"] || ""} className="bg-slate-50 border border-slate-200 p-2 mt-2 rounded-lg text-sm font-bold w-64 outline-none focus:border-blue-500 text-slate-700">
                    <option value="">-- Sélectionner --</option>
                    {profiles.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {muralInfo["Nom de la commune"] && <button onClick={handleDeleteCurrentProfile} className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Supprimer</button>}
              </div>
              <button onClick={handleNewProfile} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">➕ Nouvelle Mairie</button>
            </div>
            {Object.entries(identityFields).map(([category, fields]) => (
              <div key={category} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <h3 className="text-blue-600 font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 text-sm">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fields.map(field => (
                    <div key={field} className="flex flex-col">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-2">{field}</label>
                      <input value={muralInfo[field] || ""} onChange={(e) => setMuralInfo({...muralInfo, [field]: e.target.value})} className={`bg-slate-50 border p-3 rounded-xl focus:border-blue-500 outline-none text-sm font-bold transition-all ${muralInfo[field] ? "border-green-200 bg-green-50/30 text-slate-800" : "border-slate-200 text-slate-600"}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center pt-8 sticky bottom-8">
              <button disabled={!isFullyIdentified} onClick={() => setActiveTab("Questionnaire")} className={`px-12 py-5 rounded-2xl font-black uppercase transition-all shadow-2xl ${isFullyIdentified ? "bg-blue-600 text-white scale-105 shadow-blue-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>{isFullyIdentified ? "Passer au Questionnaire" : "Remplir tous les champs"}</button>
            </div>
          </div>
        )}

        {activeTab === "Questionnaire" && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-white border border-slate-200 p-4 rounded-2xl mb-8 flex justify-between items-center shadow-sm">
                <p className="text-sm font-black uppercase tracking-widest text-blue-600 italic">Collectivité : {muralInfo["Nom de la commune"]}</p>
                <button onClick={() => setActiveTab("Diagnostic")} className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black uppercase text-slate-600 hover:bg-slate-200">Retour</button>
            </div>
            {questions.map((q) => (
              <div key={q.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm transition-all">
                <div className="flex gap-2 mb-4">{q.odds.map(o => <span key={o} className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-black">ODD {o}</span>)}</div>
                <p className="text-xl font-bold mb-6 text-slate-800">{q.id}. {q.question.replace(/^Q\d+\s?[-–]\s?/, "")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, idx) => {
                    const pts = idx === 5 ? 0 : idx + 1; const sel = answers[q.id] === pts;
                    return (
                      <button key={idx} onClick={() => setAnswers({...answers, [q.id]: pts})} className={`p-4 rounded-xl border text-left transition-all font-bold uppercase text-[11px] flex items-center gap-3 ${sel ? "ring-4 ring-blue-100 border-blue-400 scale-[1.01]" : "opacity-90"} ${colorMap[opt.color] || "bg-slate-50"}`}>
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 flex items-center justify-center bg-white">{sel && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}</div>
                        {opt.text.replace(/^X\s/, "")}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button onClick={() => setActiveTab("Résultats")} className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase mt-10 shadow-xl shadow-blue-200 transition-all hover:bg-blue-700">Calculer les résultats</button>
          </div>
        )}

        {activeTab === "Résultats" && (
           <div className="space-y-12 animate-in slide-in-from-bottom-10">
             <div className="flex justify-between items-end border-b border-slate-200 pb-8 uppercase">
               <h2 className="text-6xl font-black italic underline decoration-blue-500 underline-offset-8 leading-tight text-slate-900">Rapport : {muralInfo["Nom de la commune"]}</h2>
               <button onClick={() => window.print()} className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-xl font-black uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm">Export PDF</button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 bg-blue-600 p-16 rounded-[50px] flex flex-col items-center justify-center border border-white/20 shadow-2xl text-center text-white">
                 <div className="text-9xl font-black leading-none">{globalScore}</div>
                 <span className="text-2xl font-bold uppercase mt-4">Score Global / 5.0</span>
               </div>
               <div className="lg:col-span-2 bg-white rounded-[50px] p-8 border border-slate-200 shadow-sm flex items-center justify-center">
                 <ReactECharts option={chartOption} style={{ height: "600px", width: "100%" }} />
               </div>
             </div>
           </div>
        )}

        {activeTab === "Priorités" && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-5xl font-black italic uppercase underline decoration-blue-500 text-slate-900">Priorités stratégiques</h2>
            <p className="text-slate-400 italic font-medium">ODD nécessitant une attention urgente (Classés par score croissant)</p>
            <div className="grid gap-6">
              {lowPerformingODDs.map(item => {
                const visuals = getScoreVisuals(item.value);
                return (
                  <div key={item.odd} className={`bg-white p-8 rounded-[30px] border-l-[20px] ${visuals.twBorder} flex justify-between items-center shadow-md border border-slate-200 transition-all hover:shadow-lg`}>
                    <div className="flex items-center gap-8">
                      <img src={oddIcons[item.odd]} alt={item.odd} className="w-20 h-20 rounded-xl shadow-sm border border-slate-50" />
                      <div className="space-y-2">
                        <div className={`text-5xl font-black ${visuals.twText} italic uppercase leading-none`}>{item.odd}</div>
                        <p className="text-lg font-bold text-slate-700">{oddDescriptions[item.odd]}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-8">
                      <p className={`${visuals.twText} font-black text-[11px] uppercase tracking-widest mb-1`}>{visuals.label}</p>
                      <p className="text-5xl font-black text-slate-900 leading-none">{item.value} <span className="text-sm text-slate-400">/ 5</span></p>
                    </div>
                  </div>
                );
              })}
              {lowPerformingODDs.length === 0 && <p className="text-center py-20 italic text-slate-400">Félicitations ! Tous vos ODD sont au-dessus de 4.0.</p>}
            </div>
          </div>
        )}

        {activeTab === "Citoyens" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 animate-in fade-in">
             <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200 h-fit sticky top-32 shadow-sm">
                <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-blue-600">Proposer une idée</h3>
                <form onSubmit={handleAddIdea} className="space-y-4">
                  <select name="oddSelection" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 font-bold outline-none focus:border-blue-500" required>
                    <option value="">Choisir un ODD...</option>
                    {Object.keys(oddDescriptions).map(odd => <option key={odd} value={odd}>{odd}</option>)}
                  </select>
                  <textarea name="ideaText" placeholder="Votre proposition..." rows="6" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 outline-none focus:border-blue-500" required></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Publier l'idée</button>
                </form>
             </div>
             <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-black uppercase italic border-b border-slate-200 pb-4 tracking-tighter text-slate-900">Boîte à idées citoyenne</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {citizenIdeas.map((idea, idx) => (
                    <div key={idx} className="bg-white text-slate-800 p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                      <p className="font-bold leading-tight mb-4 italic text-lg text-slate-700">"{idea.text}"</p>
                      <div className="flex justify-between items-center mt-4">
                         <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{idea.odd}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Le {idea.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === "Contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-12 items-center animate-in fade-in">
            <div className="space-y-8 text-slate-600 text-xl font-light">
              <h2 className="text-7xl font-black uppercase italic underline decoration-blue-500 leading-tight text-slate-900">Contact</h2>
              <p>📍 Paris, France</p>
              <p>✉️ <a href="mailto:info@odd-x.com" className="font-bold text-blue-600 hover:underline">info@odd-x.com</a></p>
            </div>
            <form action="#" className="bg-white p-12 rounded-[50px] border border-slate-200 space-y-4 shadow-xl shadow-slate-200/50">
              <input type="text" placeholder="NOM" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold" />
              <input type="email" placeholder="EMAIL" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold" />
              <textarea placeholder="MESSAGE..." rows="5" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold"></textarea>
              <button type="button" className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Envoyer</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;