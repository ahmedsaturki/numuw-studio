(function(){
  var ROOT='/numuw-studio/';
  var lang=document.documentElement.lang==='en'?'en':'ar';
  var main=document.querySelector('main');
  var nav=document.querySelector('[data-nav]');
  var menu=document.querySelector('[data-menu]');
  var langButtons=document.querySelectorAll('[data-lang-btn]');
  var localized=document.querySelectorAll('[data-ar][data-en]');

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

  function renderGlobalNav(){
    if(!nav)return;
    var items=[
      ['الرئيسية','Home',ROOT],
      ['الحلول','Solutions',ROOT+'landing/'],
      ['الأدوات','Tools',ROOT+'tools/'],
      ['المنتجات','Products',ROOT+'products/'],
      ['الشركة','Company',ROOT+'pages/'],
      ['المصادر','Resources',ROOT+'resources/'],
      ['التواصل','Contact',ROOT+'pages/contact/']
    ];
    nav.id=nav.id||'primary-nav';
    nav.setAttribute('aria-label','التنقل الرئيسي');
    nav.innerHTML=items.map(function(item){
      return '<a href="'+item[2]+'" data-ar="'+item[0]+'" data-en="'+item[1]+'">'+item[0]+'</a>';
    }).join('');
    var current=normalize(location.pathname);
    nav.querySelectorAll('a[href]').forEach(function(a){
      var target=normalize(new URL(a.href,location.href).pathname);
      if(target===current)a.setAttribute('aria-current','page');
    });
  }

  function renderBreadcrumbs(){
    if(!main || normalize(location.pathname)===normalize(ROOT) || /\/404\.html$/i.test(location.pathname))return;
    if(main.querySelector('.breadcrumbs'))return;

    var clean=location.pathname.replace(/^\/numuw-studio\/?/,'').replace(/\/+$/,'');
    var parts=clean.split('/').filter(Boolean);
    if(!parts.length)return;

    var labels={
      landing:'الحلول',
      tools:'الأدوات',
      products:'المنتجات',
      pages:'الشركة',
      documents:'المصادر',
      legal:'الثقة والقانون',
      resources:'المصادر',
      insights:'المصادر',
      'media-kit':'المصادر',
      brand:'الهوية'
    };
    var currentLabel=(main.querySelector('h1')||{}).textContent;
    currentLabel=(currentLabel||parts[parts.length-1]).trim();

    var crumb=document.createElement('nav');
    crumb.className='breadcrumbs';
    crumb.setAttribute('aria-label','مسار الصفحة');
    var list=document.createElement('ol');
    var home=document.createElement('li');
    home.innerHTML='<a href="'+ROOT+'">الرئيسية</a>';
    list.appendChild(home);

    var section=parts[0];
    var sectionLabel=labels[section]||section;
    var sectionUrl=ROOT+section+'/';
    var li=document.createElement('li');
    li.innerHTML='<a href="'+sectionUrl+'">'+sectionLabel+'</a>';
    list.appendChild(li);

    if(parts.length>1){
      var last=document.createElement('li');
      last.setAttribute('aria-current','page');
      last.textContent=currentLabel;
      list.appendChild(last);
    }else{
      li.setAttribute('aria-current','page');
      li.querySelector('a').removeAttribute('href');
      li.querySelector('a').textContent=currentLabel;
    }

    crumb.appendChild(list);
    main.insertBefore(crumb,main.firstChild);
  }

  function renderGlobalFooter(){
    var footer=document.querySelector('footer.footer');
    if(!footer)return;
    footer.innerHTML='<div class="container footer-grid"><div><strong>NUMUW | نُمو</strong><span data-ar=" · استوديو أنظمة النمو · مصر" data-en=" · Growth Systems Studio · Egypt"> · استوديو أنظمة النمو · مصر</span></div><nav aria-label="روابط الموقع"><a href="'+ROOT+'landing/" data-ar="الحلول" data-en="Solutions">الحلول</a><a href="'+ROOT+'tools/" data-ar="الأدوات" data-en="Tools">الأدوات</a><a href="'+ROOT+'products/" data-ar="المنتجات" data-en="Products">المنتجات</a><a href="'+ROOT+'pages/" data-ar="الشركة" data-en="Company">الشركة</a><a href="'+ROOT+'resources/" data-ar="المصادر" data-en="Resources">المصادر</a><a href="'+ROOT+'legal/" data-ar="الثقة والقانون" data-en="Trust & Legal">الثقة والقانون</a><a href="'+ROOT+'pages/contact/" data-ar="التواصل" data-en="Contact">التواصل</a></nav><span>© <span data-year></span></span></div>';
  }

  function applyLanguage(next){
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

  ensureSkipLink();
  renderGlobalNav();
  renderBreadcrumbs();
  renderGlobalFooter();
  applyLanguage(lang);

  var brandSub=document.querySelector('.brand-sub');
  if(brandSub)brandSub.textContent='استوديو أنظمة النمو';

  if(nav && menu){
    menu.setAttribute('type','button');
    menu.setAttribute('aria-controls',nav.id||'primary-nav');
    menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');
    menu.setAttribute('aria-label','فتح القائمة');
  }

  /* Internal pages are Arabic-first. Never expose a fake bilingual switch. */
  langButtons.forEach(function(b){
    if(localized.length<4)b.hidden=true;
  });

  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-lang-btn]');
    if(b && !b.hidden){applyLanguage(lang==='ar'?'en':'ar');return}

    var m=e.target.closest('[data-menu]');
    if(m && nav){
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

    if(e.target.closest('[data-nav] a') && nav && menu){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label','فتح القائمة');
      return;
    }

    if(nav && menu && nav.classList.contains('open') && !e.target.closest('[data-nav]') && !e.target.closest('[data-menu]')){
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
    if(e.key==='Escape' && nav && menu){
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