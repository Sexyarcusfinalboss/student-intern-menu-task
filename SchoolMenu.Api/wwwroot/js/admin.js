// admin.js - страницата на кухнята

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

// --- Пазач: само кухнята има достъп ---
async function guard() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'kitchen') {
    window.location.href = 'login.html';
    return null;
  }
  document.getElementById('who').textContent = user.username;
  return user;
}

// --- Типове ястия на български ---
const TYPE_BG = { soup: 'Супа', main: 'Основно', dessert: 'Десерт' };

// --- Зарежда и показва списъка с ястия + бутон Изтрий ---
async function loadItems() {
  const items = await getMenuItems();
  document.getElementById('items-list').innerHTML = items
    .map(i => `
      <li>
        <div>
          <strong>${i.name}</strong>
          <span class="tag">${TYPE_BG[i.type] ?? i.type}</span>
          ${i.price != null ? `<span class="price">${Number(i.price).toFixed(2)} лв.</span>` : ''}
          ${i.allergens ? `<small class="muted"> алергени: ${i.allergens}</small>` : ''}
          ${i.ingredients ? `<small class="muted"> съставки: ${i.ingredients}</small>` : ''}
        </div>
        <button class="btn-delete-item" data-id="${i.id}" data-name="${i.name}">Изтрий</button>
      </li>`)
    .join('');

  // Закачаме изтриването след рендера
  document.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id   = btn.dataset.id;
      const name = btn.dataset.name;
      if (!confirm(`Сигурен ли си, че искаш да изтриеш "${name}"?\nТова действие е необратимо!`)) return;
      try {
        await deleteMenuItem(id);
        await loadItems();
        await loadMenuSelects(); // обнови и селектите
      } catch (err) {
        showError('item-error', err.message);
      }
    });
  });
}

// --- Добавяне на ново ястие ---
document.getElementById('item-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError('item-error');
  try {
    await postMenuItem({
      name:        document.getElementById('item-name').value,
      type:        document.getElementById('item-type').value,
      allergens:   document.getElementById('item-allergens').value   || null,
      ingredients: document.getElementById('item-ingredients').value || null,
      price:       document.getElementById('item-price').value
                     ? Number(document.getElementById('item-price').value)
                     : null,
    });
    document.getElementById('item-form').reset();
    await loadItems();
    await loadMenuSelects();
  } catch (err) {
    showError('item-error', err.message);
  }
});

// --- Напълва трите падащи менюта ---
async function loadMenuSelects() {
  const items = await getMenuItems();
  const fill = (id, type) => {
    document.getElementById(id).innerHTML = items
      .filter(i => i.type === type)
      .map(i => `<option value="${i.id}">${i.name}</option>`)
      .join('');
  };
  fill('select-soup',    'soup');
  fill('select-main',    'main');
  fill('select-dessert', 'dessert');
}

// --- Публикуване на дневно меню ---
document.getElementById('menu-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError('menu-error');
  const msg = document.getElementById('menu-msg');
  msg.textContent = '';

  const date = document.getElementById('menu-date-input').value;
  if (!date) { showError('menu-error', 'Избери дата!'); return; }

  try {
    await postMenu({
      date,
      soupId:       Number(document.getElementById('select-soup').value),
      mainCourseId: Number(document.getElementById('select-main').value),
      dessertId:    Number(document.getElementById('select-dessert').value),
      notes:        document.getElementById('menu-notes').value || null,
    });
    document.getElementById('menu-form').reset();
    msg.textContent = 'Менюто е публикувано!';
    msg.style.color = 'var(--primary)';
  } catch (err) {
    showError('menu-error', err.message);
  }
});

// --- Изход ---
document.getElementById('btn-logout').addEventListener('click', async () => {
  await logout();
  window.location.href = 'index.html';
});

// --- Помощни функции за грешки ---
function showError(divId, msg) {
  const el = document.getElementById(divId);
  if (el) el.textContent = msg;
}
function clearError(divId) {
  const el = document.getElementById(divId);
  if (el) el.textContent = '';
}

// --- Старт ---
guard().then(user => {
  if (user) {
    loadItems();
    loadMenuSelects();
  }
});
