
import {
  LayoutDashboard,
  CheckSquare,
  Folder,
  CalendarDays,
  Settings,
  LogOut,
  ListTodo,
} from 'lucide-react'

import { NavLink, useNavigate } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Categories', path: '/categories', icon: Folder },
  { name: 'Calendar', path: '/calendar', icon: CalendarDays },
]

function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    navigate('/login', { replace: true })
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ListTodo size={24} />
          </div>
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1">
        <p className="text-xs uppercase text-slate-400 mb-4">
          Workspace
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-slate-700 space-y-2">

        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg"
        >
          <Settings size={20} />
          Settings
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>
    </aside>
  )
}

export default Sidebar
