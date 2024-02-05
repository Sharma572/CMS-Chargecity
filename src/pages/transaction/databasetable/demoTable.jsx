import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
// import { userColumns, userRows } from '../../datatablesource';
const Datatable = () => {

    

    
  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'product', label: 'Product' },
    {
        name: 'img',
        label: 'Image',
        options: {
            filter: false,
          customBodyRender: (value) => <img src={value} alt="product" style={{ width: '50px', height: '50px' }} />,
        },
      },
    { name: 'customer', label: 'Customer' },
    { name: 'date', label: 'Date',
    options: {
        filter: true,
        filterType: 'custom',
        customFilterListOptions: { render: (v) => `From: ${v[0]} To: ${v[1]}` },
        customFilterMethod: (value, rowData) => {
          const selectedFromDate = value[0];
          const selectedToDate = value[1];
          const rowDate = new Date(rowData.date);

          return (
            (selectedFromDate === null || rowDate >= selectedFromDate) &&
            (selectedToDate === null || rowDate <= selectedToDate)
          );
        },
      },
    },
    { name: 'amount', label: 'Amount' },
    { name: 'method', label: 'Payment Method' },
    {
        name: 'status',
        label: 'Status',
        options: {
          customBodyRender: (value) => {
            const statusColor = getStatusColor(value); // Implement this function to get color based on status
            return <span style={{background : statusColor, color: 'white',padding:'10px',borderRadius:'5px' }}>{value}</span>;
          },
        },
    }
  ];

  const getStatusColor = (status) => {
    // Implement your logic to determine color based on status
    switch (status) {
      case 'Approved':
        return 'green';
      case 'Pending':
        return 'orange';
      // Add more cases for other statuses as needed
      default:
        return 'black';
    }
  };

  const rows = [
    {
        id: 1143155,
        product: "Acer Nitro 5",
        img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "John Smith",
        date: "10 March",
        amount: 785,
        method: "Cash on Delivery",
        status: "Approved",
    },
    {
        id: 2235235,
        product: "Playstation 5",
        img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
        customer: "Michael Doe",
        date: "12 March",
        amount: 900,
        method: "Online Payment",
        status: "Pending",
    },
    {
        id: 2342353,
        product: "Redragon S101",
        img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "John Smith",
        date: "1 March",
        amount: 35,
        method: "Cash on Delivery",
        status: "Pending",
    },
    {
        id: 2357741,
        product: "Razer Blade 15",
        img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "Jane Smith",
        date: "4 March",
        amount: 920,
        method: "Online",
        status: "Approved",
    },
    {
        id: 2342355,
        product: "ASUS ROG Strix",
        img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "Harold Carol",
        date: "1 March",
        amount: 2000,
        method: "Online",
        status: "Pending",
    },
    {
        id: 1143155,
        product: "Acer Nitro 5",
        img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "John Smith",
        date: "3 Jan",
        amount: 785,
        method: "Cash on Delivery",
        status: "Approved",
    },
    {
        id: 2235235,
        product: "Playstation 5",
        img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
        customer: "Michael Doe",
        date: "12 March",
        amount: 900,
        method: "Online Payment",
        status: "Pending",
    },
    {
        id: 2342353,
        product: "Redragon S101",
        img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "John Smith",
        date: "1 March",
        amount: 35,
        method: "Cash on Delivery",
        status: "Pending",
    },
    {
        id: 2357741,
        product: "Razer Blade 15",
        img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "Jane Smith",
        date: "4 March",
        amount: 920,
        method: "Online",
        status: "Approved",
    },
    {
        id: 2342355,
        product: "ASUS ROG Strix",
        img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "Harold Carol",
        date: "12 Feb",
        amount: 2000,
        method: "Online",
        status: "Pending",
    },
    {
        id: 2342355,
        product: "ASUS ROG Strix",
        img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
        customer: "Harold Carol",
        date: "17 Jan",
        amount: 12000,
        method: "Online",
        status: "Approved",
    },
];

  const options = {
    filter: true,
    download: false,
    print: false,
    responsive: 'standard',
    
  };
       

    return (
      <>
      <div>
      <MUIDataTable
      data={rows}
      columns={columns}
      options={options}
    />
      </div>
  
      </>
    )
}

export default Datatable;