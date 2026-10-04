(function(){
  var lang=document.documentElement.lang==='en'?'en':'ar';
  var localized=document.querySelectorAll('[data-ar][data-en]');
  var langButtons=document.querySelectorAll('[data-lang-btn]');
  var canonical=document.querySelector('link[rel="canonical"]');
  var canonicalPath='';
  try{canonicalPath=new URL(canonical.getAttribute('href'),location.href).pathname}catch(e){}
  var canonicalParts=canonicalPath.split('/').filter(Boolean);
  var isGithubPages=/\.github\.io$/i.test(location.hostname);
  var firstSegment=canonicalParts[0]||'';
  var base=isGithubPages&&firstSegment?'/'+firstSegment+'/':'/';

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
    try{localStorage.setItem('numuw-lang',lang)}catch(e){}
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

  var nav=document.querySelector('[data-nav]')||document.querySelector('header .navlinks');
  var menu=document.querySelector('[data-menu]')||document.querySelector('header .menu-btn');

  if(nav){
    nav.id=nav.id||'primary-nav';
    nav.setAttribute('aria-label',lang==='ar'?'التنقل الرئيسي':'Primary navigation');
    nav.innerHTML=[
      ['landing','الحلول','Solutions'],
      ['tools','الأدوات','Tools'],
      ['products','المنتجات','Products'],
      ['pages/proof','الإثبات','Proof'],
      ['pages','الشركة','Company'],
      ['resources','الموارد','Resources']
    ].map(function(item){
      var label=lang==='ar'?item[1]:item[2];
      return '<a href="'+base+item[0]+'/" data-ar="'+item[1]+'" data-en="'+item[2]+'">'+label+'</a>';
    }).join('');

    var currentPath=location.pathname.replace(/\/+$/,'')||'/';
    nav.querySelectorAll('a[href]').forEach(function(a){
      var anchor=new URL(a.getAttribute('href'),location.href);
      var anchorPath=anchor.pathname.replace(/\/+$/,'')||'/';
      if(anchor.origin===location.origin&&anchorPath===currentPath)a.setAttribute('aria-current','page');
    });
  }

  if(menu&&nav){
    menu.setAttribute('aria-controls',nav.id);
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
    if(!menu.getAttribute('type'))menu.setAttribute('type','button');
  }

  /* A consistent orientation aid for every inner route. */
  if(main&&nav&&location.pathname.replace(/\/+$/,'')!==base.replace(/\/+$/,'')){
    var old=document.getElementById('numuw-breadcrumb');
    if(!old){
      var segments=location.pathname.split('/').filter(Boolean);
      if(isGithubPages&&segments[0]===firstSegment)segments=segments.slice(1);
      segments=segments.filter(function(x){return x!=='index.html'});
      var names={
        landing:'الحلول',tools:'الأدوات',products:'المنتجات',pages:'الشركة',
        documents:'Business Library',legal:'الثقة والخصوصية',resources:'الموارد',
        insights:'الرؤى',media-kit:'Media Kit',brand:'Brand',
        website:'المواقع والتحويل',automation:'الأتمتة',ai:'الذكاء الاصطناعي',
        'seo-local':'SEO والظهور المحلي','growth-partner':'Growth Partner',
        manufacturing:'المصانع',b2b:'B2B',realestate:'العقارات',ecommerce:'التجارة الإلكترونية',
        diagnostic:'Growth Diagnostic','automation-finder':'Automation Finder',
        'roi-calculator':'ROI Calculator',estimator:'Estimator',roadmap:'Roadmap',
        'website-readiness':'Website Readiness','solution-finder':'Solution Finder',
        'brief-builder':'Brief Builder','digital-kickoff':'انطلاقة رقمية',
        'growth-system':'نظام النمو','automation-sprint':'Automation Sprint',
        'case-studies':'الحالات','about':'من نحن','method':'المنهج','proof':'الإثبات',
        contact:'التواصل','playbooks':'Playbooks','sales-discovery':'Sales Discovery',
        'delivery-qa':'Delivery QA','proposal-template':'Proposal Template',
        'company-profile':'Company Profile','capability-statement':'Capability Statement',
        'service-catalog':'Service Catalog','onboarding':'Onboarding','handover':'Handover',
        terms:'الشروط التجارية',privacy:'الخصوصية',disclaimer:'إخلاء المسؤولية'
      };
      var current=base;
      var pieces=['<a href="'+base+'">NUMUW</a>'];
      segments.forEach(function(seg,idx){
        current+=seg+'/';
        var label=names[seg]||decodeURIComponent(seg).replace(/[-_]/g,' ');
        pieces.push('<span aria-hidden="true">/</span>');
        if(idx===segments.length-1)pieces.push('<span aria-current="page">'+label+'</span>');
        else pieces.push('<a href="'+current+'">'+label+'</a>');
      });
      var crumb=document.createElement('nav');
      crumb.id='numuw-breadcrumb';
      crumb.className='breadcrumbs';
      crumb.setAttribute('aria-label','Breadcrumb');
      crumb.innerHTML=pieces.join('');
      var header=nav.closest('header');
      if(header&&header.parentNode)header.parentNode.insertBefore(crumb,main);
    }
  }

  var footer=document.querySelector('footer');
  if(footer&&!footer.querySelector('.global-footer-links')){
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
    var saved='';
    try{saved=localStorage.getItem('numuw-lang')||''}catch(e){}
    applyLang(saved==='en'?'en':'ar');
  }

  document.addEventListener('click',function(e){
    var m=e.target.closest('[data-menu]')||e.target.closest('header .menu-btn');
    if(m&&nav){
      var open=nav.classList.toggle('open');
      m.setAttribute('aria-expanded',open?'true':'false');
      m.setAttribute('aria-label',open?(lang==='ar'?'غلق القائمة':'Close menu'):(lang==='ar'?'فتح القائمة':'Open menu'));
      if(open){
        var first=nav.querySelector('a[href]');
        if(first)first.focus();
      }else{m.focus();}
      return;
    }
    if(e.target.closest('header [data-nav] a')&&nav&&menu){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
      return;
    }
    if(nav&&menu&&nav.classList.contains('open')&&!e.target.closest('header')&&!e.target.closest('[data-menu]')){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
    }
    var b=e.target.closest('[data-lang-btn]');
    if(b&&!b.hidden){applyLang(lang==='ar'?'en':'ar');return;}
    var printButton=e.target.closest('[data-print]');
    if(printButton)window.print();
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
    var payload={name:name,detail:detail||{}};
    try{window.dispatchEvent(new CustomEvent('numuw:'+name,{detail:payload.detail}))}catch(e){}
    if(Array.isArray(window.dataLayer)){
      try{window.dataLayer.push({event:'numuw_'+name,...payload.detail})}catch(e){}
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
    else if(/pages\/proof\//i.test(href))kind='proof';
    if(kind)emit('cta',{kind:kind,path:location.pathname});
  });

  document.querySelectorAll('[data-year]').forEach(function(e){
    e.textContent=new Date().getFullYear();
  });
})();