(function(){
  var lang='ar';
  var langBtn=document.getElementById('lang');
  var menu=document.getElementById('menu');
  var nav=document.getElementById('nav');
  function apply(l){
    lang=l; document.documentElement.lang=l; document.documentElement.dir=l==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar]').forEach(function(el){el.textContent=l==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en')});
    langBtn.textContent=l==='ar'?'EN':'عربي';
    langBtn.setAttribute('aria-label',l==='ar'?'Switch to English':'التحويل للعربية');
    document.title=l==='ar'?'نُمو NUMUW — أنظمة نمو رقمية للشركات والمصانع في مصر':'NUMUW — Growth systems for Egyptian businesses';
  }
  langBtn.addEventListener('click',function(){apply(lang==='ar'?'en':'ar')});
  menu.addEventListener('click',function(){var open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
  document.querySelectorAll('.navlinks a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')})});
  apply('ar');
})();

(function(){
  function emit(name,detail){
    try{window.dispatchEvent(new CustomEvent('numuw:'+name,{detail:detail||{}}))}catch(e){}
    if(Array.isArray(window.dataLayer)){try{window.dataLayer.push({event:'numuw_'+name,...(detail||{})})}catch(e){}}
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');if(!a)return;
    var href=a.getAttribute('href')||'',kind=null;
    if(/^https:\/\/wa\.me\//i.test(href))kind='whatsapp';
    else if(/^tel:/i.test(href))kind='phone';
    else if(/tools\/diagnostic\//i.test(href))kind='diagnostic';
    else if(/products\//i.test(href))kind='product';
    else if(/tools\//i.test(href))kind='tool';
    else if(/documents\//i.test(href))kind='document';
    if(kind)emit('cta',{kind:kind,path:location.pathname});
  });
})();
