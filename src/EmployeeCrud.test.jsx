import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeCrud from "./EmployeeCrud";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Setup axios mock
const mock = new MockAdapter(axios);

const employees = [
  { EmployeeID: 1, EmployeeName: "Alice", MobileNumber: "12345", Department: "HR", Salary: 5000 },
  { EmployeeID: 2, EmployeeName: "Bob", MobileNumber: "67890", Department: "IT", Salary: 6000 },
];

describe("EmployeeCrud Component", () => {
  beforeEach(() => {
    mock.reset();
  });

  test("renders employee table", async () => {
    mock.onGet("http://localhost:5000/employees").reply(200, employees);

    render(<EmployeeCrud />);

    // Wait for employees to load
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  test("search filters employees", async () => {
    mock.onGet("http://localhost:5000/employees").reply(200, employees);

    render(<EmployeeCrud />);
    await waitFor(() => screen.getByText("Alice"));

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Alice" } });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).toBeNull();
  });

  test("sorts employees by salary", async () => {
    mock.onGet("http://localhost:5000/employees").reply(200, employees);

    render(<EmployeeCrud />);
    await waitFor(() => screen.getByText("Alice"));

    // Click Salary header to sort
    fireEvent.click(screen.getByText(/Salary/));

    const rows = screen.getAllByRole("row");
    // First data row should be Alice (5000) in ascending order
    expect(rows[1]).toHaveTextContent("Alice");

    // Click again → descending
    fireEvent.click(screen.getByText(/Salary/));
    expect(rows[1]).toHaveTextContent("Bob");
  });

  test("adds new employee and appears first", async () => {
    mock.onGet("http://localhost:5000/employees").reply(200, employees);
    const newEmployee = { EmployeeID: 3, EmployeeName: "Charlie", MobileNumber: "11111", Department: "Sales", Salary: 7000 };
    mock.onPost("http://localhost:5000/employees").reply(200, newEmployee);
    mock.onGet("http://localhost:5000/employees").reply(200, [newEmployee, ...employees]);

    render(<EmployeeCrud />);
    await waitFor(() => screen.getByText("Alice"));

    // Open modal
    fireEvent.click(screen.getByText("Add New Employee"));

    fireEvent.change(screen.getByDisplayValue(""), { target: { value: "Charlie" } }); // EmployeeName
    fireEvent.change(screen.getByPlaceholderText("Mobile Number"), { target: { value: "11111" } });
    fireEvent.change(screen.getByPlaceholderText("Department"), { target: { value: "Sales" } });
    fireEvent.change(screen.getByPlaceholderText("Salary"), { target: { value: 7000 } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      const firstRow = screen.getAllByRole("row")[1];
      expect(firstRow).toHaveTextContent("Charlie"); // New employee appears first
    });
  });

  test("deletes an employee", async () => {
    mock.onGet("http://localhost:5000/employees").reply(200, employees);
    mock.onDelete("http://localhost:5000/employees/1").reply(200);
    mock.onGet("http://localhost:5000/employees").reply(200, [employees[1]]); // After deletion

    render(<EmployeeCrud />);
    await waitFor(() => screen.getByText("Alice"));

    // Click delete button for Alice
    fireEvent.click(screen.getAllByText("Yes")[0]); // Assuming confirmation modal opens

    await waitFor(() => {
      expect(screen.queryByText("Alice")).toBeNull();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });
});
