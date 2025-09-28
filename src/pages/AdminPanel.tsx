import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Category {
  id: string;
  name: string;
}

interface ImageItem {
  id: string;
  url: string;
  title: string;
  category_id: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) fetchImages();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) setCategories(data);
  };

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('category_id', selectedCategory);
    if (!error) setImages(data);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    
    if (selectedFiles.length > 0) {
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleCancel = () => {
    setFiles([]);
    setPreviewUrls([]);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleUpload = async () => {
    if (files.length === 0 || !selectedCategory) {
      setAlertMessage('Select category and files');
      setShowAlert(true);
      return;
    }
    
    setUploading(true);
    
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const url = supabase.storage.from('project-images').getPublicUrl(fileName).data.publicUrl;

        const { error: insertError } = await supabase.from('images').insert({
          category_id: selectedCategory,
          url,
          title: file.name,
        });

        if (insertError) throw insertError;
      }
      
      handleCancel();
      fetchImages();
      setAlertMessage(`Successfully uploaded ${files.length} image(s)`);
      setShowAlert(true);
    } catch (error: any) {
      setAlertMessage(error.message);
      setShowAlert(true);
    }
    
    setUploading(false);
  };

  const deleteImage = async (id: string) => {
    setConfirmMessage('Delete this image?');
    setConfirmAction(() => async () => {
      const { error } = await supabase.from('images').delete().eq('id', id);
      if (!error) fetchImages();
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      setAlertMessage('Enter category name');
      setShowAlert(true);
      return;
    }
    
    setAddingCategory(true);
    const { error } = await supabase.from('categories').insert({
      name: newCategoryName.trim()
    });
    
    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
    } else {
      setNewCategoryName('');
      fetchCategories();
    }
    setAddingCategory(false);
  };

  const deleteCategory = async (id: string) => {
    setConfirmMessage('Delete this category? All images in this category will also be deleted.');
    setConfirmAction(() => async () => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) {
        fetchCategories();
        if (selectedCategory === id) setSelectedCategory('');
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Logout error (expected for expired sessions):', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 text-sm sm:text-base rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-600">Manage your project images and categories</p>
        </div>

        {/* Category Management */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Categories</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Category
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                />
                <button
                  onClick={addCategory}
                  disabled={!newCategoryName.trim() || addingCategory}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {addingCategory ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existing Categories ({categories.length})
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                {categories.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No categories found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {categories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                        <span className="text-gray-900">{cat.name}</span>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload New Image</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              {/* Category Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Choose a category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent"
                />
                {files.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">{files.length} file(s) selected</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleUpload}
                  disabled={files.length === 0 || !selectedCategory || uploading}
                  className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? 'Uploading...' : `Upload ${files.length > 0 ? files.length : ''} Image${files.length !== 1 ? 's' : ''}`}
                </button>
                {files.length > 0 && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 overflow-y-auto">
                {previewUrls.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {previewUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-gray-500">
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2">No images selected</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        {selectedCategory && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Images ({images.length})
            </h2>
            
            {images.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No images found for this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map(img => (
                  <div key={img.id} className="group relative bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-900 truncate">{img.title}</p>
                    </div>
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Confirm Action</h3>
              <p className="text-gray-300 mb-6">{confirmMessage}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {showAlert && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Notice</h3>
              <p className="text-gray-300 mb-6">{alertMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAlert(false)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Confirm Logout</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
