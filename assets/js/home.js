(function(){
  var lang='ar';
  var langBtn=document.getElementById('lang');
  var menu=document.getElementById('menu');
  var nav=document.getElementById('primary-nav');
  var navShell=document.querySelector('.nav');
  var skip=document.querySelector('.skip');

  var meta={
    ar:{
      title:'نُمو NUMUW — أنظمة نمو رقمية للشركات والمصانع في مصر',
      description:'نُمو يبني أنظمة نمو عملية للشركات والمصانع المصرية: تموضع، حضور رقمي، SEO وحضور محلي، أتمتة وAI وقياس — تحت استراتيجية واحدة ومسار واضح من التشخيص إلى التسليم.',
      ogTitle:'نُمو NUMUW — نظام نمو، مش مجرد خدمة',
      ogDescription:'استراتيجية + حضور رقمي + أتمتة + قياس للشركات والمصانع المصرية، مع نطاق واضح وملكية أصول واضحة.'
    },
    en:{
      title:'NUMUW — Growth Systems for Egyptian Businesses',
      description:'NUMUW builds practical growth systems for Egyptian businesses and manufacturers: positioning, digital presence, search, automation, AI and measurement.',
      ogTitle:'NUMUW — A growth system, not another service',
      ogDescription:'Strategy, digital presence, automation and measurement for Egyptian businesses, with clear scope and asset ownership.'
    }
  };

  function setMeta(selector,value){
    var el=document.querySelector(selector);
    if(el)el.setAttribute('content',value);
  }

  function apply(next){
    lang=next==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';

    document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
      el.textContent=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });

    var copy=meta[lang];
    document.title=copy.title;
    setMeta('meta[name="description"]',copy.description);
    setMeta('meta[property="og:title"]',copy.ogTitle);
    setMeta('meta[property="og:description"]',copy.ogDescription);
    setMeta('meta[name="twitter:title"]',copy.ogTitle);
    setMeta('meta[name="twitter:description"]',copy.ogDescription);

    langBtn.textContent=lang==='ar'?'EN':'عربي';
    langBtn.setAttribute('aria-label',lang==='ar'?'Switch to English':'التحويل للعربية');
    langBtn.setAttribute('aria-pressed',lang==='en'?'true':'false');
    if(skip)skip.textContent=lang==='ar'?'تخطّي للمحتوى':'Skip to content';
  }

  function closeMenu(returnFocus){
    if(!nav||!menu)return;
    navShell.classList.remove('open');
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
    if(returnFocus)menu.focus();
  }

  if(langBtn)langBtn.addEventListener('click',function(){
    var next=lang==='ar'?'en':'ar';
    try{localStorage.setItem('numuw-home-lang',next)}catch(e){}
    apply(next);
  });

  if(menu&&nav){
    menu.addEventListener('click',function(){
      var open=!navShell.classList.contains('open');
      navShell.classList.toggle('open',open);
      menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',open?(lang==='ar'?'غلق القائمة':'Close menu'):(lang==='ar'?'فتح القائمة':'Open menu'));
      if(open){
        var first=nav.querySelector('a[href]');
        if(first)first.focus();
      }else{
        menu.focus();
      }
    });

    nav.querySelectorAll('a[href]').forEach(function(a){
      a.addEventListener('click',function(){closeMenu(false)});
    });

    document.addEventListener('click',function(e){
      if(navShell.classList.contains('open')&&!navShell.contains(e.target))closeMenu(false);
    });

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&navShell.classList.contains('open'))closeMenu(true);
    });
  }

  var saved=null;
  try{saved=localStorage.getItem('numuw-home-lang')}catch(e){}
  apply(saved==='en'?'en':'ar');
})();
