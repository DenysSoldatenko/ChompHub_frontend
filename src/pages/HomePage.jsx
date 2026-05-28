import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../components/ErrorDisplay';
import {getAllCategories} from '../api/categoryApi';
import {getAllProducts} from '../api/productApi';
import {extractErrorMessage} from '../utils/errorHandler';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const HomePage = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([getAllCategories(), getAllProducts()]);

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

        const mappedCategories = rawCategories.map(category => {
          const matchingProducts = productsByCategory[category.name] || [];

          let randomProduct = null;
          if (matchingProducts.length > 0) {
            const randomIndex = Math.floor(Math.random() * matchingProducts.length);
            randomProduct = matchingProducts[randomIndex];
          }

          const rawImage = randomProduct?.imageUrl || randomProduct?.image_url || category.imageUrl;
          const safeImage = rawImage && !rawImage.includes('loremflickr.com') ? rawImage : FALLBACK_IMAGE;

          return {
            ...category,
            dishCount: matchingProducts.length,
            imageUrl: safeImage,
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

  const handleCategoryClick = (categoryName) => {
    navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
  };

  return (<div className="home-page">
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
            {featuredCategories.map((category) => (<div
                key={category.id}
                className="home-category-card"
                onClick={() => handleCategoryClick(category.name)}>
              <div className="home-category-image-container">
                <img
                    src={category.imageUrl}
                    alt={category.featuredDishName}
                    className="home-category-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                />
                {category.dishCount > 0 && (<span className="category-badge">{category.dishCount} items</span>)}
              </div>
              <div className="home-category-info">
                <h3 className="home-category-name">{category.name}</h3>
                <p className="home-category-dish">Featured: {category.featuredDishName}</p>
                <p className="home-category-description">{category.description}</p>
              </div>
            </div>))}
          </div>)}
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
  </div>);
};

export default HomePage;