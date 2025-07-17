// import React, { useState, useEffect } from 'react';
// import { fleetManagerService } from '../../services/api';
// import { toast } from 'react-toastify';
// import styles from './FleetManagers.module.scss';
// import { 
//   Search, 
//   Add, 
//   Edit, 
//   Delete 
// } from '@mui/icons-material';

// const FleetManagers = () => {
//   const [fleetManagers, setFleetManagers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [addForm, setAddForm] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     password: '',
//   });
//   const [addLoading, setAddLoading] = useState(false);

//   useEffect(() => {
//     loadFleetManagers();
//   }, [page, search]);

//   const loadFleetManagers = async () => {
//     try {
//       setLoading(true);
//       const response = await fleetManagerService.getAll({
//         page,
//         search,
//         limit: 10
//       });
//       setFleetManagers(response.data.data.fleetManagers);
//       setTotalPages(Math.ceil(response.data.data.pagination.total / 10));
//     } catch (error) {
//       toast.error('Failed to load fleet managers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//     setPage(1);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this fleet manager?')) {
//       try {
//         await fleetManagerService.delete(id);
//         toast.success('Fleet manager deleted successfully');
//         loadFleetManagers();
//       } catch (error) {
//         toast.error('Failed to delete fleet manager');
//       }
//     }
//   };

//   const handleAddChange = (e) => {
//     setAddForm({ ...addForm, [e.target.name]: e.target.value });
//   };

//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     setAddLoading(true);
//     try {
//       await fleetManagerService.create({ ...addForm, roleId: 2 });
//       toast.success('Fleet manager registered successfully');
//       setShowAddModal(false);
//       setAddForm({ firstName: '', lastName: '', username: '', email: '', password: '' });
//       loadFleetManagers();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to register fleet manager');
//     } finally {
//       setAddLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h1>Fleet Managers</h1>
//         <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
//           <Add /> Add New
//         </button>
//       </div>

//       <div className={styles.searchBar}>
//         <Search />
//         <input
//           type="text"
//           placeholder="Search fleet managers..."
//           value={search}
//           onChange={handleSearch}
//         />
//       </div>

//       {loading ? (
//         <div className={styles.loading}>Loading...</div>
//       ) : (
//         <>
//           <div className={styles.table}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Username</th>
//                   <th>Email</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fleetManagers.map((manager) => (
//                   <tr key={manager.id}>
//                     <td>{`${manager.firstName} ${manager.lastName}`}</td>
//                     <td>{manager.username}</td>
//                     <td>{manager.email}</td>
//                     <td>
//                       <span className={`${styles.status} ${manager.isActive ? styles.active : styles.inactive}`}>
//                         {manager.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td>
//                       <div className={styles.actions}>
//                         <button className={styles.editButton}>
//                           <Edit />
//                         </button>
//                         <button 
//                           className={styles.deleteButton}
//                           onClick={() => handleDelete(manager.id)}
//                         >
//                           <Delete />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className={styles.pagination}>
//             <button 
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//               disabled={page === 1}
//             >
//               Previous
//             </button>
//             <span>{`Page ${page} of ${totalPages}`}</span>
//             <button 
//               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}

//       {/* Add Fleet Manager Modal */}
//       {showAddModal && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modal}>
//             <h2>Add Fleet Manager</h2>
//             <form onSubmit={handleAddSubmit} className={styles.addForm} autoComplete="off">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={addForm.firstName}
//                 onChange={handleAddChange}
//                 required
//                 autoFocus
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={addForm.lastName}
//                 onChange={handleAddChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 value={addForm.username}
//                 onChange={handleAddChange}
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={addForm.email}
//                 onChange={handleAddChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={addForm.password}
//                 onChange={handleAddChange}
//                 required
//               />
//               <div className={styles.modalActions}>
//                 <button type="button" onClick={() => setShowAddModal(false)} className={styles.cancelButton}>
//                   Cancel
//                 </button>
//                 <button type="submit" className={styles.saveButton} disabled={addLoading}>
//                   {addLoading ? 'Saving...' : 'Save'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FleetManagers;


import React, { useState, useEffect } from 'react';
import { fleetManagerService } from '../../services/api';
import { toast } from 'react-toastify';
import styles from './FleetManagers.module.scss';
import { Search, Add, Edit, Delete } from '@mui/icons-material';

const FleetManagers = () => {
  const [fleetManagers, setFleetManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' });
  const [addLoading, setAddLoading] = useState(false);

  const [editForm, setEditForm] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadFleetManagers();
  }, [page, search]);

  const loadFleetManagers = async () => {
    try {
      setLoading(true);
      const response = await fleetManagerService.getAll({ page, search, limit: 10 });
      setFleetManagers(response.data.data.fleetManagers);
      setTotalPages(Math.ceil(response.data.data.pagination.total / 10));
    } catch (error) {
      toast.error('Failed to load fleet managers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fleet manager?')) {
      try {
        await fleetManagerService.delete(id);
        toast.success('Fleet manager deleted successfully');
        loadFleetManagers();
      } catch (error) {
        toast.error('Failed to delete fleet manager');
      }
    }
  };

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await fleetManagerService.create({ ...addForm, roleId: 2 });
      toast.success('Fleet manager registered successfully');
      setShowAddModal(false);
      setAddForm({ firstName: '', lastName: '', username: '', email: '', password: '' });
      loadFleetManagers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register fleet manager');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const updatedData = { ...editForm };
      if (!updatedData.password) delete updatedData.password;
      await fleetManagerService.update(editForm.id, updatedData);
      toast.success('Fleet manager updated successfully');
      setShowEditModal(false);
      setEditForm(null);
      loadFleetManagers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update fleet manager');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Fleet Managers</h1>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          <Add /> Add New
        </button>
      </div>

      <div className={styles.searchBar}>
        <Search />
        <input type="text" placeholder="Search fleet managers..." value={search} onChange={handleSearch} />
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <div className={styles.table}>
            <table>
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
                {fleetManagers.map((manager) => (
                  <tr key={manager.id}>
                    <td>{`${manager.firstName} ${manager.lastName}`}</td>
                    <td>{manager.username}</td>
                    <td>{manager.email}</td>
                    <td>
                      <span className={`${styles.status} ${manager.isActive ? styles.active : styles.inactive}`}>
                        {manager.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.editButton} onClick={() => { setEditForm(manager); setShowEditModal(true); }}>
                          <Edit />
                        </button>
                        <button className={styles.deleteButton} onClick={() => handleDelete(manager.id)}>
                          <Delete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
            <span>{`Page ${page} of ${totalPages}`}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add Fleet Manager</h2>
            <form onSubmit={handleAddSubmit} className={styles.addForm}>
              <input name="firstName" placeholder="First Name" value={addForm.firstName} onChange={handleAddChange} required />
              <input name="lastName" placeholder="Last Name" value={addForm.lastName} onChange={handleAddChange} required />
              <input name="username" placeholder="Username" value={addForm.username} onChange={handleAddChange} required />
              <input name="email" type="email" placeholder="Email" value={addForm.email} onChange={handleAddChange} required />
              <input name="password" type="password" placeholder="Password" value={addForm.password} onChange={handleAddChange} required />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.cancelButton}>Cancel</button>
                <button type="submit" disabled={addLoading} className={styles.saveButton}>{addLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Fleet Manager</h2>
            <form onSubmit={handleEditSubmit} className={styles.addForm}>
              <input name="firstName" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} required />
              <input name="lastName" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} required />
              <input name="username" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} required />
              <input name="email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
              <input name="password" type="password" placeholder="New Password (optional)" onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowEditModal(false)} className={styles.cancelButton}>Cancel</button>
                <button type="submit" disabled={editLoading} className={styles.saveButton}>{editLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagers;

