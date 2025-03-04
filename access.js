document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Получаем сохраненные данные, если они есть
    const savedAccessData = getAccessData();
    
    // Заполняем форму сохраненными данными
    if (savedAccessData) {
        fillFormWithSavedData(savedAccessData);
    }

    // Обработчик для кнопки "Получить доступ"
    const getAccessBtn = document.querySelector('.get-access-btn');
    if (getAccessBtn) {
        getAccessBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'create-store.html';
        });
    }

    // Обработчик для текстовых полей
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
        
        // Инициализация при загрузке
        if (input.value.trim() !== '') {
            input.classList.add('filled');
        }
    });

    // Обработчик для переключателя видимости пароля
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                this.classList.add('visible');
            } else {
                passwordField.type = 'password';
                this.classList.remove('visible');
            }
        });
    });
});

// Функция сохранения данных о доступе
function saveAccessData() {
    const accessData = {
        // Данные о доступе
        storeLogin: document.querySelector('#store-login').value,
        storePassword: document.querySelector('#store-password').value,
        storeName: document.querySelector('#store-name').value,
        storeLink: document.querySelector('#store-link').value
    };

    localStorage.setItem('accessData', JSON.stringify(accessData));
}

// Функция получения сохраненных данных о доступе
function getAccessData() {
    try {
        const accessData = localStorage.getItem('accessData');
        return accessData ? JSON.parse(accessData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о доступе:', e);
        return null;
    }
}

// Функция заполнения формы сохраненными данными
function fillFormWithSavedData(data) {
    // Заполняем поля доступа
    if (data.storeLogin) {
        const loginField = document.querySelector('#store-login');
        if (loginField) {
            loginField.value = data.storeLogin;
            loginField.classList.add('filled');
        }
    }
    
    if (data.storePassword) {
        const passwordField = document.querySelector('#store-password');
        if (passwordField) {
            passwordField.value = data.storePassword;
            passwordField.classList.add('filled');
        }
    }
    
    if (data.storeName) {
        const nameField = document.querySelector('#store-name');
        if (nameField) {
            nameField.value = data.storeName;
            nameField.classList.add('filled');
        }
    }
    
    if (data.storeLink) {
        const linkField = document.querySelector('#store-link');
        if (linkField) {
            linkField.value = data.storeLink;
            linkField.classList.add('filled');
        }
    }
} 