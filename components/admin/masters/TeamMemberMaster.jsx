import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  importTeamMember
} from '../../../api/updateApis/teamMemberApi'; // Your API functions

const fields = [
  { name: 'team_name', label: 'Team Name', type: 'text', required: true },
  { name: 'team_phone', label: 'Team phone Number', type: 'text', required: true },
  { name: 'team_email', label: 'Team Email Id', type: 'email', required: true },
  { name: 'team_address', label: 'Team Address', type: 'text', required: true },

  { name: 'team_designation', label: 'Team Designation', type: 'text', required: true },



];


const TeamMemberMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Team Member"
          backend="teamMembers"
        fields={fields}
        fetchData={getTeamMembers}
        createData={createTeamMember}
        updateData={updateTeamMember}
        deleteData={deleteTeamMember}
         importData={importTeamMember}
      />
    </div>
  );
};

export default TeamMemberMaster;