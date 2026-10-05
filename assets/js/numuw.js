(function(){
  var lang=document.documentElement.lang==='en'?'en':'ar';
  var SITE_ROOT=location.pathname.indexOf('/numuw-studio/')===0?'/numuw-studio/':'/';
  var localized=document.querySelectorAll('[data-ar][data-en]');
  var langButtons=document.querySelectorAll('[data-lang-btn]');

  function applyLang(next){
    lang=next==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
      el.textContent=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });
    langButtons.forEach(function(b){
      b.textContent=lang==='ar'?'EN':'عربي';
      b.setAttribute('aria-label',lang==='ar'?'Switch to English':'التحويل للعربية');
      b.setAttribute('aria-pressed',lang==='en'?'true':'false');
    });
  }

  function pathLink(path){return SITE_ROOT+path.replace(/^\//,'')}

  function normalizeNav(){
    var nav=document.querySelector('[data-nav]');
    if(!nav)return;
    var items=[
      ['','الرئيسية','Home'],
      ['landing/','الحلول','Solutions'],
      ['tools/','الأدوات','Tools'],
      ['products/','المنتجات','Products'],
      ['pages/','الشركة','Company'],
      ['resources/','الموارد','Resources']
    ];
    nav.innerHTML=items.map(function(it){
      return '<a href="'+pathLink(it[0])+'" data-ar="'+it[1]+'" data-en="'+it[2]+'">'+(lang==='ar'?it[1]:it[2])+'</a>';
    }).join('');
    nav.setAttribute('aria-label',lang==='ar'?'التنقل الرئيسي':'Primary navigation');
    var currentPath=location.pathname.replace(/\/+$/,'')||'/';
    nav.querySelectorAll('a[href]').forEach(function(a){
      var target=new URL(a.getAttribute('href'),location.href);
      var targetPath=target.pathname.replace(/\/+$/,'')||'/';
      if(target.origin===location.origin && targetPath===currentPath)a.setAttribute('aria-current','page');
    });
  }

  function breadcrumbData(){
    var p=location.pathname.replace(/\/+$/,'');
    var map=[
      ['/landing/','الحلول','Solutions'],
      ['/tools/','الأدوات','Tools'],
      ['/products/','المنتجات','Products'],
      ['/pages/','الشركة','Company'],
      ['/documents/','مكتبة الشركة','Business Library'],
      ['/legal/','الثقة والسياسات','Trust & Policies'],
      ['/brand/','الهوية الإعلامية','Brand & Media'],
      ['/insights/','المعرفة','Insights'],
      ['/resources/','الموارد','Resources']
    ];
    for(var i=0;i<map.length;i++){
      var base=SITE_ROOT.replace(/\/$/,'')+map[i][0].replace(/^\//,'').replace(/\/$/,'');
      var norm=map[i][0].replace(/\/$/,'');
      if(p===base){
        return [{ar:'الرئيسية',en:'Home',url:pathLink('')},{ar:map[i][1],en:map[i][2],url:pathLink(norm.replace(/^\//,'')+'/')}];
      }
      if(p.indexOf(base+'/')===0){
        var label=document.title.replace(/^NUMUW\s*\|\s*/,'').trim()||map[i][1];
        return [{ar:'الرئيسية',en:'Home',url:pathLink('')},{ar:map[i][1],en:map[i][2],url:pathLink(norm.replace(/^\//,'')+'/')},{ar:label,en:label,url:location.href}];
      }
    }
    return [];
  }

  function injectBreadcrumbs(){
    var data=breadcrumbData();
    if(data.length<2)return;
    if(!document.querySelector('.breadcrumbs')){
      var header=document.querySelector('header');
      var main=document.querySelector('main');
      if(header&&main){
        var nav=document.createElement('nav');
        nav.className='breadcrumbs container';
        nav.setAttribute('aria-label',lang==='ar'?'مسار الصفحة':'Breadcrumb');
        nav.innerHTML='<a href="'+data[0].url+'" data-ar="'+data[0].ar+'" data-en="'+data[0].en+'">'+(lang==='ar'?data[0].ar:data[0].en)+'</a><span aria-hidden="true">/</span>'+data.slice(1).map(function(x,i){
          return i===data.length-2?'<span aria-current="page">'+(lang==='ar'?x.ar:x.en)+'</span>':'<a href="'+x.url+'" data-ar="'+x.ar+'" data-en="'+x.en+'">'+(lang==='ar'?x.ar:x.en)+'</a>';
        }).join('<span aria-hidden="true">/</span>');
        header.insertAdjacentElement('afterend',nav);
      }
    }
    if(!document.getElementById('numuw-breadcrumb-schema')){
      var script=document.createElement('script');
      script.type='application/ld+json';
      script.id='numuw-breadcrumb-schema';
      script.textContent=JSON.stringify({
        '@context':'https://schema.org',
        '@type':'BreadcrumbList',
        itemListElement:data.map(function(x,i){return {'@type':'ListItem',position:i+1,name:lang==='ar'?x.ar:x.en,item:i===data.length-1?undefined:x.url}}).map(function(x){if(!x.item)delete x.item;return x;})
      });
      document.head.appendChild(script);
    }
  }

  function normalizeFooter(){
    var footer=document.querySelector('.footer');
    var grid=document.querySelector('.footer-grid');
    if(!footer||!grid)return;
    grid.innerHTML='<div class="footer-brand"><strong>NUMUW | نُمو</strong><span data-ar="أنظمة نمو رقمية عملية للشركات والأعمال." data-en="Practical digital growth systems for businesses.">أنظمة نمو رقمية عملية للشركات والأعمال.</span></div>'+
      '<nav class="footer-links" aria-label="Footer navigation">'+
      '<a href="'+pathLink('landing/')" data-ar="الحلول" data-en="Solutions">الحلول</a>'+
      '<a href="'+pathLink('tools/')" data-ar="الأدوات" data-en="Tools">الأدوات</a>'+
      '<a href="'+pathLink('products/')" data-ar="المنتجات" data-en="Products">المنتجات</a>'+
      '<a href="'+pathLink('pages/')" data-ar="الشركة" data-en="Company">الشركة</a>'+
      '<a href="'+pathLink('resources/')" data-ar="الموارد" data-en="Resources">الموارد</a></nav>'+
      '<div class="footer-trust"><a href="'+pathLink('legal/privacy/')" data-ar="الخصوصية" data-en="Privacy">الخصوصية</a><a href="'+pathLink('legal/disclaimer/')" data-ar="الإخلاء" data-en="Disclaimer">الإخلاء</a><a href="'+pathLink('documents/terms/')" data-ar="الشروط" data-en="Terms">الشروط</a></div>'+
      '<div class="footer-contact"><a href="https://wa.me/201127788810" target="_blank" rel="noopener" data-ar="WhatsApp" data-en="WhatsApp">WhatsApp</a><a href="tel:+201018541802" dir="ltr">+20 10 1854 1802</a><span>© <span data-year></span></span></div>';
  }

  var main=document.querySelector('main');
  if(main && !main.id)main.id='main';
  if(main && !document.querySelector('.skip')){
    var skip=document.createElement('a');
    skip.className='skip';
    skip.href='#main';
    skip.textContent=lang==='ar'?'تخطّي للمحتوى':'Skip to content';
    document.body.insertBefore(skip,document.body.firstChild);
  }

  var nav=document.querySelector('[data-nav]');
  var menu=document.querySelector('[data-menu]');
  if(nav&&!nav.id)nav.id='primary-nav';
  if(menu&&nav){
    menu.setAttribute('aria-controls',nav.id);
    menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');
  }

  normalizeNav();
  normalizeFooter();
  injectBreadcrumbs();

  document.addEventListener('click',function(e){
    var langButton=e.target.closest('[data-lang-btn]');
    if(langButton && !langButton.hidden){applyLang(lang==='ar'?'en':'ar');return}
    var m=e.target.closest('[data-menu]');
    if(m&&nav){
      var open=nav.classList.toggle('open');
      m.setAttribute('aria-expanded',open?'true':'false');
      m.setAttribute('aria-label',open?(lang==='ar'?'غلق القائمة':'Close menu'):(lang==='ar'?'فتح القائمة':'Open menu'));
      if(open){var first=nav.querySelector('a[href]');if(first)first.focus()}else m.focus();
      return;
    }
    if(e.target.closest('[data-nav] a')&&nav&&menu){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');return}
    if(nav&&menu&&nav.classList.contains('open')&&!e.target.closest('[data-nav]')&&!e.target.closest('[data-menu]')){
      nav.classList.remove('open');menu.setAttribute('aria-expanded','false');
    }
    var printButton=e.target.closest('[data-print]');
    if(printButton){window.print();return}
  });

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav&&menu){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
      menu.focus();
    }
  });

  document.querySelectorAll('a[target="_blank"]').forEach(function(a){
    var rel=(a.getAttribute('rel')||'').split(/\s+/).filter(Boolean);
    if(rel.indexOf('noopener')<0)rel.push('noopener');
    if(rel.indexOf('noreferrer')<0)rel.push('noreferrer');
    a.setAttribute('rel',rel.join(' '));
  });

  function emit(name,detail){
    var payload=detail||{};
    try{window.dispatchEvent(new CustomEvent('numuw:'+name,{detail:payload}))}catch(e){}
    if(Array.isArray(window.dataLayer)){
      try{window.dataLayer.push({event:'numuw_'+name,...payload})}catch(e){}
    }
  }

  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');
    if(!a)return;
    var href=a.getAttribute('href')||'',kind=null;
    if(/^https:\/\/wa\.me\//i.test(href))kind='whatsapp';
    else if(/^tel:/i.test(href))kind='phone';
    else if(/tools\/diagnostic\//i.test(href))kind='diagnostic';
    else if(/products\//i.test(href))kind='product';
    else if(/tools\//i.test(href))kind='tool';
    else if(/documents\//i.test(href))kind='document';
    if(kind)emit('cta',{kind:kind,path:location.pathname});
  });

  document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});

  if(localized.length<4){langButtons.forEach(function(b){b.hidden=true})}
  else{
    var saved;
    try{saved=localStorage.getItem('numuw-lang')}catch(e){}
    applyLang(saved==='ar'||saved==='en'?saved:lang);
  }
})();