(function(){
  var lang='ar';
  var langBtn=document.getElementById('lang');
  var menu=document.getElementById('menu');
  var header=document.getElementById('nav');
  var nav=document.getElementById('primary-nav');
  function apply(next){
    lang=next==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
      el.innerHTML=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });
    if(langBtn){
      langBtn.textContent=lang==='ar'?'EN':'عربي';
      langBtn.setAttribute('aria-label',lang==='ar'?'Switch to English':'التحويل للعربية');
      langBtn.setAttribute('aria-pressed',lang==='en'?'true':'false');
    }
    document.title=lang==='ar'?'نُمو NUMUW — أنظمة نمو رقمية للشركات والمصانع في مصر':'NUMUW — Growth systems for Egyptian businesses';
  }
  function save(){
    try{localStorage.setItem('numuw-lang',lang)}catch(e){}
  }
  if(langBtn){
    langBtn.addEventListener('click',function(){apply(lang==='ar'?'en':'ar');save()});
  }
  if(menu&&header&&nav){
    menu.setAttribute('aria-controls',nav.id||'primary-nav');
    menu.setAttribute('aria-expanded','false');
    function close(){header.classList.remove('open');menu.setAttribute('aria-expanded','false');}
    menu.addEventListener('click',function(){
      var open=header.classList.toggle('open');
      menu.setAttribute('aria-expanded',open?'true':'false');
      menu.setAttribute('aria-label',open?(lang==='ar'?'غلق القائمة':'Close menu'):(lang==='ar'?'فتح القائمة':'Open menu'));
      if(open){var first=nav.querySelector('a[href]');if(first)first.focus()}
      else menu.focus();
    });
    nav.addEventListener('click',function(e){if(e.target.closest('a[href]'))close()});
    document.addEventListener('click',function(e){if(header.classList.contains('open')&&!header.contains(e.target))close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&header.classList.contains('open')){close();menu.focus()}});
  }
  var saved=null;
  try{saved=localStorage.getItem('numuw-lang')}catch(e){}
  apply(saved==='ar'||saved==='en'?saved:'ar');
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