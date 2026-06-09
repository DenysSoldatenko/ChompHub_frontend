import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons';
import {deleteProduct, getAllProducts} from "../../api/productApi";

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
const ITEMS_PER_PAGE = 12;

const AdminMenuPage = () => {
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const {RenderError, showError} = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await getAllProducts();
      const data = response.content || response.data || response;

      if (Array.isArray(data)) {
        setAllItems(data);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteProduct(id);
        fetchMenus();
        if (currentMenus.length === 1 && currentPage > 0) {
          setCurrentPage(prev => prev - 1);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    }
  };

  const currentMenus = allItems.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (<div className="admin-management-container">
    {RenderError}
    <div className="admin-content-header">
      <h1 className="admin-page-title">Menu Items Management</h1>
      <button className="btn-primary add-btn" onClick={() => navigate('/admin/menu-items/new')}>
        <FontAwesomeIcon icon={faPlus}/> Add Menu Item
      </button>
    </div>
    {currentMenus.length > 0 ? (<>
      <div className="admin-menu-grid">
        {currentMenus.map((item) => (<div className="admin-menu-card" key={item.id}>
          <div className="menu-card-image-wrapper">
            <img
                src={item.imageUrl && !item.imageUrl.includes('loremflickr.com') ? item.imageUrl : FALLBACK_IMAGE}
                alt={item.name}
                className="menu-card-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
            />
            <div className="menu-card-price">${Number(item.basePrice || 0).toFixed(2)}</div>
          </div>
          <div className="menu-card-details">
            <h3 className="menu-card-title">{item.name}</h3>
            <p className="menu-card-description">{item.description}</p>
            <div className="menu-card-footer">
                          <span className="menu-card-reviews">
                            {item.totalReviews || 0} Reviews
                          </span>
              <div className="menu-card-actions">
                <button
                    className="btn-action edit-btn"
                    onClick={() => navigate(`/admin/menu-items/edit/${item.id}`)}
                    title="Edit Item"><FontAwesomeIcon icon={faEdit}/>
                </button>
                <button
                    className="btn-action delete-btn"
                    onClick={() => handleDeleteMenuItem(item.id)}
                    title="Delete Item"><FontAwesomeIcon icon={faTrash}/>
                </button>
              </div>
            </div>
          </div>
        </div>))}
      </div>
      {totalPages > 1 && (<div className="admin-pagination">
        <button
            className="btn-secondary"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}>Previous
        </button>
        <span className="pagination-info">Page {currentPage + 1} of {totalPages}</span>
        <button
            className="btn-secondary"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(prev => prev + 1)}>Next
        </button>
      </div>)}</>) : (
        <div className="admin-table-card empty-state">No menu items found. Click "Add Menu Item" to create one.</div>)}
  </div>);
};

export default AdminMenuPage;