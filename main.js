let currentNoteCard = null; // To keep track of the note being edited

// Function to toggle the visibility of the note container
function togglenote() {
  const notecontainer = document.querySelector('.note-container');
  const circlebutton = document.querySelector('.cir-but');
  notecontainer.classList.toggle('visible'); 
  if (notecontainer.classList.contains('visible')) {
    circlebutton.style.visibility = 'hidden';
  } else {
    circlebutton.style.visibility = 'visible';
  }
}

// Formatting toolbar functions (bold, italic, underline)
document.getElementById("bold").addEventListener("click", function() {
  document.execCommand("bold", false, null);
});
document.getElementById("italic").addEventListener("click", function() {
  document.execCommand("italic", false, null);
});
document.getElementById("underline").addEventListener("click", function() {
  document.execCommand("underline", false, null);
});

// Fetch notes from backend and display them
function fetchNotes(user_id) {
  fetch(`https://notes-webapp-for-android-production.up.railway.app/get-notes/${user_id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const notes = data.notes;
        const noteLists = document.getElementById('note-lists');
        noteLists.innerHTML = ''; // Clear existing notes

        notes.forEach(note => {
          const noteCard = document.createElement('div');
          noteCard.className = 'note-card';
          noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button class="delete-note"><b><big>X</big></b></button>
          `;
          noteCard.querySelector('h3').addEventListener('click', () => editnote(noteCard, note.note_id));
          noteCard.querySelector('p').addEventListener('click', () => editnote(noteCard, note.note_id));
          noteCard.querySelector('.delete-note').addEventListener('click', () => deleteNote(note.note_id));

          noteLists.appendChild(noteCard);
        });
      }
    })
    .catch(error => console.error("Error fetching notes:", error));
}

// Function to open the note container and populate it for editing
function editnote(noteCard, note_id) {
  const titleInput = document.querySelector('.title-input');
  const noteText = document.querySelector('.note-text');

  currentNoteCard = noteCard; // Store the reference to the current note card

  // Fetch the note details from the backend
  fetch(`https://notes-webapp-for-android-production.up.railway.app/get-notes/${note_id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const note = data.notes[0];
        titleInput.value = note.title;
        noteText.innerHTML = note.content;

        // Show the note container for editing
        togglenote();
      }
    });
}

// Function to save or update a note
function savenote() {
  const titleInput = document.querySelector('.title-input');
  const noteText = document.querySelector('.note-text');
  const user_id = 1; // Replace with actual logged-in user's ID

  const title = titleInput.value.trim();
  const content = noteText.innerHTML.trim();

  if (!title && !content) {
    showPopup('Note is empty');
    return;
  }

  const note = { user_id, title, content };

  if (currentNoteCard) {
    // Update existing note
    updateNote(note);
  } else {
    // Save new note
    fetch("https://notes-webapp-for-android-production.up.railway.app/add-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(note)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Note added successfully!");
          fetchNotes(user_id); // Refresh the notes list
        }
      });
  }

  titleInput.value = '';
  noteText.innerHTML = '';
  togglenote();
}

// Function to update an existing note
function updateNote(note) {
  fetch("https://notes-webapp-for-android-production.up.railway.app/update-note", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Note updated successfully!");
        fetchNotes(note.user_id); // Refresh the notes list
      }
    });
}

// Function to delete a specific note
function deleteNote(note_id) {
  const user_id = 1; // Replace with actual logged-in user's ID

  fetch("https://notes-webapp-for-android-production.up.railway.app/delete-note", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ note_id, user_id })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Note deleted successfully!");
        fetchNotes(user_id); // Refresh the notes list
      }
    })
    .catch(error => console.error("Error deleting note:", error));
}

// Function to delete all notes
function deleteAllNotes() {
  const user_id = 1; // Replace with actual logged-in user's ID

  fetch("https://notes-webapp-for-android-production.up.railway.app/delete-all-notes", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user_id })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("All notes deleted successfully!");
        fetchNotes(user_id); // Refresh the notes list
      }
    })
    .catch(error => console.error("Error deleting all notes:", error));
}

// Popup management for user alerts
function showPopup(message) {
  const popup = document.getElementById('popup');
  const popupMessage = popup.querySelector('.popup-message');
  popupMessage.textContent = message;
  popup.classList.add('active');
}

function closePopup() {
  const popup = document.getElementById('popup');
  popup.classList.remove('active');
}

// Confirmation dialog for deleting all notes
function confirmdel(message, onconfirm) {
  const confirmdialog = document.getElementById('custom-confirm');
  const confirmmessage = document.getElementById('confirm-message');
  const confirmyes = document.getElementById('confirm-yes');
  const confirmno = document.getElementById('confirm-no');

  confirmmessage.textContent = message;
  confirmdialog.style.display = 'flex';
  confirmyes.onclick = () => {
    confirmdialog.style.display = 'none';
    onconfirm();
  };
  confirmno.onclick = () => {
    confirmdialog.style.display = 'none';
  };
}
