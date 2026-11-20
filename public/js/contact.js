let captchaImg = document.querySelector('#captcha_img')
let refreshImg = document.querySelector('.img_refresh')

refreshImg.addEventListener('click', () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/captcha.png');
    xhr.onload = () => {
        if (xhr.status === 200) {
            captchaImg.src = '/captcha.png'
        }
    }
    xhr.send()
})