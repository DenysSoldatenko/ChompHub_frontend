import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getAllCategories} from '../../api/categoryApi';
import {addProduct, getProductById, updateProduct, updateProductImage} from '../../api/productApi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const AdminMenuFormPage = () => {
  const {id} = useParams();
  const {RenderError, showError} = useError();
  const navigate = useNavigate();

  const [menu, setMenu] = useState({
    name: '', description: '', price: '', categoryId: '', imageFile: null, imageUrl: ''
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      let fetchedCategories = [];
      try {
        const catResponse = await getAllCategories();
        if (catResponse) {
          fetchedCategories = catResponse.content || catResponse.data || catResponse;
          setCategories(fetchedCategories);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }

      if (id) {
        try {
          const prodResponse = await getProductById(id);
          if (prodResponse) {
            const data = prodResponse.data || prodResponse;
            const matchedCategory = fetchedCategories.find(c => c.name === data.categoryName);

            setMenu(prev => ({
              ...prev,
              name: data.name || '',
              description: data.description || '',
              price: (data.basePrice || data.price || 0).toString(),
              categoryId: matchedCategory ? matchedCategory.id.toString() : '',
              imageUrl: data.imageUrl || ''
            }));
          }
        } catch (error) {
          showError(error.response?.data?.message || error.message);
        }
      }
    };

    loadData();
  }, [id]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setMenu(prev => ({...prev, [name]: value}));
  };

  const handleFileChange = (e) => {
    setMenu(prev => ({...prev, imageFile: e.target.files[0]}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productPayload = {
        name: menu.name.trim(),
        description: menu.description?.trim() || '',
        basePrice: parseFloat(menu.price.toString().replace(',', '.')),
        categoryId: Number(menu.categoryId),
        stockQuantity: 50,
        active: true,
        imageUrl: menu.imageUrl || null
      };

      if (id) {
        await updateProduct(id, productPayload);
        if (menu.imageFile) {
          await updateProductImage(id, menu.imageFile);
        }
      } else {
        const createdProduct = await addProduct(productPayload);
        const newProductId = createdProduct?.id || createdProduct?.data?.id;

        if (menu.imageFile && newProductId) {
          await updateProductImage(newProductId, menu.imageFile);
        }
      }

      navigate('/admin/menu-items');
    } catch (error) {
      showError(error.response?.data?.detail || error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (<div className="admin-form-container">
    {RenderError}
    <div className="admin-content-header">
      <h1 className="admin-page-title">{id ? 'Edit Menu Item' : 'Add New Menu Item'}</h1>
      <button
          type="button"
          className="btn-secondary back-btn"
          onClick={() => navigate('/admin/menu-items')}>&larr; Back to Menu Items
      </button>
    </div>
    <div className="admin-form-card">
      <form onSubmit={handleSubmit} className="corporate-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name *</label>
          <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={menu.name}
              onChange={handleInputChange}
              placeholder="e.g. Classic Cheeseburger"
              required/>
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
              id="description"
              name="description"
              className="form-input textarea"
              value={menu.description}
              onChange={handleInputChange}
              placeholder="Provide details about the item..."
              rows="4"/>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="price" className="form-label">Price *</label>
            <input
                type="number"
                id="price"
                name="price"
                className="form-input"
                value={menu.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                required/>
          </div>
          <div className="form-group">
            <label htmlFor="categoryId" className="form-label">Category *</label>
            <select
                id="categoryId"
                name="categoryId"
                className="form-input"
                value={menu.categoryId}
                onChange={handleInputChange}
                required>
              <option value="" disabled>Select a category</option>
              {categories.map(category => (<option key={category.id} value={category.id}>
                {category.name}
              </option>))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="imageFile" className="form-label">
            {id ? 'Change Image (Leave blank to keep current)' : 'Image *'}
          </label>
          <input
              type="file"
              id="imageFile"
              name="imageFile"
              className="form-input"
              onChange={handleFileChange}
              accept="image/*"
              required={!id}/>
          {id && menu.imageUrl && !menu.imageFile && (
              <div className="current-image-preview" style={{marginTop: '1rem'}}>
                <p className="form-label" style={{marginBottom: '0.5rem'}}>Current Image:</p>
                <img
                    src={menu.imageUrl}
                    alt="Current item"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '2px solid #cbd5e1'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                />
              </div>)}
        </div>
        <div className="form-actions">
          <button
              type="submit"
              className="btn-primary save-btn"
              disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (id ? 'Update Menu Item' : 'Save Menu Item')}
          </button>
        </div>
      </form>
    </div>
  </div>);
};

export default AdminMenuFormPage;