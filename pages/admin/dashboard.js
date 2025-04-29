import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiUsers, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLogOut, FiX, FiFilter } from 'react-icons/fi';

// pages/admin/dashboard.js
import AdminRoute from '../../components/AdminRoute';

function AdminDashboardContent() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          const error = await res.json();
          setError(error.message || 'Failed to load users');
          if (res.status === 403) {
            router.push('/admin/login');
          }
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [router]);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle logout
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: ''
    });
    setShowEditModal(true);
  };

  // Handle update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (userForm.password && userForm.password !== userForm.confirmPassword) {
      setError('Password and confirmation do not match');
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          password: userForm.password || undefined
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
        setShowEditModal(false);
        setError('');
      } else {
        const error = await res.json();
        setError(error.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
      } else {
        const error = await res.json();
        setError(error.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Modern Header with Glassmorphism Effect */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FiUsers className="h-5 w-5 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-blue-800">User Management</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <FiLogOut className="text-blue-600" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <div className="mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-blue-400" />
            </div>
            <input
              type="text"
              className="pl-10 block w-full rounded-xl border-0 bg-white py-2.5 shadow-sm ring-1 ring-inset ring-blue-200 placeholder:text-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-blue-800 sm:text-sm sm:leading-6"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 ring-1 ring-red-100 flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Users Table - Card Layout for Mobile */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-blue-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-blue-100">
              <thead className="bg-blue-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-blue-900">{user.name}</div>
                            <div className="text-xs text-blue-400">Last active: 2h ago</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-800">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <FiUsers className="mx-auto h-12 w-12 text-blue-200" />
                      <h3 className="mt-2 text-sm font-medium text-blue-800">No users found</h3>
                      <p className="mt-1 text-sm text-blue-400">Try adjusting your search to find what you're looking for.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 p-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className="p-4 rounded-xl border border-blue-100 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-900">{user.name}</div>
                        <div className="text-xs text-blue-400">{user.email}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center px-3 py-1.5 rounded-lg hover:bg-blue-50"
                    >
                      <FiEdit2 className="mr-1.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      <FiTrash2 className="mr-1.5" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FiUsers className="mx-auto h-12 w-12 text-blue-200" />
                <h3 className="mt-2 text-sm font-medium text-blue-800">No users found</h3>
                <p className="mt-1 text-sm text-blue-400">Try adjusting your search to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">Edit User</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-blue-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-0 bg-blue-50 py-2.5 px-4 shadow-sm ring-1 ring-inset ring-blue-200 placeholder:text-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-blue-800"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border-0 bg-blue-50 py-2.5 px-4 shadow-sm ring-1 ring-inset ring-blue-200 placeholder:text-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-blue-800"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4 border-t border-blue-100">
                  <h3 className="text-sm font-medium text-blue-700 mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border-0 bg-blue-50 py-2.5 px-4 shadow-sm ring-1 ring-inset ring-blue-200 placeholder:text-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-blue-800"
                        placeholder="Leave blank to keep current"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border-0 bg-blue-50 py-2.5 px-4 shadow-sm ring-1 ring-inset ring-blue-200 placeholder:text-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-blue-800"
                        placeholder="Leave blank to keep current"
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}