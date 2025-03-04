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

    // Обработчики для табов
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Удаляем активный класс у всех табов
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Добавляем активный класс выбранному табу
            tab.classList.add('active');
            const contentId = tab.id + '-content';
            document.getElementById(contentId).classList.add('active');

            // Обновляем содержимое вкладки
            updateTabContent(tab.id);
        });
    });

    // Функция для обновления содержимого вкладки
    function updateTabContent(tabId) {
        const content = document.getElementById(tabId + '-content');
        if (!content) return;

        // Очищаем текущее содержимое
        content.innerHTML = '';

        // Получаем текущую заявку
        const currentOrder = getCurrentOrder();
        console.log('Текущая заявка:', currentOrder);

        if (tabId === 'tab-moderation' && currentOrder) {
            // Создаем карточку заявки
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-content">
                    <div class="product-image-left">
                        <img src="${currentOrder.product?.image || 'assets/tz.jpg'}" alt="Фото товара">
                    </div>
                    <div class="price-block">
                        <div class="price purple">
                            <div class="price-value">${currentOrder.requirements?.reward || '800'} ₽</div>
                            <div class="price-label">Выплата</div>
                        </div>
                        <div class="price gray">
                            <div class="price-value">${currentOrder.product?.price || '500'} ₽</div>
                            <div class="price-label">Цена</div>
                        </div>
                    </div>
                    <div class="payment-row">
                        <div class="payment-block">
                            <div class="payment-label">Выплата:</div>
                            <div class="payment-value">Сразу</div>
                        </div>
                        <div class="payment-block">
                            <div class="payment-label">Доплата:</div>
                            <div class="payment-value bonus">Нет</div>
                        </div>
                    </div>
                    <div class="social-buttons">
                        <div class="social-btn">Instagram*</div>
                        <div class="social-btn">VK</div>
                    </div>
                    <div class="requirements-block">
                        <div class="requirement-item">
                            <span class="requirement-label">Пул от:</span>
                            <span class="requirement-value">${currentOrder.requirements?.followers || 'Неважно'}</span>
                        </div>
                        <div class="requirement-item">
                            <span class="requirement-label">Reels от:</span>
                            <span class="requirement-value">${currentOrder.requirements?.reels || 'Неважно'}</span>
                        </div>
                        <div class="requirement-item">
                            <span class="requirement-label">Stories от:</span>
                            <span class="requirement-value">${currentOrder.requirements?.stories || 'Неважно'}</span>
                        </div>
                    </div>
                </div>`;
            content.appendChild(card);
        } else {
            // Показываем сообщение об отсутствии заявок
            content.innerHTML = getEmptyMessage(tabId);
        }
    }

    // Функция для получения сообщения о пустой вкладке
    function getEmptyMessage(tabId) {
        switch (tabId) {
            case 'tab-active':
                return `
                    <div class="active-info no-data-message">
                        <h3>У вас нет активных заявок</h3>
                        <p>Здесь будут отображаться ваши активные заявки после прохождения модерации</p>
                    </div>`;
            case 'tab-moderation':
                return `
                    <div class="moderation-info no-data-message">
                        <h3>У вас нет заявок на модерации</h3>
                        <p>Здесь будут отображаться ваши заявки, ожидающие проверки</p>
                    </div>`;
            case 'tab-hidden':
                return `
                    <div class="hidden-info no-data-message">
                        <h3>У вас нет скрытых заявок</h3>
                        <p>Здесь будут отображаться заявки, которые вы решили скрыть</p>
                    </div>`;
            default:
                return '';
        }
    }

    // Функция для получения текущей заявки
    function getCurrentOrder() {
        try {
            const orderData = localStorage.getItem('currentOrder');
            return orderData ? JSON.parse(orderData) : null;
        } catch (e) {
            console.error('Ошибка при получении текущей заявки:', e);
            return null;
        }
    }

    // Функция для получения заявок из localStorage
    function getOrders() {
        try {
            const orders = localStorage.getItem('orders');
            return orders ? JSON.parse(orders) : [];
        } catch (e) {
            console.error('Ошибка при получении заявок:', e);
            return [];
        }
    }

    // Инициализация первой вкладки
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        updateTabContent(activeTab.id);
    }

    // Обработчик для WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.onEvent('mainButtonClicked', function() {
            const orders = getOrders();
            window.Telegram.WebApp.sendData(JSON.stringify(orders));
        });
    }

    // Функция для получения данных о товаре из localStorage
    function getProductData() {
        try {
            const data = localStorage.getItem('productData');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка при получении данных о товаре:', e);
            return null;
        }
    }

    // Функция для получения данных о требованиях из localStorage
    function getRequirementsData() {
        try {
            const data = localStorage.getItem('requirementsData');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка при получении данных о требованиях:', e);
            return null;
        }
    }

    // Функция для получения данных о ТЗ из localStorage
    function getTzData() {
        try {
            const data = localStorage.getItem('tzData');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка при получении данных о ТЗ:', e);
            return null;
        }
    }

    // Функция для получения данных о магазине из localStorage
    function getStoreData() {
        try {
            const data = localStorage.getItem('storeData');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка при получении данных о магазине:', e);
            return null;
        }
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

// Функция для обновления статуса заявки
function updateOrderStatus(orderId, newStatus) {
    try {
        const orders = getOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Обновляем отображение
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) {
                updateTabContent(activeTab.id);
            }
        }
    } catch (e) {
        console.error('Ошибка при обновлении статуса заявки:', e);
    }
} 
