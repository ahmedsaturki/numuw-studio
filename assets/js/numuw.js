(function(){
  var lang=document.documentElement.lang==='en'?'en':'ar';
  var siteRoot=location.pathname.indexOf('/numuw-studio/')===0?'/numuw-studio/':'/';
  var nav=document.querySelector('[data-nav]');
  var menu=document.querySelector('[data-menu]');
  var langButtons=document.querySelectorAll('[data-lang-btn]');

  function rootPath(path){
    return siteRoot + String(path||'').replace(/^\//,'');
  }

  function setLanguage(next){
    lang=next==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
      el.textContent=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });
    langButtons.forEach(function(btn){
      btn.textContent=lang==='ar'?'EN':'عربي';
      btn.setAttribute('aria-label',lang==='ar'?'Switch to English':'التحويل للعربية');
      btn.setAttribute('aria-pressed',lang==='en'?'true':'false');
    });
    if(nav) nav.setAttribute('aria-label',lang==='ar'?'التنقل الرئيسي':'Primary navigation');
    document.querySelectorAll('.breadcrumbs a[data-ar][data-en]').forEach(function(el){
      el.textContent=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });
  }

  function normalizeNavigation(){
    if(!nav)return;
    var items=[
      ['','الرئيسية','Home'],
      ['landing/','الحلول','Solutions'],
      ['tools/','الأدوات','Tools'],
      ['products/','المنتجات','Products'],
      ['pages/','الشركة','Company'],
      ['resources/','الموارد','Resources']
    ];
    nav.innerHTML=items.map(function(item){
      var label=lang==='ar'?item[1]:item[2];
      return '<a href="'+rootPath(item[0])+'" data-ar="'+item[1]+'" data-en="'+item[2]+'">'+label+'</a>';
    }).join('');
    var current=location.pathname.replace(/\/+$/,'')||'/';
    nav.querySelectorAll('a[href]').forEach(function(link){
      var p=new URL(link.getAttribute('href'),location.href).pathname.replace(/\/+$/,'')||'/';
      if(p===current)link.setAttribute('aria-current','page');
    });
  }

  function sectionForPath(){
    var p=location.pathname;
    var sections=[
      ['/landing/','الحلول','Solutions'],
      ['/tools/','الأدوات','Tools'],
      ['/products/','المنتجات','Products'],
      ['/pages/','الشركة','Company'],
      ['/documents/','مكتبة الشركة','Business Library'],
      ['/legal/','الثقة والسياسات','Trust & Policies'],
      ['/brand/','الهوية والإعلام','Brand & Media'],
      ['/insights/','المعرفة','Insights'],
      ['/resources/','الموارد','Resources']
    ];
    for(var i=0;i<sections.length;i++){
      var prefix=siteRoot+sections[i][0].replace(/^\//,'');
      if(p===prefix.replace(/\/$/,'')||p.indexOf(prefix)===0)return sections[i];
    }
    return null;
  }

  function addBreadcrumbs(){
    var section=sectionForPath();
    if(!section)return;
    if(document.querySelector('.breadcrumbs'))return;
    var header=document.querySelector('header');
    var main=document.querySelector('main');
    if(!header||!main)return;
    var currentTitle=document.title.replace(/^NUMUW\s*\|\s*/,'').trim();
    var sectionPath=section[0].replace(/^\//,'');
    var nav=document.createElement('nav');
    nav.className='breadcrumbs container';
    nav.setAttribute('aria-label',lang==='ar'?'مسار الصفحة':'Breadcrumb');
    nav.innerHTML='<a href="'+rootPath('')+'" data-ar="الرئيسية" data-en="Home">'+(lang==='ar'?'الرئيسية':'Home')+'</a><span aria-hidden="true">/</span><a href="'+rootPath(sectionPath)+'" data-ar="'+section[1]+'" data-en="'+section[2]+'">'+(lang==='ar'?section[1]:section[2])+'</a>';
    if(location.pathname.replace(/\/+$/,'')!== (siteRoot+sectionPath).replace(/\/$/,''))
      nav.innerHTML+='<span aria-hidden="true">/</span><span aria-current="page">'+currentTitle+'</span>';
    header.insertAdjacentElement('afterend',nav);

    if(!document.getElementById('numuw-breadcrumb-schema')){
      var script=document.createElement('script');
      script.type='application/ld+json';
      script.id='numuw-breadcrumb-schema';
      var items=[{'@type':'ListItem',position:1,name:lang==='ar'?'الرئيسية':'Home',item:rootPath('')},{'@type':'ListItem',position:2,name:lang==='ar'?section[1]:section[2]}];
      if(location.pathname.replace(/\/+$/,'')!== (siteRoot+sectionPath).replace(/\/$/,''))
        items[1].item=rootPath(sectionPath),items.push({'@type':'ListItem',position:3,name:currentTitle});
      script.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items});
      document.head.appendChild(script);
    }
  }

  function normalizeFooter(){
    var footer=document.querySelector('.footer');
    var grid=document.querySelector('.footer-grid');
    if(!footer||!grid)return;
    grid.innerHTML='<div class="footer-brand"><strong>NUMUW | نُمو</strong><span data-ar="أنظمة نمو رقمية عملية للشركات والأعمال." data-en="Practical digital growth systems for businesses.">أنظمة نمو رقمية عملية للشركات والأعمال.</span></div>'+
      '<nav class="footer-links" aria-label="Footer navigation"><a href="'+rootPath('landing/')+'" data-ar="الحلول" data-en="Solutions">الحلول</a><a href="'+rootPath('tools/')+'" data-ar="الأدوات" data-en="Tools">الأدوات</a><a href="'+rootPath('products/')+'" data-ar="المنتجات" data-en="Products">المنتجات</a><a href="'+rootPath('pages/')+'" data-ar="الشركة" data-en="Company">الشركة</a><a href="'+rootPath('resources/')+'" data-ar="الموارد" data-en="Resources">الموارد</a></nav>'+
      '<div class="footer-trust"><a href="'+rootPath('legal/privacy/')+'" data-ar="الخصوصية" data-en="Privacy">الخصوصية</a><a href="'+rootPath('documents/terms/')+'" data-ar="الشروط" data-en="Terms">الشروط</a></div>'+
      '<div class="footer-contact"><a href="https://wa.me/201127788810" target="_blank" rel="noopener" data-ar="WhatsApp" data-en="WhatsApp">WhatsApp</a><a href="tel:+201018541802" dir="ltr">+20 10 1854 1802</a><span>© <span data-year></span></span></div>';
  }

  var main=document.querySelector('main');
  if(main&&!main.id)main.id='main';
  if(main&&!document.querySelector('.skip')){
    var skip=document.createElement('a');
    skip.className='skip';
    skip.href='#main';
    skip.textContent=lang==='ar'?'تخطّي للمحتوى':'Skip to content';
    document.body.insertBefore(skip,document.body.firstChild);
  }

  if(nav&&!nav.id)nav.id='primary-nav';
  if(menu&&nav){
    menu.setAttribute('aria-controls',nav.id);
    menu.setAttribute('aria-expanded','false');
  }

  normalizeNavigation();
  normalizeFooter();
  addBreadcrumbs();

  document.addEventListener('click',function(e){
    var langButton=e.target.closest('[data-lang-btn]');
    if(langButton&&!langButton.hidden){setLanguage(lang==='ar'?'en':'ar');try{localStorage.setItem('numuw-lang',lang)}catch(err){}return;}
    var m=e.target.closest('[data-menu]');
    if(m&&nav){
      var open=nav.classList.toggle('open');
      m.setAttribute('aria-expanded',open?'true':'false');
      m.setAttribute('aria-label',open?(lang==='ar'?'غلق القائمة':'Close menu'):(lang==='ar'?'فتح القائمة':'Open menu'));
      if(open){var first=nav.querySelector('a[href]');if(first)first.focus();}else m.focus();
      return;
    }
    if(e.target.closest('[data-nav] a')&&nav&&menu){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
    var printButton=e.target.closest('[data-print]');
    if(printButton){window.print();return;}
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

  function emitCta(kind){
    var detail={kind:kind,path:location.pathname};
    try{window.dispatchEvent(new CustomEvent('numuw:cta',{detail:detail}))}catch(err){}
    if(Array.isArray(window.dataLayer)){try{window.dataLayer.push({event:'numuw_cta',kind:kind,path:location.pathname})}catch(err){}}
  }

  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');
    if(!a)return;
    var href=a.getAttribute('href')||'';
    if(/^https:\/\/wa\.me\//i.test(href))emitCta('whatsapp');
    else if(/^tel:/i.test(href))emitCta('phone');
    else if(/tools\/diagnostic\//i.test(href))emitCta('diagnostic');
    else if(/products\//i.test(href))emitCta('product');
    else if(/tools\//i.test(href))emitCta('tool');
    else if(/documents\//i.test(href))emitCta('document');
  });

  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=String(new Date().getFullYear())});

  if(langButtons.length<1){return;}
  var localizedCount=document.querySelectorAll('[data-ar][data-en]').length;
  if(localizedCount<4){langButtons.forEach(function(btn){btn.hidden=true});}
  else{
    var saved=null;
    try{saved=localStorage.getItem('numuw-lang')}catch(err){}
    setLanguage(saved==='ar'||saved==='en'?saved:lang);
  }
})();