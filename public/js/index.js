const searchBtn = document.querySelector('.search_btn');
const searchForm = document.querySelector('.search_form');

searchBtn.addEventListener('click', () => {
    searchForm.className.add('active');
})