(function(){
  const THEME_KEY = 'mytravels_theme';
  const LANG_KEY = 'mytravels_lang';
  const STORAGE_KEY = 'mytravels_posts_v3';

  function initTheme(){
    try{
      const stored = localStorage.getItem(THEME_KEY);
      if(stored) document.documentElement.setAttribute('data-theme', stored);
      else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.setAttribute('data-theme','dark');
      else document.documentElement.setAttribute('data-theme','light');
    }catch(e){ document.documentElement.setAttribute('data-theme','light'); }
  }

  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
    const btn = document.getElementById('themeToggle'); if(btn) btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
  }

  function translateUI(lang){
    const t = {
      en: { back: 'Back', notFound: 'Post not found.', home: 'Home', brand: 'My Travels', footer: '© 2025 My Travels. All rights reserved.', toggleTheme: 'Toggle theme' },
      es: { back: 'Volver', notFound: 'Publicación no encontrada.', home: 'Inicio', brand: 'Mis Viajes', footer: '© 2025 Mis Viajes. Todos los derechos reservados.', toggleTheme: 'Alternar tema' },
      fr: { back: 'Retour', notFound: 'Message non trouvé.', home: 'Accueil', brand: 'Mes Voyages', footer: '© 2025 Mes Voyages. Tous droits réservés.', toggleTheme: 'Basculer le thème' },
      de: { back: 'Zurück', notFound: 'Beitrag nicht gefunden.', home: 'Startseite', brand: 'Meine Reisen', footer: '© 2025 Meine Reisen. Alle Rechte vorbehalten.', toggleTheme: 'Design umschalten' },
      it: { back: 'Indietro', notFound: 'Post non trovato.', home: 'Home', brand: 'I miei viaggi', footer: '© 2025 I miei viaggi. Tutti i diritti riservati.', toggleTheme: 'Attiva tema' },
      pt: { back: 'Voltar', notFound: 'Postagem não encontrada.', home: 'Início', brand: 'Minhas Viagens', footer: '© 2025 Minhas Viagens. Todos os direitos reservados.', toggleTheme: 'Alternar tema' },
      ar: { back: 'رجوع', notFound: 'لم يتم العثور على المنشور.', home: 'الرئيسية', brand: 'رحلاتي', footer: '© 2025 رحلاتي. جميع الحقوق محفوظة.', toggleTheme: 'تبديل المظهر' },
      ja: { back: '戻る', notFound: '投稿が見つかりません。', home: 'ホーム', brand: '私の旅', footer: '© 2025 私の旅。無断転載を禁じます。', toggleTheme: 'テーマを切り替える' },
      zh: { back: '返回', notFound: '找不到帖子。', home: '首页', brand: '我的旅行', footer: '© 2025 我的旅行。保留所有权利。', toggleTheme: '切换主题' },
      ru: { back: 'Назад', notFound: 'Пост не найден.', home: 'Главная', brand: 'Мои путешествия', footer: '© 2025 Мои путешествия. Все права защищены.', toggleTheme: 'Переключить тему' }
    }[lang] || {};
    const backLabel = document.getElementById('backLabel'); if(backLabel) backLabel.textContent = t.back || 'Back';
    const brandLabel = document.getElementById('brandLabel'); if(brandLabel) brandLabel.textContent = t.brand || 'My Travels';
    const footerEl = document.getElementById('footerCopyright'); if(footerEl) footerEl.textContent = t.footer || footerEl.textContent;
    const themeBtn = document.getElementById('themeToggle'); if(themeBtn) themeBtn.title = t.toggleTheme || 'Toggle theme';
    window.__mytravels_translations = window.__mytravels_translations || {};
    Object.assign(window.__mytravels_translations, t);
  }

  function applyLang(lang){
    document.documentElement.setAttribute('data-lang', lang);
    // Set RTL for Arabic, set LTR for others
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
    const lb = document.getElementById('langLabel'); if(lb) lb.textContent = (lang || '').toUpperCase();
    translateUI(lang);
    // mark active item in dropdown if present
    const dropdownItems = document.querySelectorAll('.dropdown-menu a[data-lang]');
    dropdownItems.forEach(it=>{ if(it.getAttribute('data-lang')===lang) it.classList.add('active'); else it.classList.remove('active'); });
  }

  function readPosts(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { return []; } }

  function getQueryParam(name){ const params = new URLSearchParams(location.search); return params.get(name); }

  document.addEventListener('DOMContentLoaded', function(){
    initTheme();
    const themeBtn = document.getElementById('themeToggle');
    if(themeBtn){ const current = document.documentElement.getAttribute('data-theme') || 'light'; themeBtn.innerHTML = current === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>'; themeBtn.addEventListener('click', ()=>{ const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; applyTheme(next); }); }

    // language
    const langBtn = document.getElementById('langToggle');
    try{ const stored = localStorage.getItem(LANG_KEY) || 'en'; applyLang(stored); }catch(e){ applyLang('en'); }
    if(langBtn){
      const label = document.getElementById('langLabel'); if(label) label.textContent = (document.documentElement.getAttribute('data-lang') || 'en').toUpperCase();
      const dropdownItems = document.querySelectorAll('.dropdown-menu a[data-lang]');
      dropdownItems.forEach(item=>{
        item.addEventListener('click', (ev)=>{
          ev.preventDefault();
          const lang = item.getAttribute('data-lang'); if(!lang) return;
          applyLang(lang);
          const lbl = document.getElementById('langLabel'); if(lbl) lbl.textContent = item.textContent || lang.toUpperCase();
        });
      });
    }

    // render post
    const id = getQueryParam('id');
    const container = document.getElementById('postView');
    const posts = readPosts();
    const post = posts.find(p=>p.id === id);
    const t = window.__mytravels_translations || {};
    if(!post){ container.innerHTML = `<div class="alert alert-warning">${t.notFound || 'Post not found.'} <a href="index.html">${t.home || 'Home'}</a></div>`; return; }

    const imgs = post.images && post.images.length ? post.images : (post.img ? (Array.isArray(post.img)?post.img:[post.img]) : []);
    const imgHtml = imgs.length ? imgs.map(i=>`<img src="${i}" class="img-fluid rounded mb-3" alt="post image">`).join('\n') : '';
    const T = window.__mytravels_translations || {};
    const unt = T.untitled || 'Untitled';
    const transLabel = T.translate || 'Translate';
    container.innerHTML = `
      <article class="mx-auto" style="max-width:900px">
        <header class="mb-3">
          <h1 class="h3 mb-1">${escapeHtml(post.title || unt)}</h1>
          <div class="text-muted small mb-2">${new Date(post.date).toLocaleString()}</div>
        </header>
        ${imgHtml}
        <div class="card card-travel p-3">
          <div class="card-body p-0">
            <div class="post-content" id="postContent">${(escapeHtml(post.content) || '').replace(/\n/g,'<br>')}</div>
          </div>
        </div>
        <div class="mt-4 text-end">
          <a class="btn btn-outline-secondary me-2" href="index.html">${t.back || 'Back'}</a>
          <button id="translatePostBtn" class="btn btn-outline-secondary">${transLabel}</button>
        </div>
      </article>
    `;
    try{ document.title = (post.title ? (post.title + ' — ') : '') + (window.__mytravels_translations.brand || 'My Travels'); const metaDesc = document.querySelector('meta[name="description"]'); if(metaDesc) metaDesc.setAttribute('content', (post.content||'').slice(0,140)); }catch(e){}
    // translate post detail
    const translateBtn = document.getElementById('translatePostBtn');
    if(translateBtn){
      translateBtn.addEventListener('click', async ()=>{
        const target = document.documentElement.getAttribute('data-lang') || 'en';
        const contentEl = document.getElementById('postContent');
        if(!contentEl) return;
        const cacheKey = 'mytravels_trans_cache';
        const cache = (()=>{ try{return JSON.parse(localStorage.getItem(cacheKey)||'{}')}catch(e){return{}} })();
        const pid = post.id;
        if(cache[pid] && cache[pid][target]){ contentEl.innerHTML = cache[pid][target].content; return; }
        translateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        try{
          const res = await fetch('https://libretranslate.com/translate',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ q: contentEl.innerText, source: 'auto', target: target, format:'text' }) });
          if(!res.ok) throw new Error('Translate error');
          const j = await res.json();
          const translated = j.translatedText || '';
          const safe = translated.replace(/\n/g,'<br>');
          contentEl.innerHTML = safe;
          cache[pid] = cache[pid] || {};
          cache[pid][target] = { content: safe, ts: Date.now() };
          try{ localStorage.setItem(cacheKey, JSON.stringify(cache)); }catch(e){}
        }catch(e){ alert(window.__mytravels_translations.translateError || 'Error translating post'); }
        translateBtn.textContent = window.__mytravels_translations.translate || 'Translate';
      });
    }

    function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  });
})();
