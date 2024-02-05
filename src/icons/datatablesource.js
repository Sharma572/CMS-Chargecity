import "./components/databasetable/databaseTable.scss";
export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "customer", headerName: "Customer", width: 130 },

  {
    field: "date",
    headerName: "Date",
    type: "number",
    width: 90,
  },
  {
    field: "product",
    headerName: "Product",
    width: 130,
    renderCell: (params) => (
      <div className="cellWithTable">
        <img className="cellImg" src={params.row.img} alt="./avtar" />
        {params.row.product}
      </div>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <div className={`cellWithStatus ${params.row.status}`}>
        {params.row.status}
      </div>
    ),
  },
];

export const userRows = [
  {
    id: 1143155,
    product: "Acer",
    img: "https://picsum.photos/200",
    customer: "John",
    date: "1 April",
    amount: 445,
    status: "Approved",
  },
  {
    id: 1143155,
    product: "Acer",
    img: "https://picsum.photos/200",
    customer: "John",
    date: "1 April",
    amount: 445,
    status: "Pending",
  },
  {
    id: 1143155,
    product: "Acer",
    img: "https://picsum.photos/200",
    customer: "John",
    date: "1 April",
    amount: 445,
    status: "Approved",
  },
  {
    id: 1143155,
    product: "Acer",
    img: "https://picsum.photos/200",
    customer: "John",
    date: "1 April",
    amount: 445,
    status: "Pending",
  },
];
