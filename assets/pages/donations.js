const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberElement = entry.target;
            if (!numberElement.hasAttribute('data-animated')) {
                const target = parseInt(numberElement.getAttribute('data-target'));
                animateNumber(numberElement, target);
                numberElement.setAttribute('data-animated', 'true');
            }
        }
    });
}, observerOptions);

// Get all number elements and observe them
document.querySelectorAll('.impact-number').forEach(number => {
    observer.observe(number);
});

function animateNumber(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current).toLocaleString();
        }
    }, stepDuration);
}

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// Form Functionality
let currentStep = 1;
let selectedDonationType = null;
let selectedPaymentMethod = "credit-card";
let selectedAmount = null;
let isDonationTypeMonthly = true;

function updateProgress() {
    const progress = ((currentStep - 1) / 3) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
}

function updateSteps() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.toggle('active', stepNum === currentStep);
        step.classList.toggle('completed', stepNum < currentStep);
    });
}

function showStep(step) {
    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });
    document.querySelector(`.form-page[data-step="${step}"]`).classList.add('active');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const formNavigation = document.querySelector('.form-navigation');

    // Скрываем кнопку "Previous" на первом шаге
    prevBtn.style.display = step === 1 ? 'none' : 'block';
    
    // Скрываем кнопку "Next" на последнем шаге
    nextBtn.style.display = step === 4 ? 'none' : 'block';
    
    // Показываем кнопку "Submit" только на последнем шаге
    submitBtn.style.display = step === 4 ? 'block' : 'none';
    
    // Скрываем всю панель навигации на первом шаге
    formNavigation.style.display = step === 1 ? 'none' : 'flex';

    updateProgress();
    updateSteps();
}

function updateAmountOptions() {
    const amountOptionsContainer = document.querySelector('.amount-options');
    if (amountOptionsContainer) {
        if (isDonationTypeMonthly) {
            // Monthly donation amounts
            amountOptionsContainer.innerHTML = `
                <div class="amount-option" data-amount="15" onclick="selectAmount(this, 15)">$15</div>
                <div class="amount-option" data-amount="25" onclick="selectAmount(this, 25)">$25</div>
                <div class="amount-option" data-amount="35" onclick="selectAmount(this, 35)">$35</div>
                <div class="amount-option" data-amount="50" onclick="selectAmount(this, 50)">$50</div>
                <div class="amount-option" data-amount="75" onclick="selectAmount(this, 75)">$75</div>
                <div class="amount-option" data-amount="100" onclick="selectAmount(this, 100)">$100</div>
                <div class="amount-option" data-amount="other" onclick="selectAmount(this, 'other')">Other</div>
            `;
            // Select first option by default
            const firstOption = document.querySelector('.amount-option');
            if (firstOption) {
                firstOption.classList.add('selected');
                selectedAmount = 15;
            }
        } else {
            // One-time donation amounts
            amountOptionsContainer.innerHTML = `
                <div class="amount-option" data-amount="50" onclick="selectAmount(this, 50)">$50</div>
                <div class="amount-option" data-amount="100" onclick="selectAmount(this, 100)">$100</div>
                <div class="amount-option" data-amount="150" onclick="selectAmount(this, 150)">$150</div>
                <div class="amount-option" data-amount="300" onclick="selectAmount(this, 300)">$300</div>
                <div class="amount-option" data-amount="500" onclick="selectAmount(this, 500)">$500</div>
                <div class="amount-option" data-amount="1000" onclick="selectAmount(this, 1000)">$1000</div>
                <div class="amount-option" data-amount="other" onclick="selectAmount(this, 'other')">Other</div>
            `;
            // Select first option by default
            const firstOption = document.querySelector('.amount-option');
            if (firstOption) {
                firstOption.classList.add('selected');
                selectedAmount = 50;
            }
        }
    }
}

function selectAmount(element, amount) {
    const options = document.querySelectorAll('.amount-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    const customAmountContainer = document.querySelector('.custom-amount');
    if (amount === 'other') {
        customAmountContainer.style.display = 'block';
        document.getElementById('customAmount').focus();
        selectedAmount = null;
    } else {
        customAmountContainer.style.display = 'none';
        selectedAmount = amount;
    }
}

function updateCustomAmount(value) {
    selectedAmount = parseFloat(value);
}

function selectPaymentMethod(element, method) {
    const methods = document.querySelectorAll('.payment-method');
    methods.forEach(m => m.classList.remove('selected'));
    element.classList.add('selected');
    selectedPaymentMethod = method;
    
    const creditCardDetails = document.getElementById('credit-card-details');
    const paypalDetails = document.getElementById('paypal-details');
    
    if (method === 'credit-card') {
        creditCardDetails.style.display = 'block';
        paypalDetails.style.display = 'none';
    } else {
        creditCardDetails.style.display = 'none';
        paypalDetails.style.display = 'block';
    }
}

function setupMonetaryDonationListeners() {
    // Credit Card Number Formatting and Validation
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            let value = this.value.replace(/\D/g, '');
            
            // Add spaces after every 4 digits
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            this.value = formattedValue;
            
            // Update card type icon
            updateCardType(value);
        });
        
        cardNumberInput.addEventListener('blur', function() {
            validateCardNumber(this);
        });
    }

    // Expiry Date Formatting and Validation
    const expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                this.value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
            } else {
                this.value = value;
            }
        });
        
        expiryInput.addEventListener('blur', function() {
            validateExpiry(this);
        });
    }
    
    // CVV Input Masking and Validation
    const cvvInput = document.getElementById('cardCvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
        
        // Show the actual numbers when focused
        cvvInput.addEventListener('focus', function() {
            this.type = 'number';
        });
        
        // Hide the numbers when blurred
        cvvInput.addEventListener('blur', function() {
            this.type = 'password';
            validateCVV(this);
        });
    }
}

// Credit card validation functions
function validateCardNumber(input) {
    const value = input.value.replace(/\s/g, '');
    const errorElement = document.getElementById('cardNumberError');
    
    // Check if empty
    if (!value) {
        showInputError(input, errorElement, 'Please enter your card number');
        return false;
    }
    
    // Check length
    if (value.length < 13 || value.length > 19) {
        showInputError(input, errorElement, 'Card number should be between 13-19 digits');
        return false;
    }
    
    // Luhn algorithm check
    if (!isValidLuhn(value)) {
        showInputError(input, errorElement, 'Invalid card number');
        return false;
    }
    
    hideInputError(input, errorElement);
    return true;
}

function validateExpiry(input) {
    const value = input.value.replace(/\D/g, '');
    const errorElement = document.getElementById('cardExpiryError');
    
    // Check if empty
    if (!value || value.length < 4) {
        showInputError(input, errorElement, 'Please enter a valid expiration date');
        return false;
    }
    
    const month = parseInt(value.slice(0, 2), 10);
    const year = parseInt('20' + value.slice(2, 4), 10);
    
    // Check month
    if (month < 1 || month > 12) {
        showInputError(input, errorElement, 'Invalid month');
        return false;
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Check if expired
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        showInputError(input, errorElement, 'Card has expired');
        return false;
    }
    
    // Check if too far in the future
    if (year > currentYear + 20) {
        showInputError(input, errorElement, 'Expiration date too far in the future');
        return false;
    }
    
    hideInputError(input, errorElement);
    return true;
}

function validateCVV(input) {
    const value = input.value;
    const errorElement = document.getElementById('cardCvvError');
    
    // Check if empty
    if (!value) {
        showInputError(input, errorElement, 'Please enter the CVV');
        return false;
    }
    
    // Check length (3-4 digits)
    if (value.length < 3 || value.length > 4) {
        showInputError(input, errorElement, 'CVV should be 3-4 digits');
        return false;
    }
    
    hideInputError(input, errorElement);
    return true;
}

function isValidLuhn(number) {
    let sum = 0;
    let doubleUp = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (doubleUp) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        doubleUp = !doubleUp;
    }
    
    return (sum % 10) === 0;
}

function showInputError(input, errorElement, message) {
    input.classList.add('invalid');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideInputError(input, errorElement) {
    input.classList.remove('invalid');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function updateCardType(number) {
    const visa = document.getElementById('card-visa');
    const mastercard = document.getElementById('card-mastercard');
    const amex = document.getElementById('card-amex');
    const discover = document.getElementById('card-discover');
    
    // Reset all
    [visa, mastercard, amex, discover].forEach(icon => {
        if (icon) icon.classList.remove('active');
    });
    
    // Show appropriate icon based on card number
    if (number.startsWith('4')) {
        if (visa) visa.classList.add('active');
    } else if (/^5[1-5]/.test(number)) {
        if (mastercard) mastercard.classList.add('active');
    } else if (/^3[47]/.test(number)) {
        if (amex) amex.classList.add('active');
    } else if (/^6(?:011|5)/.test(number)) {
        if (discover) discover.classList.add('active');
    }
}

function nextStep() {
    if (validateStep(currentStep)) {
        // Получаем текущую страницу
        const currentPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);
        
        // Добавляем класс для анимации выхода
        if (currentPage) {
            currentPage.classList.add('slide-out');
            
            // Переход к следующему шагу после завершения анимации
            setTimeout(() => {
                currentPage.classList.remove('slide-out');
                
                if (currentStep < 4) {
                    currentStep++;
                    showStep(currentStep);
                    
                    // Добавляем анимацию входа для нового шага
                    const nextPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);
                    if (nextPage) {
                        nextPage.classList.add('slide-in');
                        setTimeout(() => {
                            nextPage.classList.remove('slide-in');
                        }, 300);
                    }
                    
                    // Обновляем детали пожертвования при переходе на шаг 2
                    if (currentStep === 2) {
                        updateDonationDetails();
                    }
                }
                
                if (currentStep === 4) {
                    updateSummary();
                }
                
                // Если текущий шаг - выбор суммы для денежного пожертвования, и мы хотим перенаправить на GoFundMe
                if (currentStep === 2 && selectedDonationType === 'money' && GOFUNDME_INTEGRATION_ENABLED) {
                    // Здесь будет ваш код для интеграции с GoFundMe, если необходимо
                    // Раскомментируйте, если хотите использовать эту функцию
                    /*
                    const gofundmeUrl = new URL(GOFUNDME_CAMPAIGN_URL);
                    // Показываем сообщение о переходе
                    document.getElementById('donationForm').style.display = 'none';
                    document.querySelector('.success-message').classList.add('active');
                    document.querySelector('.success-message h2').textContent = "Redirecting to GoFundMe...";
                    document.querySelector('.success-message p').textContent = "You'll be redirected to complete your donation securely.";
                    
                    // Перенаправляем на GoFundMe через 2 секунды
                    setTimeout(() => {
                        window.location.href = gofundmeUrl.toString();
                    }, 2000);
                    
                    return;
                    */
                }
            }, 300);
        }
    }
}

// Модифицируем функцию selectDonationType
function selectDonationType(type) {
    selectedDonationType = type;
    document.querySelectorAll('.donation-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Автоматически переходим к следующему шагу после выбора типа пожертвования
    setTimeout(() => {
        nextStep();
    }, 300); // Небольшая задержка для визуального эффекта выбора
}

// Обновляем showStep, чтобы скрыть кнопку Next на первом шаге
function showStep(step) {
    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });
    document.querySelector(`.form-page[data-step="${step}"]`).classList.add('active');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const formNavigation = document.querySelector('.form-navigation');

    // Скрываем кнопку "Previous" на первом шаге
    prevBtn.style.display = step === 1 ? 'none' : 'block';
    
    // Скрываем кнопку "Next" на последнем шаге
    nextBtn.style.display = step === 4 ? 'none' : 'block';
    
    // Показываем кнопку "Submit" только на последнем шаге
    submitBtn.style.display = step === 4 ? 'block' : 'none';
    
    // Скрываем всю панель навигации на первом шаге
    formNavigation.style.display = step === 1 ? 'none' : 'flex';

    updateProgress();
    updateSteps();
}

// Для удобства навигации добавим небольшую анимацию при переходе между шагами
function nextStep() {
    if (validateStep(currentStep)) {
        // Получаем текущую страницу
        const currentPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);
        
        // Добавляем класс для анимации выхода
        if (currentPage) {
            currentPage.classList.add('slide-out');
            
            // Переход к следующему шагу после завершения анимации
            setTimeout(() => {
                currentPage.classList.remove('slide-out');
                
                if (currentStep < 4) {
                    currentStep++;
                    showStep(currentStep);
                    
                    // Добавляем анимацию входа для нового шага
                    const nextPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);
                    if (nextPage) {
                        nextPage.classList.add('slide-in');
                        setTimeout(() => {
                            nextPage.classList.remove('slide-in');
                        }, 300);
                    }
                    
                    // Обновляем детали пожертвования при переходе на шаг 2
                    if (currentStep === 2) {
                        updateDonationDetails();
                    }
                }
                
                if (currentStep === 4) {
                    updateSummary();
                }
                
                // Если текущий шаг - выбор суммы для денежного пожертвования, и мы хотим перенаправить на GoFundMe
                if (currentStep === 2 && selectedDonationType === 'money' && GOFUNDME_INTEGRATION_ENABLED) {
                    // Здесь будет ваш код для интеграции с GoFundMe, если необходимо
                    // Раскомментируйте, если хотите использовать эту функцию
                    /*
                    const gofundmeUrl = new URL(GOFUNDME_CAMPAIGN_URL);
                    // Показываем сообщение о переходе
                    document.getElementById('donationForm').style.display = 'none';
                    document.querySelector('.success-message').classList.add('active');
                    document.querySelector('.success-message h2').textContent = "Redirecting to GoFundMe...";
                    document.querySelector('.success-message p').textContent = "You'll be redirected to complete your donation securely.";
                    
                    // Перенаправляем на GoFundMe через 2 секунды
                    setTimeout(() => {
                        window.location.href = gofundmeUrl.toString();
                    }, 2000);
                    
                    return;
                    */
                }
            }, 300);
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Получаем текущую страницу
        const currentPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);
        
        // Добавляем класс для анимации выхода
        if (currentPage) {
            currentPage.classList.add('slide-out-reverse');
            
            // Переход к предыдущему шагу после завершения анимации
            setTimeout(() => {
                currentPage.classList.remove('slide-out-reverse');
                
                currentStep--;
                showStep(currentStep);
                
                // Добавляем анимацию входа для нового шага
                const prevPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);
                if (prevPage) {
                    prevPage.classList.add('slide-in-reverse');
                    setTimeout(() => {
                        prevPage.classList.remove('slide-in-reverse');
                    }, 300);
                }
            }, 300);
        }
    }
}

 function selectMonetaryDonationType(element, type) {
    const options = document.querySelectorAll('.donation-type-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    // Update donation type
    isDonationTypeMonthly = (type === 'monthly');
    
    // Update amount options based on donation type
    updateAmountOptions();
}


function updateDonationDetails() {
    // Update donation-specific fields
    const fields = document.getElementById('donationSpecificFields');
    fields.innerHTML = '';

    switch (selectedDonationType) {
        case 'money':
            fields.innerHTML = `
                <div class="form-section">
                    <h3>Donation Type</h3>
                    <div class="donation-type-options">
                        <div class="donation-type-option selected" data-type="monthly" onclick="selectMonetaryDonationType(this, 'monthly')">
                            <h4>Monthly</h4>
                            <p>Provide ongoing support to our programs</p>
                        </div>
                        <div class="donation-type-option" data-type="one-time" onclick="selectMonetaryDonationType(this, 'one-time')">
                            <h4>One Time</h4>
                            <p>Make a single donation today</p>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Choose Your Gift Amount</h3>
                    <div class="amount-options">
                        <div class="amount-option selected" data-amount="15" onclick="selectAmount(this, 15)">$15</div>
                        <div class="amount-option" data-amount="25" onclick="selectAmount(this, 25)">$25</div>
                        <div class="amount-option" data-amount="35" onclick="selectAmount(this, 35)">$35</div>
                        <div class="amount-option" data-amount="50" onclick="selectAmount(this, 50)">$50</div>
                        <div class="amount-option" data-amount="75" onclick="selectAmount(this, 75)">$75</div>
                        <div class="amount-option" data-amount="100" onclick="selectAmount(this, 100)">$100</div>
                        <div class="amount-option" data-amount="other" onclick="selectAmount(this, 'other')">Other</div>
                    </div>
                    <div class="custom-amount">
                        <input type="number" id="customAmount" placeholder="Enter amount (USD)" min="1" onchange="updateCustomAmount(this.value)">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Payment Method</h3>
                    <div class="payment-methods">
                        <div class="payment-method selected" data-method="credit-card" onclick="selectPaymentMethod(this, 'credit-card')">
                            <div class="payment-method-icon">💳</div>
                            <div>Credit Card</div>
                        </div>
                        <div class="payment-method" data-method="paypal" onclick="selectPaymentMethod(this, 'paypal')">
                            <div class="payment-method-icon">📱</div>
                            <div>PayPal</div>
                        </div>
                    </div>
                    
                    <div class="payment-details">
                        <!-- Credit Card Details -->
                        <div id="credit-card-details" class="active">
                            <div class="credit-card-form">
                                <div class="card-number-container">
                                    <label for="cardNumber">Card Number</label>
                                    <div class="card-input-wrapper">
                                        <input type="text" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxlength="19" required>
                                        <div class="card-icons">
                                            <span id="card-visa" class="card-icon visa"></span>
                                            <span id="card-mastercard" class="card-icon mastercard"></span>
                                            <span id="card-amex" class="card-icon amex"></span>
                                            <span id="card-discover" class="card-icon discover"></span>
                                        </div>
                                    </div>
                                    <div id="cardNumberError" class="card-error"></div>
                                </div>
                                
                                <div class="card-row">
                                    <div class="expiry-container">
                                        <label for="cardExpiry">Expiration Date</label>
                                        <input type="text" id="cardExpiry" placeholder="MM / YY" maxlength="7" required>
                                        <div id="cardExpiryError" class="card-error"></div>
                                    </div>
                                    
                                    <div class="cvv-container">
                                        <label for="cardCvv">CVV</label>
                                        <input type="password" id="cardCvv" placeholder="XXX" maxlength="4" required>
                                        <div id="cardCvvError" class="card-error"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- PayPal Details -->
                        <div id="paypal-details" style="display:none;">
                            <div class="paypal-message">
                                <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" alt="PayPal" class="paypal-logo">
                                <p>You will be redirected to PayPal to complete your donation securely.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize donation type selection and amount options
            selectedAmount = isDonationTypeMonthly ? 15 : 50;
            
            // Initialize event listeners for the monetary donation form
            setupMonetaryDonationListeners();
            
            // Update amount options based on current donation type
            updateAmountOptions();
            break;
            
        case 'vehicle':
            fields.innerHTML = `
                <div class="form-group">
                    <label for="vehicleType">Vehicle Type</label>
                    <select id="vehicleType" name="vehicle_type" required>
                        <option value="">Select vehicle type</option>
                        <option value="car">Car</option>
                        <option value="truck">Truck</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="rv">RV</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="vehicleYear">Year</label>
                    <input type="number" id="vehicleYear" name="vehicle_year" min="1900" max="2025" required>
                </div>
                <div class="form-group">
                    <label for="vehicleMake">Make</label>
                    <input type="text" id="vehicleMake" name="vehicle_make" required>
                </div>
                <div class="form-group">
                    <label for="vehicleModel">Model</label>
                    <input type="text" id="vehicleModel" name="vehicle_model" required>
                </div>
                <div class="form-group">
                    <label for="vehicleCondition">Condition</label>
                    <select id="vehicleCondition" name="vehicle_condition" required>
                        <option value="">Select condition</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                    </select>
                </div>
            `;
            break;
            
        case 'vessel':
            fields.innerHTML = `
                <div class="form-group">
                    <label for="vesselType">Vessel Type</label>
                    <select id="vesselType" name="vessel_type" required>
                        <option value="">Select vessel type</option>
                        <option value="boat">Boat</option>
                        <option value="yacht">Yacht</option>
                        <option value="jetski">Jet Ski</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="vesselYear">Year</label>
                    <input type="number" id="vesselYear" name="vessel_year" min="1900" max="2025" required>
                </div>
                <div class="form-group">
                    <label for="vesselMake">Make</label>
                    <input type="text" id="vesselMake" name="vessel_make" required>
                </div>
                <div class="form-group">
                    <label for="vesselLength">Length (feet)</label>
                    <input type="number" id="vesselLength" name="vessel_length" min="1" required>
                </div>
                <div class="form-group">
                    <label for="vesselCondition">Condition</label>
                    <select id="vesselCondition" name="vessel_condition" required>
                        <option value="">Select condition</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                    </select>
                </div>
            `;
            break;
    }
}

function validateStep(step) {
    const page = document.querySelector(`.form-page[data-step="${step}"]`);
    let isValid = true;

    if (step === 1 && !selectedDonationType) {
        alert('Please select a donation type');
        return false;
    }
    
    // Special validation for donation details
    if (step === 2 && selectedDonationType === 'money') {
        // Validate amount selection
        if (selectedAmount === null || isNaN(selectedAmount) || selectedAmount <= 0) {
            alert('Please select or enter a valid donation amount');
            return false;
        }
        
        // Validate credit card details if credit-card is selected
        if (selectedPaymentMethod === 'credit-card') {
            const cardNumber = document.getElementById('cardNumber');
            const cardExpiry = document.getElementById('cardExpiry');
            const cardCvv = document.getElementById('cardCvv');
            
            const isCardValid = validateCardNumber(cardNumber);
            const isExpiryValid = validateExpiry(cardExpiry);
            const isCvvValid = validateCVV(cardCvv);
            
            if (!isCardValid || !isExpiryValid || !isCvvValid) {
                return false;
            }
        }
    }

    // Validate required inputs in the current step
    const inputs = page.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
            
            // Find or create error message
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('card-error')) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'card-error';
                input.parentNode.insertBefore(errorMsg, input.nextElementSibling);
            }
            
            errorMsg.textContent = 'This field is required';
            errorMsg.style.display = 'block';
        } else {
            input.classList.remove('invalid');
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('card-error')) {
                errorMsg.style.display = 'none';
            }
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields');
    }

    return isValid;
}

function updateSummary() {
    const summary = document.getElementById('donationSummary');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    let details = '';
    switch (selectedDonationType) {
        case 'money':
            const amountText = selectedAmount ? `$${selectedAmount}` : `$${document.getElementById('customAmount').value}`;
            const frequencyText = isDonationTypeMonthly ? 'Monthly' : 'One-time';
            const paymentMethodText = selectedPaymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal';
            
            details = `
                <p>Donation Amount: ${amountText}</p>
                <p>Frequency: ${frequencyText}</p>
                <p>Payment Method: ${paymentMethodText}</p>
            `;
            
            if (selectedPaymentMethod === 'credit-card') {
                const cardNumber = document.getElementById('cardNumber').value;
                const last4 = cardNumber.replace(/\s/g, '').slice(-4);
                details += `<p>Card ending in: ****${last4}</p>`;
            }
            break;
            
        case 'vehicle':
            const vehicleType = document.getElementById('vehicleType').value;
            const vehicleYear = document.getElementById('vehicleYear').value;
            const vehicleMake = document.getElementById('vehicleMake').value;
            const vehicleModel = document.getElementById('vehicleModel').value;
            details = `<p>Vehicle Type: ${vehicleType}</p><p>Year: ${vehicleYear}</p><p>Make: ${vehicleMake}</p><p>Model: ${vehicleModel}</p>`;
            break;
            
        case 'vessel':
            const vesselType = document.getElementById('vesselType').value;
            const vesselYear = document.getElementById('vesselYear').value;
            const vesselMake = document.getElementById('vesselMake').value;
            const vesselLength = document.getElementById('vesselLength').value;
            details = `<p>Vessel Type: ${vesselType}</p><p>Year: ${vesselYear}</p><p>Make: ${vesselMake}</p><p>Length: ${vesselLength} feet</p>`;
            break;
    }

    summary.innerHTML = `
        <div class="form-group">
            <h3>Personal Information</h3>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
        </div>
        <div class="form-group">
            <h3>Donation Information</h3>
            <p>Type: ${selectedDonationType.charAt(0).toUpperCase() + selectedDonationType.slice(1)}</p>
            ${details}
        </div>
    `;
}

function handleSubmit(event) {
    event.preventDefault();
    if (validateStep(4)) {
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        // Prepare the donation details
        let donationDetails = '';
        switch (selectedDonationType) {
            case 'money':
                const amountText = selectedAmount ? `$${selectedAmount}` : `$${document.getElementById('customAmount').value}`;
                const frequencyText = isDonationTypeMonthly ? 'Monthly' : 'One-time';
                donationDetails = `Amount: ${amountText}, Frequency: ${frequencyText}, Method: ${selectedPaymentMethod}`;
                break;
                
            case 'vehicle':
                const vehicleType = document.getElementById('vehicleType').value;
                const vehicleYear = document.getElementById('vehicleYear').value;
                const vehicleMake = document.getElementById('vehicleMake').value;
                const vehicleModel = document.getElementById('vehicleModel').value;
                donationDetails = `Vehicle Type: ${vehicleType}, Year: ${vehicleYear}, Make: ${vehicleMake}, Model: ${vehicleModel}`;
                break;
                
            case 'vessel':
                const vesselType = document.getElementById('vesselType').value;
                const vesselYear = document.getElementById('vesselYear').value;
                const vesselMake = document.getElementById('vesselMake').value;
                const vesselLength = document.getElementById('vesselLength').value;
                donationDetails = `Vessel Type: ${vesselType}, Year: ${vesselYear}, Make: ${vesselMake}, Length: ${vesselLength} feet`;
                break;
        }
        
        // Create a data object to send to Web3Forms
        const formData = {
            access_key: "29a03125-9517-47d2-8222-1577fb054c2d", // Replace with your Web3Forms access key
            subject: "New Donation Submission",
            name: name,
            email: email,
            phone: phone,
            donation_type: selectedDonationType,
            donation_details: donationDetails,
            from_page: window.location.href
        };
        
        // Disable the submit button and show loading state
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('submitBtn').innerHTML = "Sending...";
        
        // Send form data to Web3Forms API
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                // Show success message
                document.getElementById('donationForm').style.display = 'none';
                document.querySelector('.success-message').classList.add('active');
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            } else {
                console.log(json);
                alert("Error: " + json.message);
                document.getElementById('submitBtn').disabled = false;
                document.getElementById('submitBtn').innerHTML = "Submit Donation";
            }
        })
        .catch(error => {
            console.log(error);
            alert("Something went wrong submitting the form. Please try again.");
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('submitBtn').innerHTML = "Submit Donation";
        });
    }
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    showStep(1);
});

// SUBMIT FOOTER LOGIC
document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");

    // Email Validation
    emailInput.addEventListener("input", function () {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            emailInput.style.border = "2px solid red";
        } else {
            emailInput.style.border = "2px solid green";
        }
    });

    // Message Validation (Limit to 500 characters)
    messageInput.addEventListener("input", function () {
        if (messageInput.value.length > 500) {
            messageInput.value = messageInput.value.substring(0, 500);
        }
    });

    // Submit Button Animation
    form.addEventListener("submit", function (e) {
        submitBtn.innerHTML = "Sending...";
        submitBtn.style.background = "#d4a60b";
        submitBtn.disabled = true;
    });
});

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    showStep(1);
});
