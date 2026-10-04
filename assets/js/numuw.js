(function(){
  var lang=document.documentElement.lang==='en'?'en':'ar';
  var localized=document.querySelectorAll('[data-ar][data-en]');
  var langButtons=document.querySelectorAll('[data-lang-btn]');
  var canonical=document.querySelector('link[rel="canonical"]');
  var canonicalPath='';
  try{canonicalPath=new URL(canonical.getAttribute('href'),location.href).pathname}catch(e){}
  var firstSegment=canonicalPath.split('/').filter(Boolean)[0]||'';
  var base='/' + (firstSegment?firstSegment+'/':'');
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

  function route(labelKey){
    return base+labelKey+'/';
  }

  var main=document.querySelector('main');
  if(main){
    if(!main.id)main.id='main';
    if(!document.querySelector('.skip')){
      var skip=document.createElement('a');
      skip.className='skip';
      skip.href='#main';
      skip.textContent=lang==='ar'?'تخطّي للمحتوى':'Skip to content';
      document.body.insertBefore(skip,document.body.firstChild);
    }
  }

  var nav=document.querySelector('[data-nav]');
  var menu=document.querySelector('[data-menu]');

  if(nav){
    if(!nav.id)nav.id='primary-nav';
    nav.setAttribute('aria-label',lang==='ar'?'التنقل الرئيسي':'Primary navigation');
    nav.innerHTML=[
      ['landing','الحلول','Solutions'],
      ['tools','الأدوات','Tools'],
      ['products','المنتجات','Products'],
      ['proof','الإثبات','Proof'],
      ['pages','الشركة','Company'],
      ['resources','الموارد','Resources']
    ].map(function(item){
      return '<a href="'+route(item[0])+'" data-ar="'+item[1]+'" data-en="'+item[2]+'">'+(lang==='ar'?item[1]:item[2])+'</a>';
    }).join('');

    var currentPath=location.pathname.replace(/\/+$/,'')||'/';
    nav.querySelectorAll('a[href]').forEach(function(a){
      var anchor=new URL(a.getAttribute('href'),location.href);
      var anchorPath=anchor.pathname.replace(/\/+$/,'')||'/';
      if(anchor.origin===location.origin && anchorPath===currentPath){
        a.setAttribute('aria-current','page');
      }
    });
  }

  if(menu && nav){
    menu.setAttribute('aria-controls',nav.id);
    menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');
    menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
  }

  /* Document-level orientation aid. Home is deliberately excluded. */
  if(main && nav && location.pathname.replace(/\/+$/,'')!==base.replace(/\/+$/,'')){
    var oldCrumb=document.getElementById('numuw-breadcrumb');
    if(!oldCrumb){
      var parts=location.pathname.split('/').filter(Boolean);
      var start=parts[0]===firstSegment?1:0;
      var visible=parts.slice(start).filter(function(x){return x && x!=='index.html'});
      var pathNames={
        landing:'الحلول',tools:'الأدوات',products:'المنتجات',pages:'الشركة',
        documents:'Business Library',legal:'الثقة والخصوصية',resources:'الموارد',
        insights:'Insights',media-kit:'Media Kit',brand:'Brand'
      };
      var crumb=document.createElement('nav');
      crumb.id='numuw-breadcrumb';
      crumb.className='breadcrumbs';
      crumb.setAttribute('aria-label','Breadcrumb');
      var current=base;
      var links=['<a href="'+base+'">NUMUW</a>'];
      visible.forEach(function(part,idx){
        current+=part+'/';
        var label=pathNames[part]||part.replace(/[-_]/g,' ');
        var isLast=idx===visible.length-1;
        links.push('<span aria-hidden="true">/</span>'+(isLast?'<span aria-current="page">'+label+'</span>':'<a href="'+current+'">'+label+'</a>'));
      });
      crumb.innerHTML=links.join('');
      var header=nav.closest('header');
      if(header && header.parentNode && main) header.parentNode.insertBefore(crumb,main);
    }
  }

  /* Consistent footer wayfinding without changing existing document meaning. */
  var footer=document.querySelector('footer');
  if(footer && !footer.querySelector('.global-footer-links')){
    var wrap=footer.querySelector('.container')||footer.querySelector('.wrap')||footer;
    var links=document.createElement('nav');
    links.className='global-footer-links';
    links.setAttribute('aria-label',lang==='ar'?'روابط رئيسية':'Primary links');
    links.innerHTML='<a href="'+base+'landing/">الحلول</a><a href="'+base+'tools/">الأدوات</a><a href="'+base+'products/">المنتجات</a><a href="'+base+'pages/proof/">الإثبات</a><a href="'+base+'pages/">الشركة</a><a href="'+base+'resources/">الموارد</a><a href="'+base+'documents/">الملفات</a><a href="'+base+'legal/">الثقة والخصوصية</a>';
    wrap.appendChild(links);
  }

  if(localized.length<4){
    langButtons.forEach(function(b){b.hidden=true});
  }else{
    var saved;
    try{saved=localStorage.getItem('numuw-lang')}catch(e){}
    if(saved==='ar'||saved==='en')applyLang(saved);
    else applyLang(lang);
  }

  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-lang-btn]');
    if(b && !b.hidden){applyLang(lang==='ar'?'en':'ar');return}

    var m=e.target.closest('[data-menu]');
    if(m && nav){
      var open=nav.classList.toggle('open');
      m.setAttribute('aria-expanded',open?'true':'false');
      m.setAttribute('aria-label',open?(lang==='ar'?'غلق القائمة':'Close menu'):(lang==='ar'?'فتح القائمة':'Open menu'));
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
      menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
      return;
    }

    if(nav && menu && nav.classList.contains('open') && !e.target.closest('[data-nav]') && !e.target.closest('[data-menu]')){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
    }

    var printButton=e.target.closest('[data-print]');
    if(printButton){window.print();}
  });

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && nav && menu){
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

  function emit(name, detail){
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

  document.querySelectorAll('[data-year]').forEach(function(e){
    e.textContent=new Date().getFullYear();
  });
})();