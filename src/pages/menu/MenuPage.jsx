import {useState, useEffect, useMemo} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getAllProducts} from '../../api/productApi';
import {extractErrorMessage} from '../../utils/errorHandler';

const ITEMS_PER_PAGE = 8;

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const navigate = useNavigate();
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchMenus = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProducts();
        const productList = Array.isArray(data) ? data : data?.content || [];
        setMenus(productList);
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, searchTerm]);

  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      const itemCategoryId = item.categoryId || item.category?.id;
      const matchesCategory = categoryId ? String(itemCategoryId) === String(categoryId) : true;
      const matchesSearch =
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menus, categoryId, searchTerm]);

  const totalPages = Math.ceil(filteredMenus.length / ITEMS_PER_PAGE) || 1;
  const paginatedMenus = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMenus.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMenus, currentPage]);

  const handleClearFilter = () => {
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
      <div className="menu-page">
        {RenderError}
        <div className="menu-header">
          <h1 className="menu-title">Our Menu</h1>
          <div className="menu-title-divider"></div>
          <p className="menu-subtitle">
            {categoryId ? 'Filtered by selected category' : 'Explore all fresh and tasty dishes'}
          </p>
          {categoryId && (
              <button className="menu-reset-filter" onClick={handleClearFilter}>
                ✕ Clear Category Filter
              </button>
          )}
        </div>
        <div className="menu-search-wrapper">
          <input
              type="text"
              placeholder="Search dishes by name or ingredient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu-search-input"
          />
        </div>
        {isLoading ? (
            <div className="menu-loading-container">
              <div className="menu-spinner"></div>
              <p>Preparing menu items...</p>
            </div>
        ) : paginatedMenus.length === 0 ? (
            <div className="menu-empty-state">
              <p>No dishes found matching your criteria.</p>
            </div>
        ) : (
            <>
              <div className="menu-grid">
                {paginatedMenus.map((item) => (
                    <div
                        key={item.id}
                        className="menu-item-card"
                        onClick={() => navigate(`/menu/${item.id}`)}>
                      <div className="menu-item-image-wrapper">
                        <img
                            src={
                              item.imageUrl && !item.imageUrl.includes('loremflickr.com')
                                  ? item.imageUrl
                                  : `https://picsum.photos/seed/${item.id}/600/400`
                            }
                            alt={item.name}
                            className="menu-item-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                            }}
                        />
                        <span className="menu-item-price-tag">
                    ${Number(item.basePrice || item.price || 0).toFixed(2)}
                  </span>
                      </div>
                      <div className="menu-item-content">
                        <h2 className="menu-item-name">{item.name}</h2>
                        <p className="menu-item-description">{item.description}</p>
                        <div className="menu-item-footer">
                          <span className="menu-details-link">View Details →</span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
              {totalPages > 1 && (
                  <div className="menu-pagination">
                    <button
                        className="menu-pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}>‹ Prev
                    </button>
                    <div className="menu-pagination-pages">
                      {Array.from({length: totalPages}, (_, idx) => idx + 1).map((page) => (
                          <button
                              key={page}
                              className={`menu-pagination-page ${currentPage === page ? 'active' : ''}`}
                              onClick={() => handlePageChange(page)}>{page}
                          </button>
                      ))}
                    </div>
                    <button
                        className="menu-pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}>Next ›
                    </button>
                  </div>
              )}
            </>
        )}
      </div>
  );
};

export default MenuPage;