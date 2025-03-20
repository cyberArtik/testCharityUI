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

    prevBtn.style.display = step === 1 ? 'none' : 'block';
    nextBtn.style.display = step === 4 ? 'none' : 'block';
    submitBtn.style.display = step === 4 ? 'block' : 'none';

    updateProgress();
    updateSteps();
}

function selectDonationType(type) {
    selectedDonationType = type;
    document.querySelectorAll('.donation-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    // Update donation-specific fields
    const fields = document.getElementById('donationSpecificFields');
    fields.innerHTML = '';

    switch (type) {
        case 'money':
            fields.innerHTML = `
                <div class="form-group">
                    <label for="amount">Donation Amount ($)</label>
                    <input type="number" id="amount" name="amount" min="1" required>
                </div>
                <div class="form-group">
                    <label for="frequency">Donation Frequency</label>
                    <select id="frequency" name="frequency" required>
                        <option value="once">One-time</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            `;
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
    const inputs = page.querySelectorAll('input, select, textarea');
    let isValid = true;

    if (step === 1 && !selectedDonationType) {
        alert('Please select a donation type');
        return false;
    }

    inputs.forEach(input => {
        if (input.required && !input.value) {
            isValid = false;
            input.classList.add('invalid');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields');
    }

    return isValid;
}

function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < 4) {
            currentStep++;
            showStep(currentStep);
        }
        if (currentStep === 4) {
            updateSummary();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function updateSummary() {
    const summary = document.getElementById('donationSummary');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    let details = '';
    switch (selectedDonationType) {
        case 'money':
            const amount = document.getElementById('amount').value;
            const frequency = document.getElementById('frequency').value;
            details = `Donation Amount: $${amount}<br>Frequency: ${frequency}`;
            break;
        case 'vehicle':
            const vehicleType = document.getElementById('vehicleType').value;
            const vehicleYear = document.getElementById('vehicleYear').value;
            const vehicleMake = document.getElementById('vehicleMake').value;
            const vehicleModel = document.getElementById('vehicleModel').value;
            details = `Vehicle Type: ${vehicleType}<br>Year: ${vehicleYear}<br>Make: ${vehicleMake}<br>Model: ${vehicleModel}`;
            break;
        case 'vessel':
            const vesselType = document.getElementById('vesselType').value;
            const vesselYear = document.getElementById('vesselYear').value;
            const vesselMake = document.getElementById('vesselMake').value;
            const vesselLength = document.getElementById('vesselLength').value;
            details = `Vessel Type: ${vesselType}<br>Year: ${vesselYear}<br>Make: ${vesselMake}<br>Length: ${vesselLength} feet`;
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
                const amount = document.getElementById('amount').value;
                const frequency = document.getElementById('frequency').value;
                donationDetails = `Donation Amount: $${amount}, Frequency: ${frequency}`;
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