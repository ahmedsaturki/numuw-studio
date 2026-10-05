(function(){
  var lang=document.documentElement.lang==='en'?'en':'ar';
  var localized=document.querySelectorAll('[data-ar][data-en],[data-ar-html][data-en-html]');
  var langButtons=document.querySelectorAll('[data-lang-btn]');

  function applyLang(next){
    lang=next==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
      el.textContent=lang==='ar'?el.getAttribute('data-ar'):el.getAttribute('data-en');
    });
    document.querySelectorAll('[data-ar-html][data-en-html]').forEach(function(el){
      el.innerHTML=lang==='ar'?el.getAttribute('data-ar-html'):el.getAttribute('data-en-html');
    });
    var title=document.querySelector('title[data-ar-title][data-en-title]');
    if(title)title.textContent=lang==='ar'?title.getAttribute('data-ar-title'):title.getAttribute('data-en-title');
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

  var nav=document.querySelector('[data-nav]');
  var menu=document.querySelector('[data-menu]');
  if(nav && !nav.id)nav.id='primary-nav';
  if(nav) nav.setAttribute('aria-label',lang==='ar'?'التنقل الرئيسي':'Primary navigation');
  if(menu && nav){
    menu.setAttribute('aria-controls',nav.id);
    menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');
    menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
  }

  if(nav){
    var currentPath=location.pathname.replace(/\/+$/,'')||'/';
    nav.querySelectorAll('a[href]').forEach(function(a){
      var href=a.getAttribute('href')||'';
      if(!href || href.charAt(0)==='#' || /^[a-z][a-z0-9+.-]*:/i.test(href)) return;
      var anchor=new URL(href,location.href);
      var anchorPath=anchor.pathname.replace(/\/+$/,'')||'/';
      if(anchor.origin===location.origin && anchorPath===currentPath){
        a.setAttribute('aria-current','page');
      }
    });
  }

  /* Do not advertise a bilingual switch on pages that are not actually localized. */
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
    if(/^https:\/\/wa\.me\//i.test(href)) kind='whatsapp';
    else if(/^tel:/i.test(href)) kind='phone';
    else if(/tools\/diagnostic\//i.test(href)) kind='diagnostic';
    else if(/products\//i.test(href)) kind='product';
    else if(/tools\//i.test(href)) kind='tool';
    else if(/documents\//i.test(href)) kind='document';
    if(kind) emit('cta',{kind:kind,path:location.pathname});
  });

  document.addEventListener('click',function(e){
    var printButton=e.target.closest('[data-print]');
    if(printButton){window.print();}
  });

  document.querySelectorAll('[data-year]').forEach(function(e){
    e.textContent=new Date().getFullYear();
  });
})();