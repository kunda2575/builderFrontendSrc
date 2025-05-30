import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';

const ProjectCreditsTable = () => {
    const [source, setSource] = useState([]);
    const [purpose, setPurpose] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    

    useEffect(() => {
        fetchData(config.getSource).then(res => setSource(res.data || []));
        fetchData(config.getPurpose).then(res => setPurpose(res.data || []));
        fetchData(config.getPaymentModePc).then(res => setPaymentMode(res.data || []));
    
    }, []);

    const fetchProjectCredits = async ({ source, purpose, payment_mode,  skip, limit }) => {
        // const params = { source, purpose, payment_mode, payment_bank, skip, limit };
 const url = `${config.getProjectCredits}?source=${source || ''}&purpose=${purpose || ''}&payment_mode=${payment_mode || ''}&skip=${skip}&limit=${limit}`;
      const res = await fetchData(url);
        return {
            data: res.data?.projectCreditsDetails || [],
            count: res.data?.projectCreditsDetailsCount || 0,
        };
    };

    
    return (
        <div>
            {/* Action Buttons */}
          
            <ReusableDataTable
                title="Project Credits Table"
                fetchFunction={fetchProjectCredits}
               deleteFunction={(id) => deleteData(config.deleteProjectCredits(id))}
                         filters={[
                    {
                        field: 'source',
                        header: 'Source',
                        options: source,
                        optionLabel: 'fundSource',
                        optionValue: 'fundSource',
                        queryKey: 'fundSource'
                    },
                    {
                        field: 'deposit_bank_purpose',
                        header: 'Purpose',
                        options: purpose,
                        optionLabel: 'fundPurpose',
                        optionValue: 'fundPurpose',
                        queryKey: 'fundPurpose'
                    },
                    {
                        field: 'payment_mode',
                        header: 'Payment Mode',
                        options: paymentMode,
                        optionLabel: 'paymentMode',
                        optionValue: 'paymentMode',
                        queryKey: 'payment_mode'
                    },
                   
                ]}
                columns={[
                    { field: 'date', header: 'Date' },
                    { field: 'amount_inr', header: 'Amount (INR)' },
           
                   
                ]}
                actions={(rowData, { onDelete }) => (
                    <>
                        <Link to={`/projectCreditForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                            <i className="pi pi-pencil" />
                        </Link>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(rowData.id)}>
                            <i className="pi pi-trash" />
                        </button>
                    </>
                )}
                 addButtonLink="/projectCreditForm"
            backButtonLink="/transaction"
            />
        </div>
    );
};

export default ProjectCreditsTable;
