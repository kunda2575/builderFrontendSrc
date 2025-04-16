import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getEmployeeDetails, createEmployeeDetails, updateEmployeeDetails, deleteEmployeeDetails } from '../../../api/employeeApi'
import { toast } from "react-toastify"


const EmployeeMaster = () => {
    const [employees, setEmployees] = useState([])
    const [form, setForm] = useState({
        employeeName: '',
        employeePhone: '',
        employeeEmail: '',
        address: '',
        idType: '',
        idProof1: '',
        employeeSalary: '',
        department: '',
        employeeID: null
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await getEmployeeDetails()
            setEmployees(res.data)
        } catch (error) {
            toast.error('Failed to fetch Employees');
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.employeeID) {
                await updateEmployeeDetails(form.employeeID, form);
                toast.success(`Employee updated successfully`);

            } else {
                await createEmployeeDetails(form);
                toast.success(`Employee created successfully`)
            }
            setForm({
                employeeName: '',
                employeePhone: '',
                employeeEmail: '',
                address: '',
                idType: '',
                idProof1: '',
                employeeSalary: '',
                department: '',
                employeeID: null
            })
            fetchEmployees()
        } catch (error) {
            toast.error('Action Failed')
        }
    };
    const handleEdit = (employee) => {
        setForm(employee);
    };


    const handleDelete = async (employeeID) => {
        if (!window.confirm('Are you sure to delete this Employee?')) return;
        try {
            await deleteEmployeeDetails(employeeID);
            toast.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            toast.error('Delete failed');
        }
    };
    return (
        <>
            <div className="container mt-3">
                <div className='mb-2'>
                    <Link className="text-decoration-none text-primary" to="/updateData"> <i className="pi pi-arrow-left"></i>  Back </Link>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card mb-3">
                            <div className="card-header">
                                <h4 className="text-center">  Employee Master</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} className="row">
                                    <span className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Employee Name"
                                            onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                                            value={form.employeeName}
                                            required
                                        />
                                    </span>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Employee Phone"
                                            onChange={(e) => setForm({ ...form, employeePhone: e.target.value })}
                                            value={form.employeePhone}

                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Employee Email"
                                            onChange={(e) => setForm({ ...form, employeeEmail: e.target.value })}
                                            value={form.employeeEmail}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Id Type"
                                            onChange={(e) => setForm({ ...form, idType: e.target.value })}
                                            value={form.idType}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Id Proof"
                                            onChange={(e) => setForm({ ...form, idProof1: e.target.value })}
                                            value={form.idProof1}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Employee Salary"
                                            onChange={(e) => setForm({ ...form, employeeSalary: e.target.value })}
                                            value={form.employeeSalary}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Department"
                                            onChange={(e) => setForm({ ...form, department: e.target.value })}
                                            value={form.department}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            value={form.address}
                                            placeholder="Enter Address"
                                            // rows={3}
                                        >
                                            {/* EmployeeAddress */}
                                        </textarea>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-sm">
                                            {form.id ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 overflow-auto">
                        <table className="table table-sm table-bordered text-center flex-wrap">
                            <thead className="table-dark">
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th>Id Type</th>
                                    <th>Id Proof</th>
                                    <th>Salary</th>
                                    <th>Department</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.employeeID}>
                                        <td>{employee.employeeName}</td>
                                        <td>{employee.employeePhone}</td>
                                        <td>{employee.employeeEmail}</td>
                                        <td>{employee.idType}</td>
                                        <td>{employee.idProof1}</td>
                                        <td>{employee.employeeSalary}</td>
                                        <td>{employee.department}</td>
                                        <td>{employee.address}</td>
                                        <td className="d-flex justify-content-center">
                                            <button
                                                className="btn btn-sm btn-info me-1"
                                                onClick={() => handleEdit(employee)}
                                            >
                                                <i className="pi pi-pen-to-square"> </i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(employee.employeeID)}
                                            >
                                                <i className="pi pi-trash"> </i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center">No Employees found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EmployeeMaster