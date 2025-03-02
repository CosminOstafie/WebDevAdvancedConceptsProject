// Global array to hold the stores
let stores = [];

// Render the store list in the <ul> element
function renderStores() {
  const ul = document.getElementById('store-list');
  ul.innerHTML = ''; // Clear current list
  
  stores.forEach(store => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${store.name} - Website: <a href="${store.url}" target="_blank">${store.url || 'Not Available'}</a> - District: ${store.district || "Not Available"}
      <button class="remove-btn" data-id="${store.id}">Remove</button>
    `;
    ul.appendChild(li);
  });
}

// Fetch the stores from your backend API
function fetchStores() {
  fetch('http://localhost:3000/api/stores')
    .then(res => res.json())
    .then(data => {
      stores = data;
      renderStores();
    })
    .catch(err => console.error("Error fetching stores", err.stack));
}

// Remove a store using its id (requires backend DELETE support)
function removeStore(id) {
  fetch(`http://localhost:3000/api/stores/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(() => {
    // Refresh the store list after deletion
    fetchStores();
  })
  .catch(err => console.error("Error removing store", err));
}

// Use event delegation for remove button clicks
document.getElementById('store-list').addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('remove-btn')) {
    const id = e.target.getAttribute('data-id');
    removeStore(id);
  }
});

// Sorting functionality: sort stores by the selected field and re-render
document.getElementById('sortBtn').addEventListener('click', function() {
  const sortBy = document.getElementById('sort').value;
  stores.sort((a, b) => {
    if (!a[sortBy]) return 1;
    if (!b[sortBy]) return -1;
    return a[sortBy].localeCompare(b[sortBy]);
  });
  renderStores();
});

// Handle form submission to add a new store
document.getElementById('addStoreForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const newStore = {
    name: document.getElementById('storeName').value,
    url: document.getElementById('storeUrl').value,
    district: document.getElementById('storeDistrict').value || null
  };
  
  // POST the new store to the backend API
  fetch('http://localhost:3000/api/stores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStore)
  })
  .then(res => res.json())
  .then(() => {
    fetchStores();
    e.target.reset(); // Clear form fields
  })
  .catch(err => console.error("Error adding store", err));
});

// Initial fetch of the store list when the page loads
fetchStores();