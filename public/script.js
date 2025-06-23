document.addEventListener('DOMContentLoaded', function () {
  // Инициализация AOS
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }

  var modal = document.getElementById('applyModal');
  var btns = document.querySelectorAll('.apply-btn');
  var span = document.querySelector('.close');
  var formModal = document.getElementById('applyFormModal');
  var formPage = document.getElementById('applyFormPage');

  // Открытие модального окна
  for (var i = 0; i < btns.length; i++) {
    btns[i].onclick = function () {
      if (modal) {
        modal.style.display = 'block';
      }
    };
  }

  // Закрытие по крестику
  if (span) {
    span.onclick = function () {
      if (modal) {
        modal.style.display = 'none';
      }
    };
  }

  // Закрытие по клику вне окна
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  // Обработка отправки формы
  function handleFormSubmit(form) {
    if (!form) {
      console.warn('Форма не найдена');
      return;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ageInput = form.querySelector('input[type="number"]');
      if (!ageInput) {
        alert('Поле возраста не найдено');
        return;
      }

      var age = parseInt(ageInput.value, 10);
      if (isNaN(age) || age < 16 || age > 35) {
        alert('Возраст должен быть от 16 до 35 лет');
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/submit', true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              if (xhr.responseText && xhr.responseText.trim().length > 0) {
                var data = JSON.parse(xhr.responseText);
                if (data.success) {
                  alert('Заявка отправлена!');
                  if (modal) modal.style.display = 'none';
                  form.reset();
                } else {
                  alert(data.message || 'Ошибка при отправке.');
                }
              } else {
                alert('Сервер вернул пустой ответ.');
              }
            } catch (err) {
              console.error('Ошибка при обработке JSON:', err);
              alert('Ошибка при обработке ответа сервера.');
            }
          } else {
            console.error('HTTP error:', xhr.status);
            alert('Произошла ошибка при отправке заявки. Попробуйте позже.');
          }
        }
      };

      try {
        var formData = new FormData(form);
        xhr.send(formData);
      } catch (e) {
        console.error('Ошибка при отправке формы:', e);
        alert('Не удалось отправить форму. Обновите браузер или попробуйте позже.');
      }
    });
  }

  handleFormSubmit(formModal);
  handleFormSubmit(formPage);
});
