// password prompt
// The real <input type="password"> holds the actual value and gets full native
// mobile keyboard behavior (autocorrect, predictive text, swipe-typing, backspace,
// selection, autofill all just work). This function only updates the purely
// visual flower overlay sitting on top of it — it never touches input.value,
// so it can't fight the keyboard the way the old version did.
function updatepassword(event){
    const input = document.getElementById('password');
    const mask = document.getElementById('password-mask');
    if (mask) {
        mask.textContent = '✿'.repeat(input.value.length);
    }
}



function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value; // Use the actual password entered by the user
    
    // Make sure both username and password are provided
    if (!username || !password) {
    showPopup("Please enter both username and password:");
    return;
    }
    
    // Send the login request to the server
    fetch("https://notes-webapp-for-android-production.up.railway.app/login", {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
    showPopup("Login successful!!");
    // Redirect to another page if needed
    setTimeout(()=>{ 
    window.location.href = 'notes.html'; // Modify as needed
    },2000);
    } else {
    showPopup("Invalid username or password");
    }
    })
    .catch(error => {
    console.error("Error during login:", error);
    showPopup("An error occurred. Please try again.");
    });
    }
    function showPopup(message) {
        const popup = document.getElementById('popup');
        const popupMessage= popup.querySelector('.popup-message');
    
        popupMessage.textContent= message;
        popup.classList.add('active');
      }
      function closePopup(){
        const popup = document.getElementById('popup');
        popup.classList.remove('active');
      }
