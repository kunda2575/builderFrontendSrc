import React, { useEffect, useState } from 'react';
import { getleadDetails, getleadSourceDetails, getleadStageDetails, getteamMemberDetails } from '../../../api/transactionApis/leadsApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [leadSource, setLeadSource] = useState([]);
  const [leadStage, setLeadStage] = useState([]);
  const [teamMember, setTeamMember] = useState([]);
  const [filters, setFilters] = useState({
    lead_stage: '',
    lead_source: '',
    team_member: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const leadsRes = await getleadDetails();
      const sourceRes = await getleadSourceDetails();
      const stageRes = await getleadStageDetails();
      const teamRes = await getteamMemberDetails();
      setLeads(leadsRes.data);
      setLeadSource(sourceRes.data);
      setLeadStage(stageRes.data);
      setTeamMember(teamRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ lead_stage: '', lead_source: '', team_member: '' });
  };

  const filteredLeads = leads.filter(lead => {
    const matchStage = filters.lead_stage ? lead.lead_stage === Number(filters.lead_stage) : true;
    const matchSource = filters.lead_source ? lead.lead_source === Number(filters.lead_source) : true;
    const matchMember = filters.team_member ? lead.team_member === Number(filters.team_member) : true;
    return matchStage && matchSource && matchMember;
  });

  const getLeadStageName = (id) => {
    const stage = leadStage.find(stage => stage.id === id);
    return stage ? stage.leadStage : '';
  };

  const getLeadSourceName = (id) => {
    const source = leadSource.find(source => source.id === id);
    return source ? source.leadSource : '';
  };

  const getTeamMemberName = (id) => {
    const member = teamMember.find(member => member.id === id);
    return member ? member.team_name : '';
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Leads Data</h2>

      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            name="lead_stage"
            value={filters.lead_stage}
            onChange={handleFilterChange}
          >
            <option value="">Select Lead Stage</option>
            {leadStage.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.leadStage}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            name="lead_source"
            value={filters.lead_source}
            onChange={handleFilterChange}
          >
            <option value="">Select Lead Source</option>
            {leadSource.map(source => (
              <option key={source.id} value={source.id}>{source.leadSource}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            name="team_member"
            value={filters.team_member}
            onChange={handleFilterChange}
          >
            <option value="">Select Team Member</option>
            {teamMember.map(member => (
              <option key={member.id} value={member.id}>{member.team_name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <button className="btn btn-secondary w-100" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Contact Name</th>
              <th>Lead Stage</th>
              <th>Lead Source</th>
              <th>Team Member</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead, index) => (
                <tr key={lead.id}>
                  <td>{index + 1}</td>
                  <td>{lead.contact_name}</td>
                  <td>{getLeadStageName(lead.lead_stage)}</td>
                  <td>{getLeadSourceName(lead.lead_source)}</td>
                  <td>{getTeamMemberName(lead.team_member)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;