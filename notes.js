function togglenote(){
    const notecontainer = document.querySelector('.note-container');
    const circlebutton = document.querySelector('.cir-but');
    notecontainer.classList.toggle('visible'); 
if (notecontainer.classList.contains('visible')){
  circlebutton.style.visibility = 'hidden';
}else {
  circlebutton.style.visibility = 'visible';
}
}
document.getElementById("bold").addEventListener(
    "click",function() {
    document.execCommand("bold",false,null);
});
document.getElementById("italic").addEventListener(
    "click",function() {
    document.execCommand("italic",false,null);
});
document.getElementById("underline").addEventListener(
    "click",function() {
    document.execCommand("underline",false,null);
});
document.getElementById("monospace").addEventListener("click", function() {
  document.execCommand("fontName", false, "monospace");
});
document.getElementById("list").addEventListener("click", function () {
  // Insert the symbol 𑣿 at the caret position
  const symbol = "𑣿";
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  // Create a text node with the symbol
  const textNode = document.createTextNode(symbol);

  // Insert the symbol at the caret position
  range.insertNode(textNode);

  // Move the caret after the inserted symbol
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);
});

// Function to fetch the current user's username and display a welcome popup
function welcomeUser() {
  fetch("http://localhost:3000/current-user")
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
              showPopup(`Welcome, ${data.username}!`);
          } else {
              console.error("No user logged in");
          }
      })
      .catch((error) => {
          console.error("Error fetching current user:", error);
      });
}
window.addEventListener("DOMContentLoaded", welcomeUser);

let currentNoteCard = null; // To keep track of the note being edited

// Function to open the note container and populate it for editing
/*function editnote(noteCard) {
  const titleInput = document.querySelector('.title-input');
  const noteText = document.querySelector('.note-text');

  currentNoteCard = noteCard; // Store the reference to the current note card

  // Populate the editor with the note card's content
  const title = noteCard.querySelector('h3').textContent;
  const content = noteCard.querySelector('p').innerHTML;

  titleInput.value = title;
  noteText.innerHTML = content;

  // Show the note container for editing
  togglenote();
}*/
// Function to open the note container and populate it for editing
function editnote(noteCard) {
  const titleInput = document.querySelector('.title-input');
  const noteText = document.querySelector('.note-text');

  currentNoteCard = noteCard; // Store the reference to the current note card

  // Populate the editor with the note card's content
  const title = noteCard.querySelector('h3').textContent;
  const content = noteCard.querySelector('p').innerHTML;

  titleInput.value = title;
  noteText.innerHTML = content;

  // Show the note container for editing
  togglenote();
}
function savenote() {
  const titleInput = document.querySelector('.title-input');
  const noteText = document.querySelector('.note-text');

  const title = titleInput.value.trim();
  const content = noteText.innerHTML.trim();

  if (!title && !content) {
    showPopup('Note is empty');
    return;
  }

  const normalizedContent = content
    .replace(/<div>/g, '<br>')
    .replace(/<\/div>/g, '')
    .trim();

  if (currentNoteCard) {
    // Update existing note
    const noteId = currentNoteCard.dataset.id; // Assuming the card has a `data-id` attribute
    fetch("http://localhost:3000/update-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: noteId, title, content: normalizedContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          currentNoteCard.querySelector('h3').textContent = title || 'Untitled Note';
          currentNoteCard.querySelector('p').innerHTML = normalizedContent || 'No content';
          showPopup("Note updated successfully!");
        } else {
          showPopup("Failed to update note.");
        }
      })
      .catch((error) => {
        console.error("Error updating note:", error);
        showPopup("note updated sucessfully.");
        fetchNotes();
      });

    currentNoteCard = null; // Reset after editing
  } else {
    // Create a new note
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `
      <h3>${title || 'Untitled Note'}</h3>
      <p>${normalizedContent || 'No content'}</p>
      <button class="delete-note"><b><big>X</big></b></button>
    `;

    // Add click listeners for editing and deleting
    noteCard.querySelector('h3').addEventListener('click', () => editnote(noteCard));
    noteCard.querySelector('p').addEventListener('click', () => editnote(noteCard));
    noteCard.querySelector('.delete-note').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(noteCard);
    });

    // Append the new card to the list
    const noteLists = document.getElementById('note-lists');
    noteLists.appendChild(noteCard);

    // Save the new note to the database
    fetch("http://localhost:3000/save-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content: normalizedContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          noteCard.dataset.id = data.noteId; // Store the note ID from the server
          showPopup("Note saved successfully!");
        } else {
          showPopup("Failed to save note.");
        }
      })
      .catch((error) => {
        console.error("Error saving note:", error);
        showPopup("Error saving note.");
      });
  }

  // Clear the input fields
  titleInput.value = '';
  noteText.innerHTML = '';

  // Hide the note container
  togglenote();

  // Update the delete button state
  updateDeleteButtonState();
} 

 
   
// Fetch and display all notes for the logged-in user
function fetchNotes() {
  fetch("http://localhost:3000/get-notes")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const noteLists = document.getElementById('note-lists');
        noteLists.innerHTML = ''; // Clear the current notes list
        data.notes.forEach(note => {
          const noteCard = document.createElement('div');
          noteCard.className = 'note-card';
          noteCard.dataset.id = note.id;
          noteCard.innerHTML = `
            <h3>${note.title || 'Untitled Note'}</h3>
            <p>${note.content || 'No content'}</p>
            <button class="delete-note"><b><big>X</big></b></button>
          `;

          // Add click listeners for editing and deleting
          noteCard.querySelector('h3').addEventListener('click', () => editnote(noteCard));
          noteCard.querySelector('p').addEventListener('click', () => editnote(noteCard));
          noteCard.querySelector('.delete-note').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNote(noteCard);
          });

          noteLists.appendChild(noteCard);
        });
      } else {
        console.error("Error fetching notes:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching notes:", error);
    });
}


function deleteNote(noteCard) {
  const noteId = noteCard.dataset.id;

  // Send delete request to the server
  fetch("http://localhost:3000/delete-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: noteId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        noteCard.remove();
        showPopup("Note deleted successfully!");
        updateDeleteButtonState();
      } else {
        showPopup("Failed to delete note.");
      }
    })
    .catch((error) => {
      console.error("Error deleting note:", error);
      showPopup("deleted sucessfully");
    });
}
window.addEventListener("DOMContentLoaded", () => {
  welcomeUser(); // Welcome the user
  fetchNotes();  // Fetch and display notes after login
});

//function to delete all notes
function deleteAllNotes() {
  // Send a request to the server to delete all notes
  fetch("http://localhost:3000/delete-all-notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Clear the notes from the UI
        const noteLists = document.getElementById("note-lists");
        noteLists.innerHTML = ""; // Clear all notes in the frontend
        updateDeleteButtonState(); // Update the delete button state
        showPopup("All notes deleted successfully!"); // Show success message
      } else {
        showPopup("Failed to delete all notes: " + data.message); // Show error message
      }
    })
    .catch((error) => {
      console.error("Error deleting all notes:", error);
      showPopup("Error deleting all notes.");
    });
}

// Add event listener to delete button
const deleteButton = document.querySelector(".delete");
deleteButton.addEventListener("click", function () {
  confirmdel(
    "Are you sure you want to delete all notes?",
    deleteAllNotes // Pass the deleteAllNotes function as the confirmation callback
  );
});

// Function to update the delete button state
function updateDeleteButtonState() {
  const noteLists = document.getElementById("note-lists");
  const deleteButton = document.querySelector(".delete");
  deleteButton.disabled = noteLists.children.length === 0; // Disable button if no notes exist
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

function confirmdel(message, onconfirm){
  const confirmdialog = document.getElementById('custom-confirm');
  const confirmmessage = document.getElementById('confirm-message');
  const confirmyes = document.getElementById('confirm-yes');
  const confirmno = document.getElementById('confirm-no');

   confirmmessage.textContent = message;
   confirmdialog.style.display = 'flex';
   confirmyes.onclick = ()=>{
    confirmdialog.style.display = 'none';
    onconfirm();
   };
   confirmno.onclick= ()=> {
    confirmdialog.style.display = 'none';
   };
}
