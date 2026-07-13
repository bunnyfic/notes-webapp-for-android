// password promt
let actualpassword="";
function updatepassword(event){
    const input= document.getElementById('password');
    let inputvalue = input.value;
if (inputvalue.length > actualpassword.length){
    actualpassword += inputvalue[inputvalue.length-1];
} else {
    actualpassword=actualpassword.slice(0,-1);
}
input.value= '✿'.repeat(actualpassword.length);
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
    
    

