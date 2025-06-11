AOS.init();

const modal = document.getElementById('applyModal');
const btns = document.querySelectorAll('.apply-btn');
const span = document.querySelector('.close');
const formModal = document.getElementById('applyFormModal');
const formPage = document.getElementById('applyFormPage');

btns.forEach(btn => {
    btn.onclick = function() {
        modal.style.display = 'block';
    }
});

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function handleFormSubmit(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const age = form.querySelector('input[type="number"]').value;
        if (age < 16 || age > 35) {
            alert('Возраст должен быть от 16 до 35 лет');
            return;
        }
        const formData = new FormData(form);
        fetch('http://localhost:3000/submit', { // Исправляем URL
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Заявка отправлена!');
                modal.style.display = 'none';
                form.reset();
            } else {
                alert(data.message || 'Ошибка при отправке.');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке заявки.');
        });
    });
}

handleFormSubmit(formModal);
handleFormSubmit(formPage);