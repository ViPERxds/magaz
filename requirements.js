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

    // Обработчики для раскрытия/скрытия блоков соцсетей
    const socialHeaders = document.querySelectorAll('.social-header');
    socialHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('open');
        });
    });

    // Обработчики для чекбоксов "Неважно"
    const unimportantCheckboxes = document.querySelectorAll('.unimportant input[type="checkbox"]');
    unimportantCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const statsInput = this.closest('.stats-group').querySelector('.stats-input');
            statsInput.disabled = this.checked;
        });
    });

    // Обработчики для кнопок опций (да/нет)
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parent = this.closest('.option-buttons');
            parent.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Показываем/скрываем поля для условий доплаты
            if (this.closest('.reward-option') && this.closest('.reward-option').querySelector('h3').textContent.includes('Доплата при условии')) {
                const conditionFields = document.querySelector('.condition-fields');
                if (conditionFields) {
                    conditionFields.style.display = this.dataset.value === 'yes' ? 'block' : 'none';
                }
            }
        });
    });

    // Обработчик кнопки "Добавить ТЗ"
    const addTzBtn = document.querySelector('.add-tz-btn');
    if (addTzBtn) {
        addTzBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveRequirementsData();
            window.location.href = 'tz.html';
        });
    }
});

// Функция сохранения данных о требованиях
function saveRequirementsData() {
    const requirementsData = {
        // Данные по соцсетям
        socialRequirements: {
            instagram: getSocialNetworkData('instagram'),
            telegram: getSocialNetworkData('telegram'),
            tiktok: getSocialNetworkData('tiktok'),
            vk: getSocialNetworkData('vk'),
            youtube: getSocialNetworkData('youtube')
        },
        
        // Данные о вознаграждении
        rewardPrice: document.querySelector('.reward-input').value || '800',
        
        // Данные о доплате
        bonusAmount: getConditionAmount(),
        bonusCondition: getConditionText(),
        
        // Опции
        keyPurchase: getOptionValue('Выкуп по ключу'),
        returnPolicy: getOptionValue('Возможен возврат?'),
        reviewType: getReviewType(),
        paymentType: 'Сразу' // По умолчанию
    };

    localStorage.setItem('requirementsData', JSON.stringify(requirementsData));
}

// Функция получения данных по соцсети
function getSocialNetworkData(network) {
    const networkBlock = document.querySelector(`.social-header[data-network="${network}"]`).closest('.social-network-block');
    if (!networkBlock) return null;
    
    const fields = networkBlock.querySelector('.network-fields');
    if (!fields) return null;
    
    const data = {};
    
    // Получаем данные о подписчиках
    const followersInput = fields.querySelector('.stats-group:nth-child(1) .stats-input');
    const followersUnimportant = fields.querySelector('#' + network + '-followers-unimportant');
    
    if (followersInput && !followersInput.disabled) {
        data.followers = followersInput.value;
    }
    
    // Получаем данные о просмотрах (разные для разных соцсетей)
    if (network === 'instagram') {
        const reelsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
        const storiesInput = fields.querySelector('.stats-group:nth-child(3) .stats-input');
        
        if (reelsInput && !reelsInput.disabled) {
            data.reels = reelsInput.value;
        }
        
        if (storiesInput && !storiesInput.disabled) {
            data.stories = storiesInput.value;
        }
    } else if (network === 'telegram' || network === 'vk') {
        const viewsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
        
        if (viewsInput && !viewsInput.disabled) {
            data.views = viewsInput.value;
        }
    } else if (network === 'tiktok') {
        const viewsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
        
        if (viewsInput && !viewsInput.disabled) {
            data.views = viewsInput.value;
        }
    } else if (network === 'youtube') {
        const shortsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
        
        if (shortsInput && !shortsInput.disabled) {
            data.shorts = shortsInput.value;
        }
    }
    
    return Object.keys(data).length > 0 ? data : null;
}

// Функция получения значения опции (да/нет)
function getOptionValue(optionTitle) {
    const optionBlock = Array.from(document.querySelectorAll('.reward-option')).find(block => 
        block.querySelector('h3').textContent.includes(optionTitle)
    );
    
    if (!optionBlock) return null;
    
    const activeButton = optionBlock.querySelector('.option-btn.active');
    return activeButton ? activeButton.dataset.value === 'yes' ? 'Да' : 'Нет' : null;
}

// Функция получения типа отзыва
function getReviewType() {
    const reviewOption = Array.from(document.querySelectorAll('.reward-option')).find(block => 
        block.querySelector('h3').textContent.includes('Нужен отзыв?')
    );
    
    if (!reviewOption) return 'Нет';
    
    const activeButton = reviewOption.querySelector('.option-btn.active');
    return activeButton && activeButton.dataset.value === 'yes' ? 'Да, с фото' : 'Нет';
}

// Функция получения суммы доплаты
function getConditionAmount() {
    const conditionFields = document.querySelector('.condition-fields');
    if (!conditionFields || conditionFields.style.display === 'none') return null;
    
    const amountInput = conditionFields.querySelector('.input-group:nth-child(2) .condition-input');
    return amountInput ? amountInput.value : null;
}

// Функция получения текста условия
function getConditionText() {
    const conditionFields = document.querySelector('.condition-fields');
    if (!conditionFields || conditionFields.style.display === 'none') return null;
    
    const conditionInput = conditionFields.querySelector('.input-group:nth-child(1) .condition-input');
    return conditionInput ? conditionInput.value : null;
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