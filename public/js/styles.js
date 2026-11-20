const btn = document.querySelector('#btn');
const closeBtn = document.querySelector('.search-close');
const search = document.querySelector('.search-div');


btn.addEventListener('click', () => {
    search.classList.add('active')
})

closeBtn.addEventListener('click', () => {
    search.classList.remove('active')
})
