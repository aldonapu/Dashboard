
import "./Users.scss";
import userImage from "../Users.svg";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useEffect, useState, useRef } from "react";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc,updateDoc, doc } from "firebase/firestore";
import edituser from "../edituser.svg";
import { Dropdown } from "primereact/dropdown";


export default function Users() {
const [users, setUsers] = useState([]);
const toast = useRef(null);
const [visible, setVisible] = useState(false);
const [r, setR] = useState(false);
const [form, setForm] = useState({});
const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "User", value: "User" }
];

useEffect(() => {
    getDocs(collection(db, "users"))
    .then((res) => {
      setUsers((prev) => (res.docs.map((doc) => 
        ({...doc.data(), id: doc.id})
      )));
      
    });
  }, [r]);

const handleDelete = async (data) => {
  try {
    await deleteDoc(doc(db, "users", data.id));

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "User deleted",
      life: 3000,
    });
    setR(!r);
  } catch (error) {
    console.error(error);

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete user",
      life: 3000,
    });
  }
};

const submit = async () => {
  try {
    if (
      !form.nama ||
      !form.email ||
      !form.role 
 
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
  
      const productRef = doc(db, "users", form.id);

      await updateDoc(productRef, {
        nama: form.nama,
        email: form.email,
        role: form.role,
      });

      toast.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Data berhasil diupdate",
        life: 3000,
      });
    } else {
  
      await addDoc(collection(db, "users"), {
        nama: form.nama,
        email: form.email,
        role: form.role
      });

      toast.current.show({
        severity: "success",
        summary: "Created",
        detail: "Data berhasil ditambahkan",
        life: 3000,
      });
    }
    setR(!r);
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

    return (
    <div className="page">
    <ConfirmDialog />
    <Toast ref={toast} />
      <div className="card">
        <div className="card_content">
          <h1 className="card_title">Users</h1>
          <p className="card_description">
            Here is a quick overview of your users. You can manage and update user information from this page. Use the manage button to view and edit user details.
          </p>
        </div>
        <div className="card_image_wrapper">
          <img
            src={userImage}
            alt="Dashboard Illustration"
            className="card_image"
          />
        </div>
      </div>
        <div className="Table-area">
            <div className="action-button-wrapper">
          <Button label="Add User" icon="pi pi-plus" className="add_product" onClick={() => {setVisible(true); setForm({});}} />
        </div>
        <DataTable value={users} responsiveLayout="scroll" paginator rows={5}>
          <Column header="ID" body={(_, options) => <span>{options.rowIndex + 1}</span>} />
          <Column field="nama" header="Name" />
          <Column field="email" header="Email" />
          <Column field="role" header="Role" />
          <Column body={(rowData) => rowData.alamats?.[0]?.alamat} header="Alamat" />
           <Column body={(data) => actionBodyTemplate(data)}header="Action"></Column>
        </DataTable>
        </div>
        <Dialog  header={form.id ? "Edit User" : "Add User"} visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                    <div className="dialog-banner">
                    <img src={edituser} alt="Product" className="dialog-banner-image"/>
                    </div>
            <div className="menu">
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user-edit"></i>
                </span>
                <InputText placeholder="Nama" value={form?.nama} onChange={(e) => setForm({...form, nama: e.target.value})} />
            </div>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-at"></i>
                </span>
                <InputText placeholder="Email" value={form?.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            </div>
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-verified"></i>
            </span>
            <Dropdown
                value={form?.role}
                options={roleOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Pilih Role"
                onChange={(e) =>
                    setForm({
                        ...form,
                        role: e.value
                    })
                }
                style={{ width: "100%" }}
            />
        </div>
            </div>
            <div className="tombol-submit">
              <Button label={form.id ? "Update" : "Submit"} icon="pi pi-check" onClick={submit} />
            </div>
            </Dialog>
        </div>
    );
}
