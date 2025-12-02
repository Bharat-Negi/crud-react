import express from 'express';
import cors from 'cors';
import { sql } from './config/db.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ===============================
// Get All Employees
// ===============================
app.get('/employees', async (req, res) => {
  try {
    const [rows] = await sql.query("SELECT * FROM DummyEmployee");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// ===============================
// Get Single Employee
// ===============================
app.get('/employees/:id', async (req, res) => {
  try {
    const [rows] = await sql.query(
      "SELECT * FROM DummyEmployee WHERE EmployeeID = ?",
      [req.params.id]
    );
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
});

// ===============================
// Add Employee (Prevent Duplicate MobileNumber)
// Supports Single + Bulk Insert
// ===============================
app.post('/employees', async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    if (data.length === 0) {
      return res.status(400).json({ message: "No employee data provided" });
    }

    const mobileNumbers = data.map(emp => emp.MobileNumber);

    // Prepare placeholders for IN (?, ?, ?)
    const placeholders = mobileNumbers.map(() => "?").join(",");

    const [existing] = await sql.query(
      `SELECT MobileNumber FROM DummyEmployee WHERE MobileNumber IN (${placeholders})`,
      mobileNumbers
    );

    const existingNumbers = existing.map(e => e.MobileNumber);

    // Filter out duplicates
    const filteredData = data.filter(emp => !existingNumbers.includes(emp.MobileNumber));

    if (filteredData.length === 0) {
      return res.status(400).json({
        message: "Duplicate entries found. No new employees added.",
        duplicates: existingNumbers
      });
    }

    const values = filteredData.map(emp => [
      emp.EmployeeName,
      emp.MobileNumber,
      emp.Department,
      emp.Salary
    ]);

    const [result] = await sql.query(
      "INSERT INTO DummyEmployee (EmployeeName, MobileNumber, Department, Salary) VALUES ?",
      [values]
    );

    res.json({
      message: "Employee(s) Added Successfully",
      inserted: result.affectedRows,
      duplicatesSkipped: existingNumbers
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Insert failed", error });
  }
});

// ===============================
// Update Employee (Duplicate Check)
// ===============================
app.put('/employees/:id', async (req, res) => {
  try {
    const { EmployeeName, MobileNumber, Department, Salary } = req.body;

    // Check duplicate mobile excluding current employee
    const [existing] = await sql.query(
      "SELECT EmployeeID FROM DummyEmployee WHERE MobileNumber = ? AND EmployeeID != ?",
      [MobileNumber, req.params.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Mobile number already exists for another employee"
      });
    }

    await sql.query(
      "UPDATE DummyEmployee SET EmployeeName=?, MobileNumber=?, Department=?, Salary=? WHERE EmployeeID = ?",
      [EmployeeName, MobileNumber, Department, Salary, req.params.id]
    );

    res.json({ message: "Employee Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
});

// ===============================
// Delete Employee
// ===============================
app.delete('/employees/:id', async (req, res) => {
  try {
    await sql.query("DELETE FROM DummyEmployee WHERE EmployeeID = ?", [req.params.id]);
    res.json({ message: "Employee Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
