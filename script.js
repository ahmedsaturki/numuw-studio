let lang = 'ar';
const titles = { 
  ar: 'NUMUW | نُمو — استوديو النمو الرقمي | أحمد سعيد تركي', 
  en: 'NUMUW | Digital Growth Studio | Ahmed Saeed Turki' 
};

const EST_ITEMS = [
  { id:'landing',   ar:'لاندنج بيدج مبيعات',   en:'Sales landing page',    min:8000 },
  { id:'website',   ar:'موقع شركة تعريفي',     en:'Corporate website',     min:15000 },
  { id:'store',     ar:'متجر إلكتروني',        en:'E-commerce store',       min:25000 },
  { id:'identity',  ar:'هوية بصرية كاملة',     en:'Full brand identity',    min:6000 },
  { id:'logo',      ar:'لوجو احترافي',         en:'Professional logo',      min:1500 },
  { id:'automation',ar:'أتمتة عملية',         en:'Workflow automation',    min:8000 },
  { id:'chatbot',   ar:'شات بوت واتساب',       en:'WhatsApp chatbot',       min:8000 },
  { id:'crm',       ar:'نظام CRM',             en:'CRM setup',              min:6000 },
  { id:'kpi',       ar:'لوحة KPI وتقارير',     en:'KPI dashboard',          min:12000 },
  { id:'study',     ar:'دراسة جدوى',           en:'Feasibility study',      min:10000 },
  { id:'monthly',   ar:'شريك نمو شهري',        en:'Monthly growth partner', min:6500 }
];

const estState = {};

function renderEstimator(){
  const wrap = document.getElementById('estChips');
  if (!wrap) return;
  const L = lang === 'ar';
  const sel = EST_ITEMS.filter(function(it){ return estState[it.id]; });
  const total = sel.reduce(function(s, it){ return s + it.min; }, 0);
  
  EST_ITEMS.forEach(function(it, i){
    let c = wrap.children[i];
    if (!c) {
      c = document.createElement('button');
      c.type = 'button';
      c.onclick = function(){ estState[it.id] = !estState[it.id]; renderEstimator(); };
      wrap.appendChild(c);
    }
    c.className = 'est-chip' + (estState[it.id] ? ' on' : '');
    c.setAttribute('aria-pressed', estState[it.id] ? 'true' : 'false');
    c.innerHTML = (L ? it.ar : it.en) + '<small>' + it.min.toLocaleString('en') + '+</small>';
  });
  
  document.getElementById('estTotal').textContent = total.toLocaleString('en');
  const send = document.getElementById('estSend');
  
  if (sel.length === 0) {
    send.style.opacity = '.4'; 
    send.style.pointerEvents = 'none';
    send.setAttribute('aria-disabled', 'true'); 
    send.removeAttribute('href');
  } else {
    send.style.opacity = '1'; 
    send.style.pointerEvents = 'auto';
    send.setAttribute('aria-disabled', 'false');
    const lines = sel.map(function(it){ return '• ' + (L ? it.ar : it.en) + ' (' + it.min.toLocaleString('en') + '+)'; });
    const msg = (L
      ? 'أهلاً أحمد 👋\nحسبت تقدير شغلي من صفحة NUMUW وده اللي محتاجه:\n'
      : 'Hi Ahmed 👋\nI estimated my project from the NUMUW page, here is what I need:\n') + lines.join('\n')
      + (L ? '\nالتقدير الأدنى: ' : '\nMinimum estimate: ') + total.toLocaleString('en')
      + (L ? ' ج.م\nممكن نحدد مكالمة تشخيص؟' : ' EGP\nCan we schedule a diagnosis call?');
    send.href = 'https://wa.me/201127788810?text=' + encodeURIComponent(msg);
  }
}

function applyLang(l){
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar]').forEach(function(el){
    el.innerHTML = l === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  });
  document.title = titles[l];
  const btn = document.getElementById('langBtn');
  btn.textContent = l === 'ar' ? 'EN' : 'عربي';
  btn.setAttribute('aria-label', l === 'ar' ? 'Switch page to English' : 'تحويل الصفحة للعربية');
  renderEstimator();
}

function toggleLang(){
  lang = lang === 'ar' ? 'en' : 'ar';
  applyLang(lang);
}

renderEstimator();