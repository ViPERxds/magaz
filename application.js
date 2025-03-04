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

    // Получаем элементы табов
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const activeOrdersContainer = document.getElementById('activeOrders');

    // Функция для создания карточки активного заказа
    function createOrderCard(order) {
        const data = order.data;
        const product = data.p || {};
        const requirements = data.r || {};

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-content">
                <div class="product-image-left">
                    <img src="${product.i ? product.i[0] : 'assets/tz.jpg'}" alt="Фото товара" onerror="this.src='assets/tz.jpg'">
                </div>
                
                <div class="price-block">
                    <div class="price purple">
                        <div class="price-value">${requirements.rp || '0'} ₽</div>
                        <div class="price-label">Выплата</div>
                    </div>
                    <div class="price gray">
                        <div class="price-value">${product.p || '0'} ₽</div>
                        <div class="price-label">Цена</div>
                    </div>
                </div>
                
                <div class="payment-row">
                    <div class="payment-block">
                        <div class="payment-label">Выплата:</div>
                        <div class="payment-value">${requirements.pt || 'Не указано'}</div>
                    </div>
                    <div class="payment-block">
                        <div class="payment-label">Доплата:</div>
                        <div class="payment-value bonus">${requirements.ba ? requirements.ba + ' ₽' : 'Нет'}</div>
                    </div>
                </div>
                
                <div class="social-buttons">
                    ${renderSocialButtons(requirements.sr || {})}
                </div>
                
                <div class="requirements-block">
                    ${renderRequirements(requirements.sr || {})}
                </div>
            </div>
        `;

        return card;
    }

    // Функция для отрисовки социальных кнопок
    function renderSocialButtons(socialRequirements) {
        let buttons = '';
        for (const [platform, reqs] of Object.entries(socialRequirements)) {
            if (Object.values(reqs).some(v => v)) {
                buttons += `<div class="social-btn">${platform}</div>`;
            }
        }
        return buttons || '<div class="social-btn">Не указано</div>';
    }

    // Функция для отрисовки требований
    function renderRequirements(socialRequirements) {
        let requirements = '';
        for (const [platform, reqs] of Object.entries(socialRequirements)) {
            for (const [key, value] of Object.entries(reqs)) {
                if (value) {
                    const label = {
                        'followers': 'Подписчики от',
                        'reels': 'Reels от',
                        'stories': 'Stories от'
                    }[key] || key;
                    
                    requirements += `
                        <div class="requirement-item">
                            <span class="requirement-label">${label}:</span>
                            <span class="requirement-value">${value}</span>
                        </div>
                    `;
                }
            }
        }
        return requirements || `
            <div class="requirement-item">
                <span class="requirement-label">Требования:</span>
                <span class="requirement-value">Не указаны</span>
            </div>
        `;
    }

    // Функция для загрузки активных заказов
    async function loadActiveOrders() {
        try {
            const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
            console.log('Загрузка активных заказов для пользователя:', userId);
            
            const response = await fetch(`/api/orders?user_id=${userId}&status=active`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const orders = await response.json();
            console.log('Получены активные заказы:', orders);

            const activeOrdersContainer = document.getElementById('activeOrders');
            activeOrdersContainer.innerHTML = '';

            if (!orders || orders.length === 0) {
                activeOrdersContainer.innerHTML = `
                    <div class="active-info no-data-message">
                        <h3>У вас нет активных заявок</h3>
                        <p>Здесь будут отображаться ваши активные заявки после прохождения модерации</p>
                    </div>
                `;
                return;
            }

            orders.forEach(order => {
                const card = createOrderCard(order);
                activeOrdersContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Ошибка при загрузке активных заказов:', error);
            const activeOrdersContainer = document.getElementById('activeOrders');
            activeOrdersContainer.innerHTML = `
                <div class="error-message">
                    <h3>Произошла ошибка при загрузке заказов</h3>
                    <p>Пожалуйста, попробуйте позже</p>
                </div>
            `;
        }
    }

    // Обработчик переключения табов
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс у всех табов и контента
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Добавляем активный класс текущему табу
            this.classList.add('active');

            // Показываем соответствующий контент
            const contentId = this.id + '-content';
            document.getElementById(contentId).classList.add('active');

            // Если выбрана вкладка "Активные", загружаем активные заказы
            if (this.id === 'tab-active') {
                loadActiveOrders();
            }
        });
    });

    // Загружаем активные заказы при первой загрузке страницы
    if (document.getElementById('tab-active').classList.contains('active')) {
        loadActiveOrders();
    }

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
