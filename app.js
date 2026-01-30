// Инициализация Telegram WebAppconst tg = window.Telegram.WebApp;
tg.expand();

// ВАЖНО: сюда пиши СВОЙ Telegram username БЕЗ @, например: "lorexkut33"
const ADMIN_USERNAME = "xkkdl";

// Попробуем вытащить данные о пользователе
const user = tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : null;

// Для дебага: выведем, что Telegram реально прислал
console.log("TG user:", user);

// Проверяем, админ ли это
const isAdmin = !!(user && user.username && user.username.toLowerCase() === ADMIN_USERNAME.toLowerCase());
console.log("isAdmin =", isAdmin, "user.username =", user && user.username);

// Если админ – показываем вкладку
window.addEventListener("DOMContentLoaded", () => {
  const adminTab = document.getElementById("admin-tab");
  if (!adminTab) return;
  if (isAdmin) {
    adminTab.style.display = "inline-block";
  } else {
    adminTab.style.display = "none";
  }
});

// ======= ДАННЫЕ БОЙЦОВ (пока в JS) =======

const fighters = [
  {
    id: "adesanya",
    name: "Israel Adesanya",
    image: "https://i.imgur.com/XXXXX.jpg",
    stance: "Switch",
    weightClass: "Middleweight",
    stats: {
      headHealth: 92,
      bodyHealth: 90,
      stamina: 93,
      striking: 96,
      grappling: 86
    },
    history: "27-3-0, бывший чемпион среднего веса UFC.",
    technique: "Высокий уровень кикбоксинга, работа с дистанции.",
    alterEgo: "Stylebender"
  },
  {
    id: "pereira",
    name: "Alex Pereira",
    image: "https://i.imgur.com/YYYYY.jpg",
    stance: "Orthodox",
    weightClass: "Light Heavyweight",
    stats: {
      headHealth: 94,
      bodyHealth: 92,
      stamina: 88,
      striking: 97,
      grappling: 80
    },
    history: "Бывший чемпион в среднем и полутяжёлом весе.",
    technique: "Кикбоксёр, мощный левый хук.",
    alterEgo: null
  }
  // сюда добавить остальных бойцов
];

// ======= ИЗБРАННОЕ В localStorage =======

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch {
    return [];
  }
}

function setFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(x => x !== id);
  } else {
    favs.push(id);
  }
  setFavorites(favs);
  alert("Избранное обновлено");
}

// ======= РЕНДЕР СПИСКА БОЙЦОВ =======

function renderFighters(list) {
  const container = document.getElementById("fighters");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>Бойцы не найдены</p>";
    return;
  }

  list.forEach(f => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openFighterPage(f);

    card.innerHTML = `
      <img src="${f.image}" alt="${f.name}">
      <h2>${f.name}</h2>
      <p><b>Стойка:</b> ${f.stance}</p>
      <p><b>Вес:</b> ${f.weightClass}</p>
      ${f.alterEgo ? `<span class="tag">${f.alterEgo}</span>` : ""}
    `;
    container.appendChild(card);
  });
}

// ======= ФИЛЬТР + ПОИСК =======

function applyFilters() {
  const weight = document.getElementById("weight-filter").value;
  const q = document.getElementById("search").value.toLowerCase();

  let list = fighters.slice();

  if (weight) list = list.filter(f => f.weightClass === weight);
  if (q) list = list.filter(f => f.name.toLowerCase().includes(q));

  renderFighters(list);
}

// ======= ВКЛАДКИ =======

let currentTab = "all";

function updateTabView() {
  document.getElementById("fighters").style.display = currentTab === "all" ? "block" : "none";
  document.getElementById("favorites-list").style.display = currentTab === "favorites" ? "block" : "none";
  document.getElementById("admin-panel").style.display = currentTab === "admin" ? "block" : "none";

  if (currentTab === "all") applyFilters();
  if (currentTab === "favorites") renderFavorites();
  if (currentTab === "admin") renderAdmin();
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTab = btn.dataset.tab;
      updateTabView();
    };
  });

  document.getElementById("weight-filter").onchange = applyFilters;
  document.getElementById("search").oninput = applyFilters;
}

// ======= ИЗБРАННОЕ ВКЛАДКА =======

function renderFavorites() {
  const favs = getFavorites();
  const list = fighters.filter(f => favs.includes(f.id));
  const box = document.getElementById("favorites-list");
  box.innerHTML = "";

  if (!list.length) {
    box.innerHTML = "<p>Пока нет избранных бойцов</p>";
    return;
  }

  // используем тот же рендер для списка
  list.forEach(f => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openFighterPage(f);

    card.innerHTML = `
      <img src="${f.image}" alt="${f.name}">
      <h2>${f.name}</h2>
      <p><b>Стойка:</b> ${f.stance}</p>
      <p><b>Вес:</b> ${f.weightClass}</p>
      ${f.alterEgo ? `<span class="tag">${f.alterEgo}</span>` : ""}
    `;
    box.appendChild(card);
  });
}

// ======= СТРАНИЦА БОЙЦА =======

function openFighterPage(f) {
  document.getElementById("main-tabs").style.display = "none";

  const detail = document.createElement("div");
  detail.id = "fighter-page";
  detail.innerHTML = `
    <div class="fighter-header">
      <img id="fighter-photo" src="${f.image}" alt="${f.name}">
      <h1>${f.name}</h1>
      <p>${f.weightClass}</p>
    </div>

    <div class="stats-block">
      <h3>Характеристики</h3>
      <div class="stat-row">
        <span>Здоровье головы</span>
        <div class="bar"><div style="width:${f.stats.headHealth}%"></div></div>
        <span>${f.stats.headHealth}</span>
      </div>
      <div class="stat-row">
        <span>Здоровье корпуса</span>
        <div class="bar"><div style="width:${f.stats.bodyHealth}%"></div></div>
        <span>${f.stats.bodyHealth}</span>
      </div>
      <div class="stat-row">
        <span>Кардио</span>
        <div class="bar"><div style="width:${f.stats.stamina}%"></div></div>
        <span>${f.stats.stamina}</span>
      </div>
      <div class="stat-row">
        <span>Ударка</span>
        <div class="bar"><div style="width:${f.stats.striking}%"></div></div>
        <span>${f.stats.striking}</span>
      </div>
      <div class="stat-row">
        <span>Борьба</span>
        <div class="bar"><div style="width:${f.stats.grappling}%"></div></div>
        <span>${f.stats.grappling}</span>
      </div>
    </div>

    <div class="section">
      <h3>История боёв</h3>
      <p>${f.history || "Ещё не заполнил"}</p>
    </div>

    <div class="section">
      <h3>Техника</h3>
      <p>${f.technique || "Ещё не заполнил"}</p>
    </div>

    <button class="fav-btn" onclick="toggleFavorite('${f.id}')">
      Добавить в избранное
    </button>

    <button class="back-btn" onclick="closeFighterPage()">
      Назад
    </button>
  `;
  document.body.appendChild(detail);

  window.addEventListener("scroll", shrinkPhotoOnScroll);
}

function closeFighterPage() {
  window.removeEventListener("scroll", shrinkPhotoOnScroll);
  const page = document.getElementById("fighter-page");
  if (page) page.remove();
  document.getElementById("main-tabs").style.display = "block";
}

function shrinkPhotoOnScroll() {
  const img = document.getElementById("fighter-photo");
  if (!img) return;
  const max = 250;
  const min = 80;
  const scrolled = Math.min(window.scrollY, 200);
  const h = max - (max - min) * (scrolled / 200);
  img.style.height = h + "px";
}

// ======= АДМИН‑ПАНЕЛЬ =======

function renderAdmin() {
  const panel = document.getElementById("admin-panel");

  if (!isAdmin) {
    panel.innerHTML = "<p>Нет доступа</p>";
    return;
  }

  panel.innerHTML = `
    <h2>Админка</h2>
    <form id="add-form">
      <input name="name" placeholder="Имя бойца" required>
      <input name="image" placeholder="URL фото" required>
      <input name="weightClass" placeholder="Весовая категория" required>
      <input name="stance" placeholder="Стойка" required>
      <input name="head" type="number" min="0" max="100" placeholder="Здоровье головы (0-100)">
      <input name="body" type="number" min="0" max="100" placeholder="Здоровье корпуса (0-100)">
      <input name="stamina" type="number" min="0" max="100" placeholder="Кардио (0-100)">
      <input name="striking" type="number" min="0" max="100" placeholder="Ударка (0-100)">
      <input name="grappling" type="number" min="0" max="100" placeholder="Борьба (0-100)">
      <textarea name="history" placeholder="История боёв"></textarea>
      <textarea name="technique" placeholder="Техника"></textarea>
      <button type="submit">Добавить бойца</button>
    </form>
    <h3>Список бойцов</h3>
    <ul id="admin-list"></ul>
  `;

  const list = document.getElementById("admin-list");
  list.innerHTML = "";
  fighters.forEach(f => {
    const li = document.createElement("li");
    li.textContent = `${f.name} (${f.weightClass})`;
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.onclick = () => {
      const idx = fighters.findIndex(x => x.id === f.id);
      if (idx >= 0) fighters.splice(idx, 1);
      renderAdmin();
      if (currentTab === "all") applyFilters();
    };
    li.appendChild(del);
    list.appendChild(li);
  });

  document.getElementById("add-form").onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name");
    const id = name.toLowerCase().replace(/\s+/g, "_");
    fighters.push({
      id,
      name,
      image: fd.get("image"),
      weightClass: fd.get("weightClass"),
      stance: fd.get("stance"),
      stats: {
        headHealth: Number(fd.get("head") || 80),
        bodyHealth: Number(fd.get("body") || 80),
        stamina: Number(fd.get("stamina") || 80),
        striking: Number(fd.get("striking") || 80),
        grappling: Number(fd.get("grappling") || 80)
      },
      history: fd.get("history") || "",
      technique: fd.get("technique") || "",
      alterEgo: null
    });
    e.target.reset();
    renderAdmin();
    if (currentTab === "all") applyFilters();
  };
}

// ======= СТАРТ ПРИ ЗАГРУЗКЕ =======

window.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  applyFilters();
});
