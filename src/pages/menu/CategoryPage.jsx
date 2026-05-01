import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getAllCategories} from '../../api/categoryApi';
import {getAllProducts} from '../../api/productApi';
import {extractErrorMessage} from '../../utils/errorHandler';

const CategoriesPage = () => {
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
          const catId = product.categoryId || product.category?.id;
          if (!acc[catId]) acc[catId] = [];
          acc[catId].push(product);
          return acc;
        }, {});

        const mapped = rawCategories.map((category) => {
          const items = productsByCategory[category.id] || [];
          let randomItem = null;

          if (items.length > 0) {
            const randomIndex = Math.floor(Math.random() * items.length);
            randomItem = items[randomIndex];
          }

          return {
            ...category,
            dishCount: items.length,
            imageUrl:
                randomItem?.imageUrl ||
                randomItem?.image_url ||
                'https://loremflickr.com/600/400/food',
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

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${categoryId}`);
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
            </div>) : (
            <div className="categories-grid">
              {categories.map((category) => (
                  <div
                      key={category.id}
                      className="category-card"
                      onClick={() => handleCategoryClick(category.id)}>
                    <div className="category-image-wrapper">
                      <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="category-img"
                          loading="lazy"
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

export default CategoriesPage;