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

  // 🔍 Search
  const [searchTerm, setSearchTerm] = useState("");

  // ⬆⬇ Sorting
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

  // 🔢 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  const API_URL = "http://localhost:5000/employees";

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);

      // 🔥 Sort so newest employee appears first
      const sorted = response.data.sort((a, b) => b.EmployeeID - a.EmployeeID);

      setEmployee(sorted);
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

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("employeeModal")
      );
      modal?.hide();
    } catch (error) {
      console.log("Save error:", error);
      toast.error("Error saving employee.");
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

  // 🔍 Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredEmployees = employee.filter((row) => {
    return (
      row.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.MobileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(row.Salary).includes(searchTerm.toLowerCase())
    );
  });

  // ⬆⬇ SORT FUNCTION
  const handleSort = (column) => {
    if (sortColumn === column) {
      // toggle asc ↔ desc
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Apply Sorting
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortColumn) return 0;

    let x = a[sortColumn];
    let y = b[sortColumn];

    // Numeric sort for salary
    if (sortColumn === "Salary") {
      return sortOrder === "asc" ? x - y : y - x;
    }

    // String sort
    x = x.toString().toLowerCase();
    y = y.toString().toLowerCase();

    if (x < y) return sortOrder === "asc" ? -1 : 1;
    if (x > y) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 📌 Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = sortedEmployees.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(sortedEmployees.length / recordsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  // ⬆⬇ Arrow Icons
  const arrow = (col) =>
    sortColumn === col ? (sortOrder === "asc" ? "▲" : "▼") : "";

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

        {/* 🔍 Search */}
        <div className="row">
          <div className="col-md-12">
            <form className="d-flex justify-content-end mb-3">
              <input
                className="form-control me-2 w-auto"
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </form>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>

                <th
                  onClick={() => handleSort("EmployeeName")}
                  style={{ cursor: "pointer" }}
                >
                  Employee Name {arrow("EmployeeName")}
                </th>

                <th
                  onClick={() => handleSort("MobileNumber")}
                  style={{ cursor: "pointer" }}
                >
                  Mobile Number {arrow("MobileNumber")}
                </th>

                <th
                  onClick={() => handleSort("Department")}
                  style={{ cursor: "pointer" }}
                >
                  Department {arrow("Department")}
                </th>

                <th
                  onClick={() => handleSort("Salary")}
                  style={{ cursor: "pointer" }}
                >
                  Salary {arrow("Salary")}
                </th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((row, index) => (
                <tr key={row.EmployeeID}>
                  <td>{indexOfFirstRecord + index + 1}</td>
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

              {currentRecords.length === 0 && (
                <tr>
                  <td className="text-center" colSpan="6">
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => changePage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => changePage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => changePage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal */}
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
