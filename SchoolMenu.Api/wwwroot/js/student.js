// student.js

// --- Тъмен/светъл режим ---
(function () {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('btn-theme');
  btn.textContent = saved === 'dark' ? '☀️' : '🌙';
  btn.onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  };
})();

// Всички известни алергени за падащото меню
const ALL_ALLERGENS = [
  "глутен", "мляко", "яйца", "целина", "ядки", "соя",
  "фъстъци", "риба", "ракообразни", "горчица", "сусам"
];

function dateToStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

let currentDate = new Date();
let currentMenu = null;

// --- Попълва падащия филтър ---
function buildFilterDropdown() {
  const sel = document.getElementById('allergen-filter');
  sel.innerHTML = `<option value="">Всички ястия</option>` +
    ALL_ALLERGENS.map(a => `<option value="${a}">Изключи: ${a}</option>`).join('');
}

// --- Секция за едно ястие ---
function makeSection(type, label, item, filterWord) {
  const allergens   = item?.allergens   ?? '';
  const ingredients = item?.ingredients ?? '';
  const price       = item?.price != null ? `${Number(item.price).toFixed(2)} лв.` : '';
  const isWarning   = filterWord && allergens.toLowerCase().includes(filterWord.toLowerCase());

  if (!item) {
    return `
      <section class="course-section">
        <div class="course-header">
          <img class="course-img" src="" alt="${label}" style="opacity:0.3">
          <div class="course-title">
            <span class="course-label">${label}</span>
            <strong class="course-name muted">Не е въведено</strong>
          </div>
        </div>
      </section>`;
  }

  return `
    <section class="course-section ${isWarning ? 'allergen-warning' : ''}">
      <div class="course-header">
        <img class="course-img" src="${item.imageUrl || ""}" alt="${label}">
        <div class="course-title">
          <span class="course-label">${label}</span>
          <strong class="course-name">${item.name}</strong>
          ${price ? `<span class="price">${price}</span>` : ''}
          ${isWarning ? `<div class="allergen-badge">Съдържа: ${filterWord}</div>` : ''}
        </div>
      </div>
      <div class="course-details">
        <div class="detail-row">
          <span class="detail-label">Съставки</span>
          <span class="detail-value">${ingredients || '—'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Алергени</span>
          <span class="detail-value ${allergens ? 'allergen-text' : ''}">${allergens || 'Няма'}</span>
        </div>
      </div>
    </section>`;
}

// --- Рендерира цялото меню ---
function renderMenu(menu, filterWord) {
  const container = document.getElementById('menu-container');
  if (!menu) {
    container.innerHTML = `
      <div class="empty-day">
        <div class="empty-icon">🍳</div>
        <p>Кухнята още готви менюто за този ден.</p>
        <p class="muted">Провери пак малко по-късно!</p>
        <div style="display:flex;gap:8px;margin-top:16px;justify-content:center">
          <button onclick="changeDay(-1)">← Вчера</button>
          <button onclick="goToday()">Днес</button>
          <button onclick="changeDay(1)">Утре →</button>
        </div>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="courses-list">
      ${makeSection('soup',    'Закуска / Супа', menu.soup,       filterWord)}
      ${makeSection('main',    'Основно ястие',  menu.mainCourse, filterWord)}
      ${makeSection('dessert', 'Десерт',         menu.dessert,    filterWord)}
    </div>
    ${menu.notes ? `<p class="notes">${menu.notes}</p>` : ''}`;
}

// --- Зарежда меню за дата ---
async function loadMenu(date) {
  document.getElementById('menu-date').textContent =
    date.toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' });

  currentMenu = await getMenuForDate(dateToStr(date));
  const filterWord = document.getElementById('allergen-filter').value;
  renderMenu(currentMenu, filterWord);
}

// --- Навигация ---
function changeDay(days) {
  currentDate.setDate(currentDate.getDate() + days);
  loadMenu(currentDate);
}
function goToday() {
  currentDate = new Date();
  loadMenu(currentDate);
}

document.getElementById('btn-prev').onclick  = () => changeDay(-1);
document.getElementById('btn-next').onclick  = () => changeDay(+1);
document.getElementById('btn-today').onclick = () => goToday();

// --- Падащ филтър ---
document.getElementById('allergen-filter').addEventListener('change', () => {
  const word = document.getElementById('allergen-filter').value;
  renderMenu(currentMenu, word);
});

// --- Старт ---
buildFilterDropdown();
loadMenu(currentDate);
