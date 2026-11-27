
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  Plus,
  ArrowUpRight,
} from 'lucide-react'

import DashboardLayout from '../layouts/DashboardLayout'
import api from '../services/api'

function Dashboard() {
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get('dashboard/')
        setDashboard(response.data)
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          navigate('/login', { replace: true })
        } else {
          setError('Could not load dashboard data.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [navigate])

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-500">Loading dashboard...</p>
      </DashboardLayout>
    )
  }

  if (error || !dashboard) {
    return (
      <DashboardLayout>
        <p className="text-red-600">{error || 'Dashboard data unavailable.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Try again
        </button>
      </DashboardLayout>
    )
  }

  const summary = dashboard.summary
  const priorities = dashboard.priority_summary

  const stats = [
    {
      title: 'Total Tasks',
      value: summary.total_tasks,
      icon: ListTodo,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Completed',
      value: summary.completed_tasks,
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'In Progress',
      value: summary.in_progress_tasks,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Overdue',
      value: summary.overdue_tasks,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
    },
  ]

  const completionRate = summary.total_tasks
    ? Math.round((summary.completed_tasks / summary.total_tasks) * 100)
    : 0

  const recentTasks = dashboard.recent_tasks || []

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Here's what's happening with your tasks today.
            </p>
          </div>

          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            <Plus size={20} />
            View My Tasks
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.title}
                className="bg-white p-6 rounded-xl border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={23} />
                  </div>
                  <ArrowUpRight className="text-slate-400" />
                </div>

                <p className="text-sm text-slate-500 mt-5">
                  {stat.title}
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-1">
                  {stat.value}
                </h2>
              </div>
            )
          })}
        </div>

        {/* Additional summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">Pending Tasks</p>
            <h3 className="text-2xl font-bold mt-2">
              {summary.pending_tasks}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">Due Today</p>
            <h3 className="text-2xl font-bold mt-2">
              {summary.due_today_tasks}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">Completion Rate</p>
            <h3 className="text-2xl font-bold mt-2">
              {completionRate}%
            </h3>
          </div>
        </div>

        {/* Recent tasks and progress */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between">
              <div>
                <h2 className="font-semibold text-lg text-slate-800">
                  Recent Tasks
                </h2>
                <p className="text-sm text-slate-500">
                  Your latest activities
                </p>
              </div>

              <button
                onClick={() => navigate('/tasks')}
                className="text-blue-600 text-sm font-medium"
              >
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4">Task</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentTasks.length > 0 ? (
                    recentTasks.map((task) => (
                      <tr key={task.id} className="border-t border-slate-100">
                        <td className="px-6 py-5">
                          <p className="font-medium text-slate-800">
                            {task.title}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                            {task.priority}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                        You haven't created any tasks yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-lg text-slate-800">
              Task Progress
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Overall completion rate
            </p>

            <div className="flex justify-center my-10">
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(#2563eb ${completionRate}%, #e2e8f0 ${completionRate}% 100%)`,
                }}
              >
                <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                  <h3 className="text-3xl font-bold text-slate-800">
                    {completionRate}%
                  </h3>
                  <p className="text-xs text-slate-500">Completed</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {[
                { name: 'Low Priority', value: priorities.low },
                { name: 'Medium Priority', value: priorities.medium },
                { name: 'High Priority', value: priorities.high },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{
                        width: `${summary.total_tasks
                          ? (item.value / summary.total_tasks) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
