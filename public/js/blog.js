const showDeleteBtn = document.querySelectorAll('.show-delete');
const delete_box = document.querySelectorAll('.delete-container');
const cancel_btn = document.querySelectorAll('.cancel-btn');

for (let a = 0; a < showDeleteBtn.length; a++) {
    showDeleteBtn[a].addEventListener('click', () => {
        for (let i = 0; i < delete_box.length; i++) {
            delete_box[a].classList.add('active');
        }
    });
    cancel_btn[a].addEventListener('click', () => {
        for (let i = 0; i < delete_box.length; i++) {
            delete_box[a].classList.remove('active');
        }
    })
}

