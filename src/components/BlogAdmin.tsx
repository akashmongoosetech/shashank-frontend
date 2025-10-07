import { useState, useEffect } from 'react';
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
      // Basic client validation to mirror backend
      if (!payload.title || payload.title.trim().length < 3) {
        setError('Title must be at least 3 characters');
        return setLoading(false);
      }
      if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
        setError('Slug must use lowercase letters, numbers, and hyphens only');
        return setLoading(false);
      }
      if (!payload.excerpt || payload.excerpt.trim().length < 10) {
        setError('Excerpt must be at least 10 characters');
        return setLoading(false);
      }
      if (!payload.content || payload.content.trim().length < 10) {
        setError('Content must be at least 10 characters');
        return setLoading(false);
      }

      let res;
      if (editingBlog) {
        res = await updateBlog(editingBlog._id, payload);
      } else {
        res = await createBlog(payload);
      }

      if (res.success) {
        setMessage(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
        resetForm();
        fetchBlogs(); // Refresh the list
      } else {
        setError(res.message || `Failed to ${editingBlog ? 'update' : 'create'} blog`);
        const errs = (res as any)?.errors as Array<{ msg?: string; path?: string }> | undefined;
        setFieldErrors(errs || []);
      }
    } catch (err: any) {
      setError(err?.payload?.message || err?.message || `Failed to ${editingBlog ? 'update' : 'create'} blog`);
      const errs = err?.payload?.errors as Array<{ msg?: string; path?: string }> | undefined;
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
    } catch (err: any) {
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
    } catch (err: any) {
      setError(err?.payload?.message || err?.message || 'Failed to delete blog');
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
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Blog Admin</h1>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 font-medium ${activeTab === 'add' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          {editingBlog ? 'Edit Blog' : 'Add Blog'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-medium ${activeTab === 'list' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          List Blogs
        </button>
      </div>

      {message && <div className="mb-4 p-3 rounded bg-green-50 text-green-700">{message}</div>}
      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700">{error}</div>}
      {fieldErrors.length > 0 && (
        <ul className="mb-4 p-3 rounded bg-red-50 text-red-700 list-disc list-inside">
          {fieldErrors.map((e, i) => (
            <li key={i}>{e.path ? `${e.path}: ` : ''}{e.msg || 'Invalid value'}</li>
          ))}
        </ul>
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="my-blog-slug" required />
          <p className="text-xs text-gray-500 mt-1"><b>Lowercase letters, numbers and hyphens only.</b></p>
        </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} className="w-full border rounded px-3 py-2 h-24" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content (HTML)</label>
          <textarea name="content" value={form.content} onChange={handleChange} className="w-full border rounded px-3 py-2 h-56" required />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Sections</label>
            <button type="button" onClick={addSection} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Section</button>
          </div>
          {sections.length === 0 && (
            <p className="text-sm text-gray-500">Add section blocks with title, content and image URL. Optional; you can also rely on the main HTML content.</p>
          )}
          <div className="space-y-4">
            {sections.map((s, idx) => (
              <div key={idx} className="p-4 border rounded-md bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Section {idx + 1}</h4>
                  <button type="button" onClick={() => removeSection(idx)} className="text-red-600 text-sm">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (optional)</label>
                    <input value={s.title || ''} onChange={(e) => updateSection(idx, 'title', e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                    <input value={s.image || ''} onChange={(e) => updateSection(idx, 'image', e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea value={s.content} onChange={(e) => updateSection(idx, 'content', e.target.value)} className="w-full border rounded px-3 py-2 h-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input name="author" value={form.author} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Read Time</label>
            <input name="readTime" value={form.readTime} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="5 min read" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Add a tag" />
            <button type="button" onClick={addTag} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(form.tags || []).map((t, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                {t}
                <button type="button" onClick={() => removeTag(i)} className="ml-2 text-red-600">×</button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Description</label>
          <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} className="w-full border rounded px-3 py-2 h-20" placeholder="Brief description for SEO (max 160 characters)" />
          <p className="text-xs text-gray-500 mt-1">{(form.metaDescription || '').length}/160 characters</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SEO Keywords</label>
          <div className="flex gap-2">
            <input value={seoKeywordInput} onChange={(e) => setSeoKeywordInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Add an SEO keyword" />
            <button type="button" onClick={addSeoKeyword} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(form.seoKeywords || []).map((k, i) => (
              <span key={i} className="px-2 py-1 bg-green-100 rounded text-sm">
                {k}
                <button type="button" onClick={() => removeSeoKeyword(i)} className="ml-2 text-red-600">×</button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Tags</label>
          <div className="flex gap-2">
            <input value={metaTagInput} onChange={(e) => setMetaTagInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Add a custom meta tag (e.g., name=robots,content=noindex)" />
            <button type="button" onClick={addMetaTag} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(form.metaTags || []).map((t, i) => (
              <span key={i} className="px-2 py-1 bg-purple-100 rounded text-sm">
                {t}
                <button type="button" onClick={() => removeMetaTag(i)} className="ml-2 text-red-600">×</button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))} className="w-full border rounded px-3 py-2">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded disabled:opacity-50">
            {loading ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
          </button>
          {editingBlog && (
            <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-600 text-white rounded">
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      )}

      {activeTab === 'list' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Blog List</h2>
            <button onClick={fetchBlogs} disabled={blogsLoading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {blogsLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          {blogsLoading ? (
            <div className="text-center py-8">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No blogs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left border-b">Title</th>
                    <th className="px-4 py-2 text-left border-b">Status</th>
                    <th className="px-4 py-2 text-left border-b">Created At</th>
                    <th className="px-4 py-2 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{blog.title}</td>
                      <td className="px-4 py-2 border-b">
                        <span className={`px-2 py-1 rounded text-sm ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b">{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleteLoading === blog._id}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-50"
                        >
                          {deleteLoading === blog._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


