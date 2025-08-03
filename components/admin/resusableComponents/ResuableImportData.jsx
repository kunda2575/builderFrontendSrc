import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify"; // ✅ Import toast

const ImportData = ({ headers, fileName, uploadData }) => {
  const [visible, setVisible] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Define loading

  const csvHeaders = headers.map((h) =>
    typeof h === "string" ? { label: h, key: h } : h
  );

  const emptyRow = csvHeaders.reduce((acc, header) => {
    acc[header.key] = "";
    return acc;
  }, {});

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const extension = file.name.split(".").pop().toLowerCase();
  const reader = new FileReader();

  reader.onload = (evt) => {
    try {
      const content = evt.target.result;
      const workbook = XLSX.read(content, {
        type: extension === "csv" ? "string" : "binary",
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rawData.length) {
        toast.warn("No data found in uploaded file.");
        return;
      }

      // 🔁 Compare with previous data
      const newDataJSON = JSON.stringify(rawData);
      const oldDataJSON = JSON.stringify(uploadedData);

      if (newDataJSON === oldDataJSON) {
        toast.info("Same file content uploaded again.");
      } else {
        toast.success("New file uploaded successfully.");
        setUploadedData(rawData);
      }
    } catch (error) {
      console.error("File parsing error:", error);
      toast.error("Invalid file. Must be valid CSV or Excel.");
    }
  };

  if (extension === "csv") {
    reader.readAsText(file);
  } else {
    reader.readAsBinaryString(file);
  }
};


  const handleProceed = async () => {
    if (!uploadedData) return;

    setLoading(true);
    try {
      await uploadData(uploadedData); // Async call
    
      setVisible(false);
      setUploadedData(null);
    } catch (error) {
      toast.error("Error importing data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        label="Import Data"
        icon="pi pi-upload"
        onClick={() => setVisible(true)}
        className="btn btn-sm btn-success"
      />

      <Dialog
        header="Import CSV or Excel"
        visible={visible}
        onHide={() => {
          setVisible(false);
          setUploadedData(null);
          setLoading(false);
        }}
        style={{ width: "90vw", maxWidth: "500px" }}
        modal
        breakpoints={{ "960px": "95vw", "640px": "100vw" }}
      >
        <div className="mb-3">
          <p>Don't have a template?</p>
          <CSVLink
            data={[emptyRow]}
            headers={csvHeaders}
            filename={`${fileName}.csv`}
            className="btn btn-sm btn-primary"
          >
            Download Template
          </CSVLink>
        </div>

        <div className="mb-3">
          <p>Upload CSV or Excel file:</p>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
            className="form-control"
          />
        </div>

        {uploadedData && (
          <div className="mt-3 text-end">
            <p className="text-success text-start">✅ {uploadedData.length} row(s) ready to import.</p>
            <Button
              label={loading ? "Processing..." : "Proceed"}
              icon="pi pi-check"
              onClick={handleProceed}
              disabled={loading}
              className="btn btn-sm btn-primary"
            />
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ImportData;
