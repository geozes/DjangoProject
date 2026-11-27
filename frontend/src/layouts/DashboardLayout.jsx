
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Fixed sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 h-screen w-64 z-40">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="min-h-screen md:ml-64">
        <Navbar />
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
