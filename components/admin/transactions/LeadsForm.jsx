import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import './calender.css'
import { useSearchParams } from 'react-router-dom';

const Leads = () => {
    // For GET data based on ID 
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id'); //Ex: This gets ?id=123 from the URL

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

        if (editId) {
            fetchEditData(editId);
        }
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetchData(`${config.getLeads}`);
            setLeads(res.data);
        } catch (error) {
            toast.error('Failed to fetch leads');
        }
    };
    const fetchLeadSource = async () => {
        try {
            const res = await fetchData(`${config.getLeadSource}`);
            setLeadSource(res.data);
        } catch (error) {
            toast.error('Failed to fetch lead source');
        }
    };
    const fetchLeadStageDetails = async () => {
        try {
            const res = await fetchData(`${config.getLeadStage}`);
            setLeadStage(res.data);
        } catch (error) {
            toast.error('Failed to fetch lead stage');
        }
    };

    const fetchTeamMemberDetails = async () => {
        try {
            const res = await fetchData(`${config.getTeamMember}`);
            setteamMember(res.data);
        } catch (error) {
            toast.error('Failed to fetch team member');
        }
    };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Prepare form data for submission
    const formData = { ...form };

    // Convert array fields to CSV strings (if any)
    if (Array.isArray(formData.native_language)) {
      formData.native_language = formData.native_language.join(',');
    }

    let response;
    if (form.id) {
      response = await putData(config.updateLead(form.id), formData);
    } else {
      response = await postData(config.createLead, formData);
    }

    if (response.success) {
      toast.success(form.id ? 'Leads updated successfully' : 'Leads created successfully');
      
      setForm({
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

      fetchLeads();  // reload list or whatever needed
    } else {
      // Show backend validation or other errors here
      toast.error(response.message || 'Action failed');
    }
  } catch (error) {
    // This catches unexpected JS errors or network errors
    toast.error(error.message || 'Action failed');
  } finally {
    setLoading(false);
  }
};


    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getLeadById(id)); // Update this to your actual API endpoint
            const lead = res.data;

            if (lead) {
                if (typeof lead.native_language === 'string') {
                    lead.native_language = lead.native_language.split(','); // convert back to array if it's a CSV
                }
                setForm({
                    contact_name: lead.contact_name || '',
                    contact_phone: lead.contact_phone || '',
                    contact_email: lead.contact_email || '',
                    address: lead.address || '',
                    customer_profession: lead.customer_profession || '',
                    native_language: lead.native_language || [],  // reset to an empty array for MultiSelect
                    lead_source: lead.lead_source || '',
                    lead_stage: lead.lead_stage || '',
                    value_in_inr: lead.value_in_inr || '',
                    creation_date: lead.creation_date ? new Date(lead.creation_date) : '',
                    expected_date: lead.expected_date ? new Date(lead.expected_date) : '',
                    last_interacted_on: lead.last_interacted_on ? new Date(lead.last_interacted_on) : '',
                    next_interacted_date: lead.next_interacted_date ? new Date(lead.next_interacted_date) : '',
                    team_member: lead.team_member || '',
                    remarks: lead.remarks || '',
                    reason_for_lost_customers: lead.reason_for_lost_customers || '',
                    id: lead.id || null
                });
            }
        } catch (error) {
            toast.error("Failed to load Lead data for editing");
            console.error("Error loading lead by ID:", error);
        }
    };


    return (
        <div className="container-fluid mt-4">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"> </i>  Back </Link>
                <Link className="text-decoration-none text-primary" to="/leadsTable"> <button className='btn btn-sm btn-primary'> Leads Management table <i className="pi pi-arrow-right"> </i> </button> </Link>
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
                                        <label>Contact Name </label>
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
                            <label> Contact Phone</label>
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
                                        <label>Contact Email </label>
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
                                        <label> Contact Profession</label>
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
                                        <label>Native Language </label>
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
                                        <label> Lead Source</label>
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
                                        <label> Lead Stage</label>
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
                                        <label> Team Member </label>
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
                                        <label> Creation date</label>
                                       
                                        <Calendar
                                            value={form.creation_date}
                                            onChange={(e) => setForm({ ...form, creation_date: e.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                            showButtonBar
                                        />

                                    </div>
                                    <div className="col-lg-3">
                                        <label>Expected close date </label>
                                        <Calendar
                                            value={form.expected_date}
                                            onChange={(e) => setForm({ ...form, expected_date: e.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                            showButtonBar
                                        />
                                    </div>

                                    <div className="col-lg-3">
                                        <label > Last interacted on </label>

                                        <Calendar
                                            value={form.last_interacted_on}
                                            onChange={(e) => setForm({ ...form, last_interacted_on: e.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                            showButtonBar
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label>Next interacted date </label>

                                        <Calendar
                                            value={form.next_interacted_date}
                                            onChange={(e) => setForm({ ...form, next_interacted_date: e.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                            showButtonBar
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label>Value in INR </label>
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
                                        <label>Remarks </label>
                                        <input
                                            type="text"
                                            placeholder="Remarks"
                                            value={form.remarks}

                                            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label>Reason for lost customers </label>
                                        <input
                                            type="text"
                                            placeholder="Reason for lost customers"
                                            value={form.reason_for_lost_customers}
                                            onChange={(e) => setForm({ ...form, reason_for_lost_customers: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label> Address</label>
                                        <textarea
                                            placeholder='Address'
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            className="form-control mb-2"
                                            rows={3}
                                            required
                                        >

                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="card-footer text-center row d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary btn-sm col-lg-2" disabled={loading}>
                                    {loading ? 'Processing...' : form.id ? 'Update' : 'Create'}
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