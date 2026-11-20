let password = document.querySelectorAll('.password')
let show = document.querySelector('#show-password')

show.addEventListener('click', () => {
    password.forEach((e) => {
        if (e.type === 'password') {
            e.setAttribute('type', 'text')

        } else {
            e.setAttribute('type', 'password')
        }
    })
})

let captchaImg = document.querySelector('#captchaImg')
let refreshImg = document.querySelector('.fa-refresh')

refreshImg.addEventListener('click', () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/users/register/register-captcha.png');
    xhr.onload = () => {
        if (xhr.status === 200) {
            captchaImg.src = '/users/register/register-captcha.png'
        }
    }
    xhr.send()
})