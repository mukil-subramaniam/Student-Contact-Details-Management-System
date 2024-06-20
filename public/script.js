$(document).ready(function() {
  const searchInput = document.getElementById('searchInput');
  const studentsTableBody = $('#studentsTable tbody');
  const editStudentModal = $('#editStudentModal');
  const editStudentForm = $('#editStudentForm');
  const addStudentForm = $('#studentForm');

  // Fetch all students and populate the table
  async function fetchStudents() {
    try {
      const response = await fetch('http://localhost:3000/students');
      const students = await response.json();

      // Clear previous table data
      studentsTableBody.empty();

      students.forEach(student => {
        const row = `
          <tr>
            <td>${student.roll_number}</td>
            <td>${student.first_name}</td>
            <td>${student.last_name}</td>
            <td>${student.email}</td>
            <td>${student.phone_number}</td>
            <td>${student.address}</td>
            <td>${new Date(student.date_of_birth).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-primary" onclick="editStudent('${student._id}')">Edit</button>
              <button class="btn btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
            </td>
          </tr>
        `;
        studentsTableBody.append(row);
      });

      // Initialize DataTables
      $('#studentsTable').DataTable();
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }

  // Function to handle editing a student
  window.editStudent = async function(id) {
    try {
      const response = await fetch(`http://localhost:3000/students/${id}`);
      const student = await response.json();

      $('#editStudentId').val(student._id);
      $('#editRollNumber').val(student.roll_number);
      $('#editFirstName').val(student.first_name);
      $('#editLastName').val(student.last_name);
      $('#editEmail').val(student.email);
      $('#editPhoneNumber').val(student.phone_number);
      $('#editAddress').val(student.address);
      $('#editDateOfBirth').val(new Date(student.date_of_birth).toISOString().split('T')[0]);

      editStudentModal.modal('show');
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // Function to handle submitting the edit form
  editStudentForm.on('submit', async function(e) {
    e.preventDefault();

    const studentId = $('#editStudentId').val();
    const updatedStudent = {
      roll_number: $('#editRollNumber').val(),
      first_name: $('#editFirstName').val(),
      last_name: $('#editLastName').val(),
      email: $('#editEmail').val(),
      phone_number: $('#editPhoneNumber').val(),
      address: $('#editAddress').val(),
      date_of_birth: $('#editDateOfBirth').val(),
    };

    try {
      const response = await fetch(`http://localhost:3000/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent),
      });

      if (response.ok) {
        editStudentModal.modal('hide');
        fetchStudents(); // Reload table data
      } else {
        console.error('Failed to update student:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  });

  // Function to handle deleting a student
  window.deleteStudent = async function(id) {
    try {
      const response = await fetch(`http://localhost:3000/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchStudents(); // Reload table data
      } else {
        console.error('Failed to delete student:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Function to handle searching students
  $(searchInput).keyup(function() {
    const query = $(this).val().toLowerCase();
    studentsTable.search(query).draw();

    // Highlight rows where the search term is found
    studentsTable.rows().nodes().to$().removeClass('highlight');
    studentsTable.rows({ search: 'applied' }).nodes().to$().addClass('highlight');
  });


  // Function to handle submitting the add student form
  addStudentForm.on('submit', async function(event) {
    event.preventDefault();

    const rollNumber = $('#roll_number').val();
    const firstName = $('#first_name').val();
    const lastName = $('#last_name').val();
    const email = $('#email').val();
    const phoneNumber = $('#phone_number').val();
    const address = $('#address').val();
    const dateOfBirth = $('#date_of_birth').val();

    const newStudent = {
      roll_number: rollNumber,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      address: address,
      date_of_birth: dateOfBirth,
    };

    try {
      const response = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        alert('Student added successfully!');
        addStudentForm[0].reset(); // Clear form fields after successful submission
        fetchStudents(); // Refresh table data
      } else {
        console.error('Failed to add student:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  });

  // Initial fetch and populate student data when DOM loads
  fetchStudents();
});
