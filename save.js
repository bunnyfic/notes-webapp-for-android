let currentNoteCard = null; // To keep track of the note being edited

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

// Function to save or update a note
function savenote() {
  const titleInput = document.querySelector('.title-input');
  const noteText = document.querySelector('.note-text');

  const title = titleInput.value.trim();
  const content = noteText.innerHTML.trim();

  if (!title && !content) {
    alert('Note is empty');
    return;
  }

  if (currentNoteCard) {
    // Update existing note card
    currentNoteCard.querySelector('h3').textContent = title || 'Untitled Note';
    currentNoteCard.querySelector('p').innerHTML = content;
    currentNoteCard = null; // Reset after editing
  } else {
    // Create a new note card
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `<h3>${title || 'Untitled Note'}</h3>
                              <p>${content}</p>`;

    // Add click listener to enable editing
    noteCard.addEventListener('click', () => editnote(noteCard));

    // Append the card to the notes list
    const noteLists = document.getElementById('note-lists');
    noteLists.appendChild(noteCard);
  }

  // Clear the input fields
  titleInput.value = '';
  noteText.innerHTML = '';

  // Hide the note container
  togglenote();
}