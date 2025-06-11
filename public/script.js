// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация AOS
  AOS.init();

  const modal = document.getElementById('applyModal');
  const btns = document.querySelectorAll('.apply-btn');
  const span = document.querySelector('.close');
  const formModal = document.getElementById('applyFormModal');
  const formPage = document.getElementById('applyFormPage');

  // Открытие модального окна
  btns.forEach((btn) => {
    btn.onclick = function () {
      modal.style.display = 'block';
    };
  });

  // Закрытие модального окна по клику на крестик
  if (span) {
    span.onclick = function () {
      modal.style.display = 'none';
    };
  }

  // Закрытие модального окна по клику вне его
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  // Функция обработки отправки формы
  function handleFormSubmit(form) {
    if (!form) {
      console.warn('Форма не найдена');
      return;
    }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const ageInput = form.querySelector('input[type="number"]');
      if (!ageInput) {
        alert('Поле возраста не найдено');
        return;
      }
      const age = parseInt(ageInput.value);
      if (isNaN(age) || age < 16 || age > 35) {
        alert('Возраст должен быть от 16 до 35 лет');
        return;
      }

      const formData = new FormData(form);

      try {
        const response = await fetch('/submit', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          alert('Заявка отправлена!');
          if (modal) modal.style.display = 'none';
          form.reset();
        } else {
          alert(data.message || 'Ошибка при отправке.');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке заявки. Попробуйте позже.');
      }
    });
  }

  // Привязка обработчиков к формам
  handleFormSubmit(formModal);
  handleFormSubmit(formPage);
});