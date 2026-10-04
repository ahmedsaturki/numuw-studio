(function(){
  var lang='ar';
  var langBtn=document.getElementById('lang');
  var menu=document.getElementById('menu');
  var nav=document.getElementById('nav');
  if(!langBtn||!menu||!nav)return;

  var copy={
    ar:{
      title:'نُمو NUMUW — أنظمة نمو رقمية للشركات والمصانع في مصر',
      description:'نُمو NUMUW يبني للشركات والمصانع المصرية أنظمة نمو عملية: تموضع وهوية، مواقع عالية التحويل، SEO وحضور محلي، أتمتة، CRM ولوحات مؤشرات — من شخص مسؤول عن الصورة كاملة.',
      ogTitle:'نُمو NUMUW — نظام نمو، مش مجرد خدمة',
      ogDescription:'استراتيجية + حضور رقمي + أتمتة + قياس. حلول عملية للشركات والمصانع المصرية بدون تعقيد أو حبس داخل وكالة.'
    },
    en:{
      title:'NUMUW — Growth systems for Egyptian businesses',
      description:'NUMUW builds practical growth systems for Egyptian businesses and industrial teams: positioning, conversion websites, search visibility, workflow automation, CRM and measurement.',
      ogTitle:'NUMUW — A growth system, not another service',
      ogDescription:'Strategy, digital presence, automation and measurement connected into one practical system for Egyptian businesses.'
    }
  };

  function meta(nameOrProperty,selector,value){
    var el=document.querySelector(selector);
    if(el)el.setAttribute('content',value);
  }

  function apply(next){
    lang=next==='en'?'en':'ar';
    var c=copy[lang];
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
      el.innerHTML=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });
    langBtn.textContent=lang==='ar'?'EN':'عربي';
    langBtn.setAttribute('aria-label',lang==='ar'?'Switch to English':'التحويل للعربية');
    langBtn.setAttribute('aria-pressed',lang==='en'?'true':'false');
    document.title=c.title;
    meta('description','meta[name="description"]',c.description);
    meta('og:title','meta[property="og:title"]',c.ogTitle);
    meta('og:description','meta[property="og:description"]',c.ogDescription);
    meta('twitter:title','meta[name="twitter:title"]',c.ogTitle);
    meta('twitter:description','meta[name="twitter:description"]',c.ogDescription);
    meta('og:locale','meta[property="og:locale"]',lang==='ar'?'ar_EG':'en_US');
    try{localStorage.setItem('numuw-lang',lang)}catch(e){}
  }

  function closeMenu(returnFocus){
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
    if(returnFocus)menu.focus();
  }

  langBtn.addEventListener('click',function(){apply(lang==='ar'?'en':'ar')});
  menu.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?(lang==='ar'?'غلق القائمة':'Close menu'):(lang==='ar'?'فتح القائمة':'Open menu'));
    if(open){
      var first=nav.querySelector('a[href]');
      if(first)first.focus();
    }
  });
  nav.querySelectorAll('a[href]').forEach(function(a){
    a.addEventListener('click',function(){closeMenu(false)});
  });
  document.addEventListener('click',function(e){
    if(nav.classList.contains('open')&&!e.target.closest('#nav'))closeMenu(false);
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true);
  });
  document.querySelectorAll('a[target="_blank"]').forEach(function(a){
    var rel=(a.getAttribute('rel')||'').split(/\s+/).filter(Boolean);
    if(rel.indexOf('noopener')<0)rel.push('noopener');
    if(rel.indexOf('noreferrer')<0)rel.push('noreferrer');
    a.setAttribute('rel',rel.join(' '));
  });

  var saved='';
  try{saved=localStorage.getItem('numuw-lang')||''}catch(e){}
  apply(saved==='en'?'en':'ar');
})();

(function(){
  function emit(name,detail){
    try{window.dispatchEvent(new CustomEvent('numuw:'+name,{detail:detail||{}}))}catch(e){}
    if(Array.isArray(window.dataLayer)){
      try{window.dataLayer.push({event:'numuw_'+name,...(detail||{})})}catch(e){}
    }
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
    else if(/pages\/proof\//i.test(href))kind='proof';
    if(kind)emit('cta',{kind:kind,path:location.pathname});
  });
})();