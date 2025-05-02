import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getleadDetails, getleadSourceDetails, getleadStageDetails, getteamMemberDetails, createleadDetails } from '../../../api/transactionApis/leadsApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import './calender.css'

const Leads = () => {
    const [loading, setLoading] = useState(false)
    const [leads, setLeads] = useState([]);
    const [leadSource, setLeadSource] = useState([]);
    const [leadStage, setLeadStage] = useState([]);
    const [teamMember, setteamMember] = useState([]);
    const [form, setForm] = useState({
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        address: '',
        customer_profession: '',
        native_language: [],
        lead_source: '',
        lead_stage: '',
        value_in_inr: '',
        creation_date: '',
        expected_date: '',
        team_member: '',
        last_interacted_on: '',
        next_interacted_date: '',
        remarks: '',
        reason_for_lost_customers: '',
        id: null
    });

    useEffect(() => {
        fetchLeads();
        fetchLeadSource();
        fetchLeadStageDetails();
        fetchTeamMemberDetails();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await getleadDetails();
            setLeads(res.data);
        } catch (error) {
            toast.error('Failed to fetch leads');
        }
    };
    const fetchLeadSource = async () => {
        try {
            const res = await getleadSourceDetails();
            setLeadSource(res.data);
        } catch (error) {
            toast.error('Failed to fetch lead source');
        }
    };
    const fetchLeadStageDetails = async () => {
        try {
            const res = await getleadStageDetails();
            setLeadStage(res.data);
        } catch (error) {
            toast.error('Failed to fetch lead stage');
        }
    };

    const fetchTeamMemberDetails = async () => {
        try {
            const res = await getteamMemberDetails();
            setteamMember(res.data);
        } catch (error) {
            toast.error('Failed to fetch team member');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare the form data for submission
            const formData = { ...form };

            // Convert array values to comma-separated string (e.g., native_language)
            if (Array.isArray(formData.native_language)) {
                formData.native_language = formData.native_language.join(',');
            }

            // Add similar logic for other array fields if necessary
            // Example:
            // if (Array.isArray(formData.someOtherField)) {
            //     formData.someOtherField = formData.someOtherField.join(',');
            // }

            if (form.id) {
                await updateLeadsDetails(form.id, formData);
                toast.success('Leads updated successfully');
            } else {
                await createleadDetails(formData);
                toast.success('Leads created successfully');
            }

            // Reset the form fields after submit
            setForm({
                contact_name: '',
                contact_phone: '',
                contact_email: '',
                address: '',
                customer_profession: '',
                native_language: [],  // reset to an empty array for MultiSelect
                lead_source: '',
                lead_stage: '',
                value_in_inr: '',
                creation_date: '',
                expected_date: '',
                team_member: '',
                last_interacted_on: '',
                next_interacted_date: '',
                remarks: '',
                reason_for_lost_customers: '',
                id: null
            });

            // Fetch leads again after submit
            fetchLeads();
        } catch (error) {
            toast.error('Action failed');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="container-fluid mt-3">
            {/* <div className='mb-2'>
                <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"></i>  Back </Link>
            </div> */}
            <div className='mb-2'>
                <Link className="text-decoration-none text-primary" to="/leadsTable"> <i className="pi pi-arrow-left"></i> Leads Management table </Link>
            </div>


            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Leads Transactions</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3">
                                        <input
                                            type="text"
                                            placeholder="Contact Name"
                                            value={form.contact_name}
                                            onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">

                                        <input
                                            type="number"
                                            placeholder="Contact Phone"
                                            value={form.contact_phone}
                                            onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <input
                                            type="email"
                                            placeholder="Contact Email"
                                            value={form.contact_email}
                                            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-3">
                                        <input
                                            type="text"
                                            placeholder="Contact Profession"
                                            value={form.customer_profession}
                                            onChange={(e) => setForm({ ...form, customer_profession: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <MultiSelect
                                            value={form.native_language}
                                            options={[
                                                { label: 'Telugu', value: 'Telugu' },
                                                { label: 'English', value: 'English' },
                                                { label: 'Hindi', value: 'Hindi' }
                                            ]}
                                            onChange={(e) => setForm({ ...form, native_language: e.value })}
                                            placeholder="Select Languages"
                                            display="chip"
                                            className="w-100 mb-2"
                                        />
                                    </div>

                                    <div className="col-lg-3">
                                        <select
                                            name='leadSource'
                                            value={form.lead_source}
                                            onChange={(e) => setForm({ ...form, lead_source: e.target.value })}
                                            className="form-select mb-2"
                                            required
                                        >
                                            <option value=""> Select lead source </option>
                                            {
                                                leadSource.map(source => {
                                                    return (
                                                        <option key={source.id} value={source.leadSource}>
                                                            {source.leadSource}
                                                        </option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </div>

                                    <div className="col-lg-3">
                                        <select
                                            name='leadStage'
                                            value={form.lead_stage}
                                            onChange={(e) => setForm({ ...form, lead_stage: e.target.value })}
                                            className="form-select mb-2"
                                            required
                                        >
                                            <option value=""> Select lead stage </option>
                                            {
                                                leadStage.map(source => {
                                                    return (
                                                        <option key={source.id} value={source.leadStage}>
                                                            {source.leadStage}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-lg-3">
                                        <select
                                            name='teamMember'
                                            value={form.team_member}
                                            onChange={(e) => setForm({ ...form, team_member: e.target.value })}
                                            className="form-select mb-2"
                                            required
                                        >
                                            <option value=""> Select Team Member </option>
                                            {
                                                teamMember.map(source => {
                                                    return (
                                                        <option key={source.id} value={source.team_name}>
                                                            {source.team_name}

                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div className="col-lg-3">
                                        <label className='mb-1'> Creation date</label>
                                        {/* <input
                                            type="date"
                                            placeholder="Creation date"

                                            value={form.creation_date}
                                            onChange={(e) => setForm({ ...form, creation_date: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        /> */}

                                        <Calendar
                                            value={form.creation_date}
                                            onChange={(e) => setForm({ ...form, creation_date: e.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                        />

                                    </div>
                                    <div className="col-lg-3">
                                        <label className='mb-1'>Expected close date </label>



                                        <Calendar
                                            value={form.expected_date}
                                            onChange={(e) => setForm({ ...form, expected_date: e.target.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-3">
                                        <label className='mb-1'> Last interacted on </label>
                                       
                                        <Calendar
                                            value={form.last_interacted_on}
                                            onChange={(e) => setForm({ ...form, last_interacted_on: e.target.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className='mb-1'>Next interacted date </label>
                                      
                                           <Calendar
                                            value={form.next_interacted_date}
                                            onChange={(e) => setForm({ ...form, next_interacted_date: e.target.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <input
                                            type="text"
                                            placeholder="Value in INR"
                                            value={form.value_in_inr}
                                            onChange={(e) => setForm({ ...form, value_in_inr: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <input
                                            type="text"
                                            placeholder="Remarks "
                                            value={form.remarks}

                                            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <input
                                            type="text"
                                            placeholder="Reason for lost customers"
                                            value={form.reason_for_lost_customers}
                                            onChange={(e) => setForm({ ...form, reason_for_lost_customers: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <textarea
                                            placeholder='Address'
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            className="form-control"
                                            rows={3}
                                            required
                                        >

                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer text-center">
                                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                                    {loading ? 'Processing...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default Leads;