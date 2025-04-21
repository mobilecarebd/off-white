'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/admin/DashboardLayout';
import Image from 'next/image';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    regularPrice: '',
    offerPrice: '',
    isActive: true,
    image: null
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      // Fetch all packages (including inactive) for admin view
      const response = await fetch('http://localhost:5000/api/packages?all=true', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch packages');
      const data = await response.json();
      // Assuming the backend returns { packages: [...] } even for admin
      setPackages(data.packages || data); // Adjust based on actual API response
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
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

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const openModal = (pkg = null) => {
    setCurrentPackage(pkg);
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description,
        features: pkg.features.join(', '),
        regularPrice: pkg.regularPrice,
        offerPrice: pkg.offerPrice || '',
        isActive: pkg.isActive,
        image: null // Don't prefill image for edit
      });
    } else {
      setFormData({
        name: '',
        description: '',
        features: '',
        regularPrice: '',
        offerPrice: '',
        isActive: true,
        image: null
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPackage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(currentPackage ? 'Updating package...' : 'Creating package...');

    const packageData = new FormData();
    packageData.append('name', formData.name);
    packageData.append('description', formData.description);
    // Send features as a comma-separated string, backend will parse
    packageData.append('features', formData.features);
    packageData.append('regularPrice', formData.regularPrice);
    if (formData.offerPrice) {
        packageData.append('offerPrice', formData.offerPrice);
    }
    packageData.append('isActive', formData.isActive);
    if (formData.image) {
      packageData.append('image', formData.image);
    }

    const url = currentPackage
      ? `http://localhost:5000/api/packages/${currentPackage._id}`
      : 'http://localhost:5000/api/packages';
    const method = currentPackage ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        body: packageData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      toast.success(`Package ${currentPackage ? 'updated' : 'created'} successfully`, { id: toastId });
      closeModal();
      fetchPackages(); // Refresh the list
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm('Are you sure you want to delete this package? This cannot be undone.')) return;

    const toastId = toast.loading('Deleting package...');
    try {
      const response = await fetch(`http://localhost:5000/api/packages/${packageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Delete failed');
      }

      toast.success('Package deleted successfully', { id: toastId });
      fetchPackages(); // Refresh the list
    } catch (error) {
      console.error('Error deleting package:', error);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Package Management</h1>
          <button onClick={() => openModal()} className="w-full sm:w-auto blue-glass-button px-4 py-2 rounded-lg transition-all hover:scale-105">
            Add New Package
          </button>
        </div>

        {loading ? (
          <p className="text-center text-white/80">Loading packages...</p>
        ) : (
          <div className="blue-glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 sm:p-4">Image</th>
                    <th className="p-3 sm:p-4">Name</th>
                    <th className="p-3 sm:p-4">Price</th>
                    <th className="hidden sm:table-cell p-4">Offer Price</th>
                    <th className="p-3 sm:p-4">Status</th>
                    <th className="p-3 sm:p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg._id} className="border-b border-white/10 last:border-0 hover:bg-white/5">
                      <td className="p-3 sm:p-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
                          <Image 
                            src={`http://localhost:5000${pkg.imageUrl}`} 
                            alt={pkg.name} 
                            fill
                            className="rounded object-cover" 
                          />
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 font-medium">
                        <div className="max-w-[150px] sm:max-w-none">
                          <p className="truncate">{pkg.name}</p>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">${pkg.regularPrice.toFixed(2)}</td>
                      <td className="hidden sm:table-cell p-4">{pkg.offerPrice ? `$${pkg.offerPrice.toFixed(2)}` : '-'}</td>
                      <td className="p-3 sm:p-4">
                        <span className={`px-2 py-1 rounded text-xs ${pkg.isActive ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <button onClick={() => openModal(pkg)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                          <button onClick={() => handleDelete(pkg._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {packages.length === 0 && <p className="text-center p-4 text-white/60">No packages found.</p>}
          </div>
        )}

        {/* Modal for Add/Edit Package */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="blue-glass rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{currentPackage ? 'Edit Package' : 'Add New Package'}</h2>
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
                  <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    id="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    required 
                    rows="3" 
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-white/80 mb-1">Features (comma-separated)</label>
                  <input 
                    type="text" 
                    name="features" 
                    id="features" 
                    value={formData.features} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="regularPrice" className="block text-sm font-medium text-white/80 mb-1">Regular Price ($)</label>
                    <input 
                      type="number" 
                      name="regularPrice" 
                      id="regularPrice" 
                      value={formData.regularPrice} 
                      onChange={handleInputChange} 
                      required 
                      min="0" 
                      step="0.01" 
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                  </div>
                  <div>
                    <label htmlFor="offerPrice" className="block text-sm font-medium text-white/80 mb-1">Offer Price ($)</label>
                    <input 
                      type="number" 
                      name="offerPrice" 
                      id="offerPrice" 
                      value={formData.offerPrice} 
                      onChange={handleInputChange} 
                      min="0" 
                      step="0.01" 
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-white/80 mb-1">Package Image</label>
                  <input 
                    type="file" 
                    name="image" 
                    id="image" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 cursor-pointer" 
                  />
                  {currentPackage && <p className="text-xs text-white/60 mt-1">Leave blank to keep the current image.</p>}
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    id="isActive" 
                    checked={formData.isActive} 
                    onChange={handleInputChange} 
                    className="h-4 w-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500" 
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-white/80">Active</label>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="w-full sm:w-auto blue-glass-button px-4 py-2 rounded-lg transition-all hover:scale-105"
                  >
                    {currentPackage ? 'Update Package' : 'Create Package'}
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