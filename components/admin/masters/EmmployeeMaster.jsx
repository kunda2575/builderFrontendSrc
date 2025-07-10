
import {
  getEmployeeDetails,
  createEmployeeDetails,
  updateEmployeeDetails,
  deleteEmployeeDetails
} from '../../../api/updateApis/employeeApi'; // Your API functions
import ReusableTableForm from './ReusableTableForm';

const fields = [
  { name: 'employeeID', label: 'Employee Id', type: 'number', required: true },
  { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
  { name: 'employeePhone', label: 'Mobile', type: 'number', required: true },
  { name: 'employeeEmail', label: 'Email', type: 'email', required: true },
  { name: 'idType', label: 'Id type', type: 'text', required: true },
  { name: 'employeeSalary', label: 'Employee Salary', type: 'number', required: true },
  { name: 'department', label: 'Department', type: 'text', required: true },
  {
    name: 'emp_address',
    label: 'Address',
    type: 'textarea',
    required: true
  },
  { name: 'idProof1', label: 'Id Proof 1', type: 'file', required: true ,showInTable: false},
];


const EmployeeMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Employee"
        fields={fields}
        fetchData={getEmployeeDetails}
        createData={createEmployeeDetails}
        updateData={updateEmployeeDetails}
        deleteData={deleteEmployeeDetails}
         fcolumnClass="mb-2 col-lg-12"
        tcolumnClass=" mb-2 col-lg-12"
        ccolumnClass="mb-2 col-lg-4"
      />
    </div>
  );
};

export default EmployeeMaster;