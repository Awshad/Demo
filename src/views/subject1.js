// // 
// import React, { useState, useEffect, useRef } from 'react';
// import { classNames } from 'primereact/utils';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Toast } from 'primereact/toast';
// import { Button } from 'primereact/button';
// import { FileUpload } from 'primereact/fileupload';
// import { Rating } from 'primereact/rating';
// import { Toolbar } from 'primereact/toolbar';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { RadioButton } from 'primereact/radiobutton';
// import { InputNumber } from 'primereact/inputnumber';
// import { Dialog } from 'primereact/dialog';
// import { Tooltip } from 'primereact/tooltip';
// import { InputText } from 'primereact/inputtext';
// import '../DatatableDemo.css';
// import axios from 'axios';

// import { ProductService } from '../service/ProductService';

// export default function subject() {
  
// let emptyProduct = {
//   id: null,
//   name: '',
//   description: '',
//   category: null,
//   price: 0,
//   quantity: 0,
//   rating: 0,
//   inventoryStatus: 'INSTOCK'
// };

// const [products, setProducts] = useState(null);
// const [productDialog, setProductDialog] = useState(false);
// const [deleteProductDialog, setDeleteProductDialog] = useState(false);
// const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
// const [product, setProduct] = useState(emptyProduct);
// const [selectedProducts, setSelectedProducts] = useState(null);
// const [submitted, setSubmitted] = useState(false);
// const [globalFilter, setGlobalFilter] = useState(null);
// const toast = useRef(null);
// const dt = useRef(null);


// useEffect(() => {
//    ProductService.getProducts().then(data => setProducts(data));

// }, []); // eslint-disable-line react-hooks/exhaustive-deps


// const formatCurrency = (value) => {
//   return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// }

// const openNew = () => {
//   setProduct(emptyProduct);
//   setSubmitted(false);
//   setProductDialog(true);
// }

// const hideDialog = () => {
//   setSubmitted(false);
//   setProductDialog(false);
// }

// const hideDeleteProductDialog = () => {
//   setDeleteProductDialog(false);
// }

// const hideDeleteProductsDialog = () => {
//   setDeleteProductsDialog(false);
// }

// const saveProduct = () => {
//   setSubmitted(true);

//   if (product.name.trim()) {
//       let _products = [...products];
//       let _product = {...product};
//       if (product.id) {
//           const index = findIndexById(product.id);

//           _products[index] = _product;
//           toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
//       }
//       else {
//           _product.id = createId();
//           _products.push(_product);
//           toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
//       }

//       setProducts(_products);
//       setProductDialog(false);
//       setProduct(emptyProduct);
//   }
// }

// const editProduct = (product) => {
//   setProduct({...product});
//   setProductDialog(true);
// }

// const confirmDeleteProduct = (product) => {
//   setProduct(product);
//   setDeleteProductDialog(true);
// }

// const deleteProduct = () => {
//   let _products = products.filter(val => val.id !== product.id);
//   setProducts(_products);
//   setDeleteProductDialog(false);
//   setProduct(emptyProduct);
//   toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
// }

// const findIndexById = (id) => {
//   let index = -1;
//   for (let i = 0; i < products.length; i++) {
//       if (products[i].id === id) {
//           index = i;
//           break;
//       }
//   }

//   return index;
// }

// const createId = () => {
//   let id = '';
//   let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   for (let i = 0; i < 5; i++) {
//       id += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return id;
// }


// const cols = [
//   { field: 'code', header: 'Code' },
//   { field: 'name', header: 'Name' },
//   { field: 'price', header: 'Price' },
//   { field: 'category', header: 'Category' },
//   { field: 'inventoryStatus', header: 'Status' }
// ];
// const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

// const exportPdf = () => {
//   import('jspdf').then((jsPDF) => {
//       import('jspdf-autotable').then(() => {
//           const doc = new jsPDF.default(0, 0);

//           doc.autoTable(exportColumns, products);
//           doc.save('products.pdf');
//       });
//   });
// };

// const exportExcel = () => {
//   import('xlsx').then((xlsx) => {
//       const worksheet = xlsx.utils.json_to_sheet(products);
//       const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
//       const excelBuffer = xlsx.write(workbook, {
//           bookType: 'xlsx',
//           type: 'array'
//       });

//       saveAsExcelFile(excelBuffer, 'products');
//   });
// };

// const saveAsExcelFile = (buffer, fileName) => {
//   import('file-saver').then((module) => {
//       if (module && module.default) {
//           let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//           let EXCEL_EXTENSION = '.xlsx';
//           const data = new Blob([buffer], {
//               type: EXCEL_TYPE
//           });

//           module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
//       }
//   });
// };

// const confirmDeleteSelected = () => {
//   setDeleteProductsDialog(true);
// }

// const deleteSelectedProducts = () => {
//   let _products = products.filter(val => !selectedProducts.includes(val));
//   setProducts(_products);
//   setDeleteProductsDialog(false);
//   setSelectedProducts(null);
//   toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
// }

// const onCategoryChange = (e) => {
//   let _product = {...product};
//   _product['category'] = e.value;
//   setProduct(_product);
// }

// const onInputChange = (e, name) => {
//   const val = (e.target && e.target.value) || '';
//   let _product = {...product};
//   _product[`${name}`] = val;

//   setProduct(_product);
// }

// const onInputNumberChange = (e, name) => {
//   const val = e.value || 0;
//   let _product = {...product};
//   _product[`${name}`] = val;

//   setProduct(_product);
// }

// const leftToolbarTemplate = () => {
//   return (
//       <React.Fragment>
//           <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
//           <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
//       </React.Fragment>
//   )
// }

// const rightToolbarTemplate = () => {
//   return (
//       <React.Fragment >
//           <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success mr-2" data-pr-tooltip="XLS" />
//           <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning mr-2" data-pr-tooltip="PDF" />
//       </React.Fragment>
//   )
// }
// const centerHeading = () => {
//   return (
//       <React.Fragment >          
//           <h1 className="text-uppercase">Subjects</h1>
//       </React.Fragment>
//   )
// }

// const priceBodyTemplate = (rowData) => {
//   return formatCurrency(rowData.price);
// }

// const statusBodyTemplate = (rowData) => {
//   return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
// }

// const actionBodyTemplate = (rowData) => {
//   return (
//       <React.Fragment>
//           <Button icon="pi pi-pencil" className="p-button-prmary mr-2" onClick={() => editProduct(rowData)} />
//           <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteProduct(rowData)} />
//       </React.Fragment>
//   );
// }

// const header = (
//   <div className="table-header text-right">
//       <span className="p-input-icon-left">
//           <i className="pi pi-search" />
//           <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
//       </span>
//   </div>
// );
// const productDialogFooter = (
//   <React.Fragment>
//       <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
//       <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
//   </React.Fragment>
// );
// const deleteProductDialogFooter = (
//   <React.Fragment>
//       <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
//       <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
//   </React.Fragment>
// );
// const deleteProductsDialogFooter = (
//   <React.Fragment>
//       <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
//       <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
//   </React.Fragment>
// );

// console.log(products)
//   return (
//     <div className="datatable-crud-demo">
//         <Toast ref={toast} />

//         <div className="card">
//             <Toolbar className="mb-4" left={leftToolbarTemplate} center={centerHeading} right={rightToolbarTemplate}></Toolbar>
//             <Tooltip target="button" position="bottom" />

//             <DataTable ref={dt} removableSort size="small" value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
//                 dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
//                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
//                 globalFilter={globalFilter} header={header} responsiveLayout="scroll">
//                 <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
//                 <Column field="code" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
//                 <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
//                 <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
//                 <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
//                 <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
//                 <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
//             </DataTable>
//         </div>

//         <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
//             <div className="field">
//                 <label htmlFor="name">Name</label>
//                 <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
//                 {submitted && !product.name && <small className="p-error">Name is required.</small>}
//             </div>
//             <div className="field">
//                 <label htmlFor="description">Description</label>
//                 <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
//             </div>

//             <div className="field">
//                 <label className="mb-3">Category</label>
//                 <div className="formgrid grid">
//                     <div className="field-radiobutton col-6">
//                         <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
//                         <label htmlFor="category1">Accessories</label>
//                     </div>
//                     <div className="field-radiobutton col-6">
//                         <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
//                         <label htmlFor="category2">Clothing</label>
//                     </div>
//                     <div className="field-radiobutton col-6">
//                         <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
//                         <label htmlFor="category3">Electronics</label>
//                     </div>
//                     <div className="field-radiobutton col-6">
//                         <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
//                         <label htmlFor="category4">Fitness</label>
//                     </div>
//                 </div>
//             </div>

//             <div className="formgrid grid">
//                 <div className="field col">
//                     <label htmlFor="price">Price</label>
//                     <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
//                 </div>
//                 <div className="field col">
//                     <label htmlFor="quantity">Quantity</label>
//                     <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
//                 </div>
//             </div>
//         </Dialog>

//         <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
//             <div className="confirmation-content">
//                 <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
//                 {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
//             </div>
//         </Dialog>

//         <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
//             <div className="confirmation-content">
//                 <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
//                 {product && <span>Are you sure you want to delete the selected products?</span>}
//             </div>
//         </Dialog>
//     </div>
//   )
// }