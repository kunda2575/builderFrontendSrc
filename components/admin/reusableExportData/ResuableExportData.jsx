import React, { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import { Button } from "primereact/button";
const ExportCSVButton = () => {
  const [csvData, setCsvData] = useState([]);
  const csvLinkRef = useRef();

  const headers = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
  ];

  const handleExport = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      const data = response.data;

      // Optionally transform data here if needed
      setCsvData(data);

      // Trigger the download via CSVLink ref
      setTimeout(() => {
        csvLinkRef.current.link.click();
      }, 100); // Delay to ensure state updates
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data for CSV export.");
    }
  };

  return (
    <div>
      <Button
        label="Export Data"
        icon="pi pi-download"
        onClick={handleExport}
        className="btn btn-sm btn-primary"
      />



      {/* Hidden CSVLink to trigger programmatically */}
      <CSVLink
        data={csvData}
        headers={headers}
        filename="users.csv"
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </div>
  );
};

export default ExportCSVButton;
