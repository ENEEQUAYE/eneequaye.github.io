document.addEventListener("DOMContentLoaded", () => {
    fetchCourses();
});

function fetchCourses() {
    fetch("/api/courses")
        .then(response => response.json())
        .then(data => {
            let rows = "";
            data.forEach(course => {
                rows += `
                    <tr>
                        <td>${course.courseCode}</td>
                        <td>${course.courseName}</td>
                        <td>${course.department}</td>
                        <td>${course.credits}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editCourse('${course._id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course._id}')">Delete</button>
                        </td>
                    </tr>
                `;
            });
            document.getElementById("courseTableBody").innerHTML = rows;
        });
}

function showAddCourseModal() {
    document.getElementById("modalTitle").innerText = "Add Course";
    document.getElementById("courseId").value = "";
    document.getElementById("courseCode").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("department").value = "";
    document.getElementById("credits").value = "";
    $("#courseModal").modal("show");
}

function saveCourse() {
    const id = document.getElementById("courseId").value;
    const course = {
        courseCode: document.getElementById("courseCode").value,
        courseName: document.getElementById("courseName").value,
        department: document.getElementById("department").value,
        credits: document.getElementById("credits").value,
    };

    fetch(`/api/courses/${id ? "update/" + id : "add"}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
    }).then(() => {
        $("#courseModal").modal("hide");
        fetchCourses();
    });
}

function deleteCourse(id) {
    fetch(`/api/courses/delete/${id}`, { method: "DELETE" }).then(fetchCourses);
}

function editCourse(courseId) {
    fetch(`/api/courses/${courseId}`)
        .then(response => response.json())
        .then(course => {
            document.getElementById("courseId").value = course._id;
            document.getElementById("courseCode").value = course.courseCode;
            document.getElementById("courseName").value = course.courseName;
            document.getElementById("department").value = course.department;
            document.getElementById("credits").value = course.credits;
            document.getElementById("modalTitle").textContent = 'Edit Course';
            $('#courseModal').modal('show');
        });
}