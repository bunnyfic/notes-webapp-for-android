function savenote() {
  const titleInput = document.querySelector('.title-input');
  const noteText = document.querySelector('.note-text');

  const title = titleInput.value.trim();
  const content = noteText.innerHTML.trim();

  if (!title && !content) {
    showPopup('Note is empty');
    return;
  }

  if (currentNoteCard) {
    // Update existing note card
    currentNoteCard.querySelector('h3').textContent = title || 'Untitled Note';
    currentNoteCard.querySelector('p').innerHTML = content || 'No content';
    currentNoteCard = null; // Reset after editing
  } else {
    // Create a new note card
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `
      <h3>${title || 'Untitled Note'}</h3>
      <p>${content || 'No content'}</p>
      <button class="delete-note">Delete</button>
    `;

    // Add click listener for editing
    noteCard.querySelector('h3').addEventListener('click', () => editnote(noteCard));
    noteCard.querySelector('p').addEventListener('click', () => editnote(noteCard));

    // Add listener for individual delete
    noteCard.querySelector('.delete-note').addEventListener('click', () => deleteNote(noteCard));

    // Append the card to the notes list
    const noteLists = document.getElementById('note-lists');
    noteLists.appendChild(noteCard);
  }

  // Clear the input fields
  titleInput.value = '';
  noteText.innerHTML = '';

  // Hide the note container
  togglenote();

  // Update the delete button state
  updateDeleteButtonState();
}

function deleteNote(noteCard) {
  const noteLists = document.getElementById('note-lists');
  noteLists.removeChild(noteCard);
  updateDeleteButtonState();
}
function deleteAllNotes() {
  const noteLists = document.getElementById('note-lists');
  noteLists.innerHTML = '';
  updateDeleteButtonState();
}
