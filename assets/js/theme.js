/**
 * Niger Info Veille - Gestion du Thème (Clair/Sombre)
 */

const Theme = {
  STORAGE_KEY: 'niv-theme-preference',
  THEME_DARK: 'dark',
  THEME_LIGHT: 'light',

  /**
   * Initialise le thème au chargement de la page.
   * Lit le choix précédent de l'utilisateur ou détecte la préférence système.
   */
  initTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else {
      // Détecter la préférence du système
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = systemPrefersDark ? this.THEME_DARK : this.THEME_LIGHT;
      this.applyTheme(defaultTheme);
    }
  },

  /**
   * Bascule le thème actuel entre clair et sombre.
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || this.THEME_LIGHT;
    const newTheme = currentTheme === this.THEME_DARK ? this.THEME_LIGHT : this.THEME_DARK;
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
    
    // Notification visuelle
    const modeName = newTheme === this.THEME_DARK ? 'sombre' : 'clair';
    Utils.showToast(`Mode ${modeName} activé`, 'info');
  },

  /**
   * Applique le thème sur l'élément document HTML.
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Mettre à jour l'icône ou le texte du bouton s'il existe
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      if (theme === this.THEME_DARK) {
        themeBtn.innerHTML = '☀️';
        themeBtn.setAttribute('aria-label', 'Activer le mode clair');
      } else {
        themeBtn.innerHTML = '🌙';
        themeBtn.setAttribute('aria-label', 'Activer le mode sombre');
      }
    }
  },

  /**
   * Sauvegarde le thème sélectionné dans localStorage.
   */
  saveTheme(theme) {
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
};
