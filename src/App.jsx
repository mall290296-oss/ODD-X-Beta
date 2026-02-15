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

// Liens vers les icônes officielles (Nations Unies)
const oddIcons = {
  "ODD 1": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_01.jpg",
  "ODD 2": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_02.jpg",
  "ODD 3": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_03.jpg",
  "ODD 4": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_04.jpg",
  "ODD 5": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_05.jpg",
  "ODD 6": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_06.jpg",
  "ODD 7": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_07.jpg",
  "ODD 8": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_08.jpg",
  "ODD 9": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_09.jpg",
  "ODD 10": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_10.jpg",
  "ODD 11": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_11.jpg",
  "ODD 12": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_12.jpg",
  "ODD 13": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_13.jpg",
  "ODD 14": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_14.jpg",
  "ODD 15": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_15.jpg",
  "ODD 16": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_16.jpg",
  "ODD 17": "https://www.un.org/sustainabledevelopment/fr/wp-content/uploads/sites/2/2019/08/F_SDG_Icons_2019_17.jpg"
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
            <img src="${icon}" style="width:60px; height:60px; border-radius:4px; border:1px solid #eee;" />
            <div style="flex:1;">
              <div style="font-weight:900; color:#2563eb; margin-bottom:2px; font-size:14px;">${params.name}</div>
              <div style="font-weight:bold; font-size:12px; margin-bottom:8px;">Score : ${params.value} / 5</div>
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
        {/* Sections Accueil, À Propos, Diagnostic, Questionnaire omises pour la clarté mais identiques au précédent */}
        
        {/* RÉSULTATS AVEC ICÔNES DANS TOOLTIP */}
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

        {/* PRIORITÉS AVEC ICÔNES LATÉRALES */}
        {activeTab === "Priorités" && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-5xl font-black italic uppercase underline decoration-blue-500 text-slate-900">Priorités stratégiques</h2>
            <p className="text-slate-400 italic font-medium">ODD nécessitant une attention urgente</p>
            <div className="grid gap-6">
              {lowPerformingODDs.map(item => {
                const visuals = getScoreVisuals(item.value);
                return (
                  <div key={item.odd} className={`bg-white p-8 rounded-[30px] border-l-[20px] ${visuals.twBorder} flex justify-between items-center shadow-md border border-slate-200 transition-all hover:shadow-lg overflow-hidden relative`}>
                    <div className="flex gap-8 items-center z-10">
                      <img src={oddIcons[item.odd]} alt={item.odd} className="w-24 h-24 rounded-xl shadow-lg border border-slate-100" />
                      <div className="space-y-2 max-w-2xl">
                        <div className={`text-5xl font-black ${visuals.twText} italic uppercase leading-none`}>{item.odd}</div>
                        <p className="text-lg font-bold text-slate-700">{oddDescriptions[item.odd]}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-8 z-10">
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

        {/* Les autres sections restent identiques... */}
      </div>
    </div>
  );
}

export default App;