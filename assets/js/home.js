(function(){
  var langBtn=document.getElementById('lang');
  var menu=document.getElementById('menu');
  var nav=document.getElementById('primary-nav');
  var lang='ar';

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
    document.title=lang==='ar'
      ?'نُمو NUMUW — أنظمة نمو رقمية للشركات والمصانع في مصر'
      :'NUMUW — Growth systems for Egyptian businesses';
    try{localStorage.setItem('numuw-home-lang',lang)}catch(e){}
  }

  if(langBtn){
    langBtn.addEventListener('click',function(){
      apply(lang==='ar'?'en':'ar');
    });
  }

  if(menu && nav){
    menu.setAttribute('aria-controls','primary-nav');
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','فتح القائمة');

    function closeMenu(returnFocus){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label',lang==='ar'?'فتح القائمة':'Open menu');
      if(returnFocus)menu.focus();
    }

    menu.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      menu.setAttribute('aria-expanded',open?'true':'false');
      menu.setAttribute('aria-label',open
        ?(lang==='ar'?'غلق القائمة':'Close menu')
        :(lang==='ar'?'فتح القائمة':'Open menu'));
      if(open){
        var first=nav.querySelector('a[href]');
        if(first)first.focus();
      }
    });

    nav.addEventListener('click',function(e){
      if(e.target.closest('a[href]'))closeMenu(false);
    });

    document.addEventListener('click',function(e){
      if(nav.classList.contains('open')&&!e.target.closest('#primary-nav')&&!e.target.closest('#menu')){
        closeMenu(false);
      }
    });

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true);
    });
  }

  var saved=null;
  try{saved=localStorage.getItem('numuw-home-lang')}catch(e){}
  apply(saved==='en'||saved==='ar'?saved:'ar');

  function emit(name,detail){
    try{window.dispatchEvent(new CustomEvent('numuw:'+name,{detail:detail||{}}))}catch(e){}
    if(Array.isArray(window.dataLayer)){
      try{window.dataLayer.push({event:'numuw_'+name,...(detail||{})})}catch(e){}
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
})();