import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";

export default function EmployeeCurd() {
  const [employee, setEmployee] = useState([]);
  const [emp, setEmp] = useState({
    EmployeeName: "",
    MobileNumber: "",
    Department: "",
    Salary: "",
  });

  const [isEdit, setIsEdit] = useState(false); 
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5000/employees";

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployee(response.data);
    } catch (error) {
      console.log("Error fetching employees", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setEmp({
      EmployeeName: "",
      MobileNumber: "",
      Department: "",
      Salary: "",
    });
  };

  const openEditModal = (row) => {
    setIsEdit(true);
    setEditId(row.EmployeeID);
    setEmp({
      EmployeeName: row.EmployeeName,
      MobileNumber: row.MobileNumber,
      Department: row.Department,
      Salary: row.Salary,
    });
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${editId}`, emp);
        alert("Employee Updated Successfully!");
      } else {
        await axios.post(API_URL, emp);
        alert("Employee Added Successfully!");
      }

      fetchEmployees();
      document.getElementById("closeModal").click(); // close modal
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Employee Deleted!");
      fetchEmployees();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <>
      <div className="container my-5">
        <h2 className="text-center mb-2">Employee CRUD Application</h2>

        <div className="text-center mb-2">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={openAddModal}
          >
            Add New Employee
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Mobile Number</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employee.map((row, index) => (
                <tr key={row.EmployeeID}>
                  <td>{index + 1}</td>
                  <td>{row.EmployeeName}</td>
                  <td>{row.MobileNumber}</td>
                  <td>{row.Department}</td>
                  <td>{row.Salary}</td>

                  <td>
                    <BiSolidEdit
                      className="mx-2"
                      style={{ cursor: "pointer" }}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => openEditModal(row)}
                    />

                    <MdDelete
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDelete(row.EmployeeID)}
                    />
                  </td>
                </tr>
              ))}

              {employee.length === 0 && (
                <tr>
                  <td className="text-center col-md-6">No Employees Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============= MODAL =============== */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {isEdit ? "Edit Employee" : "Add Employee"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              ></button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Employee Name"
                value={emp.EmployeeName}
                onChange={(e) =>
                  setEmp({ ...emp, EmployeeName: e.target.value })
                }
              />

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Mobile Number"
                value={emp.MobileNumber}
                onChange={(e) =>
                  setEmp({ ...emp, MobileNumber: e.target.value })
                }
              />

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Department"
                value={emp.Department}
                onChange={(e) =>
                  setEmp({ ...emp, Department: e.target.value })
                }
              />

              <input
                type="number"
                className="form-control mb-2"
                placeholder="Salary"
                value={emp.Salary}
                onChange={(e) =>
                  setEmp({ ...emp, Salary: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
