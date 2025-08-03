import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";

const ImportCSVButton = ({ fields, fileName = "import_template", uploadData, dataKey = "data" }) => {
    const [visible, setVisible] = useState(false);
    const [uploadedData, setUploadedData] = useState(null);
    const [loading, setLoading] = useState(false);

    const csvHeaders = fields.map(f => ({
        label: f.label,
        key: f.name
    }));

    const emptyRow = fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const extension = file.name.split('.').pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const content = evt.target.result;
                const workbook = XLSX.read(content, {
                    type: extension === 'csv' ? 'string' : 'binary'
                });

                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

                if (!rawData.length) {
                    toast.warn("No data found in uploaded file.");
                    return;
                }

                const normalizedData = rawData.map(row => {
                    const normalizedRow = {};
                    fields.forEach(field => {
                        const matchKey = Object.keys(row).find(
                            key =>
                                key.trim().toLowerCase().replace(/\s+/g, '') ===
                                field.label.trim().toLowerCase().replace(/\s+/g, '')
                        );
                        if (matchKey) {
                            normalizedRow[field.name] = row[matchKey];
                        }
                    });
                    return normalizedRow;
                });

                const missingRequiredFields = fields
                    .filter(f => f.required)
                    .filter(f => !Object.keys(normalizedData[0]).includes(f.name));

                if (missingRequiredFields.length > 0) {
                    toast.error(
                        `Missing required field(s): ${missingRequiredFields.map(f => f.label).join(", ")}`
                    );
                    setUploadedData(null);
                    return;
                }

                setUploadedData(normalizedData);
                toast.success("File parsed and validated.");
            } catch (error) {
                console.error("File parsing error:", error);
                toast.error("Invalid file. Must be valid CSV or Excel.");
            }
        };

        if (extension === 'csv') {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };

    const handleProceed = async () => {
        if (!uploadedData || loading) return;

        setLoading(true); // disable UI
        try {
            const processedData = uploadedData.map(row => {
                const updatedRow = { ...row };
                fields.forEach(field => {
                    if (field.options && Array.isArray(field.options)) {
                        const matchedOption = field.options.find(
                            opt => opt.value.toLowerCase() === row[field.name]?.toLowerCase()
                        );
                        if (matchedOption) {
                            updatedRow[field.name] = matchedOption.value;
                        }
                    }
                });
                return updatedRow;
            });

            const validData = processedData.filter(row =>
                fields.every(f => !f.required || (row[f.name]?.toString().trim() !== ""))
            );

            if (validData.length === 0) {
                setLoading(false);
                return;
            }

            const response = await uploadData({ [dataKey]: validData });

            if (!(response?.error || response?.data?.error)) {
                setUploadedData(null);
                setVisible(false);
            }

        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Button
                label="Import CSV"
                icon="pi pi-upload"
                onClick={() => setVisible(true)}
                className="btn btn-sm btn-success me-2"
            />

            <Dialog
                header="Import CSV"
                visible={visible}
                onHide={() => {
                    setVisible(false);
                    setUploadedData(null);
                    setLoading(false);
                }}
                style={{ width: "90vw", maxWidth: "500px" }}
                modal
                breakpoints={{ '960px': '95vw', '640px': '100vw' }}
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
                    <div className="mt-3 d-flex flex-column gap-2">
                        <p>✅ {uploadedData.length} row(s) ready to import.</p>
                        <Button
                            label={loading ? "Processing..." : "Proceed"}
                            icon="pi pi-check"
                            onClick={handleProceed}
                            disabled={loading}
                            className="btn btn-success btn-sm"
                        />
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default ImportCSVButton;
