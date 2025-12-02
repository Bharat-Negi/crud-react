import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import EmployeeModal from "./EmployeeModal";
import { toast } from "react-toastify";
import toastBox from "react-hot-toast";

export default function EmployeeCrud() {
  const [employee, setEmployee] = useState([]);
  const [emp, setEmp] = useState({
    EmployeeName: "",
    MobileNumber: "",
    Department: "",
    Salary: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔍 Search State
  const [searchTerm, setSearchTerm] = useState("");

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
        toast.success("Employee Updated Successfully!");
      } else {
        await axios.post(API_URL, emp);
        toast.success("Employee Added Successfully!");
      }

      fetchEmployees();

      // Close modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("employeeModal")
      );
      modal?.hide();
    } catch (error) {
      console.log("Save error:", error);

      if (
        error.response?.data?.message &&
        error.response.data.message.includes("Mobile number")
      ) {
        toast.error(error.response.data.message);
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("Duplicate entries")
      ) {
        toast.error(
          `This number already exists: ${error.response.data.duplicates.join(", ")}`
        );
      } else {
        toast.error("Something went wrong while saving employee.");
      }
    }
  };

  const handleDelete = (id) => {
    toastBox.custom(
      (t) => (
        <div
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h6>Are you sure?</h6>
          <p>Do you really want to delete this employee?</p>

          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-secondary btn-sm me-2"
              onClick={() => toastBox.remove(t.id)}
            >
              No
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={async () => {
                try {
                  await axios.delete(`${API_URL}/${id}`);
                  toast.success("Employee Deleted!");
                  fetchEmployees();
                  toastBox.remove(t.id);
                } catch (error) {
                  toast.error("Error deleting employee");
                }
              }}
            >
              Yes
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  // 🔍 Search Handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 🔍 Filter Employees
  const filteredEmployees = employee.filter((row) => {
    return (
      row.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.MobileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(row.Salary).includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <div className="container my-5">
        <h2 className="text-center mb-3">Employee CRUD Application</h2>

        <div className="text-center mb-3">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#employeeModal"
            onClick={openAddModal}
          >
            Add New Employee
          </button>
        </div>

        {/* 🔍 Search Bar */}
        <div className="row">
          <div className="col-md-12">
            <form className="d-flex justify-content-end mb-3">
              <input
                className="form-control me-2 w-auto"
                type="search"
                placeholder="Search by name"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </form>
          </div>
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
              {filteredEmployees.map((row, index) => (
                <tr key={row.EmployeeID}>
                  <td>{index + 1}</td>
                  <td>{row.EmployeeName}</td>
                  <td>{row.MobileNumber}</td>
                  <td>{row.Department}</td>
                  <td>{Math.round(row.Salary)}</td>

                  <td>
                    <BiSolidEdit
                      className="mx-2"
                      style={{ cursor: "pointer" }}
                      data-bs-toggle="modal"
                      data-bs-target="#employeeModal"
                      onClick={() => openEditModal(row)}
                    />

                    <MdDelete
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDelete(row.EmployeeID)}
                    />
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td className="text-center" colSpan="6">
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Component */}
      <EmployeeModal
        isEdit={isEdit}
        emp={emp}
        setEmp={setEmp}
        handleSave={handleSave}
        apiUrl={API_URL}
      />
    </>
  );
}
