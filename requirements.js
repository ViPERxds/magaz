document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Получаем сохраненные данные, если они есть
    const savedRequirementsData = getRequirementsData();
    
    // Заполняем форму сохраненными данными
    if (savedRequirementsData) {
        fillFormWithSavedData(savedRequirementsData);
    }

    // Обработка раскрытия/скрытия блоков соц. сетей
    const socialHeaders = document.querySelectorAll('.social-header');
    socialHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const networkBlock = this.closest('.social-network-block');
            const networkFields = networkBlock.querySelector('.network-fields');
            const toggleBtn = this.querySelector('.toggle-btn');
            
            if (networkFields.style.display === 'none' || !networkFields.style.display) {
                networkFields.style.display = 'block';
                toggleBtn.textContent = '▼';
                toggleBtn.style.transform = 'rotate(180deg)';
            } else {
                networkFields.style.display = 'none';
                toggleBtn.textContent = '▼';
                toggleBtn.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Обработка чекбоксов "Неважно"
    const unimportantCheckboxes = document.querySelectorAll('.unimportant input[type="checkbox"]');
    unimportantCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const statsInput = this.closest('.stats-group').querySelector('.stats-input');
            if (this.checked) {
                statsInput.value = 'Неважно';
                statsInput.disabled = true;
            } else {
                statsInput.value = '';
                statsInput.disabled = false;
            }
        });
    });

    // Обработка кнопок Да/Нет
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonGroup = this.closest('.option-buttons');
            buttonGroup.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // Если выбрано "Да" для доплаты, показываем поля условий
            if (this.dataset.value === 'yes' && 
                this.closest('.reward-option').querySelector('h3').textContent.includes('Доплата')) {
                document.querySelector('.condition-fields').style.display = 'block';
            } else if (this.dataset.value === 'no' && 
                      this.closest('.reward-option').querySelector('h3').textContent.includes('Доплата')) {
                document.querySelector('.condition-fields').style.display = 'none';
            }
        });
    });

    // Обработка кнопки "Добавить ТЗ"
    const addTzBtn = document.querySelector('.add-tz-btn');
    if (addTzBtn) {
        addTzBtn.addEventListener('click', function() {
            // Сохраняем данные формы перед переходом
            saveFormData();
            // Переход на страницу ТЗ
            window.location.href = 'tz.html';
        });
    }
});

// Функция сохранения данных формы
function saveFormData() {
    const requirementsData = {
        socialRequirements: {},
        rewardPrice: document.querySelector('.reward-input')?.value || '',
        bonusAmount: document.querySelector('.condition-fields .condition-input:first-child')?.value || '',
        bonusCondition: document.querySelector('.condition-fields .condition-input:last-child')?.value || '',
    };

    // Сохраняем данные по соц. сетям
    const socialNetworks = ['instagram', 'telegram', 'tiktok', 'vk', 'youtube'];
    socialNetworks.forEach(network => {
        const networkBlock = document.querySelector(`[data-network="${network}"]`)?.closest('.social-network-block');
        if (networkBlock) {
            requirementsData.socialRequirements[network] = {
                followers: getFieldValue(networkBlock, 'followers'),
                views: getFieldValue(networkBlock, 'views'),
                reels: getFieldValue(networkBlock, 'reels'),
                stories: getFieldValue(networkBlock, 'stories'),
                shorts: getFieldValue(networkBlock, 'shorts')
            };
        }
    });

    // Сохраняем опции (да/нет)
    const options = document.querySelectorAll('.reward-option');
    options.forEach(option => {
        const title = option.querySelector('h3').textContent.toLowerCase();
        const activeBtn = option.querySelector('.option-btn.active');
        if (activeBtn) {
            requirementsData[title.replace(/[^a-zA-Z]/g, '')] = activeBtn.dataset.value;
        }
    });

    localStorage.setItem('requirementsData', JSON.stringify(requirementsData));
}

// Вспомогательная функция для получения значения поля
function getFieldValue(container, fieldType) {
    const input = container.querySelector(`[id*="${fieldType}"]`);
    if (!input) return null;
    
    const unimportantCheckbox = container.querySelector(`#${input.id}-unimportant`);
    if (unimportantCheckbox?.checked) {
        return 'Неважно';
    }
    return input.value || null;
}

// Функция получения сохраненных данных о требованиях
function getRequirementsData() {
    try {
        const requirementsData = localStorage.getItem('requirementsData');
        return requirementsData ? JSON.parse(requirementsData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о требованиях:', e);
        return null;
    }
}

// Функция заполнения формы сохраненными данными
function fillFormWithSavedData(data) {
    // Заполняем данные по соцсетям
    if (data.socialRequirements) {
        fillSocialNetworkData('instagram', data.socialRequirements.instagram);
        fillSocialNetworkData('telegram', data.socialRequirements.telegram);
        fillSocialNetworkData('tiktok', data.socialRequirements.tiktok);
        fillSocialNetworkData('vk', data.socialRequirements.vk);
        fillSocialNetworkData('youtube', data.socialRequirements.youtube);
    }
    
    // Заполняем данные о вознаграждении
    if (data.rewardPrice) {
        document.querySelector('.reward-input').value = data.rewardPrice;
    }
    
    // Заполняем данные о доплате
    if (data.bonusAmount && data.bonusCondition) {
        // Активируем опцию "Да" для доплаты
        const bonusOption = Array.from(document.querySelectorAll('.reward-option')).find(block => 
            block.querySelector('h3').textContent.includes('Доплата при условии')
        );
        
        if (bonusOption) {
            const yesButton = bonusOption.querySelector('.option-btn[data-value="yes"]');
            if (yesButton) {
                yesButton.click();
            }
        }
        
        // Заполняем поля доплаты
        const conditionFields = document.querySelector('.condition-fields');
        if (conditionFields) {
            const conditionInput = conditionFields.querySelector('.input-group:nth-child(1) .condition-input');
            const amountInput = conditionFields.querySelector('.input-group:nth-child(2) .condition-input');
            
            if (conditionInput) conditionInput.value = data.bonusCondition;
            if (amountInput) amountInput.value = data.bonusAmount;
        }
    }
    
    // Заполняем опции
    setOptionValue('Выкуп по ключу', data.keyPurchase);
    setOptionValue('Возможен возврат?', data.returnPolicy);
    setOptionValue('Нужен отзыв?', data.reviewType === 'Да, с фото' ? 'Да' : 'Нет');
}

// Функция заполнения данных по соцсети
function fillSocialNetworkData(network, data) {
    if (!data) return;
    
    const networkBlock = document.querySelector(`.social-header[data-network="${network}"]`).closest('.social-network-block');
    if (!networkBlock) return;
    
    // Открываем блок соцсети
    const header = networkBlock.querySelector('.social-header');
    if (header && !header.classList.contains('open')) {
        header.click();
    }
    
    const fields = networkBlock.querySelector('.network-fields');
    if (!fields) return;
    
    // Заполняем данные о подписчиках
    if (data.followers) {
        const followersInput = fields.querySelector('.stats-group:nth-child(1) .stats-input');
        if (followersInput) followersInput.value = data.followers;
    }
    
    // Заполняем данные о просмотрах (разные для разных соцсетей)
    if (network === 'instagram') {
        if (data.reels) {
            const reelsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
            if (reelsInput) reelsInput.value = data.reels;
        }
        
        if (data.stories) {
            const storiesInput = fields.querySelector('.stats-group:nth-child(3) .stats-input');
            if (storiesInput) storiesInput.value = data.stories;
        }
    } else if (network === 'telegram' || network === 'vk' || network === 'tiktok') {
        if (data.views) {
            const viewsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
            if (viewsInput) viewsInput.value = data.views;
        }
    } else if (network === 'youtube') {
        if (data.shorts) {
            const shortsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
            if (shortsInput) shortsInput.value = data.shorts;
        }
    }
}

// Функция установки значения опции (да/нет)
function setOptionValue(optionTitle, value) {
    if (!value) return;
    
    const optionBlock = Array.from(document.querySelectorAll('.reward-option')).find(block => 
        block.querySelector('h3').textContent.includes(optionTitle)
    );
    
    if (!optionBlock) return;
    
    const buttonValue = value === 'Да' ? 'yes' : 'no';
    const button = optionBlock.querySelector(`.option-btn[data-value="${buttonValue}"]`);
    
    if (button) {
        button.click();
    }
} 
