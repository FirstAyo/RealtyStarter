(function(){
  /* ----------------- HERO SLIDER ----------------- */
  function initSlider(){
    var root = document.getElementById('heroSlider');
    if(!root) return;

    var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
    var prevBtn = root.querySelector('.nav.prev');
    var nextBtn = root.querySelector('.nav.next');
    var dotsWrap = root.querySelector('.dots');

    // Guard against missing markup
    if(slides.length === 0) return;

    var i = Math.max(0, slides.findIndex(function(s){ return s.classList.contains('is-active'); }));
    if(i === -1){ i = 0; slides[0].classList.add('is-active'); }

    var timer = null;
    var delay = 5000;

    function go(n){
      // bounds + no-op guard
      n = (n + slides.length) % slides.length;
      if(n === i) return;
      slides[i].classList.remove('is-active');
      i = n;
      slides[i].classList.add('is-active');
      updateDots();
    }
    function next(){ go(i+1); }
    function prev(){ go(i-1); }

    function makeDots(){
      dotsWrap.innerHTML = '';
      for(var k=0;k<slides.length;k++){
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (k+1));
        (function(idx){
          b.addEventListener('click', function(){ go(idx); restart(); });
        })(k);
        dotsWrap.appendChild(b);
      }
    }
    function updateDots(){
      var btns = dotsWrap.querySelectorAll('button');
      for(var k=0;k<btns.length;k++){
        if(k === i){ btns[k].setAttribute('aria-current','true'); }
        else { btns[k].removeAttribute('aria-current'); }
      }
    }
    function start(){
      if(timer) return;
      timer = setInterval(next, delay);
    }
    function stop(){
      if(timer){ clearInterval(timer); timer = null; }
    }
    function restart(){ stop(); start(); }

    makeDots();
    updateDots();
    start();

    if(nextBtn) nextBtn.addEventListener('click', function(){ next(); restart(); });
    if(prevBtn) prevBtn.addEventListener('click', function(){ prev(); restart(); });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function(){ if(document.hidden) stop(); else start(); });

    // Keyboard support when slider region is focused
    root.setAttribute('tabindex','0');
    root.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight') { next(); restart(); }
      if(e.key === 'ArrowLeft')  { prev(); restart(); }
    });
  }

  /* --------- CARD REVEALS + HOMEPAGE POPULATION --------- */
  function initReveals(){
    if(!('IntersectionObserver' in window)) {
      var all = document.querySelectorAll('.reveal');
      for(var n=0;n<all.length;n++){ all[n].classList.add('in'); }
      return;
    }
    var io = new IntersectionObserver(function(entries){
      for(var m=0;m<entries.length;m++){
        var entry = entries[m];
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }
    }, {rootMargin: '0px 0px -10% 0px', threshold: 0.1});
    var targets = document.querySelectorAll('.reveal');
    for(var t=0;t<targets.length;t++){ io.observe(targets[t]); }
  }

  function populateHome(){
    if(!window.loadJSON || !window.$) { initReveals(); return; }

    (async function(){
      try{
        var props = await loadJSON('data/properties.json');
        var featured = props.slice(0,3);
        var $grid = $('#featuredGrid');
        featured.forEach(function(p, idx){
          var html = '\
          <article class="card reveal" style="animation-delay:'+ (idx*80) +'ms">\
            <img src="'+p.images[0]+'" alt="'+p.title+' exterior" loading="lazy"/>\
            <div class="card-content">\
              <h3 class="card-title"><a href="listing-detail.html?id='+p.id+'">'+p.title+'</a></h3>\
              <div class="price">'+$formatPrice(p.price)+'</div>\
              <div class="meta">'+p.beds+' bd · '+p.baths+' ba · '+(p.sqft).toLocaleString()+' sqft</div>\
              <div class="meta">'+p.address+', '+p.city+'</div>\
              <p><a class="btn" href="listing-detail.html?id='+p.id+'">View Details</a></p>\
            </div>\
          </article>';
          $grid.append(html);
        });

        var posts = await loadJSON('data/blog.json');
        var latest = posts.slice(0,3);
        var $blog = $('#homeBlog');
        latest.forEach(function(b, idx){
          var html = '\
          <article class="card reveal" style="animation-delay:'+ (idx*80) +'ms">\
            <img src="'+b.coverImage+'" alt="'+b.title+'" loading="lazy"/>\
            <div class="card-content">\
              <h3 class="card-title"><a href="post.html?id='+b.id+'">'+b.title+'</a></h3>\
              <div class="meta">By '+b.author+' · '+$formatDate(b.date)+'</div>\
              <p>'+b.excerpt+'</p>\
              <p><a class="btn" href="post.html?id='+b.id+'">Read more</a></p>\
            </div>\
          </article>';
          $blog.append(html);
        });

        initReveals();
      }catch(e){
        console.error(e);
        initReveals();
      }
    })();
  }

  // Init when DOM is ready
  function ready(fn){
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', fn); }
    else { fn(); }
  }
  ready(function(){
    initSlider();
    populateHome();
  });
})();