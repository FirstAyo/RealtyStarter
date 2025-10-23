(function(){
  // Build accordion from JSON and support "one open at a time"
  function buildFAQ(items){
    var list = document.getElementById('faqList');
    if(!list) return;
    list.innerHTML = '';

    items.forEach(function(it, idx){
      var qId = 'faq-q-' + (idx+1);
      var aId = 'faq-a-' + (idx+1);

      var wrap = document.createElement('div');
      wrap.className = 'faq-item';
      wrap.setAttribute('role','listitem');

      var h3 = document.createElement('h3');
      h3.className = 'card-title';
      var btn = document.createElement('button');
      btn.className = 'faq-q';
      btn.id = qId;
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-controls', aId);
      btn.innerHTML = '<span>'+it.question+'</span><span class="chev" aria-hidden="true"></span>';
      h3.appendChild(btn);

      var ans = document.createElement('div');
      ans.className = 'faq-a';
      ans.id = aId;
      ans.setAttribute('role','region');
      ans.setAttribute('aria-labelledby', qId);
      ans.setAttribute('hidden','');

      var inner = document.createElement('div');
      inner.innerHTML = '<p>'+it.answer+'</p>';
      ans.appendChild(inner);

      wrap.appendChild(h3);
      wrap.appendChild(ans);
      list.appendChild(wrap);

      btn.addEventListener('click', function(){
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        // Close all others
        list.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(function(openBtn){
          if(openBtn === btn) return;
          openBtn.setAttribute('aria-expanded','false');
          var target = document.getElementById(openBtn.getAttribute('aria-controls'));
          if(target){ target.classList.remove('open'); target.setAttribute('hidden',''); }
        });
        // Toggle current
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        if(isOpen){
          ans.classList.remove('open');
          ans.setAttribute('hidden','');
        }else{
          ans.classList.add('open');
          ans.removeAttribute('hidden');
          // ensure visibility for keyboard users
          ans.scrollIntoView({behavior:'smooth', block:'nearest'});
        }
      });
    });

    // Optional: open item if hash matches #faq-q-N
    if(location.hash && /^#faq-q-\d+$/.test(location.hash)){
      var btn = document.querySelector(location.hash);
      if(btn){ btn.click(); }
    }
  }

  async function init(){
    try{
      if(typeof loadJSON === 'function'){
        var data = await loadJSON('data/faq.json');
        buildFAQ(data);
      } else {
        // Fallback: fetch without helper
        var res = await fetch('data/faq.json');
        var data = await res.json();
        buildFAQ(data);
      }
    }catch(e){
      console.error('Failed to load FAQ:', e);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();