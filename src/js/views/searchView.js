import icons from '../../img/icons.svg';
import View from './view.js';

class SearchView extends View {
  parentEl = document.querySelector('.search');

  addHandlerSearch(handler) {
    // When data in search box is submitted, run handler (publisher-subscriber)
    this.parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); // when submitting form, prevents automatic page reload
      handler();
    });
  }

  // Clears search box
  clearInput() {
    this.parentEl.querySelector('.search__field').value = '';
  }

  // returns query
  getQuery() {
    const query = this.parentEl.querySelector('.search__field').value;
    this.clearInput();
    return query;
  }
}

export default new SearchView();
