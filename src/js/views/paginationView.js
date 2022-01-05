import icons from '../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  parentEl = document.querySelector('.pagination');

  generateMarkup() {
    // Works out how many pages there are (in ResultsView)
    const numPages = Math.ceil(
      this.data.results.length / this.data.resultsPerPage
    );

    const currentPage = this.data.page;
    // If on page 1 and there is more than one page, display button to go to page 2
    if (currentPage === 1 && numPages > 1) {
      return `<button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // If on another page but not the last page,
    // display buttons to go forward or back a page
    if (currentPage > 1 && currentPage < numPages) {
      return `<button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>8 ${currentPage - 1}</span>
    </button>
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // If not on the first page and on the last page, display icon to go back a page
    if (currentPage > 1 && currentPage === numPages) {
      return `<button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>`;
    }

    // Otherwise, only one page -- display nothing
    return '';
  }

  addHandlerPagination(handler) {
    this.parentEl.addEventListener('click', function (e) {
      // btn is closest ancestor of e.target that matches selector
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      // If btn exists, get the current number value of data-goto
      const goToPage = Number(btn.dataset.goto);

      handler(goToPage);
    });
  }
}
export default new PaginationView();
