// Здесь будет размещаться JavaScript код
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        // Настраиваем тему и цвета
        document.documentElement.style.setProperty('--tg-theme-bg-color', window.Telegram.WebApp.backgroundColor);
        document.documentElement.style.setProperty('--tg-theme-text-color', window.Telegram.WebApp.textColor);
        document.documentElement.style.setProperty('--tg-theme-button-color', window.Telegram.WebApp.buttonColor);
        document.documentElement.style.setProperty('--tg-theme-button-text-color', window.Telegram.WebApp.buttonTextColor);

        // Скрываем MainButton если он показан
        if (window.Telegram.WebApp.MainButton.isVisible) {
            window.Telegram.WebApp.MainButton.hide();
        }

        console.log('Telegram WebApp успешно инициализирован');
    } else {
        console.error('Telegram WebApp не доступен');
    }

    // Получаем данные из localStorage
    const productData = JSON.parse(localStorage.getItem('productData') || '{}');
    console.log('Загруженные данные о товаре:', productData);

    // Заполняем название товара
    if (productData && productData.name) {
        document.getElementById('productName').innerHTML = formatProductName(productData.name);
    }

    // Заполняем изображение товара
    if (productData && productData.allImages && productData.allImages.length > 0) {
        console.log('Найдены изображения товара:', productData.allImages);
        const img = document.querySelector('img[alt="Фото товара"]');
        if (img) {
            img.src = productData.allImages[0];
            console.log('Установлено изображение товара:', img.src);
        } else {
            console.error('Не найден элемент изображения товара');
        }
    }

    // Заполняем цены
    if (productData) {
        if (productData.price) {
            document.getElementById('productPrice').textContent = productData.price + ' ₽';
            // Устанавливаем более светлый оттенок серого для цены
            document.getElementById('productPrice').style.color = '#777777';
        }
        if (productData.reward) {
            document.getElementById('rewardPrice').textContent = productData.reward + ' ₽';
        }
    }

    // Заполняем информацию о доплате
    const bonusDetails = document.getElementById('bonusDetails');
    const bonusCondition = document.querySelector('.bonus-condition');
    
    if (bonusDetails && bonusCondition) {
        // Проверяем, есть ли данные о доплате
        if (productData && productData.requirements && productData.requirements.bonusAmount && productData.requirements.bonusCondition) {
            bonusDetails.innerHTML = '<span class="condition-label">Доплата</span>' + 
                productData.requirements.bonusAmount + '₽, при условии: ' + productData.requirements.bonusCondition;
        } else {
            // Если выбрано "Нет" для доплаты, показываем "Нет"
            bonusDetails.innerHTML = '<span class="condition-label">Доплата</span>Нет';
        }
        // Всегда показываем блок
        bonusCondition.style.display = 'block';
    }

    // Заполняем данные о магазине
    if (productData) {
        console.log('Данные о магазине:', productData);
        
        // Заполняем аватар магазина
        const storeAvatar = document.querySelector('.shop-avatar img');
        if (storeAvatar) {
            if (productData.logoUrl) {
                console.log('Устанавливаем логотип магазина:', productData.logoUrl);
                storeAvatar.src = productData.logoUrl;
                storeAvatar.alt = productData.name || 'Аватар магазина';
            } else {
                console.log('Используем дефолтный логотип магазина');
                storeAvatar.src = 'images/default-shop-avatar.png';
                storeAvatar.alt = 'Магазин';
            }
        } else {
            console.error('Не найден элемент для аватара магазина');
        }
    }

    // Заполняем требования к соцсетям
    if (productData && productData.requirements && productData.requirements.socialRequirements) {
        updateSocialRequirements(productData.requirements.socialRequirements);
    }

    // Заполняем данные о вознаграждении
    if (productData && productData.requirements && productData.requirements.rewardPrice) {
        document.getElementById('rewardPrice').textContent = productData.requirements.rewardPrice + ' ₽';
    }

    // Заполняем данные об условиях
    if (productData && productData.requirements) {
        if (productData.requirements.keyPurchase) {
            document.getElementById('keyPurchase').textContent = productData.requirements.keyPurchase;
        }
        if (productData.requirements.returnPolicy) {
            document.getElementById('returnPolicy').textContent = productData.requirements.returnPolicy;
        }
        if (productData.requirements.paymentType) {
            document.getElementById('paymentType').textContent = productData.requirements.paymentType;
        }
        if (productData.requirements.reviewType) {
            const reviewType = document.getElementById('reviewType');
            if (reviewType) {
                reviewType.textContent = productData.requirements.reviewType;
            }
        }
    }

    // Заполняем информацию о ТЗ
    const tzBlock = document.querySelector('.tz-block');
    const tzPopup = document.getElementById('tzPopup');
    const closePopup = document.querySelector('.close-popup');
    const tzContent = document.getElementById('tzContent');
    
    // Получаем содержимое ТЗ из localStorage
    const savedTzContent = localStorage.getItem('tzContent');
    
    // Заполняем содержимое всплывающего окна
    if (tzContent) {
        if (savedTzContent) {
            // Разбиваем текст на абзацы и добавляем их в popup
            const paragraphs = savedTzContent.split('\n').filter(p => p.trim() !== '');
            
            if (paragraphs.length > 0) {
                tzContent.innerHTML = '';
                paragraphs.forEach(paragraph => {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    tzContent.appendChild(p);
                });
            } else {
                // Если текст не разбит на абзацы, добавляем его как один абзац
                tzContent.innerHTML = `<p>${savedTzContent}</p>`;
            }
        } else {
            // Если в localStorage нет данных, показываем пример текста
            tzContent.innerHTML = `
                <p>Обучающий курс от компании поможет раскрыть весь потенциал <strong>и пользу от продукта благодаря</strong> персональной подборке и подробной инструкции по использованию.</p>
                <p>Обучающий курс от компании поможет раскрыть весь потенциал и пользу от продукта благодаря персональной подборке и подробной инструкции по использованию.</p>
            `;
        }
    }
    
    // Обработчик клика по блоку ТЗ
    if (tzBlock && tzPopup) {
        tzBlock.addEventListener('click', function() {
            tzPopup.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Запрещаем прокрутку основной страницы
        });
    }
    
    // Обработчик клика по кнопке закрытия
    if (closePopup && tzPopup) {
        closePopup.addEventListener('click', function() {
            tzPopup.style.display = 'none';
            document.body.style.overflow = ''; // Разрешаем прокрутку основной страницы
        });
        
        // Закрытие при клике вне контента попапа
        tzPopup.addEventListener('click', function(event) {
            if (event.target === tzPopup) {
                tzPopup.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Удаляем ненужные элементы
    const elementsToRemove = [
        '.shop-rating',
        '.offers-count',
        '.views-stats',
        '.image-size'
    ];

    elementsToRemove.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    });

    // Настраиваем вкладки соцсетей
    setupSocialTabs();

    // Обработчик для кнопки "Отправить заявку"
    const submitButton = document.querySelector('.submit-btn, .publish-btn, button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                // Получаем все необходимые данные
                const productData = JSON.parse(localStorage.getItem('productData') || '{}');
                const requirementsData = JSON.parse(localStorage.getItem('requirementsData') || '{}');
                const tzData = JSON.parse(localStorage.getItem('tzData') || '{}');
                const storeData = JSON.parse(localStorage.getItem('storeData') || '{}');

                console.log('Данные перед отправкой:', {
                    productData,
                    requirementsData,
                    tzData,
                    storeData
                });

                const requestData = {
                    product: {
                        name: productData.name || '',
                        price: productData.price || '',
                        link: productData.link || '',
                        images: productData.allImages || []
                    },
                    requirements: {
                        rewardPrice: requirementsData.rewardPrice || '',
                        socialRequirements: requirementsData.socialRequirements || {},
                        keyPurchase: requirementsData.keyPurchase || '',
                        returnPolicy: requirementsData.returnPolicy || '',
                        paymentType: requirementsData.paymentType || '',
                        reviewType: requirementsData.reviewType || ''
                    },
                    tz: {
                        contentRequirements: tzData.contentRequirements || ''
                    },
                    store: {
                        name: storeData.name || '',
                        description: storeData.description || '',
                        logoUrl: storeData.logoUrl || ''
                    }
                };

                console.log('Подготовленные данные для отправки:', requestData);

                if (!requestData.product.name || !requestData.product.price) {
                    throw new Error('Не заполнены обязательные поля товара');
                }

                window.Telegram.WebApp.sendData(JSON.stringify(requestData));
                console.log('Данные успешно отправлены');
                window.Telegram.WebApp.close();

            } catch (error) {
                console.error('Ошибка при отправке данных:', error);
                alert('Ошибка: ' + error.message);
            }
        });
    } else {
        console.error('Кнопка отправки не найдена');
    }

    // Обработчик для кнопки "Редактировать"
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            window.location.href = 'add-request.html';
        });
    }
});

// Функция получения данных о товаре
function getProductData() {
    const productData = JSON.parse(localStorage.getItem('productData') || '{}');
    return {
        name: productData.name || '',
        price: productData.price || '',
        link: productData.link || '',
        marketplace: productData.marketplace || [],
        images: productData.allImages || []
    };
}

// Функция получения данных о требованиях
function getRequirementsData() {
    const requirementsData = JSON.parse(localStorage.getItem('requirementsData') || '{}');
    return {
        rewardPrice: requirementsData.rewardPrice || '',
        socialRequirements: requirementsData.socialRequirements || {
            instagram: {
                pool: false,
                reels: false,
                stories: false
            }
        }
    };
}

// Функция получения данных о ТЗ
function getTzData() {
    const tzData = JSON.parse(localStorage.getItem('tzData') || '{}');
    return {
        contentRequirements: tzData.contentRequirements || ''
    };
}

// Функция получения данных о магазине
function getStoreData() {
    const storeData = JSON.parse(localStorage.getItem('storeData') || '{}');
    return {
        name: storeData.name || '',
        description: storeData.description || ''
    };
}

// Функция получения данных о изображениях товара
function getImages() {
    const productData = JSON.parse(localStorage.getItem('productData') || '{}');
    return productData.allImages || [];
}

// Функция форматирования названия товара
function formatProductName(name) {
    if (!name) return '';
    
    // Если название короткое, возвращаем как есть
    if (name.length <= 30) {
        return name;
    }
    
    // Ищем пробел ближе к середине строки для разделения
    const midPoint = Math.floor(name.length / 2);
    let breakPoint = name.lastIndexOf(' ', midPoint);
    
    // Если пробел не найден, разделяем посередине
    if (breakPoint === -1) {
        breakPoint = midPoint;
    }
    
    const firstLine = name.substring(0, breakPoint);
    const secondLine = name.substring(breakPoint + 1);
    
    return firstLine + '<br>' + secondLine;
}

// Функция настройки галереи изображений товара
function setupProductImages(productData) {
    // Проверяем, есть ли несколько изображений
    if (productData.allImages && productData.allImages.length > 1) {
        // Создаем галерею
        createImageGallery(productData.allImages);
    } else if (productData.imageUrl) {
        // Если только одно изображение, просто устанавливаем его
        const productImage = document.getElementById('productImage');
        if (productImage) {
            productImage.src = productData.imageUrl;
            productImage.alt = productData.name || 'Товар';
        }
    }
}

// Функция создания галереи изображений
function createImageGallery(images) {
    const productImageContainer = document.querySelector('.product-image');
    if (!productImageContainer) return;
    
    // Очищаем контейнер
    productImageContainer.innerHTML = '';
    
    // Создаем контейнер для основного изображения
    const mainImageContainer = document.createElement('div');
    mainImageContainer.className = 'main-image-container';
    
    // Создаем основное изображение (всегда первое загруженное)
    const mainImage = document.createElement('img');
    mainImage.id = 'productImage';
    mainImage.src = images[0]; // Первое изображение как основное
    mainImage.alt = 'Фото товара';
    mainImageContainer.appendChild(mainImage);
    
    // Создаем контейнер для миниатюр
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'thumbnails-container';
    
    // Добавляем только дополнительные изображения как миниатюры (начиная со второго)
    if (images.length > 1) {
        for (let i = 1; i < images.length; i++) {
            const thumbnail = document.createElement('img');
            thumbnail.src = images[i];
            thumbnail.className = 'thumbnail';
            
            // Не меняем основное изображение при клике
            // Просто для визуального отображения дополнительных фото
            
            thumbnailsContainer.appendChild(thumbnail);
        }
    }
    
    // Добавляем контейнеры в галерею
    productImageContainer.appendChild(mainImageContainer);
    
    // Добавляем контейнер с миниатюрами только если есть дополнительные изображения
    if (images.length > 1) {
        productImageContainer.appendChild(thumbnailsContainer);
    }
    
    // Добавляем стили для галереи
    const style = document.createElement('style');
    style.textContent = `
        .product-image {
            display: flex;
            margin-bottom: 15px;
            position: relative;
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
            overflow-y: auto;
            max-height: 350px;
        }
        .thumbnail {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
            border: 2px solid transparent;
        }
    `;
    document.head.appendChild(style);
}

// Функция обновления требований к соцсетям
function updateSocialRequirements(socialRequirements) {
    const requirementsList = document.querySelector('.requirements-list');
    if (!requirementsList) return;
    
    // Очищаем список требований
    requirementsList.innerHTML = '';
    
    // Проверяем наличие требований для Instagram
    if (socialRequirements.instagram) {
        const instagramData = socialRequirements.instagram;
        
        // Добавляем требования для Instagram
        if (instagramData.followers) {
            addRequirementItem(requirementsList, 'Пул от:', instagramData.followers);
        }
        if (instagramData.reels) {
            addRequirementItem(requirementsList, 'Reels от:', instagramData.reels);
        }
        if (instagramData.stories) {
            addRequirementItem(requirementsList, 'Stories от:', instagramData.stories);
        }
    } else {
        // Если данных нет, добавляем значения по умолчанию
        addRequirementItem(requirementsList, 'Пул от:', '1000');
        addRequirementItem(requirementsList, 'Reels от:', '600');
        addRequirementItem(requirementsList, 'Stories от:', '250');
    }
}

// Функция добавления элемента требования
function addRequirementItem(container, label, value) {
    const item = document.createElement('div');
    item.className = 'requirement-item';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'requirement-label';
    labelSpan.textContent = label;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'requirement-value';
    valueSpan.textContent = value;
    
    item.appendChild(labelSpan);
    item.appendChild(valueSpan);
    
    container.appendChild(item);
}

// Функция настройки вкладок соцсетей
function setupSocialTabs() {
    const socialTabs = document.querySelectorAll('.social-tab');
    if (socialTabs.length === 0) return;
    
    socialTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс у всех вкладок
            socialTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Здесь можно добавить логику переключения содержимого вкладок
        });
    });
}

// Функция заполнения данных о магазине
function fillStoreData(storeData) {
    console.log('Начинаем заполнение данных о магазине:', storeData);
    
    // Заполняем название магазина
    if (storeData.name) {
        const storeName = document.querySelector('.shop-name');
        if (storeName) {
            console.log('Найден элемент для названия магазина, устанавливаем:', storeData.name);
            storeName.textContent = storeData.name;
        } else {
            console.log('Элемент для названия магазина не найден');
        }
    }
    
    // Заполняем аватар магазина
    const storeAvatar = document.querySelector('.shop-avatar img');
    if (storeAvatar) {
        if (storeData.logoUrl) {
            console.log('Устанавливаем логотип магазина:', storeData.logoUrl);
            storeAvatar.src = storeData.logoUrl;
            storeAvatar.alt = storeData.name || 'Аватар магазина';
        } else {
            console.log('Используем дефолтный логотип магазина');
            storeAvatar.src = 'images/default-shop-avatar.png';
            storeAvatar.alt = 'Магазин';
        }
    } else {
        console.error('Не найден элемент для аватара магазина');
    }
    
    // Убираем отзывы - оставляем только название магазина
    const shopRating = document.querySelector('.shop-rating');
    if (shopRating) {
        shopRating.style.display = 'none';
    }
    
    const offersCount = document.querySelector('.offers-count');
    if (offersCount) {
        offersCount.style.display = 'none';
    }
} 
