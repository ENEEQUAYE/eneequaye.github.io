// Global variables
let users = [];
const API_URL = "http://localhost:5000/api";

// Function to fetch users from the server
async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        users = await response.json();
        displayUsers();
    } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users. Please try again.");
    }
}

// Function to display users in the table
function displayUsers() {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    users.forEach((user, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
    });
}

// Function to show the add user modal
function showAddUserModal() {
    document.getElementById("userModalLabel").textContent = "Add User";
    document.getElementById("userId").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("role").value = "";
    new bootstrap.Modal(document.getElementById("userModal")).show();
}

// Function to edit a user
function editUser(userId) {
    const user = users.find((u) => u._id === userId);
    if (user) {
        document.getElementById("userModalLabel").textContent = "Edit User";
        document.getElementById("userId").value = user._id;
        document.getElementById("firstName").value = user.firstName;
        document.getElementById("lastName").value = user.lastName;
        document.getElementById("email").value = user.email;
        document.getElementById("role").value = user.role;
        new bootstrap.Modal(document.getElementById("userModal")).show();
    }
}

// Function to save a user (create or update)
async function saveUser() {
    const userId = document.getElementById("userId").value;
    const userData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value,
    };

    try {
        const url = userId ? `${API_URL}/user/${userId}` : `${API_URL}/user`;
        const method = userId ? "PUT" : "POST";
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("Failed to save user");
        }

        bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
        fetchUsers();
    } catch (error) {
        console.error("Error saving user:", error);
        alert("Failed to save user. Please try again.");
    }
}

// Function to delete a user
async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        }
    }
}

// Function to handle user search
function searchUsers() {
    const searchTerm = document.getElementById("search-users").value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    displayFilteredUsers(filteredUsers);
}

// Function to display filtered users
function displayFilteredUsers(filteredUsers) {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    filteredUsers.forEach((user, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
    });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
    document.getElementById("search-users").addEventListener("input", searchUsers);
});