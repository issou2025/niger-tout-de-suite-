/**
 * Niger Info Veille - Gestion des Favoris (Bookmarks)
 */

const Bookmarks = {
  STORAGE_KEY: 'niv-bookmarked-news-ids',

  /**
   * Récupère la liste des IDs d'actualités sauvegardés en favoris.
   */
  getBookmarks() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Erreur de lecture des favoris:', e);
      return [];
    }
  },

  /**
   * Sauvegarde la liste des favoris dans localStorage.
   */
  saveBookmarks(bookmarks) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Erreur de sauvegarde des favoris:', e);
    }
  },

  /**
   * Ajoute ou retire une actualité des favoris.
   */
  toggleBookmark(newsId) {
    let bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(newsId);
    let isAdded = false;

    if (index === -1) {
      bookmarks.push(newsId);
      isAdded = true;
      Utils.showToast('Actualité ajoutée aux favoris', 'success');
    } else {
      bookmarks.splice(index, 1);
      isAdded = false;
      Utils.showToast('Actualité retirée des favoris', 'info');
    }

    this.saveBookmarks(bookmarks);
    return isAdded;
  },

  /**
   * Vérifie si une actualité est enregistrée dans les favoris.
   */
  isBookmarked(newsId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.includes(newsId);
  }
};
