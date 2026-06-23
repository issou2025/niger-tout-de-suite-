/**
 * Niger Info Veille - Recherche et Filtrage
 */

const Search = {
  // État actuel des filtres
  filters: {
    query: '',
    category: '',
    source: '',
    date: 'all', // 'all', 'today', 'week', 'month'
    region: '',
    importance: '',
    sortBy: 'recent', // 'recent', 'ancien', 'source', 'category', 'importance'
    onlyBookmarked: false
  },

  /**
   * Initialise les liaisons d'événements pour les filtres et la recherche.
   */
  initializeFilters(sourcesArray) {
    // 1. Remplir le filtre des sources
    const sourceSelect = document.getElementById('filter-source');
    if (sourceSelect) {
      sourceSelect.innerHTML = '<option value="">Toutes les sources</option>';
      
      // Trier les sources par ordre alphabétique
      const sortedSources = [...sourcesArray].sort((a, b) => a.name.localeCompare(b.name));
      sortedSources.forEach(src => {
        const option = document.createElement('option');
        option.value = src.name;
        option.textContent = src.name;
        sourceSelect.appendChild(option);
      });
    }

    // 2. Remplir les filtres de catégorie dans le select s'il existe
    const categorySelect = document.getElementById('filter-category');
    if (categorySelect && typeof App !== 'undefined') {
      // Extraire les catégories uniques présentes dans les données
      const categories = [...new Set(App.newsData.map(item => item.category))].sort();
      categorySelect.innerHTML = '<option value="">Toutes les catégories</option>';
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    }

    // 3. Attacher les écouteurs d'événements
    
    // Recherche textuelle (Input)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.oninput = (e) => this.handleSearchInput(e.target.value);
    }

    // Bouton de réinitialisation de la recherche rapide
    const clearSearchBtn = document.getElementById('btn-clear-search');
    if (clearSearchBtn) {
      clearSearchBtn.onclick = () => {
        if (searchInput) searchInput.value = '';
        this.handleSearchInput('');
      };
    }

    // Select Catégorie
    if (categorySelect) {
      categorySelect.onchange = (e) => this.handleCategoryChange(e.target.value);
    }

    // Select Source
    if (sourceSelect) {
      sourceSelect.onchange = (e) => this.handleSourceChange(e.target.value);
    }

    // Select Date
    const dateSelect = document.getElementById('filter-date');
    if (dateSelect) {
      dateSelect.onchange = (e) => this.handleDateFilter(e.target.value);
    }

    // Select Tri
    const sortSelect = document.getElementById('filter-sort');
    if (sortSelect) {
      sortSelect.onchange = (e) => this.handleSortChange(e.target.value);
    }

    // Select Région
    const regionSelect = document.getElementById('filter-region');
    if (regionSelect) {
      regionSelect.onchange = (e) => {
        this.filters.region = e.target.value;
        this.applyFilters();
      };
    }

    // Select Importance
    const importanceSelect = document.getElementById('filter-importance');
    if (importanceSelect) {
      importanceSelect.onchange = (e) => {
        this.filters.importance = e.target.value;
        this.applyFilters();
      };
    }

    // Bouton Favoris uniquement
    const bookmarkToggle = document.getElementById('filter-bookmarks');
    if (bookmarkToggle) {
      bookmarkToggle.onclick = () => {
        this.filters.onlyBookmarked = !this.filters.onlyBookmarked;
        bookmarkToggle.classList.toggle('active', this.filters.onlyBookmarked);
        bookmarkToggle.innerHTML = this.filters.onlyBookmarked ? '❤️ Favoris' : '🤍 Filtrer favoris';
        this.applyFilters();
      };
    }

    // Navigation de catégories dans le menu/hero
    this.attachCategoryNavigation();
  },

  /**
   * Attache les clics sur les boutons de navigation par catégorie.
   */
  attachCategoryNavigation() {
    const navItems = document.querySelectorAll('.cat-nav-btn, .nav-menu-link-cat');
    navItems.forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        
        // Retirer la classe active de tous les autres boutons de la même liste
        navItems.forEach(btn => btn.classList.remove('active'));
        
        // Récupérer la catégorie ciblée
        const targetCategory = item.getAttribute('data-category') || '';
        this.filters.category = targetCategory;

        // Mettre en valeur le bouton cliqué
        item.classList.add('active');

        // Mettre à jour le select de catégorie pour rester synchronisé
        const categorySelect = document.getElementById('filter-category');
        if (categorySelect) {
          categorySelect.value = targetCategory;
        }

        // Faire défiler la page jusqu'au début de la grille
        const gridSection = document.getElementById('news-section-title');
        if (gridSection) {
          gridSection.scrollIntoView({ behavior: 'smooth' });
        }

        this.applyFilters();
      };
    });
  },

  /**
   * Gère la saisie dans la barre de recherche textuelle.
   */
  handleSearchInput(value) {
    this.filters.query = value;
    this.applyFilters();
  },

  /**
   * Gère le changement de catégorie depuis le select ou boutons.
   */
  handleCategoryChange(category) {
    this.filters.category = category;
    
    // Mettre à jour la classe active sur les boutons de catégories pour correspondre
    const navItems = document.querySelectorAll('.cat-nav-btn, .nav-menu-link-cat');
    navItems.forEach(btn => {
      const btnCat = btn.getAttribute('data-category') || '';
      btn.classList.toggle('active', btnCat === category);
    });

    this.applyFilters();
  },

  /**
   * Gère le changement de source.
   */
  handleSourceChange(source) {
    this.filters.source = source;
    this.applyFilters();
  },

  /**
   * Gère le filtre par date.
   */
  handleDateFilter(dateFilter) {
    this.filters.date = dateFilter;
    this.applyFilters();
  },

  /**
   * Gère le changement de tri.
   */
  handleSortChange(sortValue) {
    this.filters.sortBy = sortValue;
    this.applyFilters();
  },

  /**
   * Réinitialise tous les filtres à leur état par défaut.
   */
  resetFilters() {
    this.filters = {
      query: '',
      category: '',
      source: '',
      date: 'all',
      region: '',
      importance: '',
      sortBy: 'recent',
      onlyBookmarked: false
    };

    // Mettre à jour les éléments de formulaire graphiques
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const categorySelect = document.getElementById('filter-category');
    if (categorySelect) categorySelect.value = '';

    const sourceSelect = document.getElementById('filter-source');
    if (sourceSelect) sourceSelect.value = '';

    const dateSelect = document.getElementById('filter-date');
    if (dateSelect) dateSelect.value = 'all';

    const regionSelect = document.getElementById('filter-region');
    if (regionSelect) regionSelect.value = '';

    const importanceSelect = document.getElementById('filter-importance');
    if (importanceSelect) importanceSelect.value = '';

    const sortSelect = document.getElementById('filter-sort');
    if (sortSelect) sortSelect.value = 'recent';

    const bookmarkToggle = document.getElementById('filter-bookmarks');
    if (bookmarkToggle) {
      bookmarkToggle.classList.remove('active');
      bookmarkToggle.innerHTML = '🤍 Filtrer favoris';
    }

    // Réinitialiser les classes actives des boutons de catégories
    const navItems = document.querySelectorAll('.cat-nav-btn, .nav-menu-link-cat');
    navItems.forEach(btn => {
      const btnCat = btn.getAttribute('data-category') || '';
      btn.classList.toggle('active', btnCat === '');
    });

    this.applyFilters();
  },

  /**
   * Applique le filtrage croisé cumulatif sur les données.
   */
  applyFilters() {
    if (typeof App === 'undefined') return;

    let filtered = [...App.newsData];

    // 1. Filtrage textuel (Query)
    if (this.filters.query.trim() !== '') {
      const normQuery = Utils.normalizeText(this.filters.query);
      filtered = filtered.filter(item => {
        const title = Utils.normalizeText(item.title);
        const summary = Utils.normalizeText(item.summary);
        const sourceName = Utils.normalizeText(item.sourceName);
        const category = Utils.normalizeText(item.category);
        const tags = item.tags ? item.tags.map(t => Utils.normalizeText(t)).join(' ') : '';
        const region = item.region ? Utils.normalizeText(item.region) : '';

        return title.includes(normQuery) || 
               summary.includes(normQuery) || 
               sourceName.includes(normQuery) || 
               category.includes(normQuery) || 
               tags.includes(normQuery) || 
               region.includes(normQuery);
      });
    }

    // 2. Filtrage par catégorie
    if (this.filters.category !== '') {
      if (this.filters.category === 'alaune') {
        filtered = filtered.filter(item => item.importance >= 3);
      } else {
        filtered = filtered.filter(item => item.category === this.filters.category);
      }
    }

    // 2.2. Filtrage par région
    if (this.filters.region !== '') {
      filtered = filtered.filter(item => item.region === this.filters.region);
    }

    // 2.3. Filtrage par importance
    if (this.filters.importance !== '') {
      const minImportance = parseInt(this.filters.importance);
      filtered = filtered.filter(item => item.importance >= minImportance);
    }

    // 3. Filtrage par source
    if (this.filters.source !== '') {
      filtered = filtered.filter(item => item.sourceName === this.filters.source);
    }

    // 4. Filtrage par date
    if (this.filters.date !== 'all') {
      const now = new Date();
      filtered = filtered.filter(item => {
        const pubDate = new Date(item.publishedAt);
        const diffMs = now - pubDate;
        
        switch (this.filters.date) {
          case 'today':
            // moins de 24h
            return diffMs <= 24 * 60 * 60 * 1000;
          case 'week':
            // moins de 7 jours
            return diffMs <= 7 * 24 * 60 * 60 * 1000;
          case 'month':
            // moins de 30 jours
            return diffMs <= 30 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    // 5. Filtrage par favoris uniquement
    if (this.filters.onlyBookmarked) {
      const savedIds = Bookmarks.getBookmarks();
      filtered = filtered.filter(item => savedIds.includes(item.id));
    }

    // 6. Tri
    filtered = Utils.sortNews(filtered, this.filters.sortBy);

    // Mettre à jour l'application avec les données filtrées
    App.filteredNews = filtered;
    App.currentPage = 1; // Réinitialiser à la première page
    
    // Mettre à jour l'affichage
    App.renderCurrentState();

    // Mettre à jour le compteur de résultats
    const countEl = document.getElementById('results-count');
    if (countEl) {
      countEl.innerText = `${filtered.length} information${filtered.length > 1 ? 's' : ''} trouvée${filtered.length > 1 ? 's' : ''}`;
    }
  }
};
