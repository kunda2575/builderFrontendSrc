import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CustomTable = ({
    value,
    columns,
    paginator = true,
    rows = 10,
    filters,
    onFilter,
    filterDisplay = 'row',
    emptyMessage = 'No records found',
}) => {
    return (
        <div className="card">
            <DataTable
                value={value}
                paginator={paginator}
                rows={rows}
                filters={filters}
                onFilter={onFilter}
                filterDisplay={filterDisplay}
                responsiveLayout="scroll"
                emptyMessage={emptyMessage}
            >
                {columns.map((col, index) => (
                    <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        sortable={col.sortable}
                        filter={col.filter}
                        filterElement={col.filterElement}
                        filterPlaceholder={col.filterPlaceholder}
                    />
                ))}
            </DataTable>
        </div>
    );
};

export default CustomTable;