
import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import api from '../services/api'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get('categories/')
      setCategories(response.data)
      setError('')
    } catch (err) {
      setError('Could not load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setForm({ name: '', description: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      setError('Please enter a category name.')
      return
    }

    try {
      setSaving(true)
      setError('')

      if (editingId) {
        await api.patch(`categories/${editingId}/`, form)
      } else {
        await api.post('categories/', form)
      }

      resetForm()
      await fetchCategories()
    } catch (err) {
      const data = err.response?.data
      setError(
        data?.name?.[0] ||
        data?.detail ||
        'Could not save category. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const startEditing = (category) => {
    setEditingId(category.id)
    setForm({
      name: category.name,
      description: category.description || '',
    })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      await api.delete(`categories/${id}/`)
      setCategories((current) =>
        current.filter((category) => category.id !== id)
      )

      if (editingId === id) {
        resetForm()
      }
    } catch (err) {
      setError('Could not delete category.')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Categories
          </h1>
          <p className="text-slate-500 mt-1">
            Organize your tasks into meaningful groups.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Category Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">
            {editingId ? 'Edit Category' : 'Create New Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Work, Personal, Studies"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe this category..."
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus size={18} />
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Category'
                    : 'Create Category'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 border border-slate-300 px-5 py-3 rounded-lg hover:bg-slate-50"
                >
                  <X size={18} />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              All Categories ({categories.length})
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-slate-500">Loading categories...</p>
            ) : categories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500">
                  You haven't created any categories yet.
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Create your first category using the form above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-800 text-lg">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-2">
                          {category.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit category"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete category"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-5">
                      Created: {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default Categories
