/* ================== ДАНІ ================== */

const MONTHS = [
    {m:'Вер 26', inc:180, exp:210, note:'Дообмолот, продаж залишків пшениці'},
    {m:'Жов 26', inc:980, exp:260, note:'Продаж соняшнику — головне надходження осені'},
    {m:'Лис 26', inc:120, exp:140, note:'Сівба озимих завершена, розрахунки з підрядниками'},
    {m:'Гру 26', inc:60,  exp:130, note:'Податки, ремонт техніки в міжсезоння'},
    {m:'Січ 27', inc:40,  exp:120, note:'Оренда паїв, зарплати'},
    {m:'Лют 27', inc:30,  exp:180, note:'Передоплата за насіння та ЗЗР'},
    {m:'Бер 27', inc:60,  exp:390, note:'Закупівля добрив під посівну'},
    {m:'Кві 27', inc:40,  exp:520, note:'Посівна: пальне, насіння, підрядники'},
    {m:'Тра 27', inc:50,  exp:310, note:'Обприскування, догляд за посівами'},
    {m:'Чер 27', inc:80,  exp:260, note:'Друге внесення ЗЗР, підготовка до жнив'},
    {m:'Лип 27', inc:1450,exp:340, note:'Жнива пшениці — основне надходження року'},
    {m:'Сер 27', inc:300, exp:200, note:'Продаж партіями, сівба під наступний сезон'}
];

const START = 640; // тис ₴ на початок періоду

const EQUIPMENT = {
    sprayer:  {name:'Обприскувач причіпний, 2000 л', min:420, max:520, rentPerHa:1400},
    seeder:   {name:'Сівалка просапна, 8 рядків',    min:310, max:390, rentPerHa:1100},
    tractor:  {name:'Трактор 150 к.с., б/в',         min:880, max:1150, rentPerHa:2200},
    harvester:{name:'Жатка зернова, 6 м',            min:240, max:310, rentPerHa:900}
};

const NEIGHBOURS = [
    {id:1, farm:'ФГ «Зоря Поділля»', dist:12, tech:'Обприскувач Berthoud 2000 л', free:'вільний 1–20 травня', price:1400, key:'sprayer'},
    {id:2, farm:'ФГ Ковальчук О.М.',  dist:23, tech:'Сівалка Monosem 8 рядків',   free:'вільна 5–25 квітня',  price:1100, key:'seeder'},
    {id:3, farm:'ТОВ «Лан-Агро»',     dist:28, tech:'Трактор John Deere 6110',    free:'вільний у травні',    price:2200, key:'tractor'},
    {id:4, farm:'ФГ «Криниця»',       dist:9,  tech:'Жатка зернова 6 м',          free:'вільна з 10 липня',   price:900,  key:'harvester'}
];

const QA = [
    {q:'Коли буде касовий розрив?',
        a:"Залишок стає від'ємним <b>у травні 2027</b> (−60 тис ₴) і сягає дна <b>у червні: −240 тис ₴</b>. Причина не в збитковості: витрати посівної йдуть у березні–травні, а гроші за пшеницю приходять у липні. Потреба у фінансуванні — приблизно 240–280 тис ₴ на 2 місяці."},
    {q:'Порахуй витрати на посівну',
        a:"Березень–травень 2027 разом: <b>1 220 тис ₴</b>. З них добрива 390, пальне 268, насіння 245, підрядники й зарплати 317. Це 51% усіх річних витрат за три місяці.<span class='note'>Розраховано за фактичними операціями за три сезони з поправкою на площу 120 га.</span>"},
    {q:'Скільки кредиту я можу безпечно взяти?',
        a:"Безпечна межа — <b>480 тис ₴</b>. Це та сума, платежі за якою покриваються виручкою липня–жовтня й залишають запас 15% на падіння ціни зерна. Понад 620 тис ₴ ви виходите у зону, де один поганий врожай робить графік нездійсненним."},
    {q:'Що це за стрибок витрат у квітні?',
        a:"У квітні минулого сезону було <b>+96 тис ₴</b> понад норму — одним платежем на «Агротехсервіс». Схоже на позаплановий ремонт. Підтвердьте категорію, і я не буду враховувати це як регулярну витрату в прогнозі.<span class='note'>Категорію завжди підтверджуєте ви — я лише пропоную.</span>"},
    {q:'Як закрити розрив без кредиту?',
        a:"Два робочі шляхи. Перший: <b>орендувати обприскувач у сусіда</b> замість купівлі — 168 тис ₴ за сезон проти 450 тис ₴ разом, розрив зменшується до −40 тис ₴. Другий: відкласти 240 тис ₴ з жовтневої виручки за соняшник на окремий рахунок — тоді травень закривається власними коштами."}
];

/* ================== ЗАГАЛЬНЕ ================== */

const TITLES = {home:'Огляд',cashflow:'Кешфлоу',purchase:'Закупівля',rent:'Оренда поруч',analytics:'Аналітика',profile:'Господарство'};

function fmt(thousands){
    return Math.round(thousands*1000).toLocaleString('uk-UA').replace(/\u00A0/g,' ') + ' ₴';
}

function showPage(id){
    const el = document.getElementById(id);
    if(!el) return;
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active', b.dataset.page===id));
    document.getElementById('pageTitle').textContent = TITLES[id] || '';
    window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('.nav button').forEach(b=>{
    b.addEventListener('click',()=>showPage(b.dataset.page));
});

function openModal(id){
    document.getElementById(id).classList.add('active');
    document.body.style.overflow='hidden';
}
function closeModal(id){
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow='';
}
document.querySelectorAll('.modal').forEach(m=>{
    m.addEventListener('click',e=>{ if(e.target===m) closeModal(m.id); });
});
document.addEventListener('keydown',e=>{
    if(e.key==='Escape') document.querySelectorAll('.modal.active').forEach(m=>closeModal(m.id));
});

let toastTimer;
function showToast(text){
    const t=document.getElementById('toast');
    document.getElementById('toastText').textContent=text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>t.classList.remove('show'),3400);
}

document.querySelectorAll('.toggle').forEach(tg=>{
    tg.addEventListener('click',()=>{
        tg.classList.toggle('active');
        const name = tg.closest('.setting').querySelector('strong').textContent;
        showToast(name + ': ' + (tg.classList.contains('active')?'увімкнено':'вимкнено'));
    });
});

/* ================== ГРАФІК КЕШФЛОУ ================== */

let balances = [];
(function computeBalances(){
    let b = START;
    MONTHS.forEach(m=>{ b = b + m.inc - m.exp; balances.push(b); });
})();

const MAX_POS = Math.max(...balances, 0);
const MAX_NEG = Math.abs(Math.min(...balances, 0));

function buildChart(){
    const chart = document.getElementById('chart');
    MONTHS.forEach((m,i)=>{
        const val = balances[i];
        const col = document.createElement('div');
        col.className = 'col';
        col.dataset.i = i;

        const up = document.createElement('div');
        up.className='up';
        const down = document.createElement('div');
        down.className='down';

        const bar = document.createElement('div');
        bar.className = 'bar' + (val<0?' neg':'');
        if(val>=0){
            bar.style.height = Math.max(4, (val/MAX_POS)*100) + '%';
            up.appendChild(bar);
        }else{
            bar.style.height = Math.max(6, (Math.abs(val)/(MAX_NEG||1))*70) + '%';
            down.appendChild(bar);
        }

        const label = document.createElement('div');
        label.className='m';
        label.textContent = m.m;

        col.append(up, down, label);
        col.addEventListener('click',()=>selectMonth(i));
        chart.appendChild(col);
    });
}

function selectMonth(i){
    document.querySelectorAll('.col').forEach(c=>c.classList.toggle('sel', +c.dataset.i===i));
    const m = MONTHS[i], val = balances[i];
    const flow = m.inc - m.exp;
    document.getElementById('monthDetail').innerHTML = `
    <h4>${m.m} ${val<0?'<span class="negative">— касовий розрив</span>':''}</h4>
    <div class="detail-rows">
      <div><span>Надходження</span><strong class="positive">+${fmt(m.inc)}</strong></div>
      <div><span>Витрати</span><strong>−${fmt(m.exp)}</strong></div>
      <div><span>Залишок на кінець місяця</span><strong class="${val<0?'negative':''}">${fmt(val)}</strong></div>
    </div>
    <p style="color:var(--muted);font-size:12px;line-height:1.6;margin-top:16px">
      ${m.note}. Рух за місяць: <span class="${flow<0?'negative':'positive'}">${flow>=0?'+':'−'}${fmt(Math.abs(flow))}</span>.
      ${val<0?'Потрібне зовнішнє фінансування або зменшення разових витрат цього місяця.':''}
    </p>`;
}

/* ================== ЧАТ ================== */

function buildChips(){
    const wrap=document.getElementById('chips');
    QA.forEach((item,i)=>{
        const b=document.createElement('button');
        b.className='chip';
        b.textContent=item.q;
        b.addEventListener('click',()=>ask(i));
        wrap.appendChild(b);
    });
}

function ask(i){
    const body=document.getElementById('chatBody');
    const me=document.createElement('div');
    me.className='msg me';
    me.textContent=QA[i].q;
    body.appendChild(me);
    body.scrollTop=body.scrollHeight;

    const wait=document.createElement('div');
    wait.className='msg bot';
    wait.textContent='Рахую…';
    body.appendChild(wait);
    body.scrollTop=body.scrollHeight;

    setTimeout(()=>{
        wait.innerHTML=QA[i].a;
        body.scrollTop=body.scrollHeight;
    },700);
}

/* ================== ВАРІАНТИ ЗАКУПІВЛІ ================== */

function calcOptions(){
    const key=document.getElementById('equipment').value;
    const eq=EQUIPMENT[key];
    const area=Math.max(1, parseInt(document.getElementById('area').value)||120);
    const monthName={4:'квітні',5:'травні',6:'червні'}[document.getElementById('whenMonth').value];

    const price=Math.round((eq.min+eq.max)/2);           // тис ₴
    const rent=Math.round(eq.rentPerHa*area/1000);        // тис ₴ за сезон
    const credit=price;
    const monthly=Math.round(price*1.19/4);               // 4 платежі під жнива [гіпотеза ставки]
    const worstGap=Math.min(...balances);
    const gapAfterBuy=worstGap-price;
    const gapAfterRent=worstGap-rent;

    document.getElementById('optionsSub').textContent =
        `${eq.name} · потреба у ${monthName} 2027 · ринковий діапазон ${fmt(eq.min)} – ${fmt(eq.max)}`;

    document.getElementById('options').innerHTML = `
    <div class="option-card warn">
      <span class="badge red">Не рекомендовано</span>
      <h3>Купити за власні</h3>
      <div class="option-price">${fmt(price)}<span>одним платежем</span></div>
      <ul>
        <li><i>✓</i> Техніка одразу ваша, без боргу</li>
        <li><i>✕</i> Забирає всю подушку перед посівною</li>
        <li><i>✕</i> Розрив поглиблюється втричі</li>
      </ul>
      <div class="impact"><strong class="negative">${fmt(gapAfterBuy)}</strong>дно кешфлоу після покупки замість ${fmt(worstGap)}</div>
      <button class="secondary-button full" onclick="showToast('Варіант збережено для порівняння')">Все одно розглянути</button>
    </div>

    <div class="option-card">
      <span class="badge orange">Якщо техніка потрібна щороку</span>
      <h3>Кредит під сезон</h3>
      <div class="option-price">${fmt(monthly)}<span>× 4 платежі у липні–жовтні</span></div>
      <ul>
        <li><i>✓</i> Платежі лише в місяці з виручкою</li>
        <li><i>✓</i> Техніка залишається у власності</li>
        <li><i>✕</i> ${fmt(credit)} боргу з ${fmt(480)} безпечної межі</li>
      </ul>
      <div class="impact"><strong>0 ₴</strong>платежів у місяцях без доходу — розрив не поглиблюється</div>
      <button class="primary-button full" onclick="openCredit('${eq.name}', ${credit}, ${monthly})">Подати заявку</button>
    </div>

    <div class="option-card best">
      <span class="badge">Оптимально цього сезону</span>
      <h3>Оренда в сусіда</h3>
      <div class="option-price">${fmt(rent)}<span>${eq.rentPerHa} ₴/га × ${area} га за сезон</span></div>
      <ul>
        <li><i>✓</i> Без боргу й без застави</li>
        <li><i>✓</i> Ескроу та страхування від банку</li>
        <li><i>✕</i> Залежність від графіка власника</li>
      </ul>
      <div class="impact"><strong class="${gapAfterRent<0?'negative':'positive'}">${fmt(gapAfterRent)}</strong>дно кешфлоу — розрив майже закритий</div>
      <button class="primary-button full" onclick="showPage('rent')">Знайти поруч →</button>
    </div>`;

    document.getElementById('optionsWrap').style.display='block';
    document.getElementById('optionsWrap').scrollIntoView({behavior:'smooth',block:'start'});
}

function openCredit(name, total, monthly){
    document.getElementById('creditSummary').innerHTML = `
    <div class="total-row" style="border-top:none">
      <span>${name}</span><strong>${fmt(total)}</strong>
    </div>
    <div class="total-row">
      <span>Платіж у сезон надходжень</span><strong>${fmt(monthly)} × 4</strong>
    </div>`;
    openModal('creditModal');
}

/* ================== СУСІДИ ================== */

let currentNeighbour=null;

function buildNeighbours(){
    const wrap=document.getElementById('neighbours');
    wrap.innerHTML = NEIGHBOURS.map(n=>`
    <div class="neighbour" id="n${n.id}">
      <div class="n-icon">🚜</div>
      <div class="n-info">
        <strong>${n.tech}</strong>
        <span>${n.farm} · ${n.dist} км від вас · ${n.free}</span>
      </div>
      <div class="n-price">
        <strong>${n.price.toLocaleString('uk-UA').replace(/\u00A0/g,' ')} ₴</strong>
        <span>за гектар</span>
      </div>
      <button class="primary-button" onclick="openRent(${n.id})">Запитати</button>
    </div>`).join('');
}

function openRent(id){
    currentNeighbour = NEIGHBOURS.find(n=>n.id===id);
    document.getElementById('rentTitle').textContent = currentNeighbour.tech;
    document.getElementById('rentSub').textContent =
        `${currentNeighbour.farm} · ${currentNeighbour.dist} км · ${currentNeighbour.price} ₴/га`;
    updateRentTotal();
    openModal('rentModal');
}

function updateRentTotal(){
    if(!currentNeighbour) return;
    const area=Math.max(0,parseInt(document.getElementById('rentArea').value)||0);
    const sum=area*currentNeighbour.price;
    document.getElementById('rentTotal').textContent =
        sum.toLocaleString('uk-UA').replace(/\u00A0/g,' ') + ' ₴';
}

function confirmRent(){
    const area=parseInt(document.getElementById('rentArea').value)||0;
    if(area<=0){ showToast('Вкажіть площу обробітку'); return; }

    const row=document.getElementById('n'+currentNeighbour.id);
    const btn=row.querySelector('button');
    btn.textContent='Запит надіслано';
    btn.className='secondary-button';
    btn.disabled=true;
    row.querySelector('.n-info span').innerHTML +=
        ' · <span class="positive">кошти зарезервовано на ескроу</span>';

    closeModal('rentModal');
    showToast('Запит надіслано. Контакти відкриються після згоди власника');
}

/* ================== ПОЗНАЧЕННЯ ВИТРАТИ ================== */

function tagExpense(btn){
    const row=btn.closest('.transaction');
    row.querySelector('.t-icon').textContent='↑';
    row.querySelector('.t-info strong').textContent='Ремонт техніки — 96 400 ₴';
    row.querySelector('.t-info span').textContent='Позначено як разова витрата · не враховується в прогнозі';
    btn.outerHTML='<strong class="t-amount">−96 400 ₴</strong>';
    showToast('Дякую. Прогноз перераховано без цієї витрати');
}

/* ================== СТАРТ ================== */

buildChart();
selectMonth(9);
buildChips();
buildNeighbours();
