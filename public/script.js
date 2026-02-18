const API_URL = 'http://localhost:3000/api';

// --- AUTHENTICATION ---

async function registerUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const age = document.getElementById('age').value;
    const contact = document.getElementById('contact').value;
    const name = document.getElementById('name').value; 
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const bloodType = document.getElementById('bloodType').value;

    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, bloodType ,age,contact,name,state,district})
    });
    const data = await res.json();
    alert(data.message || data.error);
    if(data.success) window.location.href = 'login.html';
}

async function loginUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    // if (data.success) {
    //     localStorage.setItem('user', data.username); // Simple session handling
    //     if (data.role === 'donor') window.location.href = 'donor.html';
    //     else if (data.role === 'hospital') window.location.href = 'hospital.html';
    //     else if (data.role === 'admin') window.location.href = 'admin.html';
    // } else {
    //     alert(data.message);
    // }

if (data.success) {
        localStorage.setItem('user', data.username);
        localStorage.setItem('role', data.role); // <--- ADD THIS LINE
        
        if (data.role === 'donor') window.location.href = 'donor.html';
        else if (data.role === 'hospital') window.location.href = 'hospital.html';
        else if (data.role === 'admin') window.location.href = 'admin.html';
    }



}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// --- HOSPITAL FUNCTIONS ---

async function postRequest(e) {
    e.preventDefault();
    const hospitalName = localStorage.getItem('user');
    const bloodType = document.getElementById('reqBloodType').value;
    const units = document.getElementById('units').value;
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;

    const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalName, bloodType, units , state, district })
    });
    const data = await res.json();
    if (data.success) alert('Request Posted!');
}

// --- DONOR FUNCTIONS ---

async function loadRequests() {
    const res = await fetch(`${API_URL}/requests`);
    const requests = await res.json();
    const list = document.getElementById('requestsList');
    
    list.innerHTML = requests.map(req => `
        <div class="card">
            <strong>Hospital:</strong> ${req.hospitalName} <br>
            <strong>Needed:</strong> ${req.units} units of ${req.bloodType} <br>
            <small>Posted on: ${new Date(req.date).toLocaleDateString()}</small><br>
            <small>State:</small> ${user.state} <br>
            <small>Distrct:</small> ${user.district} <br>
        </div>
    `).join('');
}


// ... (Keep all your existing Register, Login, and Hospital code here) ...

// --- ADMIN FUNCTIONS ---

// 1. Load all users (Donors & Hospitals)
async function loadUsers() {
    // Only allow admins to load this data
    const currentUserRole = localStorage.getItem('role'); 
    // Note: In a real app, you'd verify the token on the server side.
    
    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();

        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            // Don't show the admin their own row to prevent accidental self-deletion
            if (user.username === localStorage.getItem('user')) return;

            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role.toUpperCase()}</td>
                <td>${user.bloodType ? user.bloodType : '-'}</td>
                <td>
                    <button class="btn-delete" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Error loading users:", err);
    }
}

// 2. Delete a user
async function deleteUser(userId) {
    if(!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        const data = await res.json();

        if (data.success) {
            alert('User deleted successfully');
            loadUsers(); // Refresh the table
        } else {
            alert('Failed to delete user');
        }
    } catch (err) {
        console.error("Error deleting user:", err);
    }
}