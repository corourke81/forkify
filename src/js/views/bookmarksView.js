import PreviewView from './previewView.js';

// BookmarksView and ResultsView both inherit from PreviewView
class BookmarksView extends PreviewView {
  parentEl = document.querySelector('.bookmarks__list');
  errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!';
}

export default new BookmarksView();
