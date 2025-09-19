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

document.querySelectorAll('.impact-number').forEach(number => {
    observer.observe(number);
});

function animateNumber(element, target) {
    let current = 0;
    const duration = 2000;
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

let currentStep = 1;
let selectedDonationType = null;
let selectedAmount = null;
let isDonationTypeMonthly = true;

const PAYMENT_LINKS = {
    monthly: {
        15: 'https://square.link/u/KNorCkT7',
        25: 'https://square.link/u/sVwYKB2R',
        35: 'https://square.link/u/xsxF6gV7?src=embed',
        50: 'https://square.link/u/xsxF6gV7?src=embed',
        75: 'https://square.link/u/xsxF6gV7?src=embed',
        100: 'https://square.link/u/xsxF6gV7?src=embed'
    },
    onetime: {
        50: 'https://square.link/u/hd58eTrh',
        100: 'https://square.link/u/XSQFawXv',
        150: 'https://square.link/u/xsxF6gV7?src=embed',
        300: 'https://square.link/u/xsxF6gV7?src=embed',
        500: 'https://square.link/u/xsxF6gV7?src=embed',
        1000: 'https://square.link/u/xsxF6gV7?src=embed'
    }
};

const DEFAULT_PAYMENT_LINK = 'https://square.link/u/xsxF6gV7?src=embed';

function getPaymentLink(amount) {
    const donationType = isDonationTypeMonthly ? 'monthly' : 'onetime';

    console.log('Getting payment link for:', {
        amount: amount,
        donationType: donationType,
        isDonationTypeMonthly: isDonationTypeMonthly
    });

    if (PAYMENT_LINKS[donationType] && PAYMENT_LINKS[donationType][amount]) {
        console.log('Found specific link:', PAYMENT_LINKS[donationType][amount]);
        return PAYMENT_LINKS[donationType][amount];
    }

    console.log('Using default link:', DEFAULT_PAYMENT_LINK);
    return DEFAULT_PAYMENT_LINK;
}

function validateFullName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function validatePhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('invalid');

    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('invalid');

    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progress = ((currentStep - 1) / 3) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function updateSteps() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.toggle('active', stepNum === currentStep);
        step.classList.toggle('completed', stepNum < currentStep);
    });
}

function showStep(step) {
    // Проверить, есть ли элементы donation формы на странице
    const donationFormExists = document.querySelector('.form-page[data-step="1"]');
    if (!donationFormExists) {
        return; // Выйти, если это не donation страница
    }

    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });

    const currentPage = document.querySelector(`.form-page[data-step="${step}"]`);
    if (currentPage) {
        currentPage.classList.add('active');
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const formNavigation = document.querySelector('.form-navigation');

    if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'block';

    if (nextBtn) {
        nextBtn.style.display = step === 4 ? 'none' : 'block';
    }

    if (submitBtn) {
        submitBtn.style.display = (step === 4 && selectedDonationType !== 'money') ? 'block' : 'none';
    }

    if (formNavigation) {
        formNavigation.style.display = step === 1 ? 'none' : 'flex';
    }

    updateProgress();
    updateSteps();
}

function selectDonationType(type) {
    selectedDonationType = type;
    document.querySelectorAll('.donation-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    setTimeout(() => {
        nextStep();
    }, 300);
}

function selectMonetaryDonationType(element, type) {
    const options = document.querySelectorAll('.donation-type-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    isDonationTypeMonthly = (type === 'monthly');

    updateAmountOptions();
}

function updateAmountOptions() {
    const amountOptionsContainer = document.querySelector('.amount-options');
    if (amountOptionsContainer) {
        if (isDonationTypeMonthly) {
            amountOptionsContainer.innerHTML = `
                <div class="amount-option" data-amount="15" onclick="selectAmount(this, 15)">$15</div>
                <div class="amount-option" data-amount="25" onclick="selectAmount(this, 25)">$25</div>
                <div class="amount-option" data-amount="35" onclick="selectAmount(this, 35)">$35</div>
                <div class="amount-option" data-amount="50" onclick="selectAmount(this, 50)">$50</div>
                <div class="amount-option" data-amount="75" onclick="selectAmount(this, 75)">$75</div>
                <div class="amount-option" data-amount="100" onclick="selectAmount(this, 100)">$100</div>
                <div class="amount-option" data-amount="other" onclick="selectAmount(this, 'other')">Other</div>
            `;
            const firstOption = document.querySelector('.amount-option');
            if (firstOption) {
                firstOption.classList.add('selected');
                selectedAmount = 15;
            }
        } else {
            amountOptionsContainer.innerHTML = `
                <div class="amount-option" data-amount="50" onclick="selectAmount(this, 50)">$50</div>
                <div class="amount-option" data-amount="100" onclick="selectAmount(this, 100)">$100</div>
                <div class="amount-option" data-amount="150" onclick="selectAmount(this, 150)">$150</div>
                <div class="amount-option" data-amount="300" onclick="selectAmount(this, 300)">$300</div>
                <div class="amount-option" data-amount="500" onclick="selectAmount(this, 500)">$500</div>
                <div class="amount-option" data-amount="1000" onclick="selectAmount(this, 1000)">$1000</div>
                <div class="amount-option" data-amount="other" onclick="selectAmount(this, 'other')">Other</div>
            `;
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

function updateDonationDetails() {
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
            `;

            selectedAmount = isDonationTypeMonthly ? 15 : 50;
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

function nextStep() {
    if (validateStep(currentStep)) {
        const currentPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);

        if (currentPage) {
            currentPage.classList.add('slide-out');

            setTimeout(() => {
                currentPage.classList.remove('slide-out');

                if (currentStep < 4) {
                    currentStep++;
                    showStep(currentStep);

                    const nextPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);
                    if (nextPage) {
                        nextPage.classList.add('slide-in');
                        setTimeout(() => {
                            nextPage.classList.remove('slide-in');
                        }, 300);
                    }

                    if (currentStep === 2) {
                        updateDonationDetails();
                    }
                }

                if (currentStep === 4) {
                    updateSummary();
                }
            }, 300);
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        const currentPage = document.querySelector(`.form-page[data-step="${currentStep}"]`);

        if (currentPage) {
            currentPage.classList.add('slide-out-reverse');

            setTimeout(() => {
                currentPage.classList.remove('slide-out-reverse');

                currentStep--;
                showStep(currentStep);

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

function validateStep(step) {
    const page = document.querySelector(`.form-page[data-step="${step}"]`);
    let isValid = true;

    if (step === 1 && !selectedDonationType) {
        alert('Please select a donation type');
        return false;
    }

    if (step === 2 && selectedDonationType === 'money') {
        if (selectedAmount === null || isNaN(selectedAmount) || selectedAmount <= 0) {
            alert('Please select or enter a valid donation amount');
            return false;
        }
    }

    if (step === 3) {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');

        clearFieldError('name');
        clearFieldError('email');
        clearFieldError('phone');

        if (!name.value.trim()) {
            showFieldError('name', 'Full name is required');
            isValid = false;
        } else if (!validateFullName(name.value)) {
            showFieldError('name', 'Please enter a valid full name (2-50 characters, letters only)');
            isValid = false;
        }

        if (!email.value.trim()) {
            showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!phone.value.trim()) {
            showFieldError('phone', 'Phone number is required');
            isValid = false;
        } else if (!validatePhone(phone.value)) {
            showFieldError('phone', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        return isValid;
    }

    const inputs = page.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    });

    if (!isValid && selectedDonationType !== 'money' && step !== 3) {
        alert('Please fill in all required fields');
    }

    return isValid;
}

function updateSummary() {
    const summary = document.getElementById('donationSummary');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    let donationDisplay = '';
    let donationTypeText = '';

    switch (selectedDonationType) {
        case 'money':
            const amount = selectedAmount || document.getElementById('customAmount').value;
            const frequency = isDonationTypeMonthly ? 'Monthly' : 'One-time';
            donationDisplay = `$${amount}`;
            donationTypeText = `${frequency} Donation`;
            break;

        case 'vehicle':
            const vehicleType = document.getElementById('vehicleType').value;
            const vehicleYear = document.getElementById('vehicleYear').value;
            const vehicleMake = document.getElementById('vehicleMake').value;
            const vehicleModel = document.getElementById('vehicleModel').value;
            donationDisplay = `${vehicleYear} ${vehicleMake} ${vehicleModel}`;
            donationTypeText = 'Vehicle Donation';
            break;

        case 'vessel':
            const vesselType = document.getElementById('vesselType').value;
            const vesselYear = document.getElementById('vesselYear').value;
            const vesselMake = document.getElementById('vesselMake').value;
            const vesselLength = document.getElementById('vesselLength').value;
            donationDisplay = `${vesselYear} ${vesselMake}`;
            donationTypeText = 'Vessel Donation';
            break;
    }

    summary.innerHTML = `
        <div class="minimal-confirmation">
            <div class="confirmation-header">
                <h2>Confirm Your Donation</h2>
                <p>Please review your information before proceeding</p>
            </div>
            
            <div class="summary-card">
                <div class="donation-preview">
                    <div class="donation-amount">${donationDisplay}</div>
                    <div class="donation-type">${donationTypeText}</div>
                </div>
                
                <div class="divider"></div>
                
                <div class="contact-info">
                    <div class="info-row">
                        <span class="label">Name</span>
                        <span class="value">${name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Email</span>
                        <span class="value">${email}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Phone</span>
                        <span class="value">${phone}</span>
                    </div>
                </div>
            </div>
            
            ${selectedDonationType === 'money' ? `
                <div class="payment-action">
                    <button class="donate-btn" onclick="handleDonateClick()" id="minimal-donate-btn">
                        <span class="btn-text">Donate ${donationDisplay}</span>
                        <span class="btn-arrow">→</span>
                    </button>
                    <div class="security-note">
                        <span class="lock-icon">🔒</span>
                        <span>Secure payment by Square</span>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    addMinimalStyles();
}

function addMinimalStyles() {
    if (document.getElementById('minimal-confirmation-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'minimal-confirmation-styles';
    style.textContent = `
        .minimal-confirmation {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .confirmation-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .confirmation-header h2 {
            color: #1a1a1a;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .confirmation-header p {
            color: #666;
            font-size: 16px;
            margin: 0;
        }

        .summary-card {
            background: #fff;
            border: 2px solid #f0f0f0;
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 32px;
            transition: border-color 0.2s ease;
        }

        .summary-card:hover {
            border-color: #e0e0e0;
        }

        .donation-preview {
            text-align: center;
            margin-bottom: 24px;
        }

        .donation-amount {
            font-size: 48px;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 1;
            margin-bottom: 8px;
            letter-spacing: -1px;
        }

        .donation-type {
            font-size: 16px;
            color: #666;
            font-weight: 500;
        }

        .divider {
            height: 1px;
            background: #f0f0f0;
            margin: 24px 0;
        }

        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 4px;
        }

        .label {
            font-size: 14px;
            color: #888;
            font-weight: 500;
        }

        .value {
            font-size: 16px;
            color: #1a1a1a;
            font-weight: 600;
        }

        .payment-action {
            text-align: center;
        }

        .donate-btn {
            background: #1a1a1a;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            min-width: 200px;
            justify-content: center;
            margin-bottom: 16px;
        }

        .donate-btn:hover {
            background: #333;
            transform: translateY(-1px);
        }

        .donate-btn:active {
            transform: translateY(0);
        }

        .donate-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .btn-text {
            flex: 1;
            text-align: center;
        }

        .btn-arrow {
            font-size: 18px;
            transition: transform 0.2s ease;
        }

        .donate-btn:hover .btn-arrow {
            transform: translateX(4px);
        }

        .security-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            color: #888;
        }

        .lock-icon {
            font-size: 14px;
        }

        .field-error {
            color: #dc3545;
            font-size: 14px;
            margin-top: 5px;
            display: block;
        }

        .form-group input.invalid,
        .form-group select.invalid {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }

        @media (max-width: 768px) {
            .minimal-confirmation {
                padding: 16px;
            }

            .summary-card {
                padding: 24px;
            }

            .donation-amount {
                font-size: 40px;
            }

            .donate-btn {
                width: 100%;
                padding: 18px 32px;
            }
        }
    `;

    document.head.appendChild(style);
}

function handleDonateClick() {
    const donateButton = document.getElementById('minimal-donate-btn');
    const originalText = donateButton.innerHTML;

    donateButton.innerHTML = `
        <span class="btn-text">Processing...</span>
        <span class="btn-arrow">⏳</span>
    `;

    donateButton.disabled = true;

    const paymentLink = getPaymentLink(selectedAmount);

    setTimeout(() => {
        const url = paymentLink;
        const title = 'Square Payment Links';
        const topWindow = window.top ? window.top : window;
        const dualScreenLeft = topWindow.screenLeft !== undefined ? topWindow.screenLeft : topWindow.screenX;
        const dualScreenTop = topWindow.screenTop !== undefined ? topWindow.screenTop : topWindow.screenY;
        const width = topWindow.innerWidth ? topWindow.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = topWindow.innerHeight ? topWindow.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        const h = height * .75;
        const w = 500;
        const systemZoom = width / topWindow.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft;
        const top = (height - h) / 2 / systemZoom + dualScreenTop;
        const newWindow = window.open(url, title, `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`);

        if (window.focus) newWindow.focus();

        setTimeout(() => {
            donateButton.innerHTML = originalText;
            donateButton.disabled = false;
        }, 1000);
    }, 500);
}

function showCheckoutWindow(e) {
    e.preventDefault();
    handleDonateClick();
}

function handleSubmit(event) {
    event.preventDefault();

    console.log('Form submission started for:', selectedDonationType);

    if (validateStep(4)) {
        if (selectedDonationType !== 'money') {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            console.log('Personal info:', { name, email, phone });

            let donationDetails = '';
            let donationValue = '';

            try {
                switch (selectedDonationType) {
                    case 'vehicle':
                        const vehicleType = document.getElementById('vehicleType').value;
                        const vehicleYear = document.getElementById('vehicleYear').value;
                        const vehicleMake = document.getElementById('vehicleMake').value;
                        const vehicleModel = document.getElementById('vehicleModel').value;
                        const vehicleCondition = document.getElementById('vehicleCondition').value;

                        donationDetails = `Vehicle Details:\n- Type: ${vehicleType}\n- Year: ${vehicleYear}\n- Make: ${vehicleMake}\n- Model: ${vehicleModel}\n- Condition: ${vehicleCondition}`;
                        donationValue = `${vehicleYear} ${vehicleMake} ${vehicleModel}`;
                        break;

                    case 'vessel':
                        const vesselType = document.getElementById('vesselType').value;
                        const vesselYear = document.getElementById('vesselYear').value;
                        const vesselMake = document.getElementById('vesselMake').value;
                        const vesselLength = document.getElementById('vesselLength').value;
                        const vesselCondition = document.getElementById('vesselCondition').value;

                        donationDetails = `Vessel Details:\n- Type: ${vesselType}\n- Year: ${vesselYear}\n- Make: ${vesselMake}\n- Length: ${vesselLength} feet\n- Condition: ${vesselCondition}`;
                        donationValue = `${vesselYear} ${vesselMake} (${vesselLength} ft)`;
                        break;
                }

                console.log('Donation details:', donationDetails);

                const formData = {
                    access_key: "29a03125-9517-47d2-8222-1577fb054c2d",
                    subject: `New ${selectedDonationType.charAt(0).toUpperCase() + selectedDonationType.slice(1)} Donation - ${donationValue}`,
                    name: name,
                    email: email,
                    phone: phone,
                    donation_type: selectedDonationType.charAt(0).toUpperCase() + selectedDonationType.slice(1),
                    donation_details: donationDetails,
                    message: `New ${selectedDonationType} donation submission:\n\nDonor Information:\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone}\n\n${donationDetails}\n\nSubmitted from: ${window.location.href}`,
                    from_page: window.location.href
                };

                console.log('Form data to send:', formData);

                const submitButton = document.getElementById('submitBtn');
                submitButton.disabled = true;
                submitButton.innerHTML = "Sending...";

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(formData)
                })
                    .then(async (response) => {
                        console.log('Response status:', response.status);
                        let json = await response.json();
                        console.log('Response data:', json);

                        if (response.status == 200) {
                            console.log('Form submitted successfully!');
                            document.getElementById('donationForm').style.display = 'none';
                            document.querySelector('.success-message').classList.add('active');

                            setTimeout(() => {
                                window.location.reload();
                            }, 5000);
                        } else {
                            console.error('Form submission error:', json);
                            alert("Error submitting form: " + (json.message || 'Unknown error'));
                            submitButton.disabled = false;
                            submitButton.innerHTML = "Submit Donation";
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        alert("Network error. Please check your connection and try again.");
                        submitButton.disabled = false;
                        submitButton.innerHTML = "Submit Donation";
                    });

            } catch (error) {
                console.error('Error preparing form data:', error);
                alert("Error preparing form data. Please try again.");
            }
        }
    }
}

function handleFooterContact(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const message = form.message.value;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.innerHTML = "Sending...";
    submitButton.disabled = true;
    submitButton.style.background = "#d4a60b";

    // Web3Forms (optional, can keep if you want backup submission)
    const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY'; // Ваш ключ Web3Forms
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('message', message);
    formData.append('access_key', WEB3FORMS_KEY);
    formData.append('subject', 'New Contact Form Submission from UCS Charity');
    formData.append('from_name', 'UCS Contact Form');

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Web3Forms response:', data);
        if (data.success) {
            // Отправка через Netlify Function вместо прокси
            sendToTelegramViaNetlify(name, email, phone, message, submitButton, originalText, form);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Если Web3Forms не сработал, все равно пробуем Telegram через Netlify
        sendToTelegramViaNetlify(name, email, phone, message, submitButton, originalText, form);
    });
}

function sendToTelegramViaNetlify(name, email, phone, message, submitButton, originalText, form) {
    fetch("https://marvelous-mermaid-7d584b.netlify.app/.netlify/functions/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message })
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            completeSubmission(submitButton, originalText, form, true);
        } else {
            completeSubmission(submitButton, originalText, form, false);
        }
    })
    .catch(err => {
        console.error(err);
        completeSubmission(submitButton, originalText, form, false);
    });
}

function completeSubmission(submitButton, originalText, form, success) {
    if (success) {
        submitButton.innerHTML = "Message Sent!";
        submitButton.style.background = "#28a745";

        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.style.background = "";
        }, 3000);
    } else {
        alert("Error sending message. Please try again or contact us directly.");
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.style.background = "";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const footerForm = document.getElementById('contactForm');
    if (footerForm) {
        footerForm.addEventListener('submit', handleFooterContact);

        const emailInput = footerForm.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener("input", function () {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value)) {
                    emailInput.style.border = "2px solid red";
                } else {
                    emailInput.style.border = "2px solid green";
                }
            });
        }

        const messageInput = footerForm.querySelector('textarea');
        if (messageInput) {
            messageInput.addEventListener("input", function () {
                if (messageInput.value.length > 500) {
                    messageInput.value = messageInput.value.substring(0, 500);
                }
            });
        }
    }
});


