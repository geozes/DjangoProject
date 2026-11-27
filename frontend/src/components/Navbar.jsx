import { Bell, Search, UserCircle } from 'lucide-react'

function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          My Workspace
        </h2>
        <p className="text-sm text-slate-500">
          Manage your daily activities
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center bg-slate-100 px-3 py-2 rounded-lg">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent outline-none px-2 text-sm w-40"
          />
        </div>

        <button className="relative text-slate-600">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle size={32} className="text-slate-500" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800">
              My Account
            </p>
            <p className="text-xs text-slate-500">User</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar