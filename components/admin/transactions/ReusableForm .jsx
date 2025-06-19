// components/forms/ReusableForm.jsx
import React from 'react';

const ReusableForm = ({ fields, formData, onChange, onSubmit, loading, submitLabel }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="card-body">
                <div className="row">
                    {fields.map(field => (
                        <div className="col-lg-12 mb-2" key={field.name}>
                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={onChange}
                                    className="form-select"
                                    required={field.required}
                                >
                                    <option value="">{field.placeholder}</option>
                                    {field.options.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={formData[field.name]}
                                    onChange={onChange}
                                    className="form-control"
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="card-footer text-center">
                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                    {loading ? 'Processing...' : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default ReusableForm;
