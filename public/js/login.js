let password = document.querySelector('#password');
let icon = document.querySelector('.icon');
let iconAt = document.querySelector('.fa').getAttribute('class');
password.addEventListener('input', () => {
    if (password.value !== '') {
        icon.classList.add('active');
    } else {
        icon.classList.remove('active');

    }
})

icon.addEventListener('click', () => {
    if (password.type === 'password') {
        password.setAttribute('type', 'text');
        icon.classList.add('eye')
    } else {
        password.setAttribute('type', 'password');
        icon.classList.remove('eye')

    }
})