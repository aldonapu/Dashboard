import "./Orders.scss";
import Order from '../Orders.svg';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useEffect, useState, useRef } from "react";
import { Tag } from "primereact/tag";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { db } from "../firebase";
import { InputText } from 'primereact/inputtext'
import {collection,getDocs,doc,getDoc,updateDoc, onSnapshot} from "firebase/firestore";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";

export default function Orders() {
const toast = useRef(null);
const [orders, setOrders] = useState([]);
const [visible, setVisible] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
const [selectedUser, setSelectedUser] = useState(null);
const[search, setSearch] =useState("");
const [filters, setFilters] = useState({
    status: {
        value: null,
        matchMode: FilterMatchMode.EQUALS
    }
});

const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing"},
    { label: "Shipping", value: "shipping" },
    { label: "Completed", value: "completed"    }
];

const statusRowFilterTemplate = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={statusOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder="All"
            showClear
            className="p-column-filter"
        />
    );
};

const LoadOrders = async () => {  
    const snapshot = await getDocs(collection(db, "orders"));
    const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersData);  
    }


useEffect(() => {

    const unsubscribe = onSnapshot(
        collection(db, "orders"),
        (snapshot) => {

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setOrders(data);
        }
    );

    return () => unsubscribe();

}, []);
    
const statusBody = (rowData) => {
    switch (rowData.status) {
        case "pending":
            return <Tag value="Pending" severity="danger" />;

        case "processing":
            return <Tag value="Processing" severity="info" />;

        case "shipping":
            return <Tag value="Shipping" severity="warning" />;

        case "completed":
            return <Tag value="Completed" severity="success" />;

        default:
            return <Tag value={rowData.status} />;
    }
};;

const formatRupiah = (rowData) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(rowData.total);
};
const openDetail = async (order) => {

    setSelectedOrder(order);
    console.log(order);
    console.log(order.userId);
    console.log(typeof order.userId);
    const userRef = doc(db, "users", order.userId);

    const userSnap = await getDoc(userRef);

    if(userSnap.exists()){

        setSelectedUser({
            id: userSnap.id,
            ...userSnap.data()
        });

        setVisible(true);
    }

};
const detailBody = (rowData) => {
    return (
        <Button label="Detail" severity="secondary" text raised
            onClick={() => {
                openDetail(rowData);
            }}
        />
    );
};

const updateStatus = async (order, status) => {

    const orderRef = doc(db, "orders", order.id);

    await updateDoc(orderRef, {
        status
    });

    setSelectedOrder({
        ...order,
        status
    });

   LoadOrders();
};
const filterOrders = orders.filter(order => order.orderNumber.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page">
      <ConfirmDialog />
      <Toast ref={toast} />
      <div className="page__header">
        <div>
          <p className="page__eyebrow">Sales</p>
        </div>
     
      </div>
      <div className="card_orders">
        <div className="card_content">
          <h1 className="card_title">Orders</h1>
          <p className="card_description">
            Here is a quick overview of your orders. You can manage and track the status of your orders from this page. Use the export button to download order data for further analysis.
          </p>
        </div>
        <div className="card_image_wrapper">
          <img
            src={Order}
            alt="Dashboard Illustration"
            className="card_image_orders"
          />
        </div>
      </div>
    <div className="Table-area">    
         <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Order Number" /> 
            <DataTable value={filterOrders} responsiveLayout="scroll" paginator rows={5} filters={filters} onFilter={(e) => setFilters(e.filters)} filterDisplay="row">
                <Column field="orderNumber" sortable style={{ width: '25%' }} header="Order Number" />
                <Column field="date" sortable style={{ width: '25%' }} header="Date" />
                <Column field="customerName" sortable style={{ width: '25%' }} header="Customer Name" />
                <Column field="total" sortable style={{ width: '25%' }} header="Total" body={formatRupiah} />
                <Column field="paymentStatus" sortable style={{ width: '25%' }} header="Payment" />
                <Column field="status" header="Status"  body={statusBody} filter showFilterMenu={false} filterElement={statusRowFilterTemplate} style={{ width: "25%" }}/>
                <Column header="Detail Order" body={detailBody} />
              </DataTable>
    </div>
                  <Dialog
                header="Detail Order"
                visible={visible}
                style={{ width: "50vw" }}
                onHide={() => setVisible(false)}
            >
    {selectedOrder && selectedUser && (
        <div className="order-details" >
            <p><strong>Order Number :</strong> {selectedOrder.orderNumber}</p>
            <p><strong>Tanggal :</strong> {selectedOrder.date}</p>
            <p><strong>Status :</strong> {selectedOrder.status}</p>
            <p><strong>Pembayaran :</strong> {selectedOrder.paymentStatus}</p>
            <p>
                <strong>Total :</strong>{" "}
                {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                }).format(selectedOrder.total)}
            </p>
            <hr />
            <h3>Customer</h3>
            <p><strong>Nama :</strong> {selectedUser.nama}</p>
            <p><strong>Email :</strong> {selectedUser.email}</p>
            <hr />
            <h3>Alamat</h3>
            {selectedUser.alamats.map((alamat) => (
                <div key={alamat.id}>
                    <p>{alamat.alamat}</p>
                    <p>{alamat.kota}</p>
                    <p>{alamat.provinsi}</p>
                    <p>{alamat.kodePos}</p>
                </div>
            ))}
            <hr />
            <h3>Produk</h3>

            <DataTable value={selectedOrder.items} size="small">
                <Column field="name" header="Produk" />
                <Column field="qty" header="Qty" />
                <Column
                    field="price"
                    header="Harga"
                    body={(rowData) =>
                        new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(rowData.price)
                    }
                />
            </DataTable>

        </div>
    
    )}
    <div style={{ display: "flex", justifyContent: "end", marginTop: "1rem" }}>
    {selectedOrder?.status === "pending" && (
    <Button
        label="Terima Pesanan"
        icon="pi pi-check"
        severity="success"
        onClick={() =>
            updateStatus(selectedOrder, "processing")
        }
    />
)}

{selectedOrder?.status === "processing" && (
    <Button
        label="Kirim Pesanan"
        icon="pi pi-send"
        severity="warning"
        onClick={() =>
            updateStatus(selectedOrder, "shipping")
        }
    />
)}
</div>
</Dialog>
    </div>
  );
}
