'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/admin/DashboardLayout';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';

export default function AdminPhotos() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos`);
      const data = await response.json();
      setPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to fetch photos');
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      toast.success('Photos uploaded successfully');
      fetchPhotos();
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/${photoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Delete failed');

      toast.success('Photo deleted successfully');
      setPhotos(photos.filter(photo => photo._id !== photoId));
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const handlePreview = (photo) => {
    setPreviewPhoto(photo);
  };

  const closePreview = () => {
    setPreviewPhoto(null);
  };

  if (!user?.isAdmin) {
    return <DashboardLayout>
      <div className="blue-glass rounded-xl p-6">
        <p className="text-white">Access denied. Admin privileges required.</p>
      </div>
    </DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-2 sm:p-0">
        <div className="blue-glass rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Photo Management</h1>
            <label className="w-full sm:w-auto blue-glass-button px-4 py-2 rounded-lg cursor-pointer transition-all hover:scale-105 text-center">
              {uploading ? 'Uploading...' : 'Upload Photos'}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {photos.map((photo) => (
            <div key={photo._id} className="blue-glass rounded-xl overflow-hidden">
              <div className="relative group cursor-pointer" onClick={() => handlePreview(photo)}>
                <div className="aspect-w-4 aspect-h-3 relative">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    height={300}
                    width={400}
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo._id);
                    }}
                    className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white/80 truncate text-sm">{photo.title}</p>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="blue-glass rounded-xl p-4 sm:p-6 text-center">
            <p className="text-white/80">No photos uploaded yet.</p>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewPhoto && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <div className="relative max-w-5xl w-full h-[80vh] bg-transparent">
              <button
                onClick={closePreview}
                className="absolute -top-10 right-0 text-white/80 hover:text-white p-2"
              >
                <FiX size={24} />
              </button>
              <div className="w-full h-full relative">
                <Image
                  src={previewPhoto.url}
                  alt={previewPhoto.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}