document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Получаем сохраненные данные, если они есть
    const savedStoreData = getStoreData();
    
    // Заполняем форму сохраненными данными
    if (savedStoreData) {
        fillFormWithSavedData(savedStoreData);
    }

    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg';
    fileInput.style.display = 'none';
    uploadBtn.parentNode.appendChild(fileInput);

    // Переменная для хранения URL логотипа
    let logoUrl = savedStoreData ? savedStoreData.logoUrl : null;

    // Обработка клика по кнопке
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Обработка перетаскивания
    uploadBtn.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBtn.style.borderColor = '#9747FF';
    });

    uploadBtn.addEventListener('dragleave', () => {
        uploadBtn.style.borderColor = '#E0E0E0';
    });

    uploadBtn.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBtn.style.borderColor = '#E0E0E0';
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // Обработка выбора файла
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (!file) return;

        // Проверка формата
        if (!file.type.includes('jpeg')) {
            alert('Пожалуйста, загрузите JPG файл');
            return;
        }

        // Проверка размера (1MB = 1048576 bytes)
        if (file.size > 1048576) {
            alert('Размер файла не должен превышать 1MB');
            return;
        }

        // Создаем превью
        const reader = new FileReader();
        reader.onload = (e) => {
            logoUrl = e.target.result; // Сохраняем URL логотипа
            uploadBtn.innerHTML = `
                <img src="${e.target.result}" alt="Превью" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px;">
                <span>Фото загружено</span>
                <span class="file-size">Нажмите чтобы изменить</span>
            `;
        };
        reader.readAsDataURL(file);
    }

    // Обработчик для кнопки "Готово"
    const submitButton = document.querySelector('.submit-btn');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            saveStoreData(logoUrl);
            window.location.href = 'add-request.html';
        });
    }
});

// Функция сохранения данных о магазине
function saveStoreData(logoUrl) {
    const storeData = {
        name: document.querySelector('.form-group:nth-child(1) input').value || 'Магазин',
        logoUrl: logoUrl,
        phone: document.querySelector('.form-group:nth-child(3) input').value || '',
        email: document.querySelector('.form-group:nth-child(4) input').value || ''
    };

    localStorage.setItem('storeData', JSON.stringify(storeData));
}

// Функция получения сохраненных данных о магазине
function getStoreData() {
    try {
        const storeData = localStorage.getItem('storeData');
        return storeData ? JSON.parse(storeData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о магазине:', e);
        return null;
    }
}

// Функция заполнения формы сохраненными данными
function fillFormWithSavedData(data) {
    if (data.name) {
        document.querySelector('.form-group:nth-child(1) input').value = data.name;
    }
    
    if (data.logoUrl) {
        const uploadBtn = document.querySelector('.upload-btn');
        if (uploadBtn) {
            uploadBtn.innerHTML = `
                <img src="${data.logoUrl}" alt="Превью" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px;">
                <span>Фото загружено</span>
                <span class="file-size">Нажмите чтобы изменить</span>
            `;
        }
    }
    
    if (data.phone) {
        document.querySelector('.form-group:nth-child(3) input').value = data.phone;
    }
    
    if (data.email) {
        document.querySelector('.form-group:nth-child(4) input').value = data.email;
    }
} 