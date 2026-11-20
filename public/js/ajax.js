const titleInput = document.querySelector('#title');
const textAreaInput = document.querySelector('#body');
const titleRemaining = document.querySelector('#title-remaining');
const textAreaRemaining = document.querySelector('#textArea-remaining');
const Title_Max = 100;
const TextArea_Max = 2000;

titleInput.addEventListener('input', () => {
    let totalRemaining = Title_Max - titleInput.value.length;

    if (totalRemaining < 11) {
        titleRemaining.classList.add('input-Warning')
    } else {
        titleRemaining.classList.remove('input-Warning')

    }
    titleRemaining.textContent = `${totalRemaining} characters remaining`;

})

textAreaInput.addEventListener('input', () => {
    let totalRemaining = TextArea_Max - textAreaInput.value.length;
    textAreaRemaining.textContent = `${totalRemaining} characters remaining`;

    console.log(totalRemaining)
    if (totalRemaining < 51) {
        textAreaRemaining.classList.add('input-Warning')
    } else {
        textAreaRemaining.classList.remove('input-Warning')

    }

})
