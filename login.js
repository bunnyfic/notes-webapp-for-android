// password promt
let actualpassword="";
function updatepassword(event){
    const input = document.getElementById('password');
    const newValue = input.value;
    const cursorPos = input.selectionStart;
    const oldLength = actualpassword.length;

    if (newValue.length > oldLength) {
        // characters were inserted (typing, autocorrect, paste, predictive text)
        const insertedCount = newValue.length - oldLength;
        const insertPos = Math.max(0, cursorPos - insertedCount);
        const insertedChars = newValue.substring(insertPos, cursorPos);
        actualpassword = actualpassword.slice(0, insertPos) + insertedChars + actualpassword.slice(insertPos);
    } else if (newValue.length < oldLength) {
        // characters were deleted (backspace, delete, autocorrect replace)
        const deletedCount = oldLength - newValue.length;
        actualpassword = actualpassword.slice(0, cursorPos) + actualpassword.slice(cursorPos + deletedCount);
    }

    input.value = '✿'.repeat(actualpassword.length);
    // restore cursor position, since mobile keyboards jump it to the start
    // after the value is programmatically reset
    input.setSelectionRange(cursorPos, cursorPos);
}



function loginUser() {
    const username = document.getElementById('username').value;
    const password = actualpassword; // Use the actual password entered by the user
    
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
