import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getCategoryById, addCategory, updateCategory} from '../../api/categoryApi';

const AdminCategoryFormPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {RenderError, showError} = useError();

  const [category, setCategory] = useState({
    name: '', description: ''
  });

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await getCategoryById(id);
      if (response) {
        setCategory(response.data || response);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setCategory(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCategory(id, category);
      } else {
        await addCategory(category);
      }
      navigate('/admin/categories');
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  return (<div className="admin-form-container">
    {RenderError}
    <div className="admin-content-header">
      <h1 className="admin-page-title">{id ? 'Edit Category' : 'Add New Category'}</h1>
      <button
          type="button"
          className="btn-secondary back-btn"
          onClick={() => navigate('/admin/categories')}>&larr; Back to Categories
      </button>
    </div>
    <div className="admin-form-card">
      <form onSubmit={handleSubmit} className="corporate-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Category Name</label>
          <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={category.name}
              onChange={handleInputChange}
              placeholder="e.g. Breakfast"
              required/>
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
              id="description"
              name="description"
              className="form-input textarea"
              value={category.description}
              onChange={handleInputChange}
              placeholder="Describe the category..."
              rows="4"/>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary save-btn">
            {id ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  </div>);
};

export default AdminCategoryFormPage;