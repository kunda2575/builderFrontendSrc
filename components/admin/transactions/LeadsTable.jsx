import React, { useEffect, useState, useRef } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // You can change the theme
import 'primereact/resources/primereact.min.css';                  // PrimeReact styles
import 'primeicons/primeicons.css';                                 // PrimeReact icons
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ImportData from '../resusableComponents/ResuableImportData';
import { fetchData, deleteData,postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Paginator } from 'primereact/paginator';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { Button } from 'primereact/button'; // Optional for styled export button
import axios from 'axios';
import ExportLeadsButton from '../reusableExportData/ExportLeadsButton';


const LeadsTable = () => {
    const [loading, setLoading] = useState(true)

    // for delete actions
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleteType, setDeleteType] = useState(null);

    const [filteredLeads, setFilteredLeads] = useState([]);
    const [leadSource, setLeadSource] = useState([]);          // get the data from backend
    const [leadStage, setLeadStage] = useState([]);
    const [teamMember, setTeamMember] = useState([]);

    const [selectedStages, setSelectedStages] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);      //  select options
    const [selectedMembers, setSelectedMembers] = useState([]);

    const [selectedContactNames, setSelectedContactNames] = useState([]);
    const selectedContactNamesRef = useRef([]);

    const [selectedContactPhones, setSelectedContactPhones] = useState([]);
    const selectedContactPhonesRef = useRef([]);

    const [selectedContactEmails, setSelectedContactEmails] = useState([]);
    const selectedContactEmailsRef = useRef([]);


    const selectedLeadStageRef = useRef([]);
    const selectedLeadSourceRef = useRef([]);                              // useref for tracking the filter values
    const selectedTeamMembersRef = useRef([]);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);                // pagination
    const skipValue = useRef(0);
    const limitValue = useRef(10);

    const [viewData, setViewData] = useState(null);

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



    const [leads, setLeads] = useState([]);

   const handleExcelImport = async (data) => {
    try {
        const response = await postData(config.createIMport, { leads: data }); // ✅ send leads in body
        toast.success("Leads imported successfully!");
        // getLeadDetails(); 
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || "Failed to import leads.");
    }
};


    // const fetchLeads = async () => {
    //     try {
    //         const res = await axios.get(`${API_BASE_URL}/leads`);
    //         setLeads(res.data.leadDetails);
    //     } catch (err) {
    //         console.error("Failed to fetch leads:", err);
    //     }
    // };

    // useEffect(() => {
    //     fetchLeads();
    // }, []);


    const getLeadDetails = async () => {
        setLoading(true);

        let leadStage = [];
        let leadSource = [];
        let teamMember = [];

        if (selectedLeadSourceRef.current?.length > 0) {
            let leadSourceIds = selectedLeadSourceRef.current.map(ele => ele.leadSource);
            leadSource = leadSourceIds;
        }
        if (selectedLeadStageRef.current?.length > 0) {
            let leadStageIds = selectedLeadStageRef.current.map(ele => ele.leadStage);
            leadStage = leadStageIds;
        }
        if (selectedTeamMembersRef.current?.length > 0) {
            let teamMemberIds = selectedTeamMembersRef.current.map(ele => ele.team_name);
            teamMember = teamMemberIds;
        }

        try {
            const res = await fetchData(`${config.getLeads}?leadSource=${leadSource}&leadStage=${leadStage}&teamMember=${teamMember}&skip=${skipValue.current}&limit=${limitValue.current}`);

            let leads = res.data.leadDetails;

            // Apply contact name filtering
            if (selectedContactNamesRef.current.length > 0) {
                leads = leads.filter(lead =>
                    selectedContactNamesRef.current.includes(lead.contact_name)
                );
            }

            // Apply contact phone filtering
            if (selectedContactPhonesRef?.current?.length > 0) {
                leads = leads.filter(lead =>
                    selectedContactPhonesRef.current.includes(lead.contact_phone)
                );
            }

            // Apply contact email filtering
            if (selectedContactEmailsRef?.current?.length > 0) {
                leads = leads.filter(lead =>
                    selectedContactEmailsRef.current.includes(lead.contact_email)
                );
            }

            setFilteredLeads(leads);

            setTotalRecords(res.data.leadCount);
        } catch (error) {
            toast.error("Failed to fetch leads.");
        } finally {
            setLoading(false);
        }
    };

    const getLeadStageDetails = async () => {
        await fetchData(config.getLeadStage)
            .then(res => {
                setLeadStage(res.data);
            })
    }

    const getLeadSource = async () => {
        await fetchData(config.getLeadSource)
            .then(res => {
                setLeadSource(res.data);
            })
    }

    const getTeamMembers = async () => {
        await fetchData(config.getTeamMember)
            .then(res => {
                setTeamMember(res.data);
            })
    }

    const resetFilters = () => {
        setSelectedSources([]);
        setSelectedStages([]);
        setSelectedMembers([])
        selectedLeadSourceRef.current = [];
        selectedLeadStageRef.current = [];
        selectedTeamMembersRef.current = [];
        getLeadDetails();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const confirmDelete = async () => {
        if (!confirmDeleteId) return;
        setLoading(true);
        try {
            const res = await deleteData(config.deleteLead(confirmDeleteId));
            toast.success(res.data?.message || "Material deleted successfully.");
            getLeadDetails(); // Refresh data
        } catch (error) {
            toast.error("Failed to delete material");
        } finally {
            setConfirmDeleteId(null);
            setShowDeleteModal(false);
            setDeleteType(null);
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-2">
            <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"></i>  Back </Link>
            <h3 className="text-center mb-3">Leads Management</h3>
            <div className="d-flex justify-content-end flex-wrap gap-2 my-2">
                <Link className="text-decoration-none text-primary" to="/leads">
                    <button className="btn btn-primary btn-sm">
                        Add Details <i className="pi pi-arrow-right"></i>
                    </button>
                </Link>

                <ImportData
                    headers={[
                        "contact_name",
                        "contact_phone",
                        "contact_email",
                        "address",
                        "customer_profession",
                        "native_language",
                        "lead_source",
                        "lead_stage",
                        "value_in_inr",
                        "creation_date",
                        "expected_date",
                        "team_member",
                        "last_interacted_on",
                        "next_interacted_date",
                        "remarks",
                        "reason_for_lost_customers"
                    ]}
                    fileName="Leads"
                    uploadData={handleExcelImport}
                />

                <ExportLeadsButton data={filteredLeads} />
            </div>

            <div className='row mb-3'>
                <div className='col-6'> <h5>Total Records : {totalRecords}</h5> </div>
                <div className='col-6 text-end'>
                    {(selectedLeadSourceRef.current.length > 0 || selectedLeadStageRef.current.length > 0 || selectedTeamMembersRef.current.length > 0) && (<button className='btn btn-danger btn-sm rounded-0' onClick={resetFilters}> Reset All Filters</button>)}
                </div>

            </div>

            {/* Confirmation Modal */}
            {showDeleteModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
                    <div className="bg-white p-4 rounded shadow">
                        <p className="mb-3">Are you sure you want to delete {deleteType === "bulk" ? "selected items?" : "this item?"}</p>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary btn-sm me-2" onClick={() => {
                                setConfirmDeleteId(null);
                                setShowDeleteModal(false);
                                setDeleteType(null);
                            }}>
                                Cancel
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => { confirmDelete() }} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {viewData && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 1050 }} // Bootstrap modal z-index range
                >
                    <div
                        className="bg-white p-4 rounded shadow w-75"
                        style={{ maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Lead Details</h5>
                            <button className="btn-close" onClick={() => setViewData(null)} />
                        </div>

                        <table className="table table-sm table-bordered">
                            <tbody>
                                {Object.entries(viewData).map(([key, value]) => (
                                    <tr key={key}>
                                        <th style={{ textTransform: 'capitalize' }}>
                                            {key.replace(/_/g, ' ')}
                                        </th>
                                        <td>
                                            {key === 'invoice_attachment' ? (
                                                value ? (
                                                    value.split(',').map((file, i) => (
                                                        <a
                                                            key={i}
                                                            href={`http://localhost:2026/uploads/${file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                            className="btn btn-sm btn-outline-primary me-2 mb-1"
                                                        >
                                                            Download PDF {i + 1}
                                                        </a>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">No Attachment</span>
                                                )
                                            ) : ['invoice_date', 'creation_date', 'expected_date', 'last_interacted_on', 'next_interacted_date'].includes(key) && value ? (
                                                moment(value).format('DD-MM-YYYY')
                                            ) : Array.isArray(value) ? (
                                                value.map((v, i) => (
                                                    <div key={i}>{JSON.stringify(v)}</div>
                                                ))
                                            ) : (
                                                String(value)
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            )}


            <DataTable
                value={filteredLeads}
                scrollable
                // scrollHeight="600px"
                loading={loading}
                loadingIcon="pi pi-spinner"
                stripedRows
                showClear={true}
                emptyMessage={
                    <h6 className="text-center" >
                        No leads data available
                    </h6>
                }

                responsiveLayout="scroll" // ✅ makes table responsive on small screens
            // style={{ maxWidth: '100vw', overflowX: 'auto' }}
            >
                {/* <Column field="contact_name" header="Contact Name" /> */}


                <Column
                    field="contact_name"
                    header={
                        <>
                            Contact Name
                            <br />
                            <MultiSelect
                                filter
                                value={selectedContactNames}
                                options={[...new Set(filteredLeads.map(lead => lead.contact_name))].map(name => ({ label: name, value: name }))}
                                onChange={(e) => {
                                    setSelectedContactNames(e.value);
                                    selectedContactNamesRef.current = e.value;
                                    getLeadDetails(); // optional if you want backend filtering
                                }}
                                placeholder="Select Contact Name"
                                className="w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedContactNames.length} selected`}
                            />
                        </>
                    }
                />


                {/* <Column field="contact_phone" header="Contact Phone" /> */}



                <Column
                    field="contact_phone"
                    header={
                        <>
                            Contact Phone
                            <br />
                            <MultiSelect
                                filter
                                value={selectedContactPhones}
                                options={[...new Set(filteredLeads.map(lead => lead.contact_phone))].map(name => ({ label: name, value: name }))}
                                onChange={(e) => {
                                    setSelectedContactPhones(e.value);
                                    selectedContactPhonesRef.current = e.value;
                                    getLeadDetails(); // optional if you want backend filtering
                                }}
                                placeholder="Select Contact Phone"
                                className="w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedContactPhones.length} selected`}
                            />
                        </>
                    }
                />



                {/* <Column field="contact_email" header="Contact Email" /> */}

                <Column
                    field="contact_email"
                    header={
                        <>
                            Contact Email
                            <br />
                            <MultiSelect
                                filter
                                value={selectedContactEmails}
                                options={[...new Set(filteredLeads.map(lead => lead.contact_email))].map(name => ({ label: name, value: name }))}
                                onChange={(e) => {
                                    setSelectedContactEmails(e.value);
                                    selectedContactEmailsRef.current = e.value;
                                    getLeadDetails(); // optional if you want backend filtering
                                }}
                                placeholder="Select Contact Email"
                                className="w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedContactEmails.length} selected`}
                            />
                        </>
                    }
                />


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
                                    selectedLeadSourceRef.current = e.value;
                                    getLeadDetails();
                                }}
                                placeholder="Select Lead Source"
                                className="w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedSources.length} selected`}
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
                                    selectedLeadStageRef.current = e.value;
                                    getLeadDetails();
                                }}
                                placeholder="Select Lead Stage"
                                className="w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedStages.length} selected`}
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
                                    selectedTeamMembersRef.current = e.value;
                                    getLeadDetails();
                                }}
                                placeholder="Select Team Member"
                                className="w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedMembers.length} selected`}
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
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div className="d-flex gap-2 justify-content-center">
                            <Link to={`/leads?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                                <i className="pi pi-pencil"></i>
                            </Link>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => {
                                setConfirmDeleteId(rowData.id);
                                setDeleteType("single");
                                setShowDeleteModal(true);
                            }}>
                                <i className="pi pi-trash"></i>
                            </button>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => setViewData(rowData)}>
                                <i className="pi pi-eye"></i>
                            </button>
                        </div>
                    )}
                    style={{ minWidth: '7rem' }}
                />
            </DataTable>


            <div className='mt-3'>
                <Paginator first={first} rows={rows} totalRecords={totalRecords} rowsPerPageOptions={[10, 25, 50, 100, 200, totalRecords]} onPageChange={onPageChange} />
            </div>

        </div>
    );
};

export default LeadsTable;
