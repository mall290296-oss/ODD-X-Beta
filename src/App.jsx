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
    setCitizenIdeas([{ odd: selectedOddForm, text: formData.get("ideaText"), date: new Date().toLocaleDateString() }, ...citizenIdeas]);
    e.target.reset();
    setSelectedOddForm("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <nav className="border-b border-slate-200 px-8 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab("Accueil")}>
            <div className="w-12 h-10 flex items-center justify-center">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
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
          <div className="text-center py-20 space-y-8 animate-in fade-in duration-1000">
            <div className="flex justify-center mb-4">
              <div className="w-48 h-32 md:w-64 md:h-40 bg-white rounded-3xl shadow-xl flex items-center justify-center p-6 border border-slate-100">
                <img src={LOGO_URL} alt="Polytechnique" className="w-full h-full object-contain" />
              </div>
            </div>
            <h1 className="text-8xl font-black tracking-tighter uppercase leading-none text-slate-900">ODD-X</h1>
            <p className="text-2xl text-slate-500 max-w-2xl mx-auto font-light italic">Le diagnostic de durabilité pour les collectivités territoriales.</p>
            <div className="pt-6">
              <button onClick={() => setActiveTab("Diagnostic")} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-black text-lg transition-all hover:scale-105 shadow-xl shadow-blue-200">DÉMARRER LE DIAGNOSTIC</button>
            </div>
          </div>
        )}

        {activeTab === "À Propos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center py-12 animate-in">
            <div className="space-y-8">
              <h2 className="text-6xl font-black italic underline decoration-blue-500 decoration-8 underline-offset-8 uppercase leading-tight text-slate-900">Notre Engagement</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">ODD-X transforme les données communales en leviers d'action. En alignant votre stratégie sur les Objectifs de Développement Durable, nous créons ensemble des territoires résilients.</p>
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
            <div className="text-center pt-8">
              <button disabled={!isFullyIdentified} onClick={() => setActiveTab("Questionnaire")} className={`px-12 py-5 rounded-2xl font-black uppercase transition-all shadow-2xl ${isFullyIdentified ? "bg-blue-600 text-white scale-105 shadow-blue-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>{isFullyIdentified ? "Passer au Questionnaire" : "Remplir tous les champs"}</button>
            </div>
          </div>
        )}

        {activeTab === "Questionnaire" && (
           <div className="space-y-6 animate-in fade-in">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl mb-8 flex justify-between items-center shadow-sm">
                <p className="text-sm font-black uppercase tracking-widest text-blue-600 italic">Collectivité : {muralInfo["Nom de la commune"]}</p>
                <button onClick={() => setActiveTab("Diagnostic")} className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black uppercase text-slate-600">Retour</button>
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
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-4 border-blue-600 pb-8 gap-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-20 bg-white rounded-xl shadow-sm border border-slate-100 p-2 shrink-0">
                  <img src={LOGO_URL} alt="Polytechnique" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-5xl font-black italic uppercase leading-tight text-slate-900">Rapport de Diagnostic</h2>
                  <p className="text-blue-600 font-black text-xl uppercase tracking-widest">{muralInfo["Nom de la commune"] || "Collectivité"}</p>
                </div>
              </div>
              <button onClick={() => window.print()} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 print:hidden">Imprimer / Export PDF</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-blue-600 p-16 rounded-[50px] flex flex-col items-center justify-center border border-white/20 shadow-2xl text-center text-white relative overflow-hidden">
                <img src={LOGO_URL} alt="" className="absolute w-64 h-64 opacity-10 -bottom-10 -right-10 rotate-12 pointer-events-none grayscale invert" />
                <div className="relative z-10">
                  <div className="text-9xl font-black leading-none">{globalScore}</div>
                  <span className="text-2xl font-bold uppercase mt-4 block">Score Global / 5.0</span>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-[50px] p-8 border border-slate-200 shadow-sm flex items-center justify-center">
                <ReactECharts option={chartOption} style={{ height: "600px", width: "100%" }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Priorités" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="space-y-4">
              <h2 className="text-5xl font-black italic uppercase underline decoration-blue-500 text-slate-900">Priorités stratégiques</h2>
              <p className="text-slate-500 text-lg max-w-4xl leading-relaxed italic border-l-4 border-slate-200 pl-6">
                "Nous ne vous proposons ici que des recommandations générales. Si vous avez besoin d'une approche spécifique, veuillez contacter un spécialiste ou consulter la liste des institutions publiques figurant sur ce site web."
              </p>
            </div>
            <div className="grid gap-6">
              {lowPerformingODDs.map(item => {
                const visuals = getScoreVisuals(item.value);
                return (
                  <div key={item.odd} className={`bg-white p-8 rounded-[30px] border-l-[20px] ${visuals.twBorder} flex justify-between items-center shadow-md border border-slate-200`}>
                    <div className="flex items-center gap-8">
                      <img src={oddIcons[item.odd]} alt={item.odd} className="w-20 h-20 rounded-xl" />
                      <div>
                        <div className={`text-5xl font-black ${visuals.twText} italic uppercase leading-none mb-2`}>{item.odd}</div>
                        <p className="text-lg font-bold text-slate-700">{oddDescriptions[item.odd]}</p>
                      </div>
                    </div>
                    <div className="text-right"><p className="text-5xl font-black text-slate-900">{item.value} <span className="text-sm text-slate-400">/ 5</span></p></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Partenaires" && (
          <div className="space-y-12 animate-in fade-in">
            <div className="space-y-4">
              <h2 className="text-5xl font-black italic uppercase underline decoration-blue-500 text-slate-900">Institutions spécialisées</h2>
              <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">
                Ces organismes publics et réseaux d'experts pourraient vous accompagner dans votre transition durable et vous aider à améliorer vos performances en matière d'ODD.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "ADEME", full: "Agence de la transition écologique", desc: "Expertise technique et financements pour les projets de transition énergétique et d'économie circulaire.", link: "https://www.ademe.fr" },
                { name: "FVD", full: "France Villes et Territoires Durables", desc: "Fédération des acteurs de la ville durable pour accélérer le déploiement des ODD à l'échelle locale.", link: "https://francevilledurable.fr/" },
                { name: "Club DD", full: "Le club développement durable", desc: "Réseau d'échange pour les établissements et entreprises publics sur les enjeux de durabilité.", link: "https://www.ecologie.gouv.fr/politiques-publiques/club-developpement-durable-etablissements-entreprises-publics" },
                { name: "ANCT", full: "Agence Nationale de la Cohésion des Territoires", desc: "Support aux mairies dans leurs projets de revitalisation et de cohésion territoriale.", link: "https://agence-cohesion-territoires.gouv.fr" }
              ].map((inst, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">{inst.name}</span>
                  <h3 className="text-xl font-black text-slate-900 uppercase mb-2">{inst.full}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{inst.desc}</p>
                  <a href={inst.link} target="_blank" rel="noreferrer" className="text-blue-600 font-black text-xs uppercase tracking-widest border-b-2 border-blue-100 hover:border-blue-600 transition-all">Consulter les ressources</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Citoyens" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in">
             <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200 h-fit shadow-sm">
                <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-blue-600">Proposer une idée</h3>
                {selectedOddForm && (
                  <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl animate-in zoom-in-95">
                    <img src={oddIcons[selectedOddForm]} alt="" className="w-16 h-16 rounded-lg" />
                    <p className="text-xs font-bold text-slate-600">{oddDescriptions[selectedOddForm]}</p>
                  </div>
                )}
                <form onSubmit={handleAddIdea} className="space-y-4">
                  <select
                    value={selectedOddForm}
                    onChange={(e) => setSelectedOddForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  >
                    <option value="">Choisir un ODD...</option>
                    {Object.keys(oddDescriptions).map(odd => (
                      <option key={odd} value={odd}>
                        {odd} - {oddDescriptions[odd].substring(0, 40)}...
                      </option>
                    ))}
                  </select>
                  <textarea name="ideaText" placeholder="Votre proposition..." rows="6" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100" required></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-black uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Publier l'idée</button>
                </form>
             </div>
             <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-black uppercase italic border-b border-slate-200 pb-4 text-slate-900">Boîte à idées citoyenne</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {citizenIdeas.map((idea, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="flex gap-4 mb-4">
                         <img src={oddIcons[idea.odd]} alt="" className="w-10 h-10 rounded-md shrink-0" />
                         <p className="font-bold italic text-slate-700 leading-tight">"{idea.text}"</p>
                      </div>
                      <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-4">
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
            {/* Formulaire désormais relié à ton lien Formspree */}
            <form 
              action="https://formspree.io/f/xwvnldkr" 
              method="POST" 
              className="bg-white p-12 rounded-[50px] border border-slate-200 space-y-4 shadow-xl"
            >
              <input type="text" name="name" placeholder="NOM" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl font-bold" required />
              <input type="email" name="email" placeholder="EMAIL" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl font-bold" required />
              <textarea name="message" placeholder="MESSAGE..." rows="5" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl font-bold" required></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                Envoyer
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ... (garder tous les imports et les constantes colorMap, oddIcons, oddDescriptions au début)

function App() {
  // ... (garder les autres states : activeTab, profiles, muralInfo, citizenIdeas, etc.)

  // --- NOUVELLE FONCTION POUR SUPPRIMER UNE IDÉE ---
  const handleDeleteIdea = (index) => {
    if (window.confirm("Supprimer cette idée ?")) {
      const newIdeas = [...citizenIdeas];
      newIdeas.splice(index, 1);
      setCitizenIdeas(newIdeas);
    }
  };

  // --- LOGIQUE DE GROUPEMENT DES QUESTIONS ---
  const groupedQuestions = [
    {
      title: "PARTIE 1 - ENVIRONNEMENT",
      questions: questions.filter(q => q.id >= 1 && q.id <= 17)
    },
    {
      title: "PARTIE 2 - SOCIAL & GOUVERNANCE",
      questions: questions.filter(q => q.id >= 18 && q.id <= 33)
    },
    {
      title: "PARTIE 3 - ÉCONOMIE & AMÉNAGEMENT DURABLE",
      questions: questions.filter(q => q.id >= 34 && q.id <= 50)
    }
  ];

  // ... (garder useMemo pour les scores, chartOption, handleAddIdea, etc.)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* ... Nav identique ... */}

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* ... Accueil, À Propos, Diagnostic identiques ... */}

        {activeTab === "Questionnaire" && (
           <div className="space-y-12 animate-in fade-in">
              <div className="bg-white border border-slate-200 p-6 rounded-3xl mb-8 flex justify-between items-center shadow-sm sticky top-24 z-40">
                <div>
                   <p className="text-sm font-black uppercase tracking-widest text-blue-600 italic">Diagnostic en cours</p>
                   <p className="text-lg font-bold text-slate-800">{muralInfo["Nom de la commune"]}</p>
                </div>
                <button onClick={() => setActiveTab("Diagnostic")} className="bg-slate-100 hover:bg-slate-200 px-6 py-2 rounded-full text-xs font-black uppercase text-slate-600 transition-colors">Retour aux infos</button>
              </div>

              {groupedQuestions.map((group, gIdx) => (
                <div key={gIdx} className="space-y-6">
                  <h3 className="text-3xl font-black text-slate-900 italic border-l-8 border-blue-600 pl-4 py-2 bg-slate-100/50 rounded-r-xl">
                    {group.title}
                  </h3>
                  
                  {group.questions.map((q) => (
                    <div key={q.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                      <div className="flex gap-2 mb-4">
                        {q.odds.map(o => <span key={o} className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-black">ODD {o}</span>)}
                      </div>
                      <p className="text-xl font-bold mb-6 text-slate-800">{q.id}. {q.question.replace(/^Q\d+\s?[-–]\s?/, "")}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, idx) => {
                          const pts = idx === 5 ? 0 : idx + 1; 
                          const sel = answers[q.id] === pts;
                          return (
                            <button key={idx} onClick={() => setAnswers({...answers, [q.id]: pts})} className={`p-4 rounded-xl border text-left transition-all font-bold uppercase text-[11px] flex items-center gap-3 ${sel ? "ring-4 ring-blue-100 border-blue-400 scale-[1.01]" : "opacity-90"} ${colorMap[opt.color] || "bg-slate-50"}`}>
                              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 flex items-center justify-center bg-white">
                                {sel && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                              </div>
                              {opt.text.replace(/^X\s/, "")}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              <button onClick={() => { window.scrollTo(0,0); setActiveTab("Résultats"); }} className="w-full bg-blue-600 text-white p-8 rounded-3xl font-black uppercase text-xl shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-[1.02]">
                Calculer les résultats finaux
              </button>
           </div>
        )}

        {/* ... Résultats, Priorités, Partenaires identiques ... */}

        {activeTab === "Citoyens" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in">
             <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200 h-fit shadow-sm sticky top-24">
                <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-blue-600">Proposer une idée</h3>
                <form onSubmit={handleAddIdea} className="space-y-4">
                  {/* ... (Select et Textarea identiques) ... */}
                  <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-black uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Publier l'idée</button>
                </form>
             </div>

             <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-black uppercase italic border-b border-slate-200 pb-4 text-slate-900">Boîte à idées citoyenne</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {citizenIdeas.map((idea, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between group relative">
                      {/* BOUTON SUPPRIMER */}
                      <button 
                        onClick={() => handleDeleteIdea(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                        title="Supprimer l'idée"
                      >
                        ✕
                      </button>

                      <div className="flex gap-4 mb-4">
                         <img src={oddIcons[idea.odd]} alt="" className="w-10 h-10 rounded-md shrink-0" />
                         <p className="font-bold italic text-slate-700 leading-tight">"{idea.text}"</p>
                      </div>
                      <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-4">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{idea.odd}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Le {idea.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {/* ... Contact identique ... */}
      </div>
    </div>
  );
}

export default App;
