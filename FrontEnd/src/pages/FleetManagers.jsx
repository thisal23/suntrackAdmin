import React, { useEffect, useState } from 'react';
import apiService from '../config/axiosConfig';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import NavBar from '../components/NavBar/NavBar';
import './FleetManagers.css';

const PAGE_SIZE = 5;

const initialForm = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
};

const FleetManagers = () => {
  const [fleetManagers, setFleetManagers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchFleetManagers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.get('/fleet-managers');
      setFleetManagers(res.data);
    } catch (err) {
      setError('Failed to fetch fleet managers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetManagers();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setForm(initialForm);
    setFormError('');
    setModalOpen(true);
    setEditId(null);
  };

  const openEditModal = (fm) => {
    setModalMode('edit');
    setForm({
      firstName: fm.firstName,
      lastName: fm.lastName,
      userName: fm.userName,
      email: fm.email,
      password: '',
    });
    setFormError('');
    setModalOpen(true);
    setEditId(fm.id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError('');
    setEditId(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.firstName || !form.lastName || !form.userName || !form.email || (modalMode === 'add' && !form.password)) {
      setFormError('Please fill in all required fields.');
      return;
    }
    try {
      if (modalMode === 'add') {
        await apiService.post('/fleet-managers', form);
      } else {
        await apiService.put(`/fleet-managers/${editId}`, form);
      }
      closeModal();
      fetchFleetManagers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fleet manager?')) return;
    try {
      await apiService.delete(`/fleet-managers/${id}`);
      setFleetManagers(fleetManagers.filter(fm => fm.id !== id));
    } catch {
      alert('Failed to delete.');
    }
  };

  const filteredManagers = fleetManagers.filter(fm =>
    fm.firstName.toLowerCase().includes(search.toLowerCase()) ||
    fm.lastName.toLowerCase().includes(search.toLowerCase()) ||
    fm.userName.toLowerCase().includes(search.toLowerCase()) ||
    fm.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredManagers.length / PAGE_SIZE) || 1;
  const paginatedManagers = filteredManagers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <>
      <NavBar />
      <div className="fm-bg">
        <div className="fm-card">
          <div className="fm-header-row">
            <h1 className="fm-title">Fleet Managers</h1>
            <button className="fm-add-btn" onClick={openAddModal}><FaPlus style={{ marginRight: 8 }} /> Add New</button>
          </div>
          <div className="fm-search-row">
            <input
              className="fm-search"
              type="text"
              placeholder="Search by name, username, or email"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          {loading ? <div>Loading...</div> : (
            <>
              <div className="fm-table-wrap">
                <table className="fm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedManagers.map(fm => (
                      <tr key={fm.id}>
                        <td>{fm.firstName} {fm.lastName}</td>
                        <td>{fm.userName}</td>
                        <td>{fm.email}</td>
                        <td><span className="fm-status-active">Active</span></td>
                        <td>
                          <button className="fm-action-btn fm-edit" onClick={() => openEditModal(fm)} title="Edit"><FaEdit /></button>
                          <button className="fm-action-btn fm-delete" onClick={() => handleDelete(fm.id)} title="Delete"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="fm-pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&lt;</button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    className={page === idx + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>&gt;</button>
              </div>
            </>
          )}
        </div>
        {modalOpen && (
          <div className="fm-modal-bg">
            <div className="fm-modal">
              <button className="fm-modal-close" onClick={closeModal}><FaTimes /></button>
              <h2 className="fm-modal-title">{modalMode === 'add' ? 'Add Fleet Manager' : 'Edit Fleet Manager'}</h2>
              {formError && <div className="error">{formError}</div>}
              <form onSubmit={handleFormSubmit} className="fm-modal-form">
                <div className="fm-modal-group">
                  <label>First Name:</label>
                  <input name="firstName" value={form.firstName} onChange={handleFormChange} required />
                </div>
                <div className="fm-modal-group">
                  <label>Last Name:</label>
                  <input name="lastName" value={form.lastName} onChange={handleFormChange} required />
                </div>
                <div className="fm-modal-group">
                  <label>Username:</label>
                  <input name="userName" value={form.userName} onChange={handleFormChange} required />
                </div>
                <div className="fm-modal-group">
                  <label>Email:</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} required />
                </div>
                <div className="fm-modal-group">
                  <label>Password{modalMode === 'edit' ? ' (leave blank to keep unchanged)' : ''}:</label>
                  <input name="password" type="password" value={form.password} onChange={handleFormChange} placeholder={modalMode === 'edit' ? 'Leave blank to keep current password' : ''} required={modalMode === 'add'} />
                </div>
                <button className="fm-add-btn" type="submit" style={{ width: '100%', marginTop: 16 }}>{modalMode === 'add' ? 'Add' : 'Save'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FleetManagers; 