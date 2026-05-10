import {useState, useEffect, useMemo} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getAllProducts} from '../../api/productApi';
import {extractErrorMessage} from '../../utils/errorHandler';

const ITEMS_PER_PAGE = 8;
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category');
  useNavigate();
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProducts();
        const productsList = Array.isArray(data) ? data : data?.content || [];
        setProducts(productsList);
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryQuery, searchTerm]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let matchesCategory = true;

      if (categoryQuery) {
        const target = decodeURIComponent(categoryQuery).trim().toLowerCase();
        const productCatName = (product.categoryName || '').trim().toLowerCase();
        const productCatId = (product.categoryId ?? product.category?.id ?? '').toString().trim().toLowerCase();

        matchesCategory = productCatName === target || productCatId === target;
      }

      let matchesSearch = true;
      if (searchTerm.trim()) {
        const searchLower = searchTerm.trim().toLowerCase();
        const nameLower = (product.name || '').toLowerCase();
        const descLower = (product.description || '').toLowerCase();
        matchesSearch = nameLower.includes(searchLower) || descLower.includes(searchLower);
      }

      return matchesCategory && matchesSearch;
    });
  }, [products, categoryQuery, searchTerm]);

  const clearCategoryFilter = () => {
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
      <div className="menu-page">
        {RenderError}
        <div className="menu-header">
          <h1 className="menu-title">Our Menu</h1>
          {categoryQuery && (
              <div className="menu-category-filter-indicator">
                <p>Filtered by category: <strong>{categoryQuery}</strong></p>
                <button onClick={clearCategoryFilter} className="clear-filter-btn">
                  ✕ Clear Category Filter
                </button>
              </div>
          )}
        </div>
        <div className="menu-search-container">
          <input
              type="text"
              placeholder="Search dishes by name or ingredient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu-search-input"
          />
        </div>
        {isLoading ? (
            <div className="menu-loading">Loading menu...</div>
        ) : paginatedProducts.length > 0 ? (
            <>
              <div className="menu-grid">
                {paginatedProducts.map((product) => (
                    <Link key={product.id} to={`/menu/${product.id}`} className="menu-card"
                          style={{textDecoration: 'none', color: 'inherit'}}>
                      <div className="menu-card-image-wrapper">
                        <img
                            src={
                              product.imageUrl && !product.imageUrl.includes('loremflickr.com')
                                  ? product.imageUrl
                                  : FALLBACK_IMAGE
                            }
                            alt={product.name}
                            className="menu-card-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_IMAGE;
                            }}
                        />
                        <div className="menu-card-price">${formatPrice(product.basePrice)}</div>
                      </div>
                      <div className="menu-card-content">
                        <h3 className="menu-card-name">{product.name}</h3>
                        <p className="menu-card-description">{product.description}</p>
                        <span className="menu-card-details-link">
                    View Details →
                  </span>
                      </div>
                    </Link>
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
        ) : (
            <div className="menu-no-results">
              <p>No dishes found matching your criteria.</p>
            </div>
        )}
      </div>
  );
};

export default MenuPage;