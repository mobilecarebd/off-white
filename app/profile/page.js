'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiLink, FiAlertCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userFiles, setUserFiles] = useState([]);
  const [adminAssignedFiles, setAdminAssignedFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [assignedFilesError, setAssignedFilesError] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      fetchUserFiles();
      fetchAdminAssignedFiles();
    }
  }, [user, authLoading, router]);

  const fetchUserFiles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/files`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch files');
      const data = await response.json();
      setUserFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching user files:', error);
      toast.error('Failed to fetch your files');
    }
  };

  const fetchAdminAssignedFiles = async () => {
    try {
      setFilesLoading(true);
      setAssignedFilesError(false);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/admin-assigned-files`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assigned files');
      }
      
      const data = await response.json();
      setAdminAssignedFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching admin assigned files:', error);
      setAssignedFilesError(true);
      toast.error('Failed to fetch assigned resources');
    } finally {
      setFilesLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="blue-glass rounded-xl p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/80">Welcome back, {user?.name}</p>
        </div>

        <div className="space-y-6">
          {/* Admin Assigned Resources */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Assigned Resources</h2>
            
            {filesLoading ? (
              <p className="text-white/60">Loading resources...</p>
            ) : assignedFilesError ? (
              <div className="text-center py-10 blue-glass rounded-lg">
                <FiAlertCircle className="mx-auto text-red-400 mb-3" size={40} />
                <p className="text-red-400 mb-2">Failed to fetch assigned resources</p>
                <button 
                  onClick={fetchAdminAssignedFiles}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : adminAssignedFiles.length === 0 ? (
              <p className="text-white/60">No resources have been assigned to you yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminAssignedFiles.map((file) => (
                  <div key={file._id} className="p-4 rounded-lg bg-white/5 flex items-start space-x-3">
                    <div className="p-2 rounded-md bg-white/10">
                      <FiLink className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{file.name}</h3>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center mt-2"
                      >
                        Open Link <FiLink className="ml-1" size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Resources */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">My Resources</h2>
            {userFiles.length === 0 ? (
              <p className="text-white/60">You haven't added any resources yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userFiles.map((file) => (
                  <div key={file._id} className="p-4 rounded-lg bg-white/5 flex items-start space-x-3">
                    <div className="p-2 rounded-md bg-white/10">
                      <FiLink className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{file.name}</h3>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center mt-2"
                      >
                        Open Link <FiLink className="ml-1" size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}