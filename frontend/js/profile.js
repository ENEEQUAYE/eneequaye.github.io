document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html"; // Redirect to login
        return;
    }

    function setProfile() {
        if (user) {
            document.querySelector(".profile img").src = user.profilePicture || "img/user.jpg";
            document.querySelector(".profile span").textContent = user.firstName || "Admin";
        }
    }

    async function fetchProfile() {
        try {
            const response = await fetch("/api/admin/profile", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const userData = await response.json();
            if (response.ok) {
                document.getElementById("userFullName").textContent = `${userData.firstName} ${userData.lastName}`;
                document.getElementById("userPosition").innerHTML = `<i class="fas fa-user-tag"></i> ${userData.role}`;
                document.getElementById("userEmail").innerHTML = `<i class="fas fa-envelope"></i> ${userData.email}`;
                document.getElementById("userPhone").innerHTML = `<i class="fas fa-phone"></i> ${userData.contactNumber || "N/A"}`;
                document.getElementById("profileImage").src = userData.profilePicture || "img/user.jpg";
            } else {
                console.error("Failed to load profile");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    async function updateProfile() {
        const formData = new FormData();
        formData.append("profilePicture", document.getElementById("upload-pic").files[0]);
        formData.append("firstName", document.getElementById("fullName").value.split(' ')[0]);
        formData.append("lastName", document.getElementById("fullName").value.split(' ')[1]);
        formData.append("position", document.getElementById("position").value);
        formData.append("email", document.getElementById("email").value);
        formData.append("contactNumber", document.getElementById("phone").value);

        try {
            const response = await fetch("/api/admin/profile", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                document.getElementById("profileImage").src = data.user.profilePicture;
                document.getElementById("userFullName").textContent = `${data.user.firstName} ${data.user.lastName}`;
                document.getElementById("userPosition").textContent = data.user.position;
                document.getElementById("userEmail").textContent = data.user.email;
                document.getElementById("userPhone").textContent = data.user.contactNumber;
            } else {
                alert("Failed to update profile picture.");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    }

    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });

    document.getElementById("upload-pic").addEventListener("change", updateProfile);

    setProfile();
    fetchProfile();
});