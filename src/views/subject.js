import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import '../DatatableDemo.css';
import axios from 'axios';

import { ProductService } from '../service/ProductService';

export default function subject() {
  
let emptyProduct = {
  subjectId: 0,
  subjectName: ''
};

const [products, setProducts] = useState([]);
const [productDialog, setProductDialog] = useState(false);
const [deleteProductDialog, setDeleteProductDialog] = useState(false);
const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
const [product, setProduct] = useState(emptyProduct);
const [selectedProducts, setSelectedProducts] = useState([]);
const [submitted, setSubmitted] = useState(false);
const [globalFilter, setGlobalFilter] = useState(null);
const toast = useRef(null);
const dt = useRef(null);


useEffect(() => {
  getAll();
}, []); 


const getAll = ()=>{
  axios.get('http://localhost:57301/api/Subjects')
    .then ((res) => {
      setProducts(res.data);
      // console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })
}


const openNew = () => {
  setProduct(emptyProduct);
  setSubmitted(false);
  setProductDialog(true);
}

const hideDialog = () => {
  setSubmitted(false);
  setProductDialog(false);
}

const hideDeleteProductDialog = () => {
  setDeleteProductDialog(false);
}

const hideDeleteProductsDialog = () => {
  setDeleteProductsDialog(false);
}

const saveProduct = (e) => {
  e.preventDefault();
  setSubmitted(true);  

  if (product.subjectName.trim()) {

       let _product = {...product};

      if (product.subjectId != 0) {

        axios.put('http://localhost:57301/api/Subjects/'+product.subjectId,_product)
        .then((res)=>{
          getAll();
          setProductDialog(false);
          setProduct(emptyProduct);
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Subject Updated', life: 3000 });
        }).catch((err)=>{
          console.log(err)
        })

      }
      else {
        axios.post('http://localhost:57301/api/Subjects',_product)
        .then((res)=>{
          getAll();
          setProductDialog(false);
          setProduct(emptyProduct);
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Subject Created', life: 3000 });
        }).catch((err)=>{
          console.log(err)
        })
      }    
         
  }
}

const editProduct = (product) => {
  setProduct({...product});
  setProductDialog(true);
}

const confirmDeleteProduct = (product) => {
  setProduct(product);
  setDeleteProductDialog(true);
}

const deleteProduct = () => { 
  
  axios.delete('http://localhost:57301/api/Subjects/'+product.subjectId)
  .then((res)=>{
    getAll();
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Subject Deleted', life: 3000 });
  })
  .catch((err)=>{
    console.log(err)
  })
  
  
}

const cols = [
  { field: 'subjectId', header: 'ID' },
  { field: 'subjectName', header: 'Name' }
];
const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

const exportPdf = () => {
  import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
          const doc = new jsPDF.default(0, 0);

          doc.autoTable(exportColumns, products);
          doc.save('products.pdf');
      });
  });
};

const exportExcel = () => {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'products');
  });
};

const saveAsExcelFile = (buffer, fileName) => {
  import('file-saver').then((module) => {
      if (module && module.default) {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data = new Blob([buffer], {
              type: EXCEL_TYPE
          });

          module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
  });
};

const confirmDeleteSelected = () => {
  setDeleteProductsDialog(true);
}

const deleteSelectedProducts = () => {
  
  selectedProducts.forEach(d => {
    axios.delete('http://localhost:57301/api/Subjects/'+d.subjectId)
    .then((res)=>{
      
      getAll();
      setDeleteProductsDialog(false);
      setSelectedProducts(null);
    })
    .catch((err)=>{
      console.log(err)
    })
  });
  
  toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Subjects Deleted', life: 3000 });


  // let _products = products.filter(val => !selectedProducts.includes(val));
  // setProducts(_products);
  // setDeleteProductsDialog(false);
  // setSelectedProducts(null);
  // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}


const onInputChange = (e, subjectName) => {
  const val = (e.target && e.target.value) || '';
  let _product = {...product};
  _product[`${subjectName}`] = val;

  setProduct(_product);
}

const leftToolbarTemplate = () => {
  return (
      <React.Fragment>
          <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
          <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
      </React.Fragment>
  )
}

const rightToolbarTemplate = () => {
  return (
      <React.Fragment >
          <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success mr-2" data-pr-tooltip="XLS" />
          <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning mr-2" data-pr-tooltip="PDF" />
      </React.Fragment>
  )
}
const centerHeading = () => {
  return (
      <React.Fragment >          
          <h1 className="text-uppercase">Subjects</h1>
      </React.Fragment>
  )
}


const actionBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <Button icon="pi pi-pencil" className="p-button-prmary mr-2" onClick={() => editProduct(rowData)} />
          <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
  );
}

const header = (
  <div className="table-header text-right">
      <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
  </div>
);
const productDialogFooter = (
  <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
  </React.Fragment>
);
const deleteProductDialogFooter = (
  <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
  </React.Fragment>
);
const deleteProductsDialogFooter = (
  <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
  </React.Fragment>
);
  return (
    <div className="datatable-crud-demo">
        <Toast ref={toast} />

        <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplate} center={centerHeading} right={rightToolbarTemplate}></Toolbar>
            <Tooltip target="button" position="bottom" />

            <DataTable ref={dt} removableSort size="small" value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                dataKey="subjectId" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                <Column field="subjectId" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="subjectName" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
            </DataTable>
        </div>

        <Dialog visible={productDialog} style={{ width: '450px' }} header="Subject Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="name">Name</label>
                <InputText id="name" value={product.subjectName} onChange={(e) => onInputChange(e, 'subjectName')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.subjectName })} />
                {submitted && !product.subjectName && <small className="p-error">Name is required.</small>}
            </div>
        </Dialog>

        <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                {product && <span>Are you sure you want to delete <b>{product.subjectName}</b>?</span>}
            </div>
        </Dialog>

        <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                {product && <span>Are you sure you want to delete the selected products?</span>}
            </div>
        </Dialog>
    </div>
  )
}
