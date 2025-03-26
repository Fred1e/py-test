// Initialize socket.io
const socket = io();

// Function to display user status
function updateStatusDisplay(status) {
  document.getElementById('user-status-text').innerText = status;
}

// Function to update status
function changeStatus() {
  const status = prompt("Enter your new status:");
  if (status) {
    fetch('/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', status })
    })
    .then(response => response.json())
    .then(data => updateStatusDisplay(status));
  }
}

// Function to create a new post
function createPost() {
  const content = document.getElementById('post-content').value;
  fetch('/create-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author: 'testuser', content })
  })
  .then(response => response.json())
  .then(data => alert('Post created successfully!'));
}

// Function to create a group
function createGroup() {
  const groupName = prompt("Enter the group name:");
  const description = prompt("Enter the group description:");
  const members = ['testuser'];
  fetch('/create-group', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: groupName, description, members })
  })
  .then(response => response.json())
  .then(data => alert('Group created successfully!'));
}
