
// main.js - shared site logic
const PRODUCTS = [
  {id:1,name:"VLADOK Hoodie • Black", price:12990, category:"Худи", img:"assets/images/product1.svg", desc:"Тёплое худи премиум-кроя, матовая фактура, тёмное золото на фурнитуре."},
  {id:2,name:"URBAN Cap • Night", price:3490, category:"Кепка", img:"assets/images/product2.svg", desc:"Классическая кепка с тиснением логотипа."},
  {id:3,name:"NIGHT Tee • Oversize", price:4990, category:"Футболка", img:"assets/images/product3.svg", desc:"Мягкий хлопок 220 г, oversize посадка."},
  {id:4,name:"AURA Crossbody", price:7590, category:"Сумка", img:"assets/images/product4.svg", desc:"Мини-сумка на ремне, водоотталкивающая пропитка."},
  {id:5,name:"SLICK Sunglasses", price:8990, category:"Аксессуар", img:"assets/images/product5.svg", desc:"Лёгкая оправa с дымчатыми стеклами."},
  {id:6,name:"STEALTH Joggers", price:8990, category:"Штаны", img:"assets/images/product6.svg", desc:"Удобная посадка, усиленные швы."},
  {id:7,name:"EDGE Belt", price:1990, category:"Аксессуар", img:"assets/images/product7.svg", desc:"Кожаный ремень с металлической пряжкой."},
  {id:8,name:"VOLT Beanie", price:2390, category:"Шапка", img:"assets/images/product8.svg", desc:"Тёплая шапка с фирменной эмблемой."}
];

function formatPrice(v){ return v.toLocaleString('ru-RU') + " ₽" }

function populateProductsGrid(gridId){
  const grid = document.getElementById(gridId);
  if(!grid) return;
  grid.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card fade-in';
    card.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${p.name}"></div>
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:10px">
          <div><h4 class="title">${p.name}</h4><div style="font-size:12px;color:var(--muted)">${p.category}</div></div>
          <div class="price">${formatPrice(p.price)}</div>
        </div>
        <p class="desc">${p.desc}</p>
      </div>
      <div class="card-footer">
        <button class="btn-add" data-id="${p.id}">В корзину</button>
        <button class="btn-quick" data-id="${p.id}">Быстрый просмотр</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Simple cart logic (shared)
const cart = { items: [] };
function findInCart(id){ return cart.items.find(i=>i.id===id) }
function addToCart(id, qty=1){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const existing = findInCart(id);
  if(existing) existing.qty+=qty; else cart.items.push({id:p.id,name:p.name,price:p.price,qty:qty,img:p.img});
  renderCart();
  showCart();
}
function renderCart(){
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotalPrice');
  if(!container) return;
  container.innerHTML = "";
  if(cart.items.length===0){
    container.innerHTML = '<div class="empty">Ваша корзина пуста</div>';
    document.getElementById('cartTotal').style.display = 'none';
  } else {
    cart.items.forEach(ci=>{
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.style.display='flex';
      div.style.gap='10px';
      div.style.alignItems='center';
      div.innerHTML = `
        <div style="width:56px;height:56px;border-radius:8px;overflow:hidden"><img src="${ci.img}" style="width:100%;height:100%;object-fit:cover"></div>
        <div style="flex:1"><div style="font-weight:700">${ci.name}</div><div style="font-size:13px;color:var(--muted)">${formatPrice(ci.price)} × ${ci.qty}</div></div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
          <button class="btn-quick" data-action="inc" data-id="${ci.id}">＋</button>
          <button class="btn-add" data-action="dec" data-id="${ci.id}">−</button>
        </div>
      `;
      container.appendChild(div);
    });
    const total = cart.items.reduce((s,i)=>s + i.price*i.qty,0);
    totalEl.textContent = formatPrice(total);
    document.getElementById('cartTotal').style.display = 'flex';
  }
  countEl.textContent = cart.items.reduce((s,i)=>s+i.qty,0);
}

function showCart(){ const d = document.getElementById('cartDrawer'); d.classList.add('open'); d.setAttribute('aria-hidden','false') }
function hideCart(){ const d = document.getElementById('cartDrawer'); d.classList.remove('open'); d.setAttribute('aria-hidden','true') }

document.addEventListener('click', (e)=>{
  const add = e.target.closest('.btn-add');
  const quick = e.target.closest('.btn-quick');
  if(add && add.dataset.id){ addToCart(parseInt(add.dataset.id)); }
  else if(quick && quick.dataset.id){ openModal(parseInt(quick.dataset.id)); }
  // cart +/- buttons
  const actionBtn = e.target.closest('[data-action]');
  if(actionBtn && actionBtn.dataset.action){
    const id = parseInt(actionBtn.dataset.id);
    const action = actionBtn.dataset.action;
    const idx = cart.items.findIndex(i=>i.id===id);
    if(idx===-1) return;
    if(action==='inc') cart.items[idx].qty+=1;
    if(action==='dec'){ cart.items[idx].qty-=1; if(cart.items[idx].qty<=0) cart.items.splice(idx,1) }
    renderCart();
  }
});

// Modal quick view
function openModal(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const mb = document.getElementById('modalBackdrop');
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalSubtitle').textContent = p.category;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalPrice').textContent = formatPrice(p.price);
  document.getElementById('modalImageArea').innerHTML = `<img src="${p.img}" alt="${p.name}">`;
  mb.classList.add('open');
}
function closeModal(){ document.getElementById('modalBackdrop').classList.remove('open') }

window.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ closeModal(); hideCart(); } });

// search
function initSearch(id, gridId){
  const s = document.getElementById(id);
  if(!s) return;
  s.addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    if(!q) { populateProductsGrid(gridId); return; }
    const filtered = PRODUCTS.filter(p=> (p.name + p.desc + p.category).toLowerCase().includes(q));
    const grid = document.getElementById(gridId); grid.innerHTML='';
    filtered.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'card fade-in';
      card.innerHTML = `
        <div class="thumb"><img src="${p.img}" alt="${p.name}"></div>
        <div style="margin-top:10px">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:10px">
            <div><h4 class="title">${p.name}</h4><div style="font-size:12px;color:var(--muted)">${p.category}</div></div>
            <div class="price">${formatPrice(p.price)}</div>
          </div>
          <p class="desc">${p.desc}</p>
        </div>
        <div class="card-footer">
          <button class="btn-add" data-id="${p.id}">В корзину</button>
          <button class="btn-quick" data-id="${p.id}">Быстрый просмотр</button>
        </div>
      `;
      grid.appendChild(card);
    });
  });
}

// small helpers for pages
document.addEventListener('DOMContentLoaded', ()=>{
  populateProductsGrid('productGrid');
  renderCart();
  initSearch('searchInput','productGrid');
  // attach cart show/hide
  const cartBtn = document.getElementById('cartBtn');
  if(cartBtn) cartBtn.addEventListener('click', ()=>{ const d=document.getElementById('cartDrawer'); if(d.classList.contains('open')) hideCart(); else showCart(); });
  const closeCart = document.getElementById('cartClose');
  if(closeCart) closeCart.addEventListener('click', hideCart);
  const modalClose = document.getElementById('modalClose');
  if(modalClose) modalClose.addEventListener('click', closeModal);
  const checkout = document.getElementById('checkoutBtn');
  if(checkout) checkout.addEventListener('click', ()=>{ if(cart.items.length===0){ alert('Корзина пуста'); return; } alert('Спасибо! Это демо. Здесь должна быть интеграция с оплатой.'); });
});
