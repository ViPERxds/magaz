document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Получаем сохраненные данные, если они есть
    const savedProductData = getProductData();
    
    // Заполняем форму сохраненными данными
    if (savedProductData) {
        fillFormWithSavedData(savedProductData);
    }

    // Обработчик загрузки изображений
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const imagePreview = document.getElementById('imagePreview');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', handleFileSelect);
    }

    // Обработчик перетаскивания файлов
    const uploadContainer = document.querySelector('.upload-container');
    if (uploadContainer) {
        uploadContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('drag-over');
        });

        uploadContainer.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
        });

        uploadContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }

    // Обработчик кнопок маркетплейса
    const marketplaceButtons = document.querySelectorAll('.marketplace-btn');
    marketplaceButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Обработчик отправки формы
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveProductData();
            window.location.href = 'requirements.html';
        });
    }
});

// Массив для хранения всех загруженных изображений
let uploadedImages = [];
let currentMainImageIndex = 0;

// Функция обработки выбора файлов
function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

// Функция обработки файлов
function handleFiles(files) {
    const previewContainer = document.querySelector('.image-preview');
    
    // Создаем контейнер для галереи, если его еще нет
    if (!document.querySelector('.gallery-container')) {
        // Удаляем старый контейнер превью, если он есть
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
        
        // Создаем новый контейнер для галереи
        const galleryContainer = document.createElement('div');
        galleryContainer.className = 'gallery-container';
        
        // Создаем контейнер для основного изображения
        const mainImageContainer = document.createElement('div');
        mainImageContainer.className = 'main-image-container';
        
        // Создаем контейнер для миниатюр
        const thumbnailsContainer = document.createElement('div');
        thumbnailsContainer.className = 'thumbnails-container';
        
        galleryContainer.appendChild(mainImageContainer);
        galleryContainer.appendChild(thumbnailsContainer);
        
        // Добавляем галерею на страницу
        if (previewContainer) {
            previewContainer.appendChild(galleryContainer);
        }
        
        // Добавляем стили для галереи
        const style = document.createElement('style');
        style.textContent = `
            .gallery-container {
                display: flex;
                margin-top: 15px;
                width: 100%;
            }
            .main-image-container {
                flex: 1;
                margin-right: 10px;
                position: relative;
            }
            .main-image-container img {
                width: 100%;
                height: auto;
                border-radius: 8px;
                object-fit: cover;
            }
            .thumbnails-container {
                display: flex;
                flex-direction: column;
                gap: 5px;
                width: 80px;
            }
            .thumbnail {
                width: 80px;
                height: 80px;
                border-radius: 8px;
                cursor: pointer;
                object-fit: cover;
                border: 2px solid transparent;
                transition: border-color 0.2s;
            }
            .thumbnail.active {
                border-color: #ec4899;
            }
            .image-size {
                position: absolute;
                bottom: 5px;
                right: 5px;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                padding: 2px 5px;
                border-radius: 4px;
                font-size: 12px;
            }
            .delete-image {
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(255, 0, 0, 0.7);
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-weight: bold;
                border: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Получаем контейнеры
    const mainImageContainer = document.querySelector('.main-image-container');
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    
    // Обрабатываем каждый файл
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Проверяем, что файл - изображение
        if (!file.type.match('image.*')) continue;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Создаем объект изображения
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = function() {
                // Добавляем изображение в массив
                const imageData = {
                    src: e.target.result,
                    width: img.width,
                    height: img.height
                };
                uploadedImages.push(imageData);
                
                // Обновляем галерею
                updateGallery();
            };
        };
        
        reader.readAsDataURL(file);
    }
}

// Функция для обновления галереи
function updateGallery() {
    if (uploadedImages.length === 0) return;
    
    const mainImageContainer = document.querySelector('.main-image-container');
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    
    if (!mainImageContainer || !thumbnailsContainer) return;
    
    // Очищаем контейнеры
    mainImageContainer.innerHTML = '';
    thumbnailsContainer.innerHTML = '';
    
    // Добавляем основное изображение
    const mainImage = document.createElement('img');
    mainImage.src = uploadedImages[currentMainImageIndex].src;
    mainImageContainer.appendChild(mainImage);
    
    // Добавляем размер изображения
    const sizeLabel = document.createElement('div');
    sizeLabel.className = 'image-size';
    sizeLabel.textContent = `${uploadedImages[currentMainImageIndex].width} x ${uploadedImages[currentMainImageIndex].height}`;
    mainImageContainer.appendChild(sizeLabel);
    
    // Добавляем кнопку удаления
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-image';
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', function() {
        deleteImage(currentMainImageIndex);
    });
    mainImageContainer.appendChild(deleteButton);
    
    // Добавляем миниатюры
    uploadedImages.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image.src;
        thumbnail.className = 'thumbnail';
        if (index === currentMainImageIndex) {
            thumbnail.classList.add('active');
        }
        
        thumbnail.addEventListener('click', function() {
            currentMainImageIndex = index;
            updateGallery();
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// Функция для удаления изображения
function deleteImage(index) {
    // Исправляем ошибку в удалении - используем splice правильно
    uploadedImages.splice(index, 1);
    
    if (uploadedImages.length === 0) {
        // Если изображений больше нет, удаляем галерею
        const galleryContainer = document.querySelector('.gallery-container');
        if (galleryContainer) {
            galleryContainer.remove();
        }
    } else {
        // Если изображения еще есть, обновляем индекс основного изображения
        if (currentMainImageIndex >= uploadedImages.length) {
            currentMainImageIndex = uploadedImages.length - 1;
        }
        
        // Обновляем галерею
        updateGallery();
    }
}

// Функция сохранения данных о товаре
function saveProductData() {
    const productData = {
        name: document.querySelector('.form-group input[type="text"]').value,
        marketplace: getSelectedMarketplaces(),
        price: document.querySelector('.form-group:nth-child(3) input').value,
        link: document.querySelector('.form-group:nth-child(4) input').value,
        visibility: document.getElementById('hideFromBloggers').checked ? 'Приватный' : 'Публичный',
        category: document.querySelector('.form-group select').value,
        imageUrl: uploadedImages.length > 0 ? uploadedImages[0].src : '',
        allImages: uploadedImages.map(img => img.src) // Сохраняем все изображения
    };

    localStorage.setItem('productData', JSON.stringify(productData));
}

// Функция получения выбранных маркетплейсов
function getSelectedMarketplaces() {
    const marketplaceButtons = document.querySelectorAll('.marketplace-btn.active');
    return Array.from(marketplaceButtons).map(button => button.textContent);
}

// Функция получения сохраненных данных о товаре
function getProductData() {
    try {
        const productData = localStorage.getItem('productData');
        return productData ? JSON.parse(productData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о товаре:', e);
        return null;
    }
}

// Функция заполнения формы сохраненными данными
function fillFormWithSavedData(data) {
    if (data.name) {
        document.querySelector('.form-group input[type="text"]').value = data.name;
    }
    
    if (data.marketplace && data.marketplace.length > 0) {
        const marketplaceButtons = document.querySelectorAll('.marketplace-btn');
        marketplaceButtons.forEach(button => {
            if (data.marketplace.includes(button.textContent)) {
                button.classList.add('active');
            }
        });
    }
    
    if (data.price) {
        document.querySelector('.form-group:nth-child(3) input').value = data.price;
    }
    
    if (data.link) {
        document.querySelector('.form-group:nth-child(4) input').value = data.link;
    }
    
    if (data.visibility) {
        document.getElementById('hideFromBloggers').checked = data.visibility === 'Приватный';
    }
    
    if (data.category) {
        document.querySelector('.form-group select').value = data.category;
    }
    
    // Загружаем изображения, если они есть
    if (data.allImages && data.allImages.length > 0) {
        // Загружаем все изображения в массив
        uploadedImages = data.allImages.map(src => {
            const img = new Image();
            img.src = src;
            return {
                src: src,
                width: img.width || 300,
                height: img.height || 300
            };
        });
        
        // Обновляем галерею
        setTimeout(updateGallery, 100);
    } else if (data.imageUrl) {
        // Если есть только одно изображение
        const img = new Image();
        img.src = data.imageUrl;
        img.onload = function() {
            uploadedImages = [{
                src: data.imageUrl,
                width: img.width,
                height: img.height
            }];
            updateGallery();
        };
    }
} 