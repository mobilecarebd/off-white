'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/admin/DashboardLayout';
import { FiEdit2, FiTrash2, FiLock, FiUnlock, FiFile, FiLink, FiDownload } from 'react-icons/fi';
import { formatPhoneNumber } from '../../../utils/formatters';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    isAdmin: false
  });
  const [fileFormData, setFileFormData] = useState({
    name: '',
    url: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileInputChange = (e) => {
    const { name, value } = e.target;
    setFileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openModal = (user = null) => {
    setCurrentUser(user);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone || '',
        isAdmin: user.isAdmin
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        isAdmin: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const openFileModal = (user) => {
    setCurrentUser(user);
    setFileFormData({
      name: '',
      url: ''
    });
    setIsFileModalOpen(true);
  };

  const closeFileModal = () => {
    setIsFileModalOpen(false);
    setCurrentUser(null);
    setFileFormData({
      name: '',
      url: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(currentUser ? 'Updating user...' : 'Creating user...');

    try {
      const url = currentUser
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${currentUser._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
      const method = currentUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Operation failed');
      }

      toast.success(`User ${currentUser ? 'updated' : 'created'} successfully`, { id: toastId });
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Adding URL...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${currentUser._id}/files`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...fileFormData,
          assignedByAdmin: true
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Operation failed');
      }

      toast.success('URL added successfully', { id: toastId });
      closeFileModal();
      fetchUsers();
    } catch (error) {
      console.error('Error adding URL:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

    const toastId = toast.loading('Deleting user...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }

      toast.success('User deleted successfully', { id: toastId });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const handleRemoveFile = async (userId, fileId) => {
    if (!confirm('Are you sure you want to remove this file/link?')) return;

    const toastId = toast.loading('Removing file/link...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/files/${fileId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Remove failed');
      }

      toast.success('File/Link removed successfully', { id: toastId });
      fetchUsers();
    } catch (error) {
      console.error('Error removing file/link:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const toastId = toast.loading(`${currentStatus ? 'Deactivating' : 'Activating'} user...`);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/toggle-status`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Operation failed');
      }

      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`, { id: toastId });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  if (!user?.isAdmin) {
    return <DashboardLayout><div className="blue-glass rounded-xl p-6"><p className="text-white">Access denied. Admin privileges required.</p></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-2 sm:p-0">
        <div className="blue-glass rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
          <button onClick={() => openModal()} className="w-full sm:w-auto blue-glass-button px-4 py-2 rounded-lg transition-all hover:scale-105">
            Add New User
          </button>
        </div>

        {loading ? (
          <p className="text-center text-white/80">Loading users...</p>
        ) : (
          <div className="blue-glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 sm:p-4">Name</th>
                    <th className="hidden sm:table-cell p-4">Phone</th>
                    <th className="p-3 sm:p-4">Email</th>
                    <th className="p-3 sm:p-4">Role</th>
                    <th className="hidden sm:table-cell p-4">Status</th>
                    <th className="hidden sm:table-cell p-4">Files/Links</th>
                    <th className="p-3 sm:p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-white/10">
                      <td className="p-3 sm:p-4">{user.name}</td>
                      <td className="hidden sm:table-cell p-4">{formatPhoneNumber(user.phone)}</td>
                      <td className="p-3 sm:p-4">
                        <div className="max-w-[150px] sm:max-w-none">
                          <p className="truncate">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <span className={user.isAdmin ? 'text-purple-400' : 'text-white/60'}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell p-4">
                        <div className="flex flex-col gap-2">
                          {user.files && user.files.map((file) => (
                            <div key={file._id} className="flex items-center gap-2">
                              {file.type === 'file' ? <FiFile size={16} /> : <FiLink size={16} />}
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                {file.name}
                              </a>
                              <button
                                onClick={() => handleRemoveFile(user._id, file._id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <button onClick={() => openModal(user)} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                            <FiEdit2 size={14} />
                            <span className="sm:hidden">Edit</span>
                          </button>
                          <button onClick={() => toggleUserStatus(user._id, user.isActive)} className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1">
                            {user.isActive ? <FiLock size={14} /> : <FiUnlock size={14} />}
                            <span className="sm:hidden">{user.isActive ? 'Deactivate' : 'Activate'}</span>
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                            <FiTrash2 size={14} />
                            <span className="sm:hidden">Delete</span>
                          </button>
                          <button onClick={() => openFileModal(user)} className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1">
                            <FiFile size={14} />
                            <span className="sm:hidden">Add File</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && <p className="text-center p-4 text-white/60">No users found.</p>}
          </div>
        )}

        {/* Modal for Add/Edit User */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="blue-glass rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{currentUser ? 'Edit User' : 'Add New User'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                    Password {currentUser && '(leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    {...(!currentUser && { required: true })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="isAdmin" className="ml-2 text-sm text-white/80">Admin privileges</label>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-white/80 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto blue-glass-button px-4 py-2 rounded-lg transition-all hover:scale-105"
                  >
                    {currentUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Add URL */}
        {isFileModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="blue-glass rounded-xl p-4 sm:p-6 w-full max-w-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Add URL Resource</h2>
              <form onSubmit={handleFileSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Display Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={fileFormData.name}
                    onChange={handleFileInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Name for the resource"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-white/80 mb-1">URL</label>
                  <input
                    type="url"
                    name="url"
                    id="url"
                    value={fileFormData.url}
                    onChange={handleFileInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeFileModal}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-white/80 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto blue-glass-button px-4 py-2 rounded-lg transition-all hover:scale-105"
                  >
                    Add URL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}