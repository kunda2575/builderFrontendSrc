import React, { useEffect, useState } from 'react';
import { getleadDetails, getleadSourceDetails, getleadStageDetails, getteamMemberDetails } from '../../../api/transactionApis/leadsApi';
import { MultiSelect } from 'primereact/multiselect';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // You can change the theme
import 'primereact/resources/primereact.min.css';                  // PrimeReact styles
import 'primeicons/primeicons.css';                                 // PrimeReact icons
import { Link } from 'react-router-dom';

const LeadsTable = () => {
    const [loading, setLoading] = useState(true)
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);

    const [leadSource, setLeadSource] = useState([]);
    const [leadStage, setLeadStage] = useState([]);
    const [teamMember, setTeamMember] = useState([]);

    const [selectedStages, setSelectedStages] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterLeads();
    }, [leads, selectedStages, selectedSources, selectedMembers]);

    const fetchData = async () => {
        try {
            const [leadsRes, stageRes, sourceRes, memberRes] = await Promise.all([
                getleadDetails(),
                getleadStageDetails(),
                getleadSourceDetails(),
                getteamMemberDetails()
            ]);
            setLeads(leadsRes.data);
            setLeadStage(stageRes.data);
            setLeadSource(sourceRes.data);
            setTeamMember(memberRes.data);
        } catch {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };
    

    const filterLeads = () => {
        let filtered = [...leads];

        if (selectedStages.length) {
            filtered = filtered.filter(l => selectedStages.includes(String(l.lead_stage)));
        }
        if (selectedSources.length) {
            filtered = filtered.filter(l => selectedSources.includes(String(l.lead_source)));
        }
        if (selectedMembers.length) {
            filtered = filtered.filter(l => selectedMembers.includes(String(l.team_member)));
        }

        setFilteredLeads(filtered);
    };

    const getLabel = (list, id, key) => {
        const item = list.find(i => String(i.id) === String(id));
        return item ? item[key] : '';
    };
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between">
                <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"></i>  Back </Link>
                <h3 className="text-center mb-4">Leads Management</h3>
                <Link className="text-decoration-none text-primary" to="/leads"> <i className="pi pi-arrow-right"></i>  Add Details </Link>
            </div>
            <div
                className="filters-container d-flex justify-content-center"
                style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.5rem',
                }}
            >

              
                <div className="filter-group">
                    <label htmlFor="leadSource" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Lead Source
                    </label>
                    <MultiSelect
                        inputId="leadSource"
                        value={selectedSources}
                        options={leadSource.map(source => ({ label: source.leadSource, value: String(source.id) }))}
                        onChange={(e) => setSelectedSources(e.value)}
                        placeholder="Select Lead Source"
                        display="chip"
                        className="w-20rem"
                    />
                </div>
                                  <div className="filter-group">
                    <label htmlFor="leadStage" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Lead Stage
                    </label>
                    <MultiSelect
                        inputId="leadStage"
                        value={selectedStages}
                        options={leadStage.map(stage => ({ label: stage.leadStage, value: String(stage.id) }))}
                        onChange={(e) => setSelectedStages(e.value)}
                        placeholder="Select Lead Stage"
                        display="chip"
                        className="w-20rem"
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="teamMember" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Team Member
                    </label>
                    <MultiSelect
                        inputId="teamMember"
                        value={selectedMembers}
                        options={teamMember.map(member => ({ label: member.team_name, value: String(member.id) }))}
                        onChange={(e) => setSelectedMembers(e.value)}
                        placeholder="Select Team Member"
                        display="chip"
                        className="w-20rem"
                    />
                </div>



            </div>


            {/* <div className="card shadow-sm"> */}
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className='table-secondary'>
                        <tr>
                            <th>Contact Name</th>
                            <th>Contact Phone</th>
                            <th>Contact Email</th>
                            <th>Address</th>
                            <th>Profession</th>
                            <th>Language</th>
                            <th>Lead Source</th>
                            <th>Lead Stage</th>
                            <th>Value (INR)</th>
                            <th>Creation Date</th>
                            <th>Expected Date</th>
                            <th>Team Member</th>
                            <th>Last Interacted</th>
                            <th>Next Interaction</th>
                            <th>Remarks</th>
                            <th>Reason for Lost Customers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="16" className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">  </span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan="16" className="text-center">
                                    No Records Found
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map(lead => (
                                <tr key={lead.id}>
                                    <td>{lead.contact_name}</td>
                                    <td>{lead.contact_phone}</td>
                                    <td>{lead.contact_email}</td>
                                    <td>{lead.address}</td>
                                    <td>{lead.customer_profession}</td>
                                    <td>{lead.native_language}</td>
                                    <td>{getLabel(leadSource, lead.lead_source, 'leadSource')}</td>
                                    <td>{getLabel(leadStage, lead.lead_stage, 'leadStage')}</td>
                                    <td>{lead.value_in_inr}</td>
                                    <td>{formatDate(lead.creation_date)}</td>
                                    <td>{formatDate(lead.expected_date)}</td>
                                    <td>{getLabel(teamMember, lead.team_member, 'team_name')}</td>
                                    <td>{formatDate(lead.last_interacted_on)}</td>
                                    <td>{formatDate(lead.next_interacted_date)}</td>
                                    <td>{lead.remarks}</td>
                                    <td>{lead.reason_for_lost_customers}</td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
            {/* </div> */}
        </div>
    );
};

export default LeadsTable;
