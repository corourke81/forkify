import icons from '../../img/icons.svg';
import View from './view.js';

class SearchView extends View {
  parentEl = document.querySelector('.search');

  addHandlerSearch(handler) {
    this.parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  clearInput() {
    this.parentEl.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this.parentEl.querySelector('.search__field').value;
    this.clearInput();
    return query;
  }
}

export default new SearchView();
