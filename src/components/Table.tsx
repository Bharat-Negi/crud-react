import React from "react";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";

export default function TablePage() {

    function handelEdit(){
        alert("Edit");
    }

    function handelDelete(){
        alert("Delete");
    }

  return (
    <>
      <div className="container my-5">
        <h2 className="text-center mb-2">Employee CRUD Application</h2>
        <div className="text-center mb-2">
            <button className="btn btn-primary">Add New Employee</button>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Employee Name</th>
                <th scope="col">Mobile Number</th>
                <th scope="col">Department</th>
                <th scope="col">Salary</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>
                    <div className="actionTable">
                        <BiSolidEdit onClick={handelEdit} />
                        <MdDelete onClick={handelDelete} />
                    </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
