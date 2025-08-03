import React from 'react';

const ImportErrorModal = ({ visible, onClose, errors }) => {
    if (!visible) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Import Validation Errors</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {errors?.length > 0 ? (
                            <ul className="list-unstyled">
                                {errors.map((e, idx) => (
                                    <li key={idx} className="mb-1">
                                        <strong>Row {e.row}</strong> - <code>{e.field}</code>: {e.error}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No detailed errors available.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportErrorModal;
