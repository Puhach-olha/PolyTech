/* =========================================================
   Credit Agricole Agro+ — логіка інтерфейсу
   ========================================================= */

/* ---------- Стан застосунку ---------- */

const state = {
    balance: 128450,       // загальний баланс
    agroCurrent: 10000,    // накопичено в Agro-подушці
    agroGoal: 20000,       // ціль Agro-подушки
    subscription: null     // активна підписка
};

/* Заголовки сторінок для шапки */
const PAGE_TITLES = {
    home: 'Головна',
    finance: 'Фінанси',
    subscriptions: 'Підписки',
    agro: 'Agro-подушка',
    analytics: 'Аналітика',
    profile: 'Профіль'
};

/* ---------- Допоміжні функції ---------- */

/* 128450 -> "128 450 ₴" */
function formatMoney(value) {
    return Math.round(value).toLocaleString('uk-UA').replace(/\u00A0/g, ' ') + ' ₴';
}

/* Безпечно читає число з інпута */
function readAmount(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return null;
    const value = parseFloat(String(input.value).replace(',', '.'));
    return isNaN(value) ? null : value;
}

function clearInputs(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.querySelectorAll('input').forEach(input => (input.value = ''));
}

/* ---------- Навігація ---------- */

function showPage(pageId) {
    const target = document.getElementById(pageId);
    if (!target) return;

    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    target.classList.add('active');

    document.querySelectorAll('.nav button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    const title = document.getElementById('pageTitle');
    if (title) title.textContent = PAGE_TITLES[pageId] || '';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    /* Зберігаємо сторінку в адресі, щоб працювала кнопка «Назад» */
    if (location.hash !== '#' + pageId) {
        history.pushState({ page: pageId }, '', '#' + pageId);
    }
}

/* Кнопки бокового меню */
document.querySelectorAll('.nav button').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
});

/* Кнопки «Назад/Вперед» у браузері */
window.addEventListener('popstate', () => {
    const pageId = location.hash.replace('#', '') || 'home';
    if (PAGE_TITLES[pageId]) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        document.querySelectorAll('.nav button').forEach(b => {
            b.classList.toggle('active', b.dataset.page === pageId);
        });
        document.getElementById('pageTitle').textContent = PAGE_TITLES[pageId];
    }
});

/* ---------- Модальні вікна ---------- */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    clearInputs(modalId);
}

function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(m => closeModal(m.id));
}

/* Клік по затемненому фону закриває вікно */
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
        if (event.target === modal) closeModal(modal.id);
    });
});

/* Esc закриває вікно */
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAllModals();
});

/* ---------- Сповіщення (toast) ---------- */

let toastTimer = null;

function showToast(message) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toastText');
    if (!toast || !text) return;

    text.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ---------- Оновлення інтерфейсу ---------- */

function renderBalance() {
    const hero = document.querySelector('.hero-card h2');
    if (hero) hero.textContent = formatMoney(state.balance);

    /* Картка «Заощадження» на сторінці Фінанси */
    const savings = document.querySelectorAll('.stat-card')[2];
    if (savings) savings.querySelector('strong').textContent = formatMoney(state.balance);
}

function renderAgro() {
    const percent = Math.min(100, Math.round((state.agroCurrent / state.agroGoal) * 100));

    /* Велика картка на сторінці Agro-подушка */
    const agroCard = document.querySelector('.agro-main-card');
    if (agroCard) {
        agroCard.querySelector('h2').textContent = formatMoney(state.agroCurrent);
        agroCard.querySelector('p').textContent = 'Ваша ціль — ' + formatMoney(state.agroGoal);
        agroCard.querySelector('.progress div').style.width = percent + '%';
    }

    /* Картка продукту на Головній */
    const productCard = document.querySelector('.products-grid .product-card');
    if (productCard) {
        productCard.querySelector('.product-value strong').textContent = formatMoney(state.agroCurrent);
        productCard.querySelector('.product-value span').textContent = 'із ' + formatMoney(state.agroGoal);
        productCard.querySelector('.progress div').style.width = percent + '%';
    }

    /* Фінансова ціль на сторінці Фінанси */
    const goal = document.querySelector('.goal-card');
    if (goal) {
        const left = Math.max(0, state.agroGoal - state.agroCurrent);
        goal.querySelector('p').textContent = left > 0
            ? 'Залишилось накопичити ' + formatMoney(left)
            : 'Ціль досягнуто 🎉';
        goal.querySelector('.goal-progress strong').textContent = percent + '%';
        goal.querySelector('.progress div').style.width = percent + '%';
    }
}

/* Додає нову операцію на початок списку */
function addTransaction(title, amount, type) {
    const list = document.querySelector('.transactions');
    if (!list) return;

    const now = new Date();
    const time = 'Сьогодні, ' + String(now.getHours()).padStart(2, '0') +
                 ':' + String(now.getMinutes()).padStart(2, '0');

    const row = document.createElement('div');
    row.className = 'transaction';
    row.innerHTML = `
        <div class="transaction-icon ${type === 'income' ? 'income' : 'expense'}">
            ${type === 'income' ? '↓' : '↑'}
        </div>
        <div class="transaction-info">
            <strong></strong>
            <span>${time}</span>
        </div>
        <strong class="transaction-amount ${type === 'income' ? 'positive' : ''}">
            ${type === 'income' ? '+' : '−'}${formatMoney(Math.abs(amount))}
        </strong>
    `;
    row.querySelector('.transaction-info strong').textContent = title;

    list.prepend(row);

    /* Тримаємо не більше 6 операцій у списку */
    while (list.children.length > 6) list.lastElementChild.remove();
}

/* ---------- Операції ---------- */

function makeTransfer() {
    const card = (document.getElementById('transferCard').value || '').replace(/\s/g, '');
    const amount = readAmount('transferAmount');

    if (card.length < 16) {
        showToast('Введіть коректний номер картки (16 цифр)');
        return;
    }
    if (!amount || amount <= 0) {
        showToast('Введіть суму переказу');
        return;
    }
    if (amount > state.balance) {
        showToast('Недостатньо коштів на рахунку');
        return;
    }

    state.balance -= amount;
    renderBalance();
    addTransaction('Переказ на картку ' + card.slice(-4), amount, 'expense');

    closeModal('transferModal');
    showToast('Переказано ' + formatMoney(amount));
}

function makeTopup() {
    const amount = readAmount('topupAmount');
    const source = document.getElementById('topupSource').value;

    if (!amount || amount <= 0) {
        showToast('Введіть суму поповнення');
        return;
    }

    state.balance += amount;
    renderBalance();
    addTransaction('Поповнення — ' + source, amount, 'income');

    closeModal('topupModal');
    showToast('Рахунок поповнено на ' + formatMoney(amount));
}

function makeAgroTopup() {
    const amount = readAmount('agroAmount');

    if (!amount || amount <= 0) {
        showToast('Введіть суму');
        return;
    }
    if (amount > state.balance) {
        showToast('Недостатньо коштів на рахунку');
        return;
    }

    state.balance -= amount;
    state.agroCurrent += amount;

    renderBalance();
    renderAgro();
    addTransaction('Поповнення Agro-подушки', amount, 'expense');

    closeModal('agroModal');

    if (state.agroCurrent >= state.agroGoal) {
        showToast('Ціль резерву досягнуто!');
    } else {
        showToast('Додано до резерву ' + formatMoney(amount));
    }
}

function activateSubscription(name) {
    if (state.subscription === name) {
        showToast('Підписка «' + name + '» вже активна');
        return;
    }

    state.subscription = name;

    /* Оновлюємо кнопки: активна підписка стає неактивною */
    document.querySelectorAll('.subscription-card').forEach(card => {
        const cardName = card.querySelector('h3').textContent.trim();
        const btn = card.querySelector('.primary-button');
        if (cardName === name) {
            btn.textContent = 'Підключено ✓';
        } else {
            btn.textContent = 'Підключити';
        }
    });

    showToast('Підписку «' + name + '» активовано');
}

/* ---------- Перемикачі в профілі ---------- */

document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');

        const label = toggle.closest('.setting')?.querySelector('strong')?.textContent || 'Налаштування';
        showToast(label + ': ' + (toggle.classList.contains('active') ? 'увімкнено' : 'вимкнено'));
    });
});

/* ---------- Старт ---------- */

document.addEventListener('DOMContentLoaded', () => {
    renderBalance();
    renderAgro();

    const startPage = location.hash.replace('#', '');
    if (PAGE_TITLES[startPage]) showPage(startPage);
});
