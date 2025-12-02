import React, { useState, useEffect } from "react";

export default function EmployeeModal({ isEdit, emp, setEmp, handleSave }: any) {
  const [errors, setErrors] = useState({
    EmployeeName: "",
    MobileNumber: "",
    Department: "",
    Salary: "",
    apiError: ""
  });

  useEffect(() => {
    resetErrors();
  }, [emp]);

  const resetErrors = () => {
    setErrors({
      EmployeeName: "",
      MobileNumber: "",
      Department: "",
      Salary: "",
      apiError: ""
    });
  };

  const validate = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!emp.EmployeeName?.trim()) {
      newErrors.EmployeeName = "Employee name is required";
      isValid = false;
    }

    if (!emp.MobileNumber?.trim()) {
      newErrors.MobileNumber = "Mobile number is required";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(emp.MobileNumber)) {
      newErrors.MobileNumber = "Mobile number must be 10 digits";
      isValid = false;
    }

    if (!emp.Department?.trim()) {
      newErrors.Department = "Department is required";
      isValid = false;
    }

    if (!emp.Salary) {
      newErrors.Salary = "Salary is required";
      isValid = false;
    } else if (isNaN(Number(emp.Salary))) {
      newErrors.Salary = "Salary must be a number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSave = async () => {
    if (!validate()) return;

    try {
      await handleSave();
      resetErrors();
    } catch (err: any) {
      const msg = err.response?.data?.message || "";

      if (msg.includes("Mobile number")) {
        setErrors((prev) => ({ ...prev, apiError: "Mobile number already exists!" }));
      } else if (msg.includes("Duplicate")) {
        setErrors((prev) => ({ ...prev, apiError: "Duplicate mobile number found!" }));
      } else {
        setErrors((prev) => ({ ...prev, apiError: "Something went wrong!" }));
      }
    }
  };

  return (
    <div className="modal fade" id="employeeModal" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h1 className="modal-title fs-5">{isEdit ? "Edit Employee" : "Add Employee"}</h1>
            <button className="btn-close" data-bs-dismiss="modal" onClick={resetErrors}></button>
          </div>

          <div className="modal-body">

            <input
              type="text"
              className="form-control mb-1"
              placeholder="Employee Name"
              value={emp.EmployeeName}
              onChange={(e) => setEmp({ ...emp, EmployeeName: e.target.value })}
            />
            {errors.EmployeeName && <p className="text-danger small">{errors.EmployeeName}</p>}

            <input
              type="text"
              className="form-control mb-1"
              placeholder="Mobile Number"
              value={emp.MobileNumber}
              onChange={(e) => setEmp({ ...emp, MobileNumber: e.target.value })}
            />
            {errors.MobileNumber && <p className="text-danger small">{errors.MobileNumber}</p>}

            <input
              type="text"
              className="form-control mb-1"
              placeholder="Department"
              value={emp.Department}
              onChange={(e) => setEmp({ ...emp, Department: e.target.value })}
            />
            {errors.Department && <p className="text-danger small">{errors.Department}</p>}

            <input
              type="number"
              className="form-control mb-1"
              placeholder="Salary"
              value={emp.Salary}
              onChange={(e) => setEmp({ ...emp, Salary: e.target.value })}
            />
            {errors.Salary && <p className="text-danger small">{errors.Salary}</p>}

            {errors.apiError && <p className="text-danger small mt-2">{errors.apiError}</p>}

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetErrors}>
              Close
            </button>

            <button className="btn btn-primary" onClick={onSave}>
              {isEdit ? "Update" : "Save"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
