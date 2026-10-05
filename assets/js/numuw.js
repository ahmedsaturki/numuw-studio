(function(){
  var ROOT=(function(){
    var marker='/numuw-studio/';
    var i=location.pathname.indexOf(marker);
    return i>=0?location.pathname.slice(0,i)+marker:'/';
  })();
  var lang=document.documentElement.lang==='en'?'en':'ar';
  var i18nMode=document.documentElement.getAttribute('data-i18n')||'none';
  var main=document.querySelector('main');
  var nav=document.querySelector('[data-nav]');
  var menu=document.querySelector('[data-menu]');
  var langButtons=document.querySelectorAll('[data-lang-btn]');

  function normalize(path){
    path=(path||'').replace(/\/+$/,'');
    return path||'/';
  }

  function setRel(a){
    var rel=(a.getAttribute('rel')||'').split(/\s+/).filter(Boolean);
    if(rel.indexOf('noopener')<0)rel.push('noopener');
    if(rel.indexOf('noreferrer')<0)rel.push('noreferrer');
    a.setAttribute('rel',rel.join(' '));
  }

  function ensureSkipLink(){
    if(!main)return;
    if(!main.id)main.id='main';
    if(document.querySelector('.skip'))return;
    var skip=document.createElement('a');
    skip.className='skip';
    skip.href='#main';
    skip.textContent=lang==='ar'?'تخطّي للمحتوى':'Skip to content';
    document.body.insertBefore(skip,document.body.firstChild);
  }

  function enhanceGlobalNav(){
    if(!nav)return;
    nav.id=nav.id||'primary-nav';
    nav.setAttribute('aria-label',lang==='ar'?'التنقل الرئيسي':'Primary navigation');
    var current=normalize(location.pathname);
    nav.querySelectorAll('a[href]').forEach(function(a){
      var href=a.getAttribute('href')||'';
      if(!href||href.charAt(0)==='#'||/^[a-z][a-z0-9+.-]*:/i.test(href))return;
      try{
        var target=normalize(new URL(href,location.href).pathname);
        if(target===current)a.setAttribute('aria-current','page');
      }catch(e){}
    });
  }

  function ensureBreadcrumbs(){
    if(!main||normalize(location.pathname)===normalize(ROOT)||/\/404\.html$/i.test(location.pathname))return;
    if(main.querySelector('.breadcrumbs'))return;

    var clean=location.pathname.replace(/^\/numuw-studio\/?/,'').replace(/\/+$/,'');
    var parts=clean.split('/').filter(Boolean);
    if(!parts.length)return;

    var labels={
      landing:['الحلول','Solutions'],
      tools:['الأدوات','Tools'],
      products:['المنتجات','Products'],
      pages:['الشركة','Company'],
      documents:['المصادر','Resources'],
      legal:['الثقة والقانون','Trust & Legal'],
      resources:['المصادر','Resources'],
      insights:['المصادر','Resources'],
      'media-kit':['المصادر','Resources'],
      brand:['الهوية','Brand']
    };
    var section=parts[0];
    var pair=labels[section]||[section,section];
    var currentLabel=(main.querySelector('h1')||{}).textContent;
    currentLabel=(currentLabel||parts[parts.length-1]).trim();

    var crumb=document.createElement('nav');
    crumb.className='breadcrumbs';
    crumb.setAttribute('aria-label','مسار الصفحة');
    var list=document.createElement('ol');

    var home=document.createElement('li');
    home.innerHTML='<a href="'+ROOT+'" data-ar="الرئيسية" data-en="Home">الرئيسية</a>';
    list.appendChild(home);

    var sectionLi=document.createElement('li');
    sectionLi.innerHTML='<a href="'+ROOT+section+'/" data-ar="'+pair[0]+'" data-en="'+pair[1]+'">'+pair[0]+'</a>';
    if(parts.length===1){
      sectionLi.setAttribute('aria-current','page');
      sectionLi.querySelector('a').removeAttribute('href');
    }
    list.appendChild(sectionLi);

    if(parts.length>1){
      var current=document.createElement('li');
      current.setAttribute('aria-current','page');
      current.textContent=currentLabel;
      list.appendChild(current);
    }

    crumb.appendChild(list);
    main.insertBefore(crumb,main.firstChild);
  }

  function ensureBreadcrumbSchema(){
    if(!main||normalize(location.pathname)===normalize(ROOT)||/\/404\.html$/i.test(location.pathname))return;
    if(document.querySelector('script[data-numuw-breadcrumb-schema]'))return;
    var canonical=document.querySelector('link[rel="canonical"]');
    var crumb=main.querySelector('.breadcrumbs');
    if(!canonical||!crumb)return;

    var items=[].slice.call(crumb.querySelectorAll('ol > li')).map(function(li,i){
      var a=li.querySelector('a');
      return {'@type':'ListItem',position:i+1,name:li.textContent.trim(),item:a?a.href:canonical.href};
    });
    var script=document.createElement('script');
    script.type='application/ld+json';
    script.setAttribute('data-numuw-breadcrumb-schema','true');
    script.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':items});
    document.head.appendChild(script);
  }

  function applyLanguage(next){
    lang=next==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';

    document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
      el.innerHTML=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });
    document.querySelectorAll('title[data-ar][data-en]').forEach(function(el){
      el.textContent=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });
    document.querySelectorAll('meta[data-ar][data-en]').forEach(function(el){
      el.setAttribute('content',lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en'));
    });
    langButtons.forEach(function(b){
      b.textContent=lang==='ar'?'EN':'عربي';
      b.setAttribute('aria-label',lang==='ar'?'Switch to English':'التحويل للعربية');
      b.setAttribute('aria-pressed',lang==='en'?'true':'false');
    });
    try{localStorage.setItem('numuw-lang',lang)}catch(e){}
  }

  ensureSkipLink();
  enhanceGlobalNav();
  ensureBreadcrumbs();
  ensureBreadcrumbSchema();

  langButtons.forEach(function(b){
    b.hidden=i18nMode!=='full';
  });
  if(i18nMode==='full'){
    var saved;
    try{saved=localStorage.getItem('numuw-lang')}catch(e){}
    applyLanguage(saved==='en'||saved==='ar'?saved:lang);
  }else{
    applyLanguage('ar');
  }

  if(nav&&menu){
    menu.setAttribute('type','button');
    menu.setAttribute('aria-controls',nav.id||'primary-nav');
    menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');
    menu.setAttribute('aria-label','فتح القائمة');
  }

  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-lang-btn]');
    if(b&&!b.hidden){
      applyLanguage(lang==='ar'?'en':'ar');
      return;
    }

    var m=e.target.closest('[data-menu]');
    if(m&&nav){
      var open=nav.classList.toggle('open');
      m.setAttribute('aria-expanded',open?'true':'false');
      m.setAttribute('aria-label',open?'غلق القائمة':'فتح القائمة');
      if(open){
        var first=nav.querySelector('a[href]');
        if(first)first.focus();
      }else{
        m.focus();
      }
      return;
    }

    if(e.target.closest('[data-nav] a')&&nav&&menu){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label','فتح القائمة');
      return;
    }

    if(nav&&menu&&nav.classList.contains('open')&&!e.target.closest('[data-nav]')&&!e.target.closest('[data-menu]')){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label','فتح القائمة');
    }

    var a=e.target.closest('a[href]');
    if(!a)return;
    var href=a.getAttribute('href')||'';
    if(/^https:\/\/wa\.me\//i.test(href)){
      a.setAttribute('target','_blank');
      setRel(a);
    }
  });

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav&&menu){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label','فتح القائمة');
      menu.focus();
    }
  });

  document.querySelectorAll('a[target="_blank"]').forEach(setRel);

  function emit(name,detail){
    var payload={name:name,detail:detail||{}};
    try{window.dispatchEvent(new CustomEvent('numuw:'+name,{detail:payload.detail}))}catch(e){}
    if(Array.isArray(window.dataLayer)){
      try{window.dataLayer.push({event:'numuw_'+name,...payload.detail})}catch(e){}
    }
  }

  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');
    if(!a)return;
    var href=a.getAttribute('href')||'';
    var kind=null;
    if(/^https:\/\/wa\.me\//i.test(href))kind='whatsapp';
    else if(/^tel:/i.test(href))kind='phone';
    else if(/tools\/diagnostic\//i.test(href))kind='diagnostic';
    else if(/products\//i.test(href))kind='product';
    else if(/tools\//i.test(href))kind='tool';
    else if(/documents\//i.test(href))kind='document';
    if(kind)emit('cta',{kind:kind,path:location.pathname});
  });

  document.addEventListener('click',function(e){
    var printButton=e.target.closest('[data-print]');
    if(printButton)window.print();
  });

  document.querySelectorAll('[data-year]').forEach(function(e){
    e.textContent=new Date().getFullYear();
  });
})();