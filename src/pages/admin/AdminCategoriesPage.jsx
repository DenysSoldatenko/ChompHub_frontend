import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {getAllCategories, deleteCategory} from '../../api/categoryApi';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const {RenderError, showError} = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response) {
        setCategories(response.content || response.data || response);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleAddCategory = () => {
    navigate('/admin/categories/new');
  };

  const handleEditCategory = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    }
  };

  return (
      <div className="admin-management-container">
        {RenderError}

        <div className="admin-content-header">
          <h1 className="admin-page-title">Categories Management</h1>
          <button className="btn-primary add-btn" onClick={handleAddCategory}>
            <FontAwesomeIcon icon={faPlus}/> Add Category
          </button>
        </div>

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th className="actions-header">Actions</th>
            </tr>
            </thead>
            <tbody>
            {categories.length > 0 ? (
                categories.map((category) => (
                    <tr key={category.id}>
                      <td className="id-col">#{category.id}</td>
                      <td className="name-col">{category.name}</td>
                      <td className="desc-col">{category.description}</td>
                      <td className="actions-col">
                        <button
                            className="btn-action edit-btn"
                            onClick={() => handleEditCategory(category.id)}
                            title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit}/> Edit
                        </button>
                        <button
                            className="btn-action delete-btn"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash}/> Delete
                        </button>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="4" className="empty-state">No categories found.</td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default AdminCategoriesPage;