'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/admin/DashboardLayout';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    isActive: true,
    image: null,
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team?all=true`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      setMembers(data.members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('social_')) {
      const social = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [social]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const openModal = (member = null) => {
    setCurrentMember(member);
    setDeleteImage(false);
    if (member) {
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio,
        isActive: member.isActive,
        image: null,
        socialLinks: member.socialLinks || {
          instagram: '',
          facebook: '',
          twitter: ''
        }
      });
    } else {
      setFormData({
        name: '',
        role: '',
        bio: '',
        isActive: true,
        image: null,
        socialLinks: {
          instagram: '',
          facebook: '',
          twitter: ''
        }
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(currentMember ? 'Updating team member...' : 'Creating team member...');

    const memberData = new FormData();
    memberData.append('name', formData.name);
    memberData.append('role', formData.role);
    memberData.append('bio', formData.bio);
    memberData.append('isActive', formData.isActive);
    memberData.append('socialLinks', JSON.stringify(formData.socialLinks));
    if (formData.image) {
      memberData.append('image', formData.image);
    }
    if (deleteImage) {
      memberData.append('deleteImage', 'true');
    }

    const url = currentMember
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/team/${currentMember._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/team`;
    const method = currentMember ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        body: memberData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      toast.success(`Team member ${currentMember ? 'updated' : 'created'} successfully`, { id: toastId });
      closeModal();
      fetchMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const handleDelete = async (memberId) => {
    if (!confirm('Are you sure you want to delete this team member? This cannot be undone.')) return;

    const toastId = toast.loading('Deleting team member...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team/${memberId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Delete failed');
      }

      toast.success('Team member deleted successfully', { id: toastId });
      fetchMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Team Management</h1>
          <button onClick={() => openModal()} className="w-full sm:w-auto blue-glass-button px-4 py-2 rounded-lg transition-all hover:scale-105">
            Add New Member
          </button>
        </div>

        {loading ? (
          <p className="text-center text-white/80">Loading team members...</p>
        ) : (
          <div className="blue-glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 sm:p-4">Image</th>
                    <th className="p-3 sm:p-4">Name</th>
                    <th className="p-3 sm:p-4">Role</th>
                    <th className="hidden sm:table-cell p-4">Status</th>
                    <th className="p-3 sm:p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member._id} className="border-b border-white/10">
                      <td className="p-3 sm:p-4">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${member.imageUrl.replace('/uploads', '')}`}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="max-w-[150px] sm:max-w-none">
                          <p className="font-medium truncate">{member.name}</p>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">{member.role}</td>
                      <td className="hidden sm:table-cell p-4">
                        <span className={`px-2 py-1 rounded text-xs ${member.isActive ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <button onClick={() => openModal(member)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                          <button onClick={() => handleDelete(member._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {members.length === 0 && <p className="text-center p-4 text-white/60">No team members found.</p>}
          </div>
        )}

        {/* Modal for Add/Edit Member */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="blue-glass rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{currentMember ? 'Edit Member' : 'Add New Member'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-white/80 mb-1">Role</label>
                  <input type="text" name="role" id="role" value={formData.role} onChange={handleInputChange} required className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-white/80 mb-1">Bio</label>
                  <textarea name="bio" id="bio" value={formData.bio} onChange={handleInputChange} required rows="3" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                </div>
                <div className="space-y-2">
                  <label htmlFor="image" className="block text-sm font-medium text-white/80 mb-1">Profile Image</label>
                  
                  {currentMember && currentMember.imageUrl && !deleteImage && (
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${currentMember.imageUrl.replace('/uploads', '')}`}
                        alt={currentMember.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setDeleteImage(true)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <input 
                    type="file" 
                    name="image" 
                    id="image" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 cursor-pointer" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="social_instagram" className="block text-sm font-medium text-white/80 mb-1">Instagram URL</label>
                    <input type="url" name="social_instagram" id="social_instagram" value={formData.socialLinks.instagram} onChange={handleInputChange} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label htmlFor="social_facebook" className="block text-sm font-medium text-white/80 mb-1">Facebook URL</label>
                    <input type="url" name="social_facebook" id="social_facebook" value={formData.socialLinks.facebook} onChange={handleInputChange} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label htmlFor="social_twitter" className="block text-sm font-medium text-white/80 mb-1">Twitter URL</label>
                    <input type="url" name="social_twitter" id="social_twitter" value={formData.socialLinks.twitter} onChange={handleInputChange} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500" />
                  <label htmlFor="isActive" className="ml-2 text-sm text-white/80">Active</label>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="w-full sm:w-auto px-4 py-2 rounded-lg text-white/80 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="w-full sm:w-auto blue-glass-button px-4 py-2 rounded-lg transition-all hover:scale-105">
                    {currentMember ? 'Update Member' : 'Add Member'}
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