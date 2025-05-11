import { useEffect, useState } from 'react';
import { fetchData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import ReusableDataTable from './ReusableDataTable';

const ExpenditureTable = () => {
  const [vendorNames, setVendorNames] = useState([]);
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentBanks, setPaymentBanks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [vendorRes, expenseHeadRes, paymentModeRes, paymentBankRes] = await Promise.all([
          fetchData(config.getVendor),
          fetchData(config.getExpenseHead),
          fetchData(config.getPaymentMode),
          fetchData(config.getPaymentBank)
        ]);

        setVendorNames(vendorRes.data || []);
        setExpenseHeads(expenseHeadRes.data || []);
        setPaymentModes(paymentModeRes.data || []);
        setPaymentBanks(paymentBankRes.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    })();
  }, []);

  return (
    <ReusableDataTable
      title="Expenditure"
      addLink="/expenditure"
      fetchUrl={config.getExpenditure}
      deleteUrl={(id) => config.deleteExpenditure(id)}
      filtersConfig={[
        {
          field: 'vendor_name',
          label: 'Vendor Name',
          options: vendorNames,
          optionLabel: 'vendorName',
          optionKey: 'vendorName',
          queryKey: 'vendorName'
        },
        {
          field: 'expense_head',
          label: 'Expense Head',
          options: expenseHeads,
          optionLabel: 'expenseHead',
          optionKey: 'expenseHead',
          queryKey: 'expenseHead'
        },
        {
          field: 'payment_mode',
          label: 'Payment Mode',
          options: paymentModes,
          optionLabel: 'paymentMode',
          optionKey: 'paymentMode',
          queryKey: 'paymentMode'
        },
        {
          field: 'payment_bank',
          label: 'Payment Bank',
          options: paymentBanks,
          optionLabel: 'bankName',
          optionKey: 'bankName',
          queryKey: 'paymentBank'
        }
      ]}
      columns={[
        { field: 'date', header: 'Date' },
      
        { field: 'amount_inr', header: 'Amount (INR)' },
        { field: 'invoice_number', header: 'Invoice No.' },
     
        { field: 'payment_reference', header: 'Reference' },
        { field: 'payment_evidence', header: 'Evidence' }
      ]}
    />
  );
};

export default ExpenditureTable;
