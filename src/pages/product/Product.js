import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faUpload, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import './product.css';
import Pagination from '../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';
import EditItemDrawer from './edit-product/EditProductDrawer';
import NewItemDrawer from './new-product/NewProductDrawer';
import ImportModal from '../../components/import/ImportModal';
import ImageModal from "../../components/file/ImageModal";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [paginator, setPaginator] = useState({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [drawerType, setDrawerType] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);

    const [filters, setFilters] = useState({
        brand: '',
        category: '',
        model: '',
        enabled: ''
    });

    const [importFile, setImportFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const navigate = useNavigate();
    const userMenus = JSON.parse(localStorage.getItem('menus') || '[]');
    const productMenu = userMenus.find(menu => menu.path === "/products");
    const hasPermission = (permissionCode) => {

        return productMenu?.subMenus?.some(
            subMenu => subMenu.code === permissionCode
        );
    };

    // ================= FETCH =================
    const fetchProducts = async () => {
        try {
            setIsLoading(true);

            const url = new URL(`${API}/api/v1/product/all`);
            url.search = new URLSearchParams({
                brand: filters.brand || '',
                category: filters.category || '',
                model: filters.model || '',
                enabled: filters.enabled || '',
                page: page,
                size: 10
            });

            const res = await fetch(url);
            const data = await res.json();
            setPaginator(data);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load products ❌");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        fetchProducts();
    }, [filters, page]);

    // ================= FILTER =================
    const handleFilterChange = (e) => {
        setPage(1);
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const clearFilters = () => {
        setFilters({
            brand: '',
            category: '',
            model: '',
            enabled: ''
        });
        setPage(1);
    };

    // ================= SELECT =================
    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === paginator.products?.length) {
            setSelectedIds([]);
        } else {
            const allIds = paginator.products.map(p => p.productId);
            setSelectedIds(allIds);
        }
    };

    // ================= IMPORT =================
    const handleFileChange = (e) => {
        setImportFile(e.target.files[0]);
    };

    const handleImport = async () => {
        if (!importFile) {
            toast.warning("Please select a file");
            return;
        }

        try {
            setIsImporting(true);

            const formData = new FormData();
            formData.append("file", importFile);

            const res = await fetch(`${API}/api/v1/product/import`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error();

            toast.success("File imported successfully ✅");

            setIsImportModalOpen(false);
            setImportFile(null);
            await fetchProducts();

        } catch {
            toast.error("Import failed ❌");
        } finally {
            setIsImporting(false);
        }
    };

    // ================= EXPORT =================
    const handleExport = async () => {
        try {
            setIsExporting(true);

            const params = new URLSearchParams({
                brand: filters.brand || '',
                category: filters.category || '',
                model: filters.model || '',
                enabled: filters.enabled || ''
            });

            const res = await fetch(`${API}/api/v1/product/export?${params}`);

            if (!res.ok) throw new Error();

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "products.xlsx";
            a.click();

        } catch {
            toast.error("Export failed ❌");
        } finally {
            setIsExporting(false);
        }
    };

    // ================= EDIT =================
    const handleEdit = () => {
        if (selectedIds.length === 0) {
            toast.warning("Select at least one product to edit");
            return;
        }

        const selectedProducts = paginator.products.filter(product =>
            selectedIds.includes(product.productId)
        );

        setSelectedItemId(selectedProducts);
        setDrawerType("edit");
        setIsDrawerOpen(true);
    };

    // ================= DELETE =================
    const handleDelete = async () => {

        if (selectedIds.length === 0) {
            toast.warning("Select at least one product");
            return;
        }

        try {
            const res = await fetch(`${API}/api/v1/product/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds })
            });

            if (!res.ok) throw new Error();

            toast.success("Deleted successfully ✅");

            setSelectedIds([]);
            await fetchProducts();

        } catch {
            toast.error("Delete failed ❌");
        }
    };

    const handleViewImages = (product) => {
        setSelectedProduct(product);
        setIsImageModalOpen(true);
    };

    return (
        <div className="items-container">

            {/* ✅ TOAST CONTAINER */}
            <ToastContainer position="top-right" autoClose={2000} />
            {/* FILTER */}
            <div className="filter-bar">
                <select name="brand" value={filters.brand} onChange={handleFilterChange}>
                    <option value="">All Brands</option>
                    <option value="itel">itel</option>
                    <option value="TECNO">TECNO</option>
                </select>

                <select name="category" value={filters.category} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    <option value="Mobile">Mobile</option>
                    <option value="TV">TV</option>
                    <option value="Ebike">Ebike</option>
                    <option value="Accessories">Accessories</option>
                </select>

                <input
                    type="text"
                    name="model"
                    placeholder="Search Model"
                    value={filters.model}
                    onChange={handleFilterChange}
                />

                <select name="enabled" value={filters.enabled} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>

                <button className="clear-btn" onClick={clearFilters}>Clear</button>
            </div>

            {/* ACTION BAR */}
            <div className="action-bar">


                {hasPermission("PRODUCT_IMPORT") && (
                    <button
                        className="action-btn import-action"
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        <FontAwesomeIcon icon={faUpload} /> Import
                    </button>
                )}

                {hasPermission("PRODUCT_EXPORT") && (
                    <button
                        className="action-btn export-action"
                        onClick={handleExport}
                    >
                        <FontAwesomeIcon icon={faDownload} />
                        {isExporting ? "Exporting..." : "Export"}
                    </button>
                )}

                {hasPermission("PRODUCT_EDIT") && (
                    <button
                        className="action-btn edit-action"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPen} /> Edit
                    </button>
                )}

                {hasPermission("PRODUCT_DELETE") && (
                    <button
                        className="action-btn delete-action"
                        onClick={handleDelete}
                    >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                )}

            </div>

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onFileChange={handleFileChange}
                onImport={handleImport}
                importFile={importFile}
                isImporting={isImporting}
            />

            {isLoading ? <Loading /> : (
                <div className="table-section">
                    <div className="table-wrapper">

                        <table className="scrollable-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={
                                                paginator.products?.length > 0 &&
                                                selectedIds.length === paginator.products.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>BRAND</th>
                                    <th>CATEGORY</th>
                                    <th>PRODUCT TYPE</th>
                                    <th>SERIES</th>
                                    <th>PRODUCT STATUS</th>
                                    <th>PRODUCT</th>
                                    <th>MARKET NAME</th>
                                    <th>SUPPLIER</th>

                                    <th>COUNTRY</th>
                                    <th>MEMORY</th>
                                    <th>COLOR</th>
                                    <th>MATERIAL ID</th>
                                    <th>DISTRIBUTOR PRICE</th>
                                    <th>RETAILER PRICE</th>
                                    <th>CUSTOMER PRICE</th>
                                    <th>ENABLE OR NOT</th>
                                    <th>IMAGE</th>
                                    <th>CREATOR</th>
                                    <th>CREATED DATE</th>
                                    <th>UPDATER</th>
                                    <th>UPDATED DATE</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginator.products?.map((product) => (
                                    <tr key={product.productId}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(product.productId)}
                                                onChange={() => handleSelect(product.productId)}
                                            />
                                        </td>
                                        <td>{product.brand}</td>
                                        <td>{product.category}</td>
                                        <td>{product.modelType}</td>
                                        <td>{product.series}</td>
                                        <td>{product.modelStatus}</td>
                                        <td>{product.model}</td>
                                        <td>{product.marketName}</td>

                                        <td>
                                            {product.providers && product.providers.length > 0 ? (
                                                <div className="provider-tooltip-wrapper">
                                                    <span className="provider-count">
                                                        {product.providers.length} Supplier
                                                        {product.providers.length > 1 ? 's' : ''}
                                                    </span>

                                                    <div className="provider-tooltip">
                                                        {product.providers.map((provider, index) => (
                                                            <div key={index} className="provider-tooltip-item">
                                                                • {provider.providerName || provider.label || provider}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>


                                        {/* <td>{product.provider}</td> */}
                                        <td>{product.country}</td>

                                        <td>{product.memory}</td>
                                        <td>{product.color}</td>
                                        <td>{product.materialId}</td>
                                        <td>{product.suggestedDp}</td>
                                        <td>{product.suggestedRp}</td>
                                        <td>{product.suggestedCp}</td>
                                        <td>{product.enabled == 1 ? 'Enabled' : 'Disabled'}</td>
                                        <td>
                                            <span
                                                className="view-btn"
                                                onClick={() => handleViewImages(product)}
                                            >
                                                View
                                            </span>
                                        </td>
                                        <td>{product.creator}</td>
                                        <td>{product.createDate}</td>
                                        <td>{product.updater}</td>
                                        <td>{product.updateDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-fixed">
                        <Pagination paginator={paginator} onChangePage={setPage} />
                    </div>

                    <ImageModal
                        isOpen={isImageModalOpen}
                        onClose={() => setIsImageModalOpen(false)}
                        product={selectedProduct}
                        fetchProducts={fetchProducts}
                    />

                    {isDrawerOpen && drawerType === "edit" && (
                        <EditItemDrawer
                            selectedProducts={selectedItemId}
                            onClose={() => {
                                setIsDrawerOpen(false);
                                setSelectedItemId([]);
                                setDrawerType(null);
                            }}
                            fetchProducts={fetchProducts}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Product;



const formatDateTime = (value) => {
    if (!value) return "";
    return value.replace(" ", "\n");
};

