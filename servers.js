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
        const [rows] = await sql.query("SELECT * FROM DummyEmployee WHERE EmployeeID = ?", [req.params.id]);
        res.json(rows[0] || {});
    } catch (error) {
        res.status(500).json({ message: "Error fetching employee", error });
    }
});

// ===============================
// Add Employee
// ===============================
app.post('/employees', async (req, res) => {
    try {
        const { EmployeeName, MobileNumber, Department, Salary } = req.body;

        const [result] = await sql.query(
            "INSERT INTO DummyEmployee (EmployeeName, MobileNumber, Department, Salary) VALUES (?, ?, ?, ?)",
            [EmployeeName, MobileNumber, Department, Salary]
        );

        res.json({ message: "Employee Added", id: result.insertId });

    } catch (error) {
        res.status(500).json({ message: "Insert failed", error });
    }
});

// ===============================
// Update Employee
// ===============================
app.put('/employees/:id', async (req, res) => {
    try {
        const { EmployeeName, MobileNumber, Department, Salary } = req.body;

        await sql.query(
            "UPDATE DummyEmployee SET EmployeeName=?, MobileNumber=?, Department=?, Salary=? WHERE EmployeeID = ?",
            [EmployeeName, MobileNumber, Department, Salary, req.params.id]
        );

        res.json({ message: "Employee Updated" });

    } catch (error) {
        res.status(500).json({ message: "Update failed", error });
    }
});

// ===============================
// Delete Employee
// ===============================
app.delete('/employees/:id', async (req, res) => {
    try {
        await sql.query(
            "DELETE FROM DummyEmployee WHERE EmployeeID = ?",
            [req.params.id]
        );

        res.json({ message: "Employee Deleted" });

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
