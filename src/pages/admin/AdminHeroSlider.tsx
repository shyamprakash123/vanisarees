import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Video, X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/Admin/AdminLayout';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/UI/ImageUpload';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  type: 'image' | 'video';
  url: string;
  button_text: string;
  button_link: string;
  active: boolean;
  order_index: number;
  created_at: string;
}

export default function AdminHeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'image' as 'image' | 'video',
    url: '',
    button_text: '',
    button_link: '',
    active: true,
    order_index: 0
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      // Create table if it doesn't exist
      await createHeroSlidesTable();
    } finally {
      setLoading(false);
    }
  };

  const createHeroSlidesTable = async () => {
    try {
      const { error } = await supabase.rpc('create_hero_slides_table');
      if (error) {
        // Table might already exist, let's try to fetch again
        console.log('Table creation failed, might already exist');
      }
    } catch (error) {
      console.error('Error creating hero slides table:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'order_index') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      type: 'image',
      url: '',
      button_text: '',
      button_link: '',
      active: true,
      order_index: slides.length
    });
    setShowAddModal(false);
    setEditingSlide(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const slideData = {
        title: formData.title,
        subtitle: formData.subtitle,
        type: formData.type,
        url: formData.url,
        button_text: formData.button_text,
        button_link: formData.button_link,
        active: formData.active,
        order_index: formData.order_index
      };

      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update(slideData)
          .eq('id', editingSlide.id);

        if (error) throw error;
        toast.success('Slide updated successfully');
      } else {
        const { error } = await supabase
          .from('hero_slides')
          .insert(slideData);

        if (error) throw error;
        toast.success('Slide created successfully');
      }

      fetchSlides();
      resetForm();
    } catch (error: any) {
      console.error('Error saving slide:', error);
      toast.error(error.message || 'Failed to save slide');
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      type: slide.type,
      url: slide.url,
      button_text: slide.button_text,
      button_link: slide.button_link,
      active: slide.active,
      order_index: slide.order_index
    });
    setShowAddModal(true);
  };

  const deleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Slide deleted successfully');
      fetchSlides();
    } catch (error: any) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const toggleSlideStatus = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ active: !active })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Slide ${!active ? 'activated' : 'deactivated'} successfully`);
      fetchSlides();
    } catch (error: any) {
      console.error('Error updating slide status:', error);
      toast.error('Failed to update slide status');
    }
  };

  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({
        ...prev,
        url: urls[0] // Use the first uploaded image
      }));
      toast.success('Combo image uploaded successfully!');
    }
  };

  const handleImageRemove = (url: string) => {
    setFormData(prev => ({
      ...prev,
      url: ''
    }));
  };

  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading hero slides...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Hero Slider</h1>
            <p className="text-gray-600">Create and manage homepage hero slider content</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Slide</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search slides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Slides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlides.map((slide) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                {slide.type === 'image' ? (
                  <img
                    src={slide.url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <Video className="w-12 h-12 text-white" />
                    <span className="text-white ml-2">Video Slide</span>
                  </div>
                )}

                <div className="absolute top-2 left-2 flex items-center space-x-2">
                  {slide.type === 'image' ? (
                    <ImageIcon className="w-4 h-4 text-white bg-black/50 p-1 rounded" />
                  ) : (
                    <Video className="w-4 h-4 text-white bg-black/50 p-1 rounded" />
                  )}
                  <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                    Order: {slide.order_index}
                  </span>
                </div>

                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${slide.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {slide.active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{slide.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{slide.subtitle}</p>
                <p className="text-xs text-primary-600 mb-3">{slide.button_text}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-300"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleSlideStatus(slide.id, slide.active)}
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors duration-300 ${slide.active
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                  >
                    {slide.active ? <EyeOff className="w-4 h-4 inline mr-1" /> : <Eye className="w-4 h-4 inline mr-1" />}
                    {slide.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSlides.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No slides found.</p>
          </div>
        )}

        {/* Add/Edit Slide Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle *
                    </label>
                    <textarea
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.type === 'image' ? 'Image URL' : 'Video URL'} *
                    </label>
                    {formData.type === 'image' ?
                      <ImageUpload
                        onUpload={handleImageUpload}
                        onRemove={handleImageRemove}
                        existingImages={formData.url ? [formData.url] : []}
                        maxImages={1}
                        folder="hero"
                        multiple={false}
                      /> :
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={formData.type === 'image' ? 'https://example.com/image.jpg' : 'https://youtube.com/embed/...'}
                        required
                      />
                    }

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text *
                      </label>
                      <input
                        type="text"
                        name="button_text"
                        value={formData.button_text}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link *
                      </label>
                      <input
                        type="text"
                        name="button_link"
                        value={formData.button_link}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="/products"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Index
                    </label>
                    <input
                      type="number"
                      name="order_index"
                      value={formData.order_index}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active (show in slider)
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
                    >
                      {editingSlide ? 'Update Slide' : 'Create Slide'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}