// Immediately-invoked function expression to avoid conflicts
(function() {
    // Function to run when DOM is ready
    function initPhoneMask() {
        // Get all phone input fields on the page
        const phoneInputs = document.querySelectorAll("input[type='tel'], input#phone");
        
        // Exit if no phone inputs exist
        if (!phoneInputs.length) return;
       
        // Apply mask to each phone input
        phoneInputs.forEach(phoneInput => {
            // Create a mask placeholder
            phoneInput.placeholder = "(___) ___-____";
           
            // Add input event listener
            phoneInput.addEventListener("input", function(e) {
                // Get only numbers from input
                let numbers = this.value.replace(/\D/g, "");
               
                // Limit to 10 digits
                if (numbers.length > 10) {
                    numbers = numbers.substr(0, 10);
                }
               
                // Format the phone number
                let formatted = "";
                if (numbers.length > 0) {
                    formatted = "(" + numbers.substr(0, 3);
                }
                if (numbers.length > 3) {
                    formatted += ") " + numbers.substr(3, 3);
                }
                if (numbers.length > 6) {
                    formatted += "-" + numbers.substr(6, 4);
                }
               
                // Update the input value
                this.value = formatted;
            });
           
            // Prevent non-numeric characters on keypress
            phoneInput.addEventListener("keypress", function(e) {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                    e.preventDefault();
                }
            });
           
            // Handle paste event to only keep numbers
            phoneInput.addEventListener("paste", function(e) {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const numbers = pastedText.replace(/\D/g, "").substr(0, 10);
               
                // Insert at cursor position
                const start = this.selectionStart;
                const end = this.selectionEnd;
               
                // Get current value and split it
                let currentValue = this.value.replace(/\D/g, "");
               
                // Combine with pasted numbers, limiting to 10 digits
                const newValue = (currentValue.substr(0, start) + numbers + currentValue.substr(end)).substr(0, 10);
               
                // Format and set the new value
                let formatted = "";
                if (newValue.length > 0) {
                    formatted = "(" + newValue.substr(0, 3);
                }
                if (newValue.length > 3) {
                    formatted += ") " + newValue.substr(3, 3);
                }
                if (newValue.length > 6) {
                    formatted += "-" + newValue.substr(6, 4);
                }
               
                this.value = formatted;
            });
        });
    }
   
    // Run when DOM is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPhoneMask);
    } else {
        // DOM already loaded, run now
        initPhoneMask();
    }
})();