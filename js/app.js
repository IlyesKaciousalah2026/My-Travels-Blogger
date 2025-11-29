(function(){
  // Theme initialization and toggle
  const THEME_KEY = 'mytravels_theme';
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
    const btn = document.getElementById('themeToggle'); if(btn) btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
  }

  // Apply initial theme: stored -> prefers-color-scheme -> light
  (function initTheme(){
    try{
      const stored = localStorage.getItem(THEME_KEY);
      if(stored){ document.documentElement.setAttribute('data-theme', stored); }
      else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme','dark');
      } else {
        document.documentElement.setAttribute('data-theme','light');
      }
    }catch(e){ document.documentElement.setAttribute('data-theme','light'); }
  })();

  document.addEventListener('DOMContentLoaded', function(){
    const themeBtn = document.getElementById('themeToggle');
    const langBtn = document.getElementById('langToggle');
    if(themeBtn){
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      themeBtn.innerHTML = current === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
      themeBtn.addEventListener('click', function(){
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }

    // Language support (10 languages: EN, ES, FR, DE, IT, PT, AR, JA, ZH, RU)
    const LANG_KEY = 'mytravels_lang';
    const langs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'ja', 'zh', 'ru'];
    function applyLang(lang){
      document.documentElement.setAttribute('data-lang', lang);
      // Set RTL for Arabic, set LTR for others
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
      try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
      translateUI(lang);
      const lb = document.getElementById('langLabel'); if(lb) lb.textContent = (lang || '').toUpperCase();
      // mark active item in dropdown
      const dropdownItems = document.querySelectorAll('.dropdown-menu a[data-lang]');
      dropdownItems.forEach(it=>{ if(it.getAttribute('data-lang')===lang) it.classList.add('active'); else it.classList.remove('active'); });
      // Re-render posts/cards so dynamic attributes (titles/aria) update to new language
      try{ if(typeof render === 'function') render(); }catch(e){}
    }
    function translateUI(lang){
      const t = {
        en: { clearConfirm:'Remove all posts? This cannot be undone.', deleteConfirm:'Delete this post?', deleteLabel:'Delete', openPost:'Open post', translate:'Translate', translateError:'Error translating post', revert:'Revert', translating:'Translating...', pleaseWrite:'Please write something.', newPost:'New Post', emptyNote:'No posts yet — click "New Post" to add your first travel story.', savePost:'Save post', cancel:'Cancel', clearAll:'Clear all', title:'Title', story:'Story', photos:'Photos (optional)', imageUrls:'Or enter image URLs (one per line)', modalTitle:'New Travel Post', search:'Search posts...', newest:'Newest first', oldest:'Oldest first', brand:'My Travels', heroTitle:'My Travels', heroLead:'Capture your travel stories with photos and keep them locally. Beautiful layout, easy posting.', tag1:'Photography', tag2:'Adventures', tag3:'Food & Culture', titlePlaceholder:'e.g. Road trip to Amalfi Coast', contentPlaceholder:'Write your travel story...', fabTitle:'New post', footer:'© 2025 My Travels. All rights reserved.', home:'Home', untitled:'Untitled', untitledTrip:'Untitled trip', errorReadingImages:'Error reading images', filesSelected:'{n} file(s) selected', urlsProvided:'{n} URL(s) provided', toggleTheme:'Toggle theme' },
        es: { clearConfirm:'¿Eliminar todas las publicaciones? Esto no se puede deshacer.', deleteConfirm:'¿Eliminar esta publicación?', deleteLabel:'Eliminar', openPost:'Abrir publicación', translate:'Traducir', translateError:'Error al traducir la publicación', revert:'Revertir', translating:'Traduciendo...', pleaseWrite:'Por favor escribe algo.', newPost:'Nueva publicación', emptyNote:'Aún no hay publicaciones — haz clic en "Nueva publicación" para agregar tu primera historia.', savePost:'Guardar', cancel:'Cancelar', clearAll:'Limpiar todo', title:'Título', story:'Historia', photos:'Fotos (opcional)', imageUrls:'O ingresa URLs de imágenes (una por línea)', modalTitle:'Nueva publicación de viaje', search:'Buscar publicaciones...', newest:'Más reciente', oldest:'Más antiguo', brand:'Mis Viajes', heroTitle:'Mis Viajes', heroLead:'Captura tus historias de viaje con fotos y guárdalas localmente. Diseño bonito, publicación sencilla.', tag1:'Fotografía', tag2:'Aventuras', tag3:'Comida y Cultura', titlePlaceholder:'p. ej. Viaje por la Costa Amalfitana', contentPlaceholder:'Escribe tu historia de viaje...', fabTitle:'Nuevo', footer:'© 2025 Mis Viajes. Todos los derechos reservados.', home:'Inicio', untitled:'Sin título', untitledTrip:'Viaje sin título', errorReadingImages:'Error al leer las imágenes', filesSelected:'{n} archivo(s) seleccionado(s)', urlsProvided:'{n} URL(s) proporcionada(s)', toggleTheme:'Alternar tema' },
        fr: { clearConfirm:'Supprimer tous les messages ? Cela ne peut pas être annulé.', deleteConfirm:'Supprimer ce message ?', deleteLabel:'Supprimer', openPost:'Ouvrir le message', pleaseWrite:'Veuillez écrire quelque chose.', newPost:'Nouveau message', emptyNote:'Aucun message pour le moment — cliquez sur "Nouveau message" pour ajouter votre première histoire de voyage.', savePost:'Enregistrer', cancel:'Annuler', clearAll:'Effacer tout', title:'Titre', story:'Histoire', photos:'Photos (facultatif)', imageUrls:'Ou entrez les URL des images (une par ligne)', modalTitle:'Nouveau message de voyage', search:'Rechercher des messages...', newest:'Plus récent', oldest:'Plus ancien', brand:'Mes Voyages', heroTitle:'Mes Voyages', heroLead:'Capturez vos récits de voyage avec des photos et conservez-les localement. Mise en page élégante, publication facile.', tag1:'Photographie', tag2:'Aventures', tag3:'Nourriture & Culture', titlePlaceholder:'ex. Road trip sur la côte amalfitaine', contentPlaceholder:'Écrivez votre récit de voyage...', fabTitle:'Nouveau', footer:'© 2025 Mes Voyages. Tous droits réservés.', home:'Accueil', untitled:'Sans titre', untitledTrip:'Voyage sans titre', errorReadingImages:'Erreur de lecture des images', filesSelected:'{n} fichier(s) sélectionné(s)', urlsProvided:'{n} URL(s) fournies', toggleTheme:'Basculer le thème' },
        de: { clearConfirm:'Alle Beiträge entfernen? Dies kann nicht rückgängig gemacht werden.', deleteConfirm:'Diesen Beitrag löschen?', deleteLabel:'Löschen', openPost:'Beitrag öffnen', pleaseWrite:'Bitte schreibe etwas.', newPost:'Neuer Beitrag', emptyNote:'Noch keine Beiträge — klicke auf "Neuer Beitrag", um deine erste Reisegeschichte hinzuzufügen.', savePost:'Speichern', cancel:'Abbrechen', clearAll:'Alles löschen', title:'Titel', story:'Geschichte', photos:'Fotos (optional)', imageUrls:'Oder geben Sie Bild-URLs ein (eine pro Zeile)', modalTitle:'Neuer Reisebeitrag', search:'Beiträge durchsuchen...', newest:'Neueste zuerst', oldest:'Älteste zuerst', brand:'Meine Reisen', heroTitle:'Meine Reisen', heroLead:'Erfasse deine Reisegeschichten mit Fotos und bewahre sie lokal. Schönes Layout, einfache Veröffentlichung.', tag1:'Fotografie', tag2:'Abenteuer', tag3:'Essen & Kultur', titlePlaceholder:'z. B. Roadtrip an die Amalfiküste', contentPlaceholder:'Schreiben Sie Ihre Reisegeschichte...', fabTitle:'Neu', footer:'© 2025 Meine Reisen. Alle Rechte vorbehalten.', home:'Startseite', untitled:'Ohne Titel', untitledTrip:'Unbenannte Reise', errorReadingImages:'Fehler beim Lesen der Bilder', filesSelected:'{n} Datei(en) ausgewählt', urlsProvided:'{n} URL(s) bereitgestellt', toggleTheme:'Design umschalten' },
        it: { clearConfirm:'Rimuovere tutti i post? Non è possibile annullare.', deleteConfirm:'Eliminare questo post?', deleteLabel:'Elimina', openPost:'Apri post', pleaseWrite:'Scrivi qualcosa.', newPost:'Nuovo post', emptyNote:'Nessun post ancora — fai clic su "Nuovo post" per aggiungere la tua prima storia di viaggio.', savePost:'Salva', cancel:'Annulla', clearAll:'Cancella tutto', title:'Titolo', story:'Storia', photos:'Foto (opzionale)', imageUrls:'Oppure inserisci gli URL delle immagini (uno per riga)', modalTitle:'Nuovo post di viaggio', search:'Cerca post...', newest:'Più recente', oldest:'Più vecchio', brand:'I miei viaggi', heroTitle:'I miei viaggi', heroLead:'Cattura i tuoi racconti di viaggio con foto e conservali localmente. Layout bello, pubblicazione semplice.', tag1:'Fotografia', tag2:'Avventure', tag3:'Cibo e Cultura', titlePlaceholder:'es. Viaggio sulla Costiera Amalfitana', contentPlaceholder:'Scrivi la tua storia di viaggio...', fabTitle:'Nuovo', footer:'© 2025 I miei viaggi. Tutti i diritti riservati.', home:'Home', untitled:'Senza titolo', untitledTrip:'Viaggio senza titolo', errorReadingImages:'Errore nella lettura delle immagini', filesSelected:'{n} file selezionato(i)', urlsProvided:'{n} URL fornita(i)', toggleTheme:'Attiva tema' },
        pt: { clearConfirm:'Remover todas as postagens? Isto não pode ser desfeito.', deleteConfirm:'Excluir esta postagem?', deleteLabel:'Excluir', openPost:'Abrir postagem', pleaseWrite:'Escreva algo.', newPost:'Nova postagem', emptyNote:'Nenhuma postagem ainda — clique em "Nova postagem" para adicionar sua primeira história de viagem.', savePost:'Guardar', cancel:'Cancelar', clearAll:'Limpar tudo', title:'Título', story:'História', photos:'Fotos (opcional)', imageUrls:'Ou insira URLs de imagens (um por linha)', modalTitle:'Nova postagem de viagem', search:'Pesquisar postagens...', newest:'Mais recente', oldest:'Mais antigo', brand:'Minhas Viagens', heroTitle:'Minhas Viagens', heroLead:'Capture suas histórias de viagem com fotos e mantenha-as localmente. Layout bonito, publicação simples.', tag1:'Fotografia', tag2:'Aventuras', tag3:'Comida e Cultura', titlePlaceholder:'ex. Viagem pela Costa Amalfitana', contentPlaceholder:'Escreva sua história de viagem...', fabTitle:'Novo', footer:'© 2025 Minhas Viagens. Todos os direitos reservados.', home:'Início', untitled:'Sem título', untitledTrip:'Viagem sem título', errorReadingImages:'Erro ao ler imagens', filesSelected:'{n} arquivo(s) selecionado(s)', urlsProvided:'{n} URL(s) fornecida(s)', toggleTheme:'Alternar tema' },
        ar: { clearConfirm:'إزالة جميع المنشورات؟ لا يمكن التراجع عن هذا.', deleteConfirm:'حذف هذا المنشور؟', deleteLabel:'حذف', openPost:'فتح المنشور', pleaseWrite:'يرجى كتابة شيء ما.', newPost:'منشور جديد', emptyNote:'لا توجد منشورات حتى الآن — انقر على "منشور جديد" لإضافة أول قصة سفر لك.', savePost:'حفظ', cancel:'إلغاء', clearAll:'حذف الكل', title:'العنوان', story:'القصة', photos:'الصور (اختياري)', imageUrls:'أو أدخل عناوين URL للصور (واحد لكل سطر)', modalTitle:'منشور سفر جديد', search:'البحث عن منشورات...', newest:'الأحدث أولاً', oldest:'الأقدم أولاً', brand:'رحلاتي', heroTitle:'رحلاتي', heroLead:'التقط قصص سفرك بالصور واحتفظ بها محليًا. تخطيط جميل، ونشر سهل.', tag1:'التصوير', tag2:'المغامرات', tag3:'الطعام والثقافة', titlePlaceholder:'مثال: رحلة على طول ساحل أمالفي', contentPlaceholder:'اكتب قصة سفرك...', fabTitle:'جديد', footer:'© 2025 رحلاتي. جميع الحقوق محفوظة.', home:'الرئيسية', untitled:'بدون عنوان', untitledTrip:'رحلة بدون عنوان', errorReadingImages:'خطأ في قراءة الصور', filesSelected:'تم تحديد {n} ملف(ملفات)', urlsProvided:'تم إدخال {n} رابط(روابط)', toggleTheme:'تبديل المظهر' },
        ja: { clearConfirm:'すべての投稿を削除しますか？これは取り消せません。', deleteConfirm:'この投稿を削除しますか？', deleteLabel:'削除', openPost:'投稿を開く', pleaseWrite:'何か書いてください。', newPost:'新しい投稿', emptyNote:'まだ投稿がありません — "新しい投稿"をクリックして、最初の旅の物語を追加してください。', savePost:'保存', cancel:'キャンセル', clearAll:'すべてクリア', title:'タイトル', story:'ストーリー', photos:'写真（オプション）', imageUrls:'画像URLを入力してください（1行に1つ）', modalTitle:'新しい旅行投稿', search:'投稿を検索...', newest:'最新順', oldest:'最古順', brand:'私の旅', heroTitle:'私の旅', heroLead:'写真で旅行の物語を残し、ローカルに保存します。美しいレイアウト、簡単な投稿。', tag1:'写真', tag2:'冒険', tag3:'食べ物と文化', titlePlaceholder:'例：アマルフィ海岸へのロードトリップ', contentPlaceholder:'旅行の物語を書いてください...', fabTitle:'新規', footer:'© 2025 私の旅。無断転載を禁じます。', home:'ホーム', untitled:'無題', untitledTrip:'無題の旅', errorReadingImages:'画像の読み取り中にエラーが発生しました', filesSelected:'{n} 個のファイルが選択されました', urlsProvided:'{n} 個のURLが提供されました', toggleTheme:'テーマを切り替える' },
        zh: { clearConfirm:'删除所有帖子？这无法撤销。', deleteConfirm:'删除此帖子？', deleteLabel:'删除', openPost:'打开帖子', pleaseWrite:'请写些内容。', newPost:'新帖子', emptyNote:'还没有帖子 — 点击"新帖子"来添加您的第一个旅行故事。', savePost:'保存', cancel:'取消', clearAll:'清空全部', title:'标题', story:'故事', photos:'照片（可选）', imageUrls:'或输入图像URL（每行一个）', modalTitle:'新旅行帖子', search:'搜索帖子...', newest:'最新优先', oldest:'最旧优先', brand:'我的旅行', heroTitle:'我的旅行', heroLead:'用照片记录您的旅行故事并保存在本地。漂亮的布局，轻松发布。', tag1:'摄影', tag2:'冒险', tag3:'美食与文化', titlePlaceholder:'例如：亚马尔菲海岸公路旅行', contentPlaceholder:'写下您的旅行故事...', fabTitle:'新建', footer:'© 2025 我的旅行。保留所有权利。', home:'首页', untitled:'无标题', untitledTrip:'无标题之旅', errorReadingImages:'读取图像时出错', filesSelected:'已选择 {n} 个文件', urlsProvided:'已提供 {n} 个 URL', toggleTheme:'切换主题' },
        ru: { clearConfirm:'Удалить все посты? Это не может быть отменено.', deleteConfirm:'Удалить этот пост?', deleteLabel:'Удалить', openPost:'Открыть пост', pleaseWrite:'Пожалуйста, напишите что-нибудь.', newPost:'Новый пост', emptyNote:'Пока нет постов — нажмите на "Новый пост", чтобы добавить свою первую историю путешествия.', savePost:'Сохранить', cancel:'Отмена', clearAll:'Очистить все', title:'Название', story:'История', photos:'Фотографии (опционально)', imageUrls:'Или введите URL изображений (по одному на строке)', modalTitle:'Новый пост о путешествии', search:'Поиск постов...', newest:'Новые первыми', oldest:'Старые первыми', brand:'Мои путешествия', heroTitle:'Мои путешествия', heroLead:'Записывайте свои путешествия с фотографиями и храните их локально. Красивый макет, простая публикация.', tag1:'Фотография', tag2:'Приключения', tag3:'Еда и культура', titlePlaceholder:'напр. Дорога к Амальфийскому побережью', contentPlaceholder:'Напишите свою историю путешествия...', fabTitle:'Новый', footer:'© 2025 Мои путешествия. Все права защищены.', home:'Главная', untitled:'Без названия', untitledTrip:'Безымянная поездка', errorReadingImages:'Ошибка чтения изображений', filesSelected:'{n} файл(а) выбран(ы)', urlsProvided:'{n} URL(ов) предоставлено(ы)', toggleTheme:'Переключить тему' }
      }[lang] || {};
      const newPostLabel = document.getElementById('btnNewPostLabel'); if(newPostLabel) newPostLabel.textContent = t.newPost || 'New Post';
      const clearAllLabel = document.getElementById('clearAllLabel'); if(clearAllLabel) clearAllLabel.textContent = t.clearAll || 'Clear all';
      const emptyNote = document.getElementById('emptyNote'); if(emptyNote) emptyNote.textContent = t.emptyNote || emptyNote.textContent;
      const modalTitle = document.getElementById('modalTitle'); if(modalTitle) modalTitle.textContent = t.modalTitle || 'New Travel Post';
      const labelTitle = document.getElementById('labelTitle'); if(labelTitle) labelTitle.textContent = t.title || 'Title';
      const labelStory = document.getElementById('labelStory'); if(labelStory) labelStory.textContent = t.story || 'Story';
      const labelPhotos = document.getElementById('labelPhotos'); if(labelPhotos) labelPhotos.textContent = t.photos || 'Photos (optional)';
      const labelImageUrls = document.getElementById('labelImageUrls'); if(labelImageUrls) labelImageUrls.textContent = t.imageUrls || 'Or enter image URLs (one per line)';
      const btnCancel = document.getElementById('btnCancel'); if(btnCancel) btnCancel.textContent = t.cancel || 'Cancel';
      const btnSavePost = document.getElementById('btnSavePost'); if(btnSavePost) btnSavePost.textContent = t.savePost || 'Save post';
      const saveBtns = document.querySelectorAll('.modal-footer .btn-primary'); saveBtns.forEach(b=>{ b.textContent = t.savePost || b.textContent });
      const cancelBtns = document.querySelectorAll('.modal-footer .btn-outline-secondary'); cancelBtns.forEach(b=>{ b.textContent = t.cancel || b.textContent });
      const searchInput = document.getElementById('search'); if(searchInput) searchInput.placeholder = t.search || 'Search posts...';
      const sortNewest = document.getElementById('sortNewest'); if(sortNewest) sortNewest.textContent = t.newest || 'Newest first';
      const sortOldest = document.getElementById('sortOldest'); if(sortOldest) sortOldest.textContent = t.oldest || 'Oldest first';
      // Additional UI pieces
      const brandLabel = document.getElementById('brandLabel'); if(brandLabel) brandLabel.textContent = t.brand || 'My Travels';
      try{ if(document && typeof document.title !== 'undefined') document.title = t.brand || document.title; const metaDesc = document.querySelector('meta[name="description"]'); if(metaDesc && t.metaDescription) metaDesc.setAttribute('content', t.metaDescription); }catch(e){}
      const heroTitle = document.getElementById('heroTitle'); if(heroTitle) heroTitle.textContent = t.heroTitle || 'My Travels';
      const heroLeadEl = document.getElementById('heroLead'); if(heroLeadEl) heroLeadEl.textContent = t.heroLead || heroLeadEl.textContent;
      const tag1 = document.getElementById('tag1'); if(tag1) tag1.textContent = t.tag1 || 'Photography';
      const tag2 = document.getElementById('tag2'); if(tag2) tag2.textContent = t.tag2 || 'Adventures';
      const tag3 = document.getElementById('tag3'); if(tag3) tag3.textContent = t.tag3 || 'Food & Culture';
      const titleInput = document.getElementById('title'); if(titleInput) titleInput.placeholder = t.titlePlaceholder || 'e.g. Road trip to Amalfi Coast';
      const contentInput = document.getElementById('content'); if(contentInput) contentInput.placeholder = t.contentPlaceholder || 'Write your travel story...';
      const fab = document.getElementById('fabNewPost'); if(fab) { fab.title = t.fabTitle || 'New post'; fab.setAttribute('aria-label', t.fabTitle || 'New post'); }
      const footer = document.getElementById('footerCopyright'); if(footer) footer.textContent = t.footer || footer.textContent;
      const themeBtn = document.getElementById('themeToggle'); if(themeBtn) themeBtn.title = t.toggleTheme || 'Toggle theme';
      // expose translations globally for other modules
      window.__mytravels_translations = t;
    }

    // init language
    try{ const storedLang = localStorage.getItem(LANG_KEY) || 'en'; applyLang(storedLang); }catch(e){ applyLang('en'); }
    if(langBtn){
      // Set visible label inside the dropdown toggle
      const label = document.getElementById('langLabel');
      if(label) label.textContent = (document.documentElement.getAttribute('data-lang') || 'en').toUpperCase();
      // Wire dropdown items (they have data-lang attributes)
      const dropdownItems = document.querySelectorAll('.dropdown-menu a[data-lang]');
      dropdownItems.forEach(item => {
        item.addEventListener('click', (e)=>{
          e.preventDefault();
          const lang = item.getAttribute('data-lang');
          if(!lang) return;
          applyLang(lang);
          const lbl = document.getElementById('langLabel'); if(lbl) lbl.textContent = item.textContent || lang.toUpperCase();
        });
      });
    }

    // Main app (posts)
    const STORAGE_KEY = 'mytravels_posts_v3';
    const form = document.getElementById('postForm');
    const titleEl = document.getElementById('title');
    const contentEl = document.getElementById('content');
    const imagesEl = document.getElementById('images');
    const imageUrlsEl = document.getElementById('imageUrls');
    const previewContainer = document.getElementById('previewContainer');
    const previewInfo = document.getElementById('previewInfo');
    const postsContainer = document.getElementById('postsContainer');
    const emptyNote = document.getElementById('emptyNote');
    const clearAllBtn = document.getElementById('clearAll');
    const searchEl = document.getElementById('search');
    const sortEl = document.getElementById('sort');
    const modalEl = document.getElementById('postModal');
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);

    function readPosts(){ try { const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); // normalize older format where `img` was a string
          return raw.map(p => ({
            ...p,
            images: Array.isArray(p.images) ? p.images : (p.img ? (Array.isArray(p.img) ? p.img : [p.img]) : (p.images || []))
          }));
        } catch(e) { return []; } }
    function savePosts(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

    function seedPostsIfEmpty(){
      const existing = readPosts();
      if(existing.length) return;
      // No seed posts - start with empty array
      savePosts([]);
    }

    function escapeHtml(s){
      return String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function render(){
      const q = (searchEl.value || '').toLowerCase();
      let posts = readPosts().slice();
      posts.sort((a,b)=> sortEl.value === 'old' ? new Date(a.date)-new Date(b.date) : new Date(b.date)-new Date(a.date));
      posts = posts.filter(p => (p.title + ' ' + p.content).toLowerCase().includes(q));
      postsContainer.innerHTML = '';
      emptyNote.style.display = posts.length ? 'none' : '';
      if(!posts.length) return;
      const T = window.__mytravels_translations || {};
      posts.forEach(p=>{
        const div = document.createElement('div');
        div.className = 'col-12 col-md-6 col-xl-4';
        // Make whole card clickable by placing a stretched-link inside the card
        const postHref = `post.html?id=${encodeURIComponent(p.id)}`;
        const thumb = (p.images && p.images.length) ? p.images[0] : '';
        const deleteTitle = T.deleteLabel || 'Delete';
        const openLabel = T.openPost || 'Open post';
        const unt = T.untitled || 'Untitled';
        div.innerHTML = [
          '<div class="card card-travel h-100 shadow-sm">',
            thumb ? `<img src="${thumb}" class="card-img-top" alt="post image">` : '',
            '<div class="card-body d-flex flex-column">',
              '<div class="d-flex justify-content-between align-items-start mb-2">',
                `<h5 class="card-title mb-0">${escapeHtml(p.title || unt)}</h5>`,
                `<small class="text-muted small">${new Date(p.date).toLocaleDateString()}</small>`,
              '</div>',
              `<p class="card-text text-muted mb-3" style="flex:1">${escapeHtml(p.content).replace(/\\n/g,'<br>')}</p>`,
              '<div class="d-flex gap-2 justify-content-end">',
                `<button class="btn btn-sm btn-outline-secondary translate-btn" data-id="${p.id}" title="${escapeHtml(T.translate || 'Translate')}"><i class="bi bi-arrow-repeat"></i></button>`,
                `<button class="btn btn-sm btn-outline-danger delete-btn" data-id="${p.id}" title="${escapeHtml(deleteTitle)}"><i class="bi bi-trash"></i></button>`,
              '</div>',
            '</div>',
            // stretched-link must be inside the card and the card positioned relative
            `<a class="stretched-link" href="${postHref}" aria-label="${escapeHtml(openLabel)}"></a>`,
          '</div>'
        ].join('');
        // delete button listener (stop link navigation)
        const delBtn = div.querySelector('.delete-btn');
        if(delBtn){
          delBtn.addEventListener('click', (ev)=>{
            ev.preventDefault(); ev.stopPropagation();
            const t = window.__mytravels_translations || { deleteConfirm: 'Delete this post?' };
            if(!confirm(t.deleteConfirm || 'Delete this post?')) return;
            deletePost(p.id);
          });
        }
        // translate button listener
        const trBtn = div.querySelector('.translate-btn');
        if(trBtn){
          trBtn.addEventListener('click', async (ev)=>{
            ev.preventDefault(); ev.stopPropagation();
            const lang = document.documentElement.getAttribute('data-lang') || 'en';
            await translateCard(p.id, lang, div);
          });
        }
        postsContainer.appendChild(div);
      });
    }

    // Simple client-side translation using LibreTranslate public instance.
    async function translateTextAPI(text, target){
      try{
        const res = await fetch('https://libretranslate.com/translate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: text, source: 'auto', target: target, format: 'text' })
        });
        if(!res.ok) throw new Error('Translate API error');
        const j = await res.json();
        return j.translatedText || '';
      }catch(e){ throw e; }
    }

    function getTransCache(){ try{ return JSON.parse(localStorage.getItem('mytravels_trans_cache')||'{}'); }catch(e){return{}} }
    function setTransCache(obj){ try{ localStorage.setItem('mytravels_trans_cache', JSON.stringify(obj)); }catch(e){}
    }

    async function translateCard(id, targetLang, cardEl){
      const T = window.__mytravels_translations || {};
      const txtEl = cardEl.querySelector('.card-text');
      if(!txtEl) return;
      const cache = getTransCache();
      cache[id] = cache[id] || {};
      if(cache[id][targetLang]){ // use cached
        txtEl.innerHTML = cache[id][targetLang].content || txtEl.innerHTML;
        return;
      }
      const orig = txtEl.getAttribute('data-original') || txtEl.innerHTML;
      txtEl.setAttribute('data-original', orig);
      const btn = cardEl.querySelector('.translate-btn');
      const prev = btn && btn.innerHTML;
      if(btn) btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      try{
        const translated = await translateTextAPI(orig.replace(/<br>/g,'\\n'), targetLang);
        const safe = escapeHtml(translated).replace(/\n/g,'<br>');
        txtEl.innerHTML = safe;
        cache[id][targetLang] = { content: safe, ts: Date.now() };
        setTransCache(cache);
      }catch(e){ alert(T.translateError || 'Error translating post'); }
      if(btn) btn.innerHTML = prev;
    }

    function deletePost(id){ const all = readPosts().filter(x => x.id !== id); savePosts(all); render(); }

    function clearAll(){ const t = window.__mytravels_translations || {}; if(!confirm(t.clearConfirm || 'Remove all posts? This cannot be undone.')) return; try{ localStorage.setItem(STORAGE_KEY, JSON.stringify([])); }catch(e){ localStorage.removeItem(STORAGE_KEY); } render(); }

    function resetForm(){ form.reset(); preview.style.display = 'none'; preview.src = ''; previewInfo.textContent = ''; }

    // preview multiple selected files and show URLs
    function clearPreview(){ previewContainer.innerHTML = ''; previewInfo.textContent = ''; }
    imagesEl.addEventListener('change', e=>{
      clearPreview();
      const files = Array.from(e.target.files || []);
      if(!files.length) return;
      files.forEach(f=>{
        const reader = new FileReader();
        reader.onload = function(ev){
          const img = document.createElement('img'); img.src = ev.target.result; img.style.width='96px'; img.style.height='64px'; img.style.objectFit='cover'; img.style.borderRadius='6px'; img.className='me-2 mb-2';
          previewContainer.appendChild(img);
        };
        reader.readAsDataURL(f);
      });
      const T = window.__mytravels_translations || {};
      const filesTpl = T.filesSelected || '{n} file(s) selected';
      previewInfo.textContent = filesTpl.replace('{n}', files.length);
    });
    imageUrlsEl.addEventListener('input', e=>{
      // show URL previews
      const lines = (e.target.value||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      // remove existing URL previews (we'll show all)
      // keep file previews too
      // First remove existing url-preview class
      Array.from(previewContainer.querySelectorAll('.url-preview')).forEach(n=>n.remove());
      lines.forEach(url=>{
        const img = document.createElement('img'); img.src = url; img.className='url-preview me-2 mb-2'; img.style.width='96px'; img.style.height='64px'; img.style.objectFit='cover'; img.style.borderRadius='6px';
        previewContainer.appendChild(img);
      });
      if(lines.length){
        const T = window.__mytravels_translations || {};
        const filesTpl = T.filesSelected || '{n} file(s) selected';
        const urlsTpl = T.urlsProvided || '{n} URL(s) provided';
        const filesPart = imagesEl.files.length ? (filesTpl.replace('{n}', imagesEl.files.length) + ', ') : '';
        previewInfo.textContent = filesPart + urlsTpl.replace('{n}', lines.length);
      }
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      const title = titleEl.value.trim();
      const content = contentEl.value.trim();
      if(!content) { const t = window.__mytravels_translations || {}; alert(t.pleaseWrite || 'Please write something.'); return; }
        const files = Array.from(imagesEl.files || []);
        const urls = (imageUrlsEl.value||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
        function createPostWithImages(imagesArr){
          const posts = readPosts();
          const T = window.__mytravels_translations || {};
          posts.push({ id: Date.now() + '-' + Math.random().toString(36).slice(2,8), title: title || (T.untitledTrip || 'Untitled trip'), content: content, images: imagesArr, date: new Date().toISOString() });
          savePosts(posts); resetForm(); bsModal.hide(); render();
        }
        if(files.length){
          // read all files as data URLs
          Promise.all(files.map(f=> new Promise((res,rej)=>{ const r=new FileReader(); r.onload=ev=>res(ev.target.result); r.onerror=err=>rej(err); r.readAsDataURL(f); })))
            .then(results=>{ const imagesArr = results.concat(urls); createPostWithImages(imagesArr); })
            .catch(()=>{ const T = window.__mytravels_translations || {}; alert(T.errorReadingImages || 'Error reading images'); });
        } else {
          createPostWithImages(urls);
        }
    });

    clearAllBtn.addEventListener('click', clearAll);
    searchEl.addEventListener('input', render);
    sortEl.addEventListener('change', render);

    // seed and initial render
    seedPostsIfEmpty();
    render();

  });

})();
