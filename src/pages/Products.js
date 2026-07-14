import "./Products.scss";
import ProductsImage from "../Products.svg";
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useEffect, useState, useRef } from "react";
import { Tag } from "primereact/tag";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { db } from "../firebase";
import { collection, addDoc, getDocs,updateDoc,deleteDoc, doc } from "firebase/firestore";
import addproduct from "../addproduct.svg";


export default function Products() {
const [products, setProducts] = useState([]);
const toast = useRef(null);
const [visible, setVisible] = useState(false);
const [form, setForm] = useState({});
const[search, setSearch] =useState("");

const statusBodyTemplate = (rowData) => {
  if (rowData.stock === 0) {
    return <Tag value="Out of Stock" severity="danger" />;
  }

  if (rowData.stock <= 10) {
    return <Tag value="Low Stock" severity="warning" />;
  }

  return <Tag value="In Stock" severity="success" />;
};

const formatRupiah = (rowData) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(rowData.harga);
};

const handleDelete = async (data) => {
  try {
    await deleteDoc(doc(db, "products", data.id));

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Product deleted",
      life: 3000,
    });

  } catch (error) {
    console.error(error);

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete product",
      life: 3000,
    });
  }
};

const submit = async () => {
  try {
    if (
      !form.nama ||
      !form.harga ||
      !form.stock ||
      !form.kategori ||
      !form.deskripsi ||
      !form.gambar
    ) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Semua field harus diisi",
        life: 3000,
      });
      return;
    }

    if (form.id) {
  
      const productRef = doc(db, "products", form.id);

      await updateDoc(productRef, {
        nama: form.nama,
        harga: Number(form.harga),
        stock: Number(form.stock),
        kategori: form.kategori,
        deskripsi: form.deskripsi,
        gambar: form.gambar,
      });

      toast.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Data berhasil diupdate",
        life: 3000,
      });

    } else {
  
      await addDoc(collection(db, "products"), {
        nama: form.nama,
        harga: Number(form.harga),
        stock: Number(form.stock),
        kategori: form.kategori,
        deskripsi: form.deskripsi,
        gambar: form.gambar,
      });

      toast.current.show({
        severity: "success",
        summary: "Created",
        detail: "Data berhasil ditambahkan",
        life: 3000,
      });
    }

    setForm({});
    setVisible(false);

  } catch (error) {
    console.error(error);

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Terjadi kesalahan",
      life: 3000,
    });
  }
};
const confirm = (data) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
             accept: () => handleDelete(data),   
        });
    };
const actionBodyTemplate = (data) => { 
    return (
        <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button icon="pi pi-trash" 
      rounded text raised 
      severity="danger" 
      aria-label="Delete" 
      onClick={() => confirm(data)} />
      <Button
        icon="pi pi-pencil" 
         rounded text raised 
         aria-label="Edit" 
       severity="warning" 
       onClick={() => {setVisible(true); setForm(data);}} 
      ></Button>
      </div>
      
    );
  };
useEffect(() => {
  const loadProducts = () => {
    getDocs(collection(db, "products"))
      .then((res) => {
        setProducts(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadProducts();
  const interval = setInterval(() => {
    loadProducts();
  }, 2000);
  return () => clearInterval(interval);
}, []);

const filterProducts = products.filter(product => product.nama.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="page">
          <Toast ref={toast} />
          <ConfirmDialog />
      <div className="card">
        <div className="card_content">
          <h1 className="card_title">Products</h1>
          <p className="card_description">
            Here is a quick overview of your products. You can manage and update product information from this page. Use the add product button to introduce new items to your catalog.
          </p>
        </div>
        <div className="card_image_wrapper">
          <img
            src={ProductsImage}
            alt="Dashboard Illustration"
            className="card_image"
          />
        </div>
      </div>

            {/* <div className="content-grid">
                <Card title="Popular Items" className="content-card">
                    <ul className="list">
                        <li>Minimal Chair</li>
                        <li>Cloud Lamp</li>
                        <li>Desk Organizer</li>
                    </ul>
                </Card>

                <Card title="Inventory" className="content-card">
                    <div className="metric">240 items available</div>
                    <div className="metric">12 low stock alerts</div>
                </Card>
    `        </div> */}
      <div className="Table-area">
        <div className="action-button-wrapper">
          <Button label="Add Product" icon="pi pi-plus" className="add_product" onClick={() => {setVisible(true); setForm({});}} />
             <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Product Name" />
        </div>
          <DataTable value={filterProducts} responsiveLayout="scroll" paginator rows={5} tableStyle={{ minWidth: "900px" }}>
          <Column header="ID" sortable style={{ width: '25%' }} body={(_, options) => <span>{options.rowIndex + 1}</span>} />
          <Column field="nama" sortable style={{ width: '25%' }} header="Product" />
          <Column field="kategori" sortable style={{ width: '25%' }} header="Category" />
          <Column field="harga" sortable style={{ width: '25%' }} header="Price" body={formatRupiah} />
          <Column field="stock" sortable style={{ width: '25%' }} header="Stock" />
          <Column header="Status" body={statusBodyTemplate}/>
           <Column body={(data) => actionBodyTemplate(data)}header="Action"></Column>
        </DataTable>
      </div>
      <Dialog  header={form.id ? "Edit Produk" : "Tambah Produk"} visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
        <div className="dialog-banner">
        <img src={addproduct} alt="Product" className="dialog-banner-image"/>
        </div>

            <div className="menu">
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-barcode"></i>
                </span>
                <InputText placeholder="Nama" value={form?.nama} onChange={(e) => setForm({...form, nama: e.target.value})} />
            </div>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-tag"></i>
                </span>
                <InputText placeholder="harga" value={form?.harga} onChange={(e) => setForm({...form, harga: e.target.value})} />
            </div>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-list"></i>
                </span>
                <InputText placeholder="stock" value={form?.stock} onChange={(e) => setForm({...form, stock: e.target.value})} />
            </div>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-desktop"></i>
                </span>
                <InputText placeholder="kategori" value={form?.kategori} onChange={(e) => setForm({...form, kategori: e.target.value})} />
            </div>
             <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-info"></i>
                </span>
                <InputTextarea placeholder="deskripsi" value={form?.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} />
            </div>
             <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-file"></i>
                </span>
                <InputText placeholder="gambar" value={form?.gambar} onChange={(e) => setForm({...form, gambar: e.target.value})} />
            </div>
            </div>
            <div className="tombol-submit">
              <Button label={form.id ? "Update" : "Submit"} icon="pi pi-check" onClick={submit} className="add_product" />
            </div>
            </Dialog>
        </div>
    );
}
