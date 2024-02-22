import React, { useState, useMemo, useCallback } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import data from './gridData.json';
import gridConfig from './gridConfig.json';
import { useNavigate } from 'react-router-dom';
import FormComponent from './FormComponent';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function App() {
  const navigate = useNavigate();
  const [homeClicked, setHomeClicked] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [clicked,setClicked] =useState(true);
  const handleDataClick = () => {
    setSelectedRow(null);
    setHomeClicked(false);
    setClicked(true);
    navigate('/data');

  };

  const handleHomeClick = () => {
    setSelectedRow(null);
    setHomeClicked(true);
    
  };

  const columns = useMemo(
    () =>
      gridConfig.map((item) => ({
        key: item.key,
        name: item.name,
        resizable: true,
        sortable: ['fname', 'surname'].includes(item.key),
      })),
    []
  );

  const createRows = useMemo(
    () =>
      data.map((row) => ({
        objectId: row['FARMER.OBJECT_ID'],
        status: row['FARMER.STATUS'],
        idbr: row['FARMER.FIC'],
        tax_no: row['FARMER.TAX_NO'],
        full_name: row['FARMER.FULL_NAME'],
        surname: row['FARMER.SURNAME'],
        fname: row['FARMER.FNAME'],
        gender: row['FARMER.GENDER'],
        dt_birth: row['FARMER.DT_BIRTH'],
        farm_address: row['FARMER.FARM_ADDRESS'],
        farm_munic: row['FARMER.FARM_MUNIC'],
        phone: row['FARMER.PHONE'],
        mail: row['FARMER.MAIL'],
      })),
    []
  );

  const onRowClick = (row) => {
    setSelectedRow(row);
    setClicked(false);
    navigate(`/farmer/${row.row.objectId}`);
  };
  const handleDownloadCsv = () => {
    
    const columnNames = columns.map(column => column.name);
 
    const csvContent = [
      
      columnNames.join(','), 
      
      ...createRows.map(row => 
        columns.map(column => {
          let cellValue = `${row[column.key] || ''}`;
          
       
          cellValue = `"${cellValue.replace(/"/g, '""')}"`;
          
          return cellValue;
        }).join(',')
      )
    ].join('\n');
    

    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = 'data-grid.csv'; 
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
 

  const handleDownloadExcel = () => {
    
    const columnKeys = columns.map(column => column.name);
    const excelData = columns.map(column => 
      createRows.map(row => row[column.key] || '')
    );    
    const worksheet = XLSX.utils.aoa_to_sheet([columnKeys, ...excelData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'data-grid.xlsx');
};

 const handleDownloadJSON = () => {
  const columnKeys = columns.map(column => column.name);
  const jsonData = createRows.map(row => 
      columns.map(column => row[column.key] || '')
  );

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify([columnKeys,...jsonData])
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(a); 
  
 }
  return (
    <div>
      <NavBar onDataClick={handleDataClick} onHomeClick={handleHomeClick} onExcelClick = {handleDownloadExcel} onCsvClick={handleDownloadCsv}  onJsonClick = {handleDownloadJSON} clicked={clicked}/>
      {!homeClicked ? (
        !selectedRow  ? (
          <DataGrid
            columns={columns}
            rows={createRows}
            rowsCount={createRows.length}
            rowKeyGetter={(row) => row.objectId}
            onCellClick={onRowClick}
          />
        ) : (
          <FormComponent selectedRow={selectedRow} />
        )
      ) : null}

      
    </div>
  );
}
