import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, RefreshCw, FileText, Eye, Tag, Calendar, User, Image as ImageIcon, Clock, Globe } from 'lucide-react';
import { createBlog, getBlogs, updateBlog, deleteBlog, type BlogFormData, type Blog } from '../services/apiService';

export default function BlogAdmin() {
  const [form, setForm] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    category: '',
    readTime: '',
    tags: [],
    status: 'published',
    metaDescription: '',
    seoKeywords: [],
    metaTags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [seoKeywordInput, setSeoKeywordInput] = useState('');
  const [metaTagInput, setMetaTagInput] = useState('');
  const [sections, setSections] = useState<Array<{ title?: string; content: string; image?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Array<{ msg?: string; path?: string }>>([]);

  // New state for tabs and list
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setForm((prev) => ({ ...prev, title: value, slug: prev.slug ? prev.slug : slugify(value) }));
      return;
    }
    if (name === 'slug') {
      setForm((prev) => ({ ...prev, slug: slugify(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    setForm((prev) => ({ ...prev, tags: [...(prev.tags || []), t] }));
    setTagInput('');
  };

  const removeTag = (idx: number) => {
    setForm((prev) => ({ ...prev, tags: (prev.tags || []).filter((_, i) => i !== idx) }));
  };

  const addSeoKeyword = () => {
    const k = seoKeywordInput.trim();
    if (!k) return;
    setForm((prev) => ({ ...prev, seoKeywords: [...(prev.seoKeywords || []), k] }));
    setSeoKeywordInput('');
  };

  const removeSeoKeyword = (idx: number) => {
    setForm((prev) => ({ ...prev, seoKeywords: (prev.seoKeywords || []).filter((_, i) => i !== idx) }));
  };

  const addMetaTag = () => {
    const t = metaTagInput.trim();
    if (!t) return;
    setForm((prev) => ({ ...prev, metaTags: [...(prev.metaTags || []), t] }));
    setMetaTagInput('');
  };

  const removeMetaTag = (idx: number) => {
    setForm((prev) => ({ ...prev, metaTags: (prev.metaTags || []).filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called');
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const payload: BlogFormData = {
        ...form,
        image: form.image || undefined,
        author: form.author || undefined,
        category: form.category || undefined,
        readTime: form.readTime || undefined,
        tags: form.tags && form.tags.length ? form.tags : undefined,
        sections: sections.length ? sections : undefined,
        metaDescription: form.metaDescription || undefined,
        seoKeywords: form.seoKeywords && form.seoKeywords.length ? form.seoKeywords : undefined,
        metaTags: form.metaTags && form.metaTags.length ? form.metaTags : undefined,
      };
      console.log('Payload constructed:', payload);

      // Basic client validation to mirror backend
      if (!payload.title || payload.title.trim().length < 3) {
        console.log('Validation failed: Title too short');
        setError('Title must be at least 3 characters');
        return setLoading(false);
      }
      if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
        console.log('Validation failed: Invalid slug');
        setError('Slug must use lowercase letters, numbers, and hyphens only');
        return setLoading(false);
      }
      if (!payload.excerpt || payload.excerpt.trim().length < 10) {
        console.log('Validation failed: Excerpt too short');
        setError('Excerpt must be at least 10 characters');
        return setLoading(false);
      }
      if (!payload.content || payload.content.trim().length < 10) {
        console.log('Validation failed: Content too short');
        setError('Content must be at least 10 characters');
        return setLoading(false);
      }
      console.log('Client validation passed');

      let res;
      if (editingBlog) {
        console.log('Calling updateBlog with ID:', editingBlog._id);
        res = await updateBlog(editingBlog._id, payload);
      } else {
        console.log('Calling createBlog');
        res = await createBlog(payload);
      }
      console.log('API response:', res);

      if (res.success) {
        console.log('Save successful');
        setMessage(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
        resetForm();
        fetchBlogs(); // Refresh the list
      } else {
        console.log('Save failed with response:', res);
        setError(res.message || `Failed to ${editingBlog ? 'update' : 'create'} blog`);
        const errs = (res as { errors?: Array<{ msg?: string; path?: string }> })?.errors;
        setFieldErrors(errs || []);
      }
    } catch (err: unknown) {
      const error = err as Error & { status?: number; payload?: { message?: string; errors?: Array<{ msg?: string; path?: string }> } };
      console.log('Exception caught:', error);
      console.log('Error details:', {
        message: error?.message,
        status: error?.status,
        payload: error?.payload
      });
      setError(error?.payload?.message || error?.message || `Failed to ${editingBlog ? 'update' : 'create'} blog`);
      const errs = error?.payload?.errors as Array<{ msg?: string; path?: string }> | undefined;
      setFieldErrors(errs || []);
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    setSections((prev) => [...prev, { title: '', content: '', image: '' }]);
  };

  const updateSection = (index: number, field: 'title' | 'content' | 'image', value: string) => {
    setSections((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch blogs for the list
  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await getBlogs({ limit: 100 }); // Fetch more blogs for admin
      if (res.success && res.data) {
        setBlogs(res.data.blogs);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setBlogsLoading(false);
    }
  };

  // Handle edit blog
  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image || '',
      author: blog.author || '',
      category: blog.category || '',
      readTime: blog.readTime || '',
      tags: blog.tags || [],
      status: blog.status,
      metaDescription: blog.metaDescription || '',
      seoKeywords: blog.seoKeywords || [],
      metaTags: blog.metaTags || [],
    });
    setSections(blog.sections || []);
    setActiveTab('add');
  };

  // Handle delete blog
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    setDeleteLoading(id);
    try {
      const res = await deleteBlog(id);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        setMessage('Blog deleted successfully');
      } else {
        setError(res.message || 'Failed to delete blog');
      }
    } catch (err: unknown) {
      const error = err as Error & { payload?: { message?: string } };
      setError(error?.payload?.message || error?.message || 'Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: '',
      author: '',
      category: '',
      readTime: '',
      tags: [],
      status: 'published',
      metaDescription: '',
      seoKeywords: [],
      metaTags: [],
    });
    setSections([]);
    setEditingBlog(null);
    setTagInput('');
    setSeoKeywordInput('');
    setMetaTagInput('');
  };

  // Load blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Blog Administration
          </h1>
          <p className="text-gray-600 text-lg">Manage your blog posts with ease</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-2 flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'add'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>{editingBlog ? 'Edit Blog' : 'Create Blog'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span>Manage Blogs</span>
            </button>
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {message && (
            <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="font-medium">{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-gradient-to-r from-red-400 to-red-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}
          {fieldErrors.length > 0 && (
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">!</span>
                </div>
                <span className="font-medium">Please fix the following errors:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 ml-11">
                {fieldErrors.map((e, i) => (
                  <li key={i} className="text-sm">{e.path ? `${e.path}: ` : ''}{e.msg || 'Invalid value'}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Blog Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    
                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <span>Title</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="Enter blog title..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Slug</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="my-awesome-blog-post"
                      required
                    />
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <span>🔗</span>
                      <span>Lowercase letters, numbers, and hyphens only</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none resize-none"
                    rows={3}
                    placeholder="Brief description of your blog post..."
                    required
                  />
                  <p className="text-xs text-gray-500">{(form.excerpt || '').length}/200 characters</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Content (HTML)</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none resize-none"
                    rows={8}
                    placeholder="Write your blog content here... (HTML supported)"
                    required
                  />
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Content Sections</h3>
                      <p className="text-sm text-gray-600">Add structured sections to your blog post</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addSection}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {sections.length === 0 && (
                  <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No sections added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Sections help organize your content with titles and images</p>
                  </div>
                )}

                <div className="space-y-6">
                  {sections.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <h4 className="font-bold text-gray-900">Section {idx + 1}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSection(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <span>Title</span>
                            <span className="text-gray-400">(optional)</span>
                          </label>
                          <input
                            value={s.title || ''}
                            onChange={(e) => updateSection(idx, 'title', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                            placeholder="Section title..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <ImageIcon className="w-4 h-4" />
                            <span>Image URL</span>
                            <span className="text-gray-400">(optional)</span>
                          </label>
                          <input
                            value={s.image || ''}
                            onChange={(e) => updateSection(idx, 'image', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Content</label>
                        <textarea
                          value={s.content}
                          onChange={(e) => updateSection(idx, 'content', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none resize-none"
                          rows={4}
                          placeholder="Section content..."
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Metadata */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Metadata & SEO</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Featured Image URL</span>
                    </label>
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="https://example.com/featured-image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Author</span>
                    </label>
                    <input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="Author name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Category</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="Blog category"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Read Time</span>
                    </label>
                    <input
                      name="readTime"
                      value={form.readTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="5 min read"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Tags</label>
                  <div className="flex gap-3">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                    >
                      Add Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(form.tags || []).map((t, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium">
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(i)}
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={form.metaDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none resize-none"
                    rows={3}
                    placeholder="Brief description for SEO (max 160 characters)"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">{(form.metaDescription || '').length}/160 characters</p>
                    {(form.metaDescription || '').length > 160 && (
                      <p className="text-xs text-red-500">Description is too long</p>
                    )}
                  </div>
                </div>

                {/* SEO Keywords */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">SEO Keywords</label>
                  <div className="flex gap-3">
                    <input
                      value={seoKeywordInput}
                      onChange={(e) => setSeoKeywordInput(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="Add an SEO keyword..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSeoKeyword())}
                    />
                    <button
                      type="button"
                      onClick={addSeoKeyword}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                    >
                      Add Keyword
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(form.seoKeywords || []).map((k, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-800 rounded-full text-sm font-medium">
                        {k}
                        <button
                          type="button"
                          onClick={() => removeSeoKeyword(i)}
                          className="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta Tags */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Custom Meta Tags</label>
                  <div className="flex gap-3">
                    <input
                      value={metaTagInput}
                      onChange={(e) => setMetaTagInput(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="name=robots,content=noindex"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMetaTag())}
                    />
                    <button
                      type="button"
                      onClick={addMetaTag}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                    >
                      Add Meta Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(form.metaTags || []).map((t, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium">
                        {t}
                        <button
                          type="button"
                          onClick={() => removeMetaTag(i)}
                          className="ml-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Publication Status</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={form.status === 'published'}
                        onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={form.status === 'draft'}
                        onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Draft</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-bold text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      <span>{editingBlog ? 'Update Blog' : 'Create Blog'}</span>
                    </>
                  )}
                </button>
                {editingBlog && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {activeTab === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Blog Management</h2>
                    <p className="text-blue-100">Manage all your blog posts</p>
                  </div>
                </div>
                <button
                  onClick={fetchBlogs}
                  disabled={blogsLoading}
                  className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-2xl hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 font-semibold disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${blogsLoading ? 'animate-spin' : ''}`} />
                  <span>{blogsLoading ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {blogsLoading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading blogs...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs found</h3>
                  <p className="text-gray-600 mb-6">Start creating your first blog post!</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create First Blog</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogs.map((blog, index) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                              {blog.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              blog.status === 'published'
                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                                : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                            }`}>
                              {blog.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-gray-600 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}</span>
                            </div>
                            {blog.author && (
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{blog.author}</span>
                              </div>
                            )}
                            {blog.category && (
                              <div className="flex items-center space-x-1">
                                <Tag className="w-4 h-4" />
                                <span>{blog.category}</span>
                              </div>
                            )}
                          </div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {blog.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                  +{blog.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center space-x-2"
                          >
                            <Edit className="w-5 h-5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            disabled={deleteLoading === blog._id}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {deleteLoading === blog._id ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Deleting...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-5 h-5" />
                                <span>Delete</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
