import React, { useEffect, useState, useRef } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // You can change the theme
import 'primereact/resources/primereact.min.css';                  // PrimeReact styles
import 'primeicons/primeicons.css';                                 // PrimeReact icons
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Paginator } from 'primereact/paginator';
import moment from 'moment';


const LeadsTable = () => {
    const [loading, setLoading] = useState(true)


    const [filteredLeads, setFilteredLeads] = useState([]);
    const [leadSource, setLeadSource] = useState([]);          // get the data from backend
    const [leadStage, setLeadStage] = useState([]);
    const [teamMember, setTeamMember] = useState([]);

    const [selectedStages, setSelectedStages] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);      //  select options
    const [selectedMembers, setSelectedMembers] = useState([]);

    const selectedLeadStage = useRef([]);
    const selectedLeadSource = useRef([]);                              // useref for tracking the filter values
    const selectedTeamMembers = useRef([]);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);                // pagination
    const skipValue = useRef(0);
    const limitValue = useRef(10);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        skipValue.current = event.first;     // skip = first record index
        limitValue.current = event.rows;     // limit = number of rows per page

        // Trigger data fetch
        getLeadDetails();
    };

    useEffect(() => {
        getLeadDetails();
        getLeadSource();                  //  inital load
        getLeadStageDetails();
        getTeamMembers();
    }, []);


    const getLeadDetails = async () => {
        setLoading(true)
        let leadStage = [];
        let leadSource = [];
        let teamMember = [];
        if (selectedLeadSource.current?.length > 0) {
            let leadSourceIds = selectedLeadSource.current.map(ele => ele.leadSource);
            leadSource = leadSourceIds;
        }
        if (selectedLeadStage.current?.length > 0) {
            let leadStageIds = selectedLeadStage.current.map(ele => ele.leadStage);
            leadStage = leadStageIds
        }
        if (selectedTeamMembers.current?.length > 0) {
            let teamMemberIds = selectedTeamMembers.current.map(ele => ele.team_name);
            teamMember = teamMemberIds
        }
        await fetchData(`${config.getLeads}?leadSource=${leadSource}&leadStage=${leadStage}&teamMember=${teamMember}&skip=${skipValue.current}&limit=${limitValue.current}`)
            .then(res => {
                setFilteredLeads(res.data.leadDetails);
                setTotalRecords(res.data.leadCount);
                setLoading(false);
            })
    }

    const getLeadStageDetails = async () => {
        await fetchData(config.leadStage)
            .then(res => {
                setLeadStage(res.data);
            })
    }

    const getLeadSource = async () => {
        await fetchData(config.leadSource)
            .then(res => {
                setLeadSource(res.data);
            })
    }

    const getTeamMembers = async () => {
        await fetchData(config.teamMember)
            .then(res => {
                setTeamMember(res.data);
            })
    }


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
            <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"></i>  Back </Link>
            <h3 className="text-center mb-3">Leads Management</h3>
            <div className="text-end">
                <Link className="text-decoration-none text-primary" to="/leads"> <button className='btn btn-primary btn-sm'> Add Details  <i className="pi pi-arrow-right"></i> </button>  </Link>
            </div>

            <div className='row mb-3'>
                <div className='col-6'> <h5>Total Records : {totalRecords}</h5> </div>
                <div className='col-6 text-end'>
                    {(selectedLeadSource.current.length > 0 || selectedLeadStage.current.length > 0 || selectedTeamMembers.current.lengh > 0) && <button className='btn btn-danger btn-sm rounded-0'> Reset All Filters</button>}
                </div>

            </div>
            {/* <DataTable
               value={filteredLeads}
               stripedRows
               scrollable
               scrollHeight="600px"
               loading={loading}
               loadingIcon="pi pi-spinner"
               emptyMessage={<h6 className="p-4">No leads data available.</h6>}
            >
                <Column field="contact_name" header="Contact Name" style={{ minWidth: '150px' }} />
                <Column field="contact_phone" header="Contact Phone" style={{ minWidth: '150px' }} />
                <Column field="contact_email" header="Contact Email" style={{ minWidth: '150px' }} />
                <Column field="address" header="Address" style={{ minWidth: '200px' }} />
                <Column field="customer_profession" header="Contact Profession" style={{ minWidth: '150px' }} />
                <Column field="native_language" header="Native Language" style={{ minWidth: '150px' }} />

                <Column
                    field="lead_source"
                    header={() => (
                        <label>
                            Lead Source<br />
                            <div style={{ minWidth: '150px' }}>
                                <MultiSelect
                                    filter
                                    value={selectedSources}
                                    options={leadSource}
                                    optionLabel="leadSource"
                                    onChange={(e) => {
                                        setSelectedSources(e.target.value);
                                        selectedLeadSource.current = e.target.value;
                                        getLeadDetails();
                                    }}
                                    placeholder="Select Lead Source"
                                    className="w-100"
                                    showClear
                                />
                            </div>
                        </label>
                    )}
                    style={{ minWidth: '180px', maxWidth: '200px' }}
                />

                <Column
                    field="lead_stage"
                    header={() => (
                        <label>
                            Lead Stage<br />
                            <div style={{ minWidth: '150px' }}>
                                <MultiSelect
                                    filter
                                    value={selectedStages}
                                    options={leadStage}
                                    optionLabel="leadStage"
                                    onChange={(e) => {
                                        setSelectedStages(e.target.value);
                                        selectedLeadStage.current = e.target.value;
                                        getLeadDetails();
                                    }}
                                    placeholder="Select Lead Stage"
                                    className="w-100"
                                    showClear
                                />
                            </div>
                        </label>
                    )}
                    style={{ minWidth: '180px', maxWidth: '200px' }}
                />

                <Column field="value_in_inr" header="Value In INR" style={{ minWidth: '150px' }} />
                <Column field="creation_date" header="Creation Date" body={(rowData) => formatDate(rowData.creation_date)} style={{ minWidth: '150px' }} />
                <Column field="expected_date" header="Expected Date" body={(rowData) => formatDate(rowData.expected_date)} style={{ minWidth: '150px' }} />

                <Column
                    field="team_member"
                    header={() => (
                        <label>
                            Team Member<br />
                                <MultiSelect
                                    filter
                                    value={selectedMembers}
                                    options={teamMember}
                                    optionLabel="team_name"
                                    onChange={(e) => {
                                        setSelectedMembers(e.target.value);
                                        selectedTeamMembers.current = e.target.value;
                                        getLeadDetails();
                                    }}
                                    placeholder="Select Team Member"
                                    className="w-100"
                                    showClear
                                />
                        </label>
                    )}
                    // style={{ minWidth: '180px', maxWidth: '200px' }}
                />

                <Column
                    field="last_interacted_on"
                    header="Last Interacted On"
                    body={(rowData) => rowData.last_interacted_on ? moment(rowData.last_interacted_on).format("DD-MM-YYYY") : ''}
                    style={{ minWidth: '150px' }}
                />
                <Column field="next_interacted_date" header="Next Interacted Date" body={(rowData) => formatDate(rowData.next_interacted_date)} style={{ minWidth: '150px' }} />
                <Column field="remarks" header="Remarks" style={{ minWidth: '200px' }} />
                <Column field="reason_for_lost_customers" header="Reason For Lost Customers" style={{ minWidth: '200px' }} />
            </DataTable> */}

            <DataTable
                value={filteredLeads}
                // scrollable
                // scrollHeight="flex"
                loading={loading}
                stripedRows
                emptyMessage="No leads data available"
                responsiveLayout="scroll" // ✅ makes table responsive on small screens
            >
                <Column field="contact_name" header="Contact Name" />
                <Column field="contact_phone" header="Contact Phone" />
                <Column field="contact_email" header="Contact Email" />
                <Column field="address" header="Address" />
                <Column field="customer_profession" header="Profession" />
                <Column field="native_language" header="Language" />

                <Column
                    field="lead_source"
                    header={
                        <>
                            Lead Source
                            <br />
                            <MultiSelect
                                filter
                                value={selectedSources}
                                options={leadSource}
                                optionLabel="leadSource"
                                onChange={(e) => {
                                    setSelectedSources(e.value);
                                    selectedLeadSource.current = e.value;
                                    getLeadDetails();
                                }}
                                placeholder="Select Lead Source"
                                className="w-100"
                                showClear
                            />
                        </>
                    }
                />

                <Column
                    field="lead_stage"
                    header={
                        <>
                            Lead Stage
                            <br />
                            <MultiSelect
                                filter
                                value={selectedStages}
                                options={leadStage}
                                optionLabel="leadStage"
                                onChange={(e) => {
                                    setSelectedStages(e.value);
                                    selectedLeadStage.current = e.value;
                                    getLeadDetails();
                                }}
                                placeholder="Select Lead Stage"
                                className="w-100"
                                showClear
                            />
                        </>
                    }
                />

                <Column field="value_in_inr" header="Value In INR" />
                <Column
                    field="creation_date"
                    header="Creation Date"
                    body={(rowData) => moment(rowData.creation_date).format("DD-MM-YYYY")}
                />
                <Column
                    field="expected_date"
                    header="Expected Date"
                    body={(rowData) => moment(rowData.expected_date).format("DD-MM-YYYY")}
                />
                <Column
                    field="team_member"
                    header={
                        <>
                            Team Member
                            <br />
                            <MultiSelect
                                filter
                                value={selectedMembers}
                                options={teamMember}
                                optionLabel="team_name"
                                onChange={(e) => {
                                    setSelectedMembers(e.value);
                                    selectedTeamMembers.current = e.value;
                                    getLeadDetails();
                                }}
                                placeholder="Select Team Member"
                                className="w-100"
                                showClear
                            />
                        </>
                    }
                />
                <Column
                    field="last_interacted_on"
                    header="Last Interacted On"
                    body={(rowData) =>
                        rowData.last_interacted_on
                            ? moment(rowData.last_interacted_on).format("DD-MM-YYYY")
                            : ""
                    }
                />
                <Column
                    field="next_interacted_date"
                    header="Next Interacted Date"
                    body={(rowData) => moment(rowData.next_interacted_date).format("DD-MM-YYYY")}
                />
                <Column field="remarks" header="Remarks" />
                <Column field="reason_for_lost_customers" header="Reason For Lost Customers" />
            </DataTable>


            <div className='mt-3'>
                <Paginator first={first} rows={rows} totalRecords={totalRecords} rowsPerPageOptions={[10, 25, 50, 100, 200, totalRecords]} onPageChange={onPageChange} />
            </div>

        </div>
    );
};

export default LeadsTable;
