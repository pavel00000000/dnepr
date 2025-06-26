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
      console.log('Форма отправляется...');
      
      var ageInput = form.querySelector('input[type="number"]');
      if (!ageInput) {
        console.error('Поле возраста не найдено');
        alert('Поле возраста не найдено');
        return;
      }
      
      var age = parseInt(ageInput.value, 10);
      if (isNaN(age) || age < 16 || age > 35) {
        console.warn('Некорректный возраст: ' + age);
        alert('Возраст должен быть от 16 до 35 лет');
        return;
      }
      
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/submit', true);
      // Удаляем Content-Type, чтобы браузер установил multipart/form-data автоматически
      xhr.setRequestHeader('Accept', 'application/json');
      
      xhr.onreadystatechange = function () {
        console.log('xhr.readyState: ' + xhr.readyState + ', xhr.status: ' + xhr.status);
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              var data = JSON.parse(xhr.responseText);
              console.log('Ответ сервера: ', data);
              if (data.success) {
                  alert('Заявка отправлена!');
                     gtag_report_conversion(null); // ← фиксируем конверсию для Google Ads
                if (modal) modal.style.display = 'none';
                     form.reset();

              } else {
                console.error('Ошибка от сервера: ' + (data.message || 'Неизвестная ошибка'));
                alert(data.message || 'Ошибка при отправке.');
              }
            } catch (err) {
              console.error('Ошибка при обработке JSON: ', err);
              alert('Ошибка при обработке ответа сервера.');
            }
          } else {
            console.error('HTTP ошибка: ' + xhr.status);
            alert('Произошла ошибка при отправке заявки. Попробуйте позже.');
          }
        }
      };
      
      try {
        var formData = new FormData(form);
        // Логирование содержимого FormData
        for (let [key, value] of formData.entries()) {
          console.log(`FormData: ${key}=${value}`);
        }
        xhr.send(formData);
      } catch (e) {
        console.error('Ошибка при отправке формы: ', e);
        alert('Не удалось отправить форму. Обновите браузер или попробуйте позже.');
      }
    });
  }
  
  handleFormSubmit(formModal);
  handleFormSubmit(formPage);
});