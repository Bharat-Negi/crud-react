// EmployeeModal.jsx
import React from "react";

export default function EmployeeModal({isEdit,emp,setEmp,handleSave}:any) {
  return (
    <div
      className="modal fade"
      id="employeeModal"
      tabIndex="-1"
      aria-labelledby="employeeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="employeeModalLabel">
              {isEdit ? "Edit Employee" : "Add New Employee"}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="closeModal"
              aria-label="Close"
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
  );
}
