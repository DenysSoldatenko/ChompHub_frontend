import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../components/ErrorDisplay';
import {getAllCategories} from '../api/categoryApi';
import {getAllProducts} from '../api/productApi';
import {extractErrorMessage} from '../utils/errorHandler';

const HomePage = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
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

        const productsList = Array.isArray(productsData) ? productsData : productsData.content || [];
        const productsByCategory = productsList.reduce((acc, product) => {
          const catId = product.categoryId || product.category?.id;
          if (!acc[catId]) acc[catId] = [];
          acc[catId].push(product);
          return acc;
        }, {});

        const mappedCategories = categoriesData.map(category => {
          const matchingProducts = productsByCategory[category.id] || [];

          let randomProduct = null;
          if (matchingProducts.length > 0) {
            const randomIndex = Math.floor(Math.random() * matchingProducts.length);
            randomProduct = matchingProducts[randomIndex];
          }

          return {
            ...category,
            imageUrl: randomProduct?.imageUrl || randomProduct?.image_url || 'https://via.placeholder.com/600x400?text=Food',
            featuredDishName: randomProduct?.name || category.name
          };
        });

        setFeaturedCategories(mappedCategories);
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
      <div className="home-page">
        {RenderError}
        <header className="home-hero-section">
          <div className="home-hero-content">
            <h1 className="home-hero-title">Discover Delicious Meals</h1>
            <p className="home-hero-subtitle">Order your favorite food online quickly and easily</p>
            <button className="home-explore-button" onClick={() => navigate('/menu')}>
              Explore Menu
            </button>
          </div>
        </header>
        <section className="home-featured-categories">
          <h2 className="home-section-title">Featured Categories</h2>
          {isLoading ? (<p className="home-loading">Loading categories...</p>) : (
              <div className="home-category-carousel">
                {featuredCategories.map((category) => (
                    <div
                        key={category.id}
                        className="home-category-card"
                        onClick={() => handleCategoryClick(category.id)}>
                      <div className="home-category-image-container">
                        <img
                            src={category.imageUrl}
                            alt={category.featuredDishName}
                            className="home-category-img"
                            loading="lazy"
                        />
                      </div>
                      <div className="home-category-info">
                        <h3 className="home-category-name">{category.name}</h3>
                        <p className="home-category-dish">Featured: {category.featuredDishName}</p>
                        <p className="home-category-description">{category.description}</p>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </section>
        <section className="home-call-to-action">
          <div className="home-cta-content">
            <h2 className="home-cta-title">Ready to Order?</h2>
            <p className="home-cta-text">Browse our menu and place your order now!</p>
            <button
                className="home-order-now-button"
                onClick={() => navigate('/menu')}>Order Now
            </button>
          </div>
        </section>
      </div>
  );
};

export default HomePage;