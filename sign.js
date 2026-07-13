         async function submitForm(event) {
                event.preventDefault(); // Prevent normal form submission

                // Get input values
                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;

                // Validate inputs
                if (password.length < 6) {
                    showPopup("Password must be at least 6 characters long!");
                    return;
                }

                try {
                    // Send data to the Node.js server
                    const response = await fetch("http://localhost:3000/signup", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, password }),
                    });

                    const data = await response.json();

                    // Show success or error message
                    if (data.success) {
                        showPopup(data.message);
                    }
                    else {
                        showPopup("message: " + data.message);
                    }
                } catch (error) {
                    showPopup("Error connecting to the server!");
                    console.error("fetch error : " ,error);
                }
            }

            // Function to show a popup message
            function showPopup(message) {
              const popup = document.getElementById("popup");
              const popupMessage= document.getElementById("popup-message");

              popupMessage.textContent= message;
              popup.classList.add("active");
                // Remove the popup after 3 seconds
                setTimeout(() => {
                    popup.classList.remove("active");
                }, 3000);
            }
