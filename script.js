let cart = JSON.parse(localStorage.getItem("alwajdi_cart") || "[]");
const money = n => `${n.toFixed(0)} DH`;

function renderProducts(list = PRODUCTS){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-media">${p.icon}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.cat}</p>
        <div class="product-bottom">
          <span class="price">${p.unit} ${money(p.price)}</span>
          <button class="add" onclick="addToCart(${p.id})">أضف للسلة</button>
        </div>
      </div>
    </article>`).join("");
}

function filterProducts(cat, btn){
  if(btn){document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active")}
  renderProducts(cat==="الكل" ? PRODUCTS : PRODUCTS.filter(p=>p.cat===cat));
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id:p.id,qty:1});
  saveCart(); openCart();
}

function saveCart(){
  localStorage.setItem("alwajdi_cart",JSON.stringify(cart));
  document.getElementById("cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
  renderCart();
}

function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<p style="text-align:center;color:#777;padding:40px 0">السلة خاوية دابا 🛒</p>';}
  else box.innerHTML=cart.map(x=>{
    const p=PRODUCTS.find(y=>y.id===x.id);
    return `<div class="cart-item">
      <div><b>${p.name}</b><br><small>${money(p.price)} × ${x.qty}</small></div>
      <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${x.qty} <button onclick="changeQty(${p.id},1)">+</button></div>
      <button onclick="removeItem(${p.id})" style="border:0;background:none;cursor:pointer">🗑️</button>
    </div>`;
  }).join("");
  const total=cart.reduce((s,x)=>s+PRODUCTS.find(p=>p.id===x.id).price*x.qty,0);
  document.getElementById("cartTotal").textContent=money(total);
}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function openCart(){document.getElementById("cartOverlay").classList.add("open");renderCart()}
function closeCart(e){if(!e || e.target===document.getElementById("cartOverlay"))document.getElementById("cartOverlay").classList.remove("open")}
function checkoutWhatsApp(){
  if(!cart.length){alert("السلة خاوية");return}
  const lines=cart.map(x=>{const p=PRODUCTS.find(y=>y.id===x.id);return `- ${p.name} × ${x.qty}`}).join("%0A");
  const total=cart.reduce((s,x)=>s+PRODUCTS.find(p=>p.id===x.id).price*x.qty,0);
  const msg=`سلام متجر الوجدي، بغيت نطلب:%0A${lines}%0A%0Aالمجموع التقريبي: ${money(total)}%0A%0Aالاسم:%0Aالعنوان:%0A`;
  window.open(`https://wa.me/212721851643?text=${msg}`,"_blank");
}
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();saveCart();
