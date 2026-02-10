const trips = [
    { id: 1, from: "Ottawa", to: "La Cité", date: "2026-02-10", time: "08:00", seats: 3 },
    { id: 2, from: "Gatineau", to: "La Cité", date: "2026-02-10", time: "09:15", seats: 2 },
    { id: 3, from: "Orléans", to: "La Cité", date: "2026-02-11", time: "07:30", seats: 1 }
  ];
  
  function qs(id){ return document.getElementById(id); }
  
  function renderResults(list){
    const box = qs("results");
    if (!box) return;
  
    if (list.length === 0){
      box.innerHTML = "<p class='hint'>Aucun trajet trouvé.</p>";
      return;
    }
  
    box.innerHTML = list.map(t => `
      <div class="item">
        <div>
          <div><strong>${t.from}</strong> → <strong>${t.to}</strong></div>
          <div class="hint">${t.date} à ${t.time}</div>
        </div>
        <div class="badge">${t.seats} place(s)</div>
      </div>
    `).join("");
  }
  
  function getQuery(){
    const params = new URLSearchParams(window.location.search);
    return {
      from: (params.get("from") || "").trim().toLowerCase(),
      to: (params.get("to") || "").trim().toLowerCase(),
      date: (params.get("date") || "").trim()
    };
  }
  
  function filterTrips({from,to,date}){
    return trips.filter(t => {
      const okFrom = !from || t.from.toLowerCase().includes(from);
      const okTo = !to || t.to.toLowerCase().includes(to);
      const okDate = !date || t.date === date;
      return okFrom && okTo && okDate;
    });
  }
  
  // SEARCH
  const searchForm = qs("searchForm");
  if (searchForm){
    const q = getQuery();
    if (qs("from")) qs("from").value = q.from ? q.from : "";
    if (qs("to")) qs("to").value = q.to ? q.to : "";
    if (qs("date")) qs("date").value = q.date ? q.date : "";
    renderResults(filterTrips(q));
  
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q2 = {
        from: qs("from").value.trim().toLowerCase(),
        to: qs("to").value.trim().toLowerCase(),
        date: qs("date").value.trim()
      };
      renderResults(filterTrips(q2));
    });
  }
  
  // PUBLISH (fake)
  const publishForm = qs("publishForm");
  if (publishForm){
    publishForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = qs("publishMsg");
      if (msg) msg.textContent = "Trajet publié (démo).";
      publishForm.reset();
    });
  }
  
  // LOGIN (fake)
  const loginForm = qs("loginForm");
  if (loginForm){
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = qs("loginMsg");
      if (msg) msg.textContent = "Connexion (démo).";
      loginForm.reset();
    });
  }
  