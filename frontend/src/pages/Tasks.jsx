
import { useEffect, useState } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import api from '../services/api'

function Tasks() {
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    category: '',
  })

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get('tasks/')
      setTasks(response.data)
      setError('')
    } catch (err) {
      setError('Could not load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

 useEffect(() => {
  const loadData = async () => {
    try {
      const [tasksResponse, categoriesResponse] = await Promise.all([
        api.get('tasks/'),
        api.get('categories/'),
      ])

      setTasks(tasksResponse.data)
      setCategories(categoriesResponse.data)
      setError('')
    } catch (err) {
      setError('Could not load tasks or categories.')
    } finally {
      setLoading(false)
    }
  }

  loadData()
}, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      setError('Please enter a task title.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await api.post('tasks/', {
  ...form,
  category: form.category || null,
  due_date: form.due_date || null,
  })

      setForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
        category: '',
      })

      await fetchTasks()
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Could not create task. Please check your details.'
      )
    } finally {
      setSaving(false)
    }
  }

  const updateTask = async (id, changes) => {
    try {
      await api.patch(`tasks/${id}/`, changes)
      await fetchTasks()
    } catch (err) {
      setError('Could not update task.')
    }
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await api.delete(`tasks/${id}/`)
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      )
    } catch (err) {
      setError('Could not delete task.')
    }
  }

  const priorityColor = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  }

  const statusColor = {
    pending: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div> 
            <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
            <p className="text-slate-500 mt-1">
              Create and manage your daily tasks.
            </p>
          </div>

          <button
            onClick={fetchTasks}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Create Task Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">
            Create New Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title"
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
                placeholder="Describe your task..."
                rows="3"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-3"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-3"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-3"
                />
              </div>
            </div>


          <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">
                 Category
                  </label>

                <select
                 name="category"
                 value={form.category}
                 onChange={handleChange}
                 className="w-full border border-slate-300 rounded-lg px-3 py-3"
                >
                <option value="">No Category</option>

                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                {category.name}
                </option>
                ))}
                </select>
                </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={18} />
              {saving ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              All Tasks ({tasks.length})
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-slate-500">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500">You don't have any tasks yet.</p>
                <p className="text-sm text-slate-400 mt-1">
                  Create your first task using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-slate-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold text-slate-800 ${
                        task.status === 'completed'
                          ? 'line-through text-slate-400'
                          : ''
                      }`}>
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-sm text-slate-500 mt-1">
                          {task.description}
                        </p>
                      )}

                      {task.due_date && (
                        <p className="text-xs text-slate-400 mt-2">
                          Due: {new Date(task.due_date).toLocaleString()}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${priorityColor[task.priority]}`}>
                          {task.priority}
                        </span>

                        {/* Category */}
                        {task.category && (
                          <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                            {categories.find(
                              (category) => category.id === task.category
                            )?.name || 'Category'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTask(task.id, { status: e.target.value })
                        }
                        className={`text-sm px-3 py-2 rounded-lg border-0 ${statusColor[task.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default Tasks
