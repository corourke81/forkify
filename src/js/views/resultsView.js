import icons from '../../img/icons.svg';
import PreviewView from './previewView.js';

class ResultsView extends PreviewView {
  parentEl = document.querySelector('.results');
  errorMessage = 'No recipes match that query. Please try again!';
}

export default new ResultsView();
