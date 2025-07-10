import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CSVLink } from "react-csv";

const ImportData = ({ headers, fileName, uploadData }) => {
  const [visible, setVisible] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);

  const csvHeaders = headers.map((h) => ({ label: h, key: h }));
  const emptyRow = headers.reduce((acc, header) => {
    acc[header] = "";
    return acc;
  }, {});

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (evt) => {
      const fileContent = evt.target.result;

      // Use XLSX to parse both Excel and CSV files
      const wb = XLSX.read(fileContent, {
        type: fileExtension === "csv" ? "string" : "binary",
      });

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      setUploadedData(data);
    };

    if (fileExtension === "csv") {
      reader.readAsText(file); // CSV as text
    } else {
      reader.readAsBinaryString(file); // Excel as binary
    }
  };

  const handleProceed = () => {
    if (uploadedData) {
      uploadData(uploadedData); // Pass to parent
      setVisible(false);        // Close modal
      setUploadedData(null);    // Reset
    }
  };

  return (
    <>
      <Button
        label="Import Data"
        icon="pi pi-upload"
        onClick={() => setVisible(true)}
        className="btn btn-sm btn-primary"
      />

      <Dialog
        header="Import Excel or CSV Data"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "30vw" }}
        modal
      >
        <div className="p-mb-3">
          <p>If you don’t have a template, download it:</p>

          <CSVLink
            data={[emptyRow]}
            headers={csvHeaders}
            filename={`${fileName}.csv`}
            className="btn btn-sm btn-primary mb-3"
          >
            Download CSV Template
          </CSVLink>
        </div>

        <div className="p-mb-3">
          <p>Upload Excel or CSV File:</p>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
          />
        </div>

        {uploadedData && (
          <div className="p-mt-3">
            <p>File uploaded successfully.</p>
            <Button label="Proceed" onClick={handleProceed} />
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ImportData;
