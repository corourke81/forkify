import PreviewView from './previewView.js';

// ResultsView and BookmarksView both inherit from PreviewView
class ResultsView extends PreviewView {
  parentEl = document.querySelector('.results');
  errorMessage = 'No recipes match that query. Please try again!';
}

export default new ResultsView();
