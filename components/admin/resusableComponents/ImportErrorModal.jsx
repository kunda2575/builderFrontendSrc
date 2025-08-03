import React from 'react';

const ImportErrorModal = ({ show, errors = [], onClose }) => {
    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Import Errors</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>Row</th>
                                    <th>Field</th>
                                    <th>Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errors.map((err, index) => (
                                    <tr key={index}>
                                        <td>{err.row}</td>
                                        <td>{err.field}</td>
                                        <td>{err.error}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportErrorModal;
