import React, { useState, useMemo, useEffect } from "react";
import ReactECharts from "echarts-for-react";

// --- DONNÉES DE CONFIGURATION ---

const colorMap = {
  "rouge": "bg-red-100 text-red-700 border-red-400 hover:bg-red-200",
  "orange": "bg-orange-100 text-orange-700 border-orange-400 hover:bg-orange-200",
  "jaune": "bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200",
  "vert clair": "bg-green-100 text-green-700 border-green-400 hover:bg-green-200",
  "vert foncé": "bg-green-200 text-green-800 border-green-500 hover:bg-green-300",
  "blanc": "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
};

const oddIcons = {
  "ODD 1": "https://www.agenda-2030.fr/IMG/svg/odd1.svg",
  "ODD 2": "https://www.agenda-2030.fr/IMG/svg/odd2.svg",
  "ODD 3": "https://www.agenda-2030.fr/IMG/svg/odd3.svg",
  "ODD 4": "https://www.agenda-2030.fr/IMG/svg/odd4.svg",
  "ODD 5": "https://www.agenda-2030.fr/IMG/svg/odd5.svg",
  "ODD 6": "https://www.agenda-2030.fr/IMG/svg/odd6.svg",
  "ODD 7": "https://www.agenda-2030.fr/IMG/svg/odd7.svg",
  "ODD 8": "https://www.agenda-2030.fr/IMG/svg/odd8.svg",
  "ODD 9": "https://www.agenda-2030.fr/IMG/svg/odd9.svg",
  "ODD 10": "https://www.agenda-2030.fr/IMG/svg/odd10.svg",
  "ODD 11": "https://www.agenda-2030.fr/IMG/svg/odd11.svg",
  "ODD 12": "https://www.agenda-2030.fr/IMG/svg/odd12.svg",
  "ODD 13": "https://www.agenda-2030.fr/IMG/svg/odd13.svg",
  "ODD 14": "https://www.agenda-2030.fr/IMG/svg/odd14.svg",
  "ODD 15": "https://www.agenda-2030.fr/IMG/svg/odd15.svg",
  "ODD 16": "https://www.agenda-2030.fr/IMG/svg/odd16.svg",
  "ODD 17": "https://www.agenda-2030.fr/IMG/svg/odd17.svg"
};

const oddDescriptions = {
  "ODD 1": "Pas de pauvreté : Éliminer la pauvreté sous toutes ses formes.",
  "ODD 2": "Faim 'Zéro' : Éliminer la faim et promouvoir l'agriculture durable.",
  "ODD 3": "Bonne santé et bien-être : Permettre à tous de vivre en bonne santé.",
  "ODD 4": "Éducation de qualité : Assurer l'accès à l'éducation pour tous.",
  "ODD 5": "Égalité entre les sexes : Atteindre l'égalité homme-femme.",
  "ODD 6": "Eau propre et assainissement : Garantir l'accès à l'eau potable.",
  "ODD 7": "Énergie propre et d'un coût abordable : Garantir l'accès à l'énergie.",
  "ODD 8": "Travail décent et croissance économique : Favoriser l'emploi décent.",
  "ODD 9": "Industrie, innovation et infrastructure : Bâtir des infrastructures résilientes.",
  "ODD 10": "Inégalités réduites : Réduire les inégalités entre les territoires.",
  "ODD 11": "Villes et communautés durables : Créer des cités sûres et durables.",
  "ODD 12": "Consommation et production responsables : Produire durablement.",
  "ODD 13": "Mesures relatives à la lutte contre les changements climatiques.",
  "ODD 14": "Vie aquatique : Conserver les océans et les mers.",
  "ODD 15": "Vie terrestre : Préserver la biodiversité et les forêts.",
  "ODD 16": "Paix, justice et institutions efficaces : Garantir la justice pour tous.",
  "ODD 17": "Partenariats pour la réalisation des objectifs."
};

const questions = [
  { id: 1, question: "Comment évaluez-vous l'engagement de votre commune dans la lutte contre la précarité énergétique ?", odds: [1, 7, 11], options: [{ text: "Inexistant", color: "rouge" }, { text: "Faible", color: "orange" }, { text: "Moyen", color: "jaune" }, { text: "Bon", color: "vert clair" }, { text: "Excellent", color: "vert foncé" }] },
  { id: 2, question: "La commune favorise-t-elle l'accès à une alimentation locale et durable (cantines bio, jardins partagés) ?", odds: [2, 3, 12], options: [{ text: "Inexistant", color: "rouge" }, { text: "Faible", color: "orange" }, { text: "Moyen", color: "jaune" }, { text: "Bon", color: "vert clair" }, { text: "Excellent", color: "vert foncé" }] },
  { id: 3, question: "Quelle est la part des énergies renouvelables dans la consommation des bâtiments communaux ?", odds: [7, 13], options: [{ text: "0-10%", color: "rouge" }, { text: "10-25%", color: "orange" }, { text: "25-50%", color: "jaune" }, { text: "50-75%", color: "vert clair" }, { text: "75-100%", color: "vert foncé" }] },
  // ... (Vous pouvez rajouter ici les 25 questions complètes)
];

const LOGO_URL = "https://programmes.polytechnique.edu/sites/default/files/2022-06/logo-polytechnique.svg";

// --- COMPOSANT PRINCIPAL ---

export default function App() {
  const [activeTab, setActiveTab] = useState("Accueil");
  const [selectedOdd, setSelectedOdd] = useState("");
  
  // Profils et Données
  const [profiles, setProfiles] = useState(() => JSON.parse(localStorage.getItem("oddx_profiles") || "[]"));
  const [muralInfo, setMuralInfo] = useState(() => JSON.parse(localStorage.getItem("oddx_current_id") || "{}"));
  const [citizenIdeas, setCitizenIdeas] = useState(() => JSON.parse(localStorage.getItem("oddx_ideas") || "[]"));

  const storageKey = useMemo(() => {
    const name = muralInfo["Nom de la commune"];
    return name ? `oddx_ans_${name.replace(/\s+/g, '_')}` : "oddx_ans_default";
  }, [muralInfo]);

  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem(storageKey) || "{}"));

  // Champs d'identité complets
  const identityFields = {
    "Administration": ["Nom de la commune", "Email officiel", "Maire actuel", "Code Insee", "Code Postal", "Département"],
    "Territoire": ["Population totale", "Densité (hab/km²)", "Superficie (ha)", "Espaces verts (m²)"],
    "Économie & Social": ["Taux de chômage (%)", "Revenu fiscal médian", "Nombre d'écoles", "Part logements sociaux (%)"],
    "Énergie & Déchets": ["Consommation énergétique (MWh)", "Part ENR (%)", "Taux de tri (%)", "Pistes cyclables (km)"]
  };

  useEffect(() => {
    localStorage.setItem("oddx_current_id", JSON.stringify(muralInfo));
    localStorage.setItem(storageKey, JSON.stringify(answers));
    localStorage.setItem("oddx_ideas", JSON.stringify(citizenIdeas));
    if (muralInfo["Nom de la commune"] && !profiles.includes(muralInfo["Nom de la commune"])) {
      const newProfiles = [...profiles, muralInfo["Nom de la commune"]];
      setProfiles(newProfiles);
      localStorage.setItem("oddx_profiles", JSON.stringify(newProfiles));
    }
  }, [answers, muralInfo, citizenIdeas, storageKey, profiles]);

  // Calculs
  const { oddAverages, globalScore, lowPerformingODDs } = useMemo(() => {
    const scores = {}; const counts = {};
    questions.forEach(q => {
      const val = answers[q.id];
      if (val) q.odds.forEach(o => { scores[o] = (scores[o] || 0) + val; counts[o] = (counts[o] || 0) + 1; });
    });
    const avgs = Object.keys(scores).map(o => ({ odd: `ODD ${o}`, value: Number((scores[o]/counts[o]).toFixed(1)) }));
    const total = avgs.length > 0 ? (avgs.reduce((acc, curr) => acc + curr.value, 0) / avgs.length).toFixed(1) : 0;
    return { oddAverages: avgs, globalScore: total, lowPerformingODDs: avgs.filter(a => a.value < 3.5).sort((a,b) => a.value - b.value) };
  }, [answers]);

  const handleVote = (id) => {
    setCitizenIdeas(citizenIdeas.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("Accueil")}>
          <img src={LOGO_URL} alt="X" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-black text-blue-600 tracking-tighter">ODD-X</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
          {["Accueil", "À Propos", "Diagnostic", "Résultats", "Priorités", "Institutions", "Citoyens", "Contact"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`${activeTab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"} pb-1 transition-all`}>{t}</button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* ACCUEIL */}
        {activeTab === "Accueil" && (
          <div className="text-center py-24 space-y-12">
            <h1 className="text-9xl font-black tracking-tighter uppercase leading-none">ODD-X</h1>
            <p className="text-3xl text-slate-400 font-light max-w-3xl mx-auto italic">"Penser global, agir local : le tableau de bord de votre transition durable."</p>
            <button onClick={() => setActiveTab("Diagnostic")} className="bg-blue-600 text-white px-16 py-6 rounded-full font-black text-xl shadow-2xl shadow-blue-200 hover:scale-105 transition-all">Lancer l'audit</button>
          </div>
        )}

        {/* À PROPOS */}
        {activeTab === "À Propos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12 items-center">
            <div className="space-y-6">
              <h2 className="text-6xl font-black italic uppercase leading-none border-l-8 border-blue-600 pl-6">Notre<br/>Mission</h2>
              <p className="text-xl text-slate-500 font-light leading-relaxed">ODD-X est un outil d'aide à la décision conçu pour les élus et agents territoriaux. Nous traduisons les 17 objectifs de l'ONU en indicateurs concrets pour votre territoire.</p>
            </div>
            <img src="https://educatif.eedf.fr/wp-content/uploads/sites/157/2021/02/ODD.jpg" alt="ODD" className="rounded-[40px] shadow-2xl border border-slate-200" />
          </div>
        )}

        {/* DIAGNOSTIC */}
        {activeTab === "Diagnostic" && (
          <div className="max-w-4xl mx-auto space-y-10">
            {Object.entries(identityFields).map(([cat, fields]) => (
              <section key={cat} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                <h3 className="text-blue-600 font-black uppercase tracking-widest mb-8 text-sm">{cat}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map(f => (
                    <div key={f} className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{f}</label>
                      <input 
                        value={muralInfo[f] || ""} 
                        onChange={(e) => setMuralInfo({...muralInfo, [f]: e.target.value})}
                        className="bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <button onClick={() => setActiveTab("Questionnaire")} className="w-full bg-blue-600 text-white p-8 rounded-3xl font-black uppercase text-xl shadow-xl shadow-blue-100">Accéder aux 25 questions</button>
          </div>
        )}

        {/* QUESTIONNAIRE */}
        {activeTab === "Questionnaire" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 mb-10">
              <span className="font-black text-blue-600 uppercase italic">{muralInfo["Nom de la commune"] || "Nouvelle Commune"}</span>
              <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}></div>
              </div>
            </div>
            {questions.map((q) => (
              <div key={q.id} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                <div className="flex gap-2 mb-4">
                  {q.odds.map(o => <span key={o} className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded">ODD {o}</span>)}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-8">{q.id}. {q.question}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {q.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setAnswers({...answers, [q.id]: idx + 1})}
                      className={`p-5 rounded-2xl border-2 text-left font-black uppercase text-xs transition-all flex justify-between items-center ${answers[q.id] === idx + 1 ? "border-blue-600 bg-blue-50 scale-[1.02]" : "border-slate-100 hover:border-slate-300 bg-white"}`}
                    >
                      {opt.text}
                      {answers[q.id] === idx + 1 && <span className="text-blue-600">●</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => setActiveTab("Résultats")} className="w-full bg-blue-600 text-white p-8 rounded-3xl font-black uppercase text-xl shadow-xl">Générer le rapport final</button>
          </div>
        )}

        {/* RÉSULTATS */}
        {activeTab === "Résultats" && (
          <div className="space-y-12">
            <div className="flex justify-between items-end border-b-8 border-blue-600 pb-8">
              <div>
                <h2 className="text-7xl font-black italic uppercase leading-none">Rapport</h2>
                <p className="text-2xl font-black text-blue-600 uppercase">{muralInfo["Nom de la commune"]}</p>
              </div>
              <button onClick={() => window.print()} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-xs">Exporter PDF</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-blue-600 p-16 rounded-[60px] text-white text-center flex flex-col justify-center shadow-2xl">
                <div className="text-[120px] font-black leading-none">{globalScore}</div>
                <div className="text-2xl font-bold uppercase tracking-widest">Score Global</div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-[60px] p-10 border border-slate-200 shadow-sm flex items-center justify-center">
                 <ReactECharts option={{
                   tooltip: { trigger: 'item' },
                   series: [{
                     type: 'pie', radius: [60, 160], roseType: 'area',
                     itemStyle: { borderRadius: 12, borderColor: '#fff', borderWidth: 4 },
                     label: { show: true, fontSize: 12, fontWeight: 'bold' },
                     data: oddAverages.map(a => ({ value: a.value, name: a.odd, itemStyle: { color: a.value > 4 ? '#16a34a' : a.value > 2.5 ? '#ca8a04' : '#dc2626' } }))
                   }]
                 }} style={{ height: "500px", width: "100%" }} />
              </div>
            </div>
          </div>
        )}

        {/* PRIORITÉS */}
        {activeTab === "Priorités" && (
          <div className="space-y-10">
            <div className="max-w-3xl">
              <h2 className="text-6xl font-black italic uppercase underline decoration-blue-600 underline-offset-8 mb-6">Priorités</h2>
              <p className="text-slate-400 text-lg italic border-l-4 border-slate-200 pl-6">"Les recommandations suivantes sont basées sur vos scores les plus bas. Pour un plan d'action sur-mesure, consultez un expert via l'onglet Institutions."</p>
            </div>
            <div className="grid gap-6">
              {lowPerformingODDs.map(o => (
                <div key={o.odd} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-400 transition-all">
                  <div className="flex items-center gap-8">
                    <img src={oddIcons[o.odd]} alt="" className="w-20 h-20 rounded-2xl group-hover:rotate-3 transition-transform" />
                    <div>
                      <h4 className="text-4xl font-black text-slate-800 italic uppercase leading-none mb-2">{o.odd}</h4>
                      <p className="text-slate-500 font-medium max-w-xl">{oddDescriptions[o.odd]}</p>
                    </div>
                  </div>
                  <div className="text-5xl font-black text-red-500 bg-red-50 w-24 h-24 rounded-full flex items-center justify-center">{o.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSTITUTIONS */}
        {activeTab === "Institutions" && (
          <div className="space-y-12">
            <h2 className="text-6xl font-black italic uppercase underline decoration-blue-600 underline-offset-8">Accompagnement</h2>
            <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">Ces organismes publics et réseaux d'experts pourraient vous accompagner dans votre transition durable et vous aider à améliorer vos performances en matière d'ODD.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "ADEME", full: "Agence de la transition écologique", link: "https://www.ademe.fr" },
                { name: "FVD", full: "France Villes et Territoires Durables", link: "https://francevilledurable.fr/" },
                { name: "Club DD", full: "Le club développement durable des établissements et entreprises publics", link: "https://www.ecologie.gouv.fr/politiques-publiques/club-developpement-durable-etablissements-entreprises-publics" },
                { name: "ANCT", full: "Agence Nationale de la Cohésion des Territoires", link: "https://agence-cohesion-territoires.gouv.fr" }
              ].map(i => (
                <div key={i.name} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">{i.name}</span>
                  <h3 className="text-2xl font-black text-slate-900 uppercase mb-4 leading-tight">{i.full}</h3>
                  <a href={i.link} target="_blank" rel="noreferrer" className="text-blue-600 font-black text-xs uppercase tracking-widest border-b-2 border-blue-100 hover:border-blue-600 transition-all">Consulter les ressources</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CITOYENS */}
        {activeTab === "Citoyens" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm h-fit">
              <h3 className="text-2xl font-black mb-8 uppercase text-blue-600 italic">Proposer une idée</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const text = e.target.ideaText.value;
                const newIdea = { id: Date.now(), odd: selectedOdd, text, date: new Date().toLocaleDateString(), votes: 0 };
                setCitizenIdeas([newIdea, ...citizenIdeas]);
                e.target.reset();
                setSelectedOdd("");
              }} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Cible ODD</label>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    {Object.keys(oddIcons).map(o => (
                      <button key={o} type="button" onClick={() => setSelectedOdd(o)} className={`p-1 rounded-lg transition-all ${selectedOdd === o ? "ring-2 ring-blue-600 bg-blue-50" : "opacity-40 hover:opacity-100"}`}>
                        <img src={oddIcons[o]} alt={o} className="w-full rounded" />
                      </button>
                    ))}
                  </div>
                  {selectedOdd && <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 animate-in zoom-in-95 text-[11px] font-medium text-blue-800 leading-tight">{oddDescriptions[selectedOdd]}</div>}
                </div>
                <textarea name="ideaText" placeholder="Votre proposition pour la ville..." rows="5" className="w-full bg-slate-50 p-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-medium" required></textarea>
                <button type="submit" disabled={!selectedOdd} className={`w-full p-5 rounded-2xl font-black uppercase shadow-lg transition-all ${selectedOdd ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400"}`}>Publier</button>
              </form>
            </div>
            
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-3xl font-black uppercase italic border-b-4 border-slate-100 pb-4">Paroles de citoyens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {citizenIdeas.map(i => (
                  <div key={i.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="flex gap-5 mb-6">
                      <img src={oddIcons[i.odd]} alt="" className="w-14 h-14 rounded-xl shrink-0 shadow-sm" />
                      <p className="font-bold italic text-slate-700 leading-snug">"{i.text}"</p>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{i.date}</span>
                      <button onClick={() => handleVote(i.id)} className="bg-slate-50 hover:bg-blue-50 text-slate-900 hover:text-blue-600 px-4 py-2 rounded-full flex items-center gap-3 transition-all">
                        <span className="font-black text-sm">{i.votes}</span>
                        <span className="text-lg">👍</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeTab === "Contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-12 items-center">
            <div className="space-y-8">
              <h2 className="text-8xl font-black uppercase italic underline decoration-blue-600">Contact</h2>
              <div className="space-y-4 text-2xl font-light">
                <p>📍 Paris, France</p>
                <p>✉️ <span className="font-bold text-blue-600">info@odd-x.com</span></p>
              </div>
            </div>
            <form className="bg-white p-12 rounded-[60px] border border-slate-200 shadow-2xl space-y-4">
              <input type="text" placeholder="NOM" className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100" />
              <textarea placeholder="MESSAGE..." rows="6" className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100"></textarea>
              <button type="button" className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Envoyer le message</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}