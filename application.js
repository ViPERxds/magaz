// Инициализация Telegram WebApp
document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Получаем данные из localStorage
    const productData = getProductData();
    const requirementsData = getRequirementsData();
    const tzData = getTzData();
    const storeData = getStoreData();

    // Отладочный вывод данных
    console.log('Данные о товаре из localStorage:', productData);
    console.log('Данные о требованиях из localStorage:', requirementsData);
    console.log('Данные о ТЗ из localStorage:', tzData);
    console.log('Данные о магазине из localStorage:', storeData);

    // Заполняем информацию о товаре, если есть данные
    if (productData) {
        // Заполняем изображение товара
        const productImage = document.querySelector('.product-image-left img');
        if (productImage) {
            if (productData.images && productData.images.length > 0) {
                // Если есть изображение в данных товара, используем его
                productImage.src = productData.images[0];
                console.log('Установлено изображение товара из localStorage:', productData.images[0]);
            } else if (productData.image) {
                // Проверяем альтернативное свойство image
                productImage.src = productData.image;
                console.log('Установлено изображение товара из свойства image:', productData.image);
            } else if (productData.imageUrl) {
                // Проверяем альтернативное свойство imageUrl
                productImage.src = productData.imageUrl;
                console.log('Установлено изображение товара из свойства imageUrl:', productData.imageUrl);
            } else {
                // Если изображение не найдено, используем запасной вариант
                productImage.src = 'assets/kaka.png';
                console.log('Изображение товара не найдено, используется запасной вариант');
            }
            
            // Добавляем обработчик ошибки загрузки изображения
            productImage.onerror = function() {
                this.src = 'assets/kaka.png';
                console.log('Ошибка загрузки изображения, используется запасной вариант');
            };
        }

        // Заполняем название товара
        const productName = document.querySelector('.product-name');
        if (productName && productData.name) {
            productName.textContent = productData.name;
            console.log('Установлено название товара:', productData.name);
        }

        // Заполняем цены
        if (productData.price) {
            const priceValues = document.querySelectorAll('.price-value');
            if (priceValues && priceValues.length > 1) {
                // Цена товара (серый блок)
                priceValues[1].textContent = productData.price + ' ₽';
            }
        }
    }

    // Заполняем информацию о вознаграждении, если есть данные
    if (requirementsData) {
        // Выплата (фиолетовый блок)
        if (requirementsData.rewardPrice) {
            const rewardValue = document.querySelectorAll('.price-value')[0];
            if (rewardValue) {
                rewardValue.textContent = requirementsData.rewardPrice + ' ₽';
            }
        }
        
        // Доплата
        if (requirementsData.bonusAmount) {
            const bonusValue = document.querySelector('.payment-block:nth-child(2) .payment-value');
            if (bonusValue) {
                bonusValue.innerHTML = requirementsData.bonusAmount + '₽ <span class="info-icon">i</span>';
            }
        } else {
            const bonusValue = document.querySelector('.payment-block:nth-child(2) .payment-value');
            if (bonusValue) {
                bonusValue.innerHTML = 'Нет';
            }
        }
        
        // Тип выплаты
        if (requirementsData.paymentType) {
            const paymentValue = document.querySelector('.payment-item:nth-child(1) .payment-value');
            if (paymentValue) {
                paymentValue.textContent = requirementsData.paymentType;
            }
        }

        // Заполняем требования к охватам
        if (requirementsData && requirementsData.socialRequirements && requirementsData.socialRequirements.instagram) {
            const instagramData = requirementsData.socialRequirements.instagram;
            const requirementItems = document.querySelectorAll('.requirement-item');
            
            // Обновляем значения требований
            if (requirementItems.length >= 3) {
                // Пул (подписчики)
                if (instagramData.followers) {
                    requirementItems[0].querySelector('.requirement-value').textContent = instagramData.followers;
                }
                
                // Reels
                if (instagramData.reels) {
                    requirementItems[1].querySelector('.requirement-value').textContent = instagramData.reels;
                }
                
                // Stories
                if (instagramData.stories) {
                    requirementItems[2].querySelector('.requirement-value').textContent = instagramData.stories;
                }
            }
        }
    }

    // Получение элементов вкладок и их содержимого
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Функция переключения вкладок
    function switchTab(tabId) {
        // Удаляем активный класс у всех вкладок и их содержимого
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Добавляем активный класс выбранной вкладке
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Добавляем активный класс соответствующему содержимому
        const selectedContent = document.getElementById(tabId + '-content');
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Сохраняем активную вкладку в localStorage
        localStorage.setItem('activeTab', tabId);
    }

    // Обработчики событий для вкладок
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.id);
        });
    });

    // Проверяем, есть ли сохраненная активная вкладка
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        switchTab(savedTab);
    } else {
        // По умолчанию открываем вкладку "Модерации"
        switchTab('tab-moderation');
    }

    // Функция обновления статуса заявок
    function updateApplicationsStatus() {
        // Получаем данные о заявках из localStorage или другого источника
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        
        // Проверяем наличие активных заявок
        const activeApps = applications.filter(app => app.status === 'active');
        const activeContent = document.getElementById('tab-active-content');
        if (activeApps.length > 0) {
            activeContent.classList.add('has-data');
            // Здесь можно добавить код для отображения активных заявок
        } else {
            activeContent.classList.remove('has-data');
        }
        
        // Проверяем наличие скрытых заявок
        const hiddenApps = applications.filter(app => app.status === 'hidden');
        const hiddenContent = document.getElementById('tab-hidden-content');
        if (hiddenApps.length > 0) {
            hiddenContent.classList.add('has-data');
            // Здесь можно добавить код для отображения скрытых заявок
        } else {
            hiddenContent.classList.remove('has-data');
        }
    }

    // Вызываем функцию обновления статуса при загрузке страницы
    updateApplicationsStatus();

    // Функция для получения данных о товаре из localStorage
    function getProductData() {
        const productData = localStorage.getItem('productData');
        return productData ? JSON.parse(productData) : null;
    }

    // Функция для получения данных о требованиях из localStorage
    function getRequirementsData() {
        const requirementsData = localStorage.getItem('requirementsData');
        return requirementsData ? JSON.parse(requirementsData) : null;
    }

    // Функция для получения данных о ТЗ из localStorage
    function getTzData() {
        const tzContent = localStorage.getItem('tzContent');
        return tzContent || null;
    }

    // Функция для получения данных о магазине из localStorage
    function getStoreData() {
        const storeData = localStorage.getItem('storeData');
        return storeData ? JSON.parse(storeData) : null;
    }

    // Показываем поп-ап уведомление, если нужно
    if (localStorage.getItem('showModerationPopup') === 'true') {
        const popup = document.getElementById('moderationPopup');
        const closePopup = document.querySelector('.close-popup');
        
        if (popup) {
            // Форматируем время отправки
            const submissionTime = new Date(localStorage.getItem('submissionTime'));
            const formattedDate = `${String(submissionTime.getDate()).padStart(2, '0')}.${String(submissionTime.getMonth() + 1).padStart(2, '0')} в ${String(submissionTime.getHours()).padStart(2, '0')}:${String(submissionTime.getMinutes()).padStart(2, '0')}`;
            
            // Обновляем время в поп-апе
            const timeElement = popup.querySelector('p');
            if (timeElement) {
                timeElement.textContent = `Отправлена: ${formattedDate} (МСК)`;
            }
            
            // Показываем поп-ап
            popup.classList.add('show');
            document.body.style.overflow = 'hidden'; // Запрещаем прокрутку основной страницы
            
            // Удаляем флаг
            localStorage.removeItem('showModerationPopup');
            
            // Обработчик для кнопки закрытия
            if (closePopup) {
                closePopup.addEventListener('click', function() {
                    popup.classList.remove('show');
                    document.body.style.overflow = ''; // Разрешаем прокрутку основной страницы
                });
            }
            
            // Закрытие при клике вне контента попапа
            popup.addEventListener('click', function(event) {
                if (event.target === popup) {
                    popup.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        }
    }
}); 