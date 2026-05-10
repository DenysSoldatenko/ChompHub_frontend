import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getAllCategories} from '../../api/categoryApi';
import {getAllProducts} from '../../api/productApi';
import {extractErrorMessage} from '../../utils/errorHandler';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getAllCategories(),
          getAllProducts()
        ]);

        const rawCategories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.content || [];
        const rawProducts = Array.isArray(productsData) ? productsData : productsData?.content || [];

        const productsByCategory = rawProducts.reduce((acc, product) => {
          const catName = product.categoryName || (typeof product.category === 'string' ? product.category : product.category?.name);
          if (catName) {
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(product);
          }
          return acc;
        }, {});

        const mapped = rawCategories.map((category) => {
          const items = productsByCategory[category.name] || [];
          let randomItem = null;

          if (items.length > 0) {
            const randomIndex = Math.floor(Math.random() * items.length);
            randomItem = items[randomIndex];
          }

          const rawImage = randomItem?.imageUrl || randomItem?.image_url || category.imageUrl;
          const safeImage = rawImage && !rawImage.includes('loremflickr.com') ? rawImage : FALLBACK_IMAGE;

          return {
            ...category,
            dishCount: items.length,
            imageUrl: safeImage,
            sampleDishName: randomItem?.name || null
          };
        });

        setCategories(mapped);
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
  };

  return (
      <div className="categories-page">
        {RenderError}
        <div className="categories-hero">
          <h1 className="categories-title">Explore Categories</h1>
          <p className="categories-subtitle">Find your next favorite meal prepared fresh daily</p>
        </div>
        {isLoading ? (
            <div className="categories-loading-container">
              <div className="categories-spinner"></div>
              <p>Curating delicious categories...</p>
            </div>
        ) : (
            <div className="categories-grid">
              {categories.map((category, index) => (
                  <div
                      key={category.id || `category-${index}`}
                      className="category-card"
                      onClick={() => handleCategoryClick(category.name)}>
                    <div className="category-image-wrapper">
                      <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="category-img"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                      />
                      {category.dishCount > 0 && (
                          <span className="category-badge">{category.dishCount} items</span>
                      )}
                    </div>
                    <div className="category-card-body">
                      <h2 className="category-name">{category.name}</h2>
                      <p className="category-description">{category.description}</p>
                      {category.sampleDishName && (
                          <div className="category-footer-hint">
                            <span>Try today: </span>
                            <strong>{category.sampleDishName}</strong>
                          </div>
                      )}
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default CategoryPage;