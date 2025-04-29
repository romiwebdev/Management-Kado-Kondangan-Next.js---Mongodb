// pages/dashboard.js
import { useState, useEffect } from 'react';
import { parse } from 'cookie';
import ProtectedRoute from '../components/ProtectedRoute';
import {
  FiUser, FiMapPin, FiUsers, FiGift, FiEdit2, FiTrash2,
  FiX, FiSave, FiTag, FiFileText, FiCalendar, FiCheck,
  FiInfo, FiInbox, FiUserPlus, FiHome, FiPieChart,
  FiHeart, FiLogOut, FiChevronLeft, FiChevronRight,
  FiSearch, FiFilter, FiChevronDown, FiArrowUpCircle,
  FiArrowDownCircle, FiExternalLink, FiTrendingUp
} from 'react-icons/fi';

function DashboardContent() {
  const [contacts, setContacts] = useState([]);
  const [kados, setKados] = useState([]);
  const [statistics, setStatistics] = useState({ totalContacts: 0, totalKado: 0, selesaiContacts: 0 });
  const [tab, setTab] = useState('home'); // home / kategori / statistik
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showKadoModal, setShowKadoModal] = useState(false);
  const [showContactDetailModal, setShowContactDetailModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', address: '', relationship: '' });
  const [kadoForm, setKadoForm] = useState({ contact_id: '', type: '', description: '', date: '' });
  const [editContactId, setEditContactId] = useState(null);
  const [editKadoId, setEditKadoId] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // Load Kontak, Kado, dan Statistik
  useEffect(() => {
    loadContacts();
    loadKados();
    loadStatistics();
    if (showContactDetailModal && selectedContact) {
      // Refresh kado setiap kali modal detail dibuka
      loadKados();
    }
  }, [showContactDetailModal, selectedContact]);

  // Load Kontak
  // Load Kontak dengan status selesai
  async function loadContacts() {
    try {
      const res = await fetch('/api/contacts');
      if (!res.ok) throw new Error('Gagal memuat kontak');

      const contacts = await res.json();

      // Ambil status selesai untuk semua kontak sekaligus
      const selesaiRes = await fetch('/api/selesai/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_ids: contacts.map(c => c._id)
        }),
      });

      const selesaiStatuses = await selesaiRes.json();

      // Gabungkan data
      const contactsWithStatus = contacts.map(contact => ({
        ...contact,
        is_selesai: selesaiStatuses.find(s => s.contact_id === contact._id)?.is_selesai || false
      }));

      setContacts(contactsWithStatus);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  // Load Kado
  async function loadKados() {
    try {
      const res = await fetch('/api/kado', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Gagal memuat data kado');
      const data = await res.json();
      setKados(data);
    } catch (error) {
      console.error('Error loading kados:', error);
    }
  }

  // Load Statistik
  async function loadStatistics() {
    const res = await fetch('/api/statistik');
    const data = await res.json();
    setStatistics(data);
  }

  // Pencarian Kontak
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAndGroupedContacts = filteredContacts.filter(contact =>
    filterCategory === '' || contact.relationship === filterCategory || contact.address === filterCategory
  );

  // Fungsi Set Kontak 'Selesai'
  async function handleSetSelesai(contactId, isSelesai) {
    try {
      const res = await fetch(`/api/selesai/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_selesai: isSelesai }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui status selesai');
      }

      const updatedStatus = await res.json();

      // Update local state
      setContacts(contacts.map(contact =>
        contact._id === contactId ? { ...contact, is_selesai: isSelesai } : contact
      ));

      if (selectedContact?._id === contactId) {
        setSelectedContact({ ...selectedContact, is_selesai: isSelesai });
      }

      // Refresh statistics
      await loadStatistics();

    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memperbarui status: ' + error.message);
    }
  }

  // Fungsi Tambah/Edit Kontak
  async function handleSubmitContact(e) {
    e.preventDefault();
    const url = editContactId ? `/api/contacts/${editContactId}` : '/api/contacts';
    const method = editContactId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm),
    });

    if (res.ok) {
      const updatedContact = await res.json();
      if (editContactId) {
        setContacts(contacts.map(contact =>
          contact._id === editContactId ? updatedContact : contact
        ));
        if (selectedContact?._id === editContactId) {
          setSelectedContact(updatedContact);
        }
      } else {
        setContacts([...contacts, updatedContact]);
      }
      setContactForm({ name: '', address: '', relationship: '' });
      setEditContactId(null);
    }
  }

  // Fungsi Tambah/Edit Kado
  async function handleSubmitKado(e) {
    e.preventDefault();
    const url = editKadoId ? `/api/kado/${editKadoId}` : '/api/kado';
    const method = editKadoId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...kadoForm,
          date: new Date(kadoForm.date).toISOString() // Pastikan format date benar
        }),
      });

      if (!res.ok) throw new Error('Gagal menyimpan kado');

      const result = await res.json();

      // Update state secara manual
      if (editKadoId) {
        setKados(kados.map(k => k._id === editKadoId ? result : k));
      } else {
        setKados([...kados, result]);
      }

      // Reset form dan tutup modal
      setKadoForm({ contact_id: '', type: '', description: '', date: '' });
      setEditKadoId(null);
      setShowKadoModal(false);

      // Jika sedang melihat detail kontak, update juga selectedContact
      if (selectedContact) {
        setSelectedContact({
          ...selectedContact,
          kados: [...(selectedContact.kados || []), result]
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menyimpan kado: ' + error.message);
    }
  }

  // Di dalam pages/dashboard.js
  async function handleDeleteContact(id) {
    if (!confirm('Yakin ingin menghapus kontak ini? Semua kado dan status terkait juga akan dihapus.')) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Gagal menghapus kontak');
      }

      // Update state lokal
      setContacts(contacts.filter(contact => contact._id !== id));
      setKados(kados.filter(kado => kado.contact_id !== id));

      // Tutup modal jika terbuka
      setShowContactDetailModal(false);

      // Refresh statistik
      await loadStatistics();

    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menghapus kontak: ' + error.message);
    }
  }

  // Fungsi Hapus Kado
  async function handleDeleteKado(id) {
    if (confirm('Yakin ingin menghapus kado ini?')) {
      await fetch(`/api/kado/${id}`, { method: 'DELETE' });
      setKados(kados.filter(kado => kado._id !== id));
    }
  }

  // Fungsi untuk membuka modal detail kontak
  function openContactDetail(contact) {
    setSelectedContact(contact);
    setShowContactDetailModal(true);
  }

  // Group contacts by address (desa)
  const contactsByAddress = {};
  filteredContacts.forEach(contact => {
    const address = contact.address.split(',')[0].trim(); // Get first part of address (desa)
    if (!contactsByAddress[address]) {
      contactsByAddress[address] = [];
    }
    contactsByAddress[address].push(contact);
  });

  // Group contacts by relationship
  const contactsByRelationship = {};
  filteredContacts.forEach(contact => {
    const relationship = contact.relationship;
    if (!contactsByRelationship[relationship]) {
      contactsByRelationship[relationship] = [];
    }
    contactsByRelationship[relationship].push(contact);
  });

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }


  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndGroupedContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndGroupedContacts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // fitur search kontak pada tambah kado
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  //fitur dropdown pada tab kategori
  const ITEMS_PER_PAGE = 6;

  const [expandedAddresses, setExpandedAddresses] = useState({});
  const [expandedRelationships, setExpandedRelationships] = useState({});
  const [addressCurrentPage, setAddressCurrentPage] = useState({});
  const [relationshipCurrentPage, setRelationshipCurrentPage] = useState({});

  // Add these functions
  const toggleAddressExpansion = (address) => {
    setExpandedAddresses(prev => ({
      ...prev,
      [address]: !prev[address]
    }));

    // Initialize page if not set
    if (!addressCurrentPage[address]) {
      setAddressCurrentPage(prev => ({
        ...prev,
        [address]: 1
      }));
    }
  };

  const toggleRelationshipExpansion = (relationship) => {
    setExpandedRelationships(prev => ({
      ...prev,
      [relationship]: !prev[relationship]
    }));

    // Initialize page if not set
    if (!relationshipCurrentPage[relationship]) {
      setRelationshipCurrentPage(prev => ({
        ...prev,
        [relationship]: 1
      }));
    }
  };

  const updateAddressPage = (address, page) => {
    setAddressCurrentPage(prev => ({
      ...prev,
      [address]: page
    }));
  };

  const updateRelationshipPage = (relationship, page) => {
    setRelationshipCurrentPage(prev => ({
      ...prev,
      [relationship]: page
    }));
  };


  // EDIT PROFILE
  // Di bagian state
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Fungsi baru
  const loadUserProfile = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.user);
        setProfileForm({
          name: data.user.name,
          email: data.user.email,
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validasi password jika diisi
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      alert('Password dan konfirmasi password tidak sama');
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          password: profileForm.password || undefined
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUserProfile(updatedUser);
        setShowProfileModal(false);
        alert('Profil berhasil diperbarui');
      } else {
        const error = await res.json();
        alert(error.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat memperbarui profil');
    }
  };

  const handleDeleteProfile = async () => {
    if (deleteConfirmation !== 'HAPUS') {
      alert('Silakan ketik "HAPUS" untuk mengkonfirmasi');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus akun? Semua data akan dihilangkan secara permanen.')) {
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE',
      });

      if (res.ok) {
        // Logout setelah penghapusan
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login';
      } else {
        const error = await res.json();
        alert(error.message || 'Gagal menghapus profil');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Terjadi kesalahan saat menghapus profil');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo/Title with modern effect */}
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white flex items-center">
            <FiGift className="mr-2 text-white" /> Gift Tracker
          </h1>

          {/* Button Group */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Profile Button */}
            <button
              onClick={() => {
                loadUserProfile();
                setShowProfileModal(true);
              }}
              className="flex items-center gap-1 md:gap-2 text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-300 hover:shadow-md"
            >
              <FiUser className="text-lg md:text-xl" />
              <span className="hidden sm:inline">Profil</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 md:gap-2 bg-white/90 text-blue-600 px-3 py-2 rounded-lg hover:bg-white transition-all duration-300 hover:shadow-md font-medium"
            >
              <FiLogOut className="text-lg md:text-xl" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="flex mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-blue-50">
          <button
            onClick={() => { setTab('home'); setCurrentPage(1); }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-3 md:px-6 md:py-4 transition-all duration-200 ${tab === 'home'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-500 hover:bg-blue-50/50 hover:text-blue-500'
              }`}
          >
            <FiHome className="text-lg md:text-xl" />
            <span className="text-xs md:text-sm">Home</span>
            {tab === 'home' && (
              <div className="w-full h-1 bg-blue-600 rounded-full mt-1"></div>
            )}
          </button>

          <button
            onClick={() => { setTab('kategori'); setCurrentPage(1); }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-3 md:px-6 md:py-4 transition-all duration-200 ${tab === 'kategori'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-500 hover:bg-blue-50/50 hover:text-blue-500'
              }`}
          >
            <FiUsers className="text-lg md:text-xl" />
            <span className="text-xs md:text-sm">Kategori</span>
            {tab === 'kategori' && (
              <div className="w-full h-1 bg-blue-600 rounded-full mt-1"></div>
            )}
          </button>

          <button
            onClick={() => setTab('statistik')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-3 md:px-6 md:py-4 transition-all duration-200 ${tab === 'statistik'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-500 hover:bg-blue-50/50 hover:text-blue-500'
              }`}
          >
            <FiPieChart className="text-lg md:text-xl" />
            <span className="text-xs md:text-sm">Statistik</span>
            {tab === 'statistik' && (
              <div className="w-full h-1 bg-blue-600 rounded-full mt-1"></div>
            )}
          </button>
        </div>

        {/* Home Tab */}
        {tab === 'home' && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-50 overflow-hidden">
            {/* Search and Action Bar */}
            <div className="p-4 border-b border-blue-100 flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-blue-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base transition-all"
                  placeholder="Cari Kontak..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
                >
                  <FiUserPlus className="text-lg" />
                  <span className="text-sm md:text-base">Tambah Kontak</span>
                </button>
                <button
                  onClick={() => setShowKadoModal(true)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white px-4 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all shadow-sm hover:shadow-md"
                >
                  <FiGift className="text-lg" />
                  <span className="text-sm md:text-base">Tambah Kado</span>
                </button>
              </div>
            </div>

            {/* Contacts List */}
            <div className="divide-y divide-blue-100">
              {currentItems.length > 0 ? (
                currentItems.map(contact => (
                  <div key={contact._id} className="p-4 hover:bg-blue-50/30 transition-colors duration-200 group">
                    <div className="flex justify-between items-center">
                      <div
                        onClick={() => openContactDetail(contact)}
                        className="cursor-pointer flex-1"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold group-hover:bg-blue-200 transition-colors">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{contact.name}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1.5">
                              <FiMapPin className="text-blue-400" size={12} />
                              {contact.address} • {contact.relationship}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {contact.is_selesai && (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            <FiCheck size={12} /> Selesai
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setEditContactId(contact._id);
                            setContactForm({
                              name: contact.name,
                              address: contact.address,
                              relationship: contact.relationship
                            });
                            setShowContactModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <FiUser className="text-blue-500 text-2xl" />
                  </div>
                  <p className="text-gray-500">Tidak ada kontak yang ditemukan</p>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Tambah Kontak Pertama
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <FiChevronLeft /> Sebelumnya
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-inner' : 'text-gray-600 hover:bg-blue-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  Selanjutnya <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Kategori Tab */}
        {tab === 'kategori' && (
          <div className="space-y-6">
            {/* By Address Section */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-50 overflow-hidden">
              <div className="p-4 border-b border-blue-100 bg-blue-50/30">
                <h3 className="font-semibold text-lg text-blue-800 flex items-center gap-3">
                  <FiMapPin className="text-blue-600" />
                  <span>Kontak Berdasarkan Alamat</span>
                </h3>
              </div>
              <div className="divide-y divide-blue-100">
                {Object.entries(contactsByAddress).map(([address, contacts]) => (
                  <div key={address} className="p-4 hover:bg-blue-50/20 transition-colors">
                    <div
                      className="flex justify-between items-center cursor-pointer group"
                      onClick={() => toggleAddressExpansion(address)}
                    >
                      <h4 className="font-medium text-blue-700 flex items-center gap-2">
                        {expandedAddresses[address] ?
                          <FiChevronDown className="text-blue-500 group-hover:text-blue-700" /> :
                          <FiChevronRight className="text-blue-400 group-hover:text-blue-600" />}
                        <span className="group-hover:text-blue-800 transition-colors">
                          {address}
                        </span>
                        <span className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {contacts.length}
                        </span>
                      </h4>
                    </div>

                    {expandedAddresses[address] && (
                      <>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {contacts
                            .slice(
                              (addressCurrentPage[address] - 1) * ITEMS_PER_PAGE,
                              addressCurrentPage[address] * ITEMS_PER_PAGE
                            )
                            .map(contact => (
                              <div
                                key={contact._id}
                                onClick={() => openContactDetail(contact)}
                                className="border border-blue-100 p-3 rounded-lg cursor-pointer hover:bg-blue-50/30 hover:border-blue-200 transition-all shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-semibold shadow-inner">
                                    {contact.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">{contact.name}</p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                                      <FiUsers className="text-blue-400" size={12} />
                                      {contact.relationship}
                                    </p>
                                  </div>
                                </div>
                                {contact.is_selesai && (
                                  <span className="inline-flex items-center mt-2 px-2.5 py-1 bg-green-100/80 text-green-800 text-xs rounded-full font-medium">
                                    <FiCheck size={12} className="mr-1" /> Selesai
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>

                        {/* Pagination for this address */}
                        {contacts.length > ITEMS_PER_PAGE && (
                          <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                              {Array.from({
                                length: Math.ceil(contacts.length / ITEMS_PER_PAGE)
                              }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => updateAddressPage(address, i + 1)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${addressCurrentPage[address] === i + 1
                                    ? 'bg-blue-600 text-white shadow-inner'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* By Relationship Section */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-50 overflow-hidden">
              <div className="p-4 border-b border-blue-100 bg-blue-50/30">
                <h3 className="font-semibold text-lg text-blue-800 flex items-center gap-3">
                  <FiUsers className="text-blue-600" />
                  <span>Kontak Berdasarkan Hubungan</span>
                </h3>
              </div>
              <div className="divide-y divide-blue-100">
                {Object.entries(contactsByRelationship).map(([relationship, contacts]) => (
                  <div key={relationship} className="p-4 hover:bg-blue-50/20 transition-colors">
                    <div
                      className="flex justify-between items-center cursor-pointer group"
                      onClick={() => toggleRelationshipExpansion(relationship)}
                    >
                      <h4 className="font-medium text-blue-700 flex items-center gap-2">
                        {expandedRelationships[relationship] ?
                          <FiChevronDown className="text-blue-500 group-hover:text-blue-700" /> :
                          <FiChevronRight className="text-blue-400 group-hover:text-blue-600" />}
                        <span className="group-hover:text-blue-800 transition-colors">
                          {relationship}
                        </span>
                        <span className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {contacts.length}
                        </span>
                      </h4>
                    </div>

                    {expandedRelationships[relationship] && (
                      <>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {contacts
                            .slice(
                              (relationshipCurrentPage[relationship] - 1) * ITEMS_PER_PAGE,
                              relationshipCurrentPage[relationship] * ITEMS_PER_PAGE
                            )
                            .map(contact => (
                              <div
                                key={contact._id}
                                onClick={() => openContactDetail(contact)}
                                className="border border-blue-100 p-3 rounded-lg cursor-pointer hover:bg-blue-50/30 hover:border-blue-200 transition-all shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-semibold shadow-inner">
                                    {contact.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">{contact.name}</p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                                      <FiMapPin className="text-blue-400" size={12} />
                                      {contact.address}
                                    </p>
                                  </div>
                                </div>
                                {contact.is_selesai && (
                                  <span className="inline-flex items-center mt-2 px-2.5 py-1 bg-green-100/80 text-green-800 text-xs rounded-full font-medium">
                                    <FiCheck size={12} className="mr-1" /> Selesai
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>

                        {/* Pagination for this relationship */}
                        {contacts.length > ITEMS_PER_PAGE && (
                          <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                              {Array.from({
                                length: Math.ceil(contacts.length / ITEMS_PER_PAGE)
                              }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => updateRelationshipPage(relationship, i + 1)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${relationshipCurrentPage[relationship] === i + 1
                                    ? 'bg-blue-600 text-white shadow-inner'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Statistik Tab */}
        {tab === 'statistik' && (
          <div className="space-y-6">
            {/* Stats Cards with Animated Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Total Contacts Card */}
              <div className="bg-white p-5 rounded-xl shadow-lg border border-blue-50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600/80 uppercase tracking-wider">Total Kontak</p>
                    <p className="text-3xl font-bold text-blue-800 mt-1">{statistics.totalContacts}</p>
                    <div className="mt-4 relative pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {Math.round((statistics.totalContacts / (statistics.totalContacts + 20)) * 100)}% Growth
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 mt-1 rounded-full bg-blue-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"
                          style={{ width: `${Math.min(100, Math.round((statistics.totalContacts / (statistics.totalContacts + 20)) * 100))}%` }}
                        >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100/50">
                    <FiUsers className="text-blue-600 text-xl" />
                  </div>
                </div>
              </div>

              {/* Total Gifts Card */}
              <div className="bg-white p-5 rounded-xl shadow-lg border border-blue-50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600/80 uppercase tracking-wider">Total Kado</p>
                    <p className="text-3xl font-bold text-blue-800 mt-1">{statistics.totalKado}</p>
                    <div className="mt-4 relative pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {Math.round((statistics.totalKado / statistics.totalContacts) * 100)}% Coverage
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 mt-1 rounded-full bg-blue-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                          style={{ width: `${Math.min(100, Math.round((statistics.totalKado / statistics.totalContacts) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100/50">
                    <FiGift className="text-blue-600 text-xl" />
                  </div>
                </div>
              </div>

              {/* Completed Contacts Card */}
              <div className="bg-white p-5 rounded-xl shadow-lg border border-blue-50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600/80 uppercase tracking-wider">Kontak Selesai</p>
                    <p className="text-3xl font-bold text-blue-800 mt-1">{statistics.selesaiContacts}</p>
                    <div className="mt-4 relative pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {Math.round((statistics.selesaiContacts / statistics.totalContacts) * 100)}% Completion
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 mt-1 rounded-full bg-blue-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"
                          style={{ width: `${Math.min(100, Math.round((statistics.selesaiContacts / statistics.totalContacts) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100/50">
                    <FiCheck className="text-blue-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Relationship Distribution Chart */}
              <div className="bg-white p-5 rounded-xl shadow-lg border border-blue-50">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <FiPieChart className="text-blue-600" /> Distribusi Hubungan
                </h3>
                <div className="h-64 flex items-center justify-center">
                  {/* Placeholder for pie chart - would be replaced with actual chart component */}
                  <div className="relative w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[12px] border-blue-200"></div>
                    <div className="absolute inset-0 rounded-full border-[12px] border-blue-400 clip-[0%_50%]"></div>
                    <div className="absolute inset-0 rounded-full border-[12px] border-blue-600 clip-[0%_25%]"></div>
                    <div className="absolute inset-0 rounded-full border-[12px] border-blue-800 clip-[0%_75%]"></div>
                    <div className="absolute inset-4 rounded-full bg-white z-10 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{Object.keys(contactsByRelationship).length} Kategori</span>
                    </div>
                  </div>
                  <div className="ml-8 space-y-3">
                    {Object.entries(contactsByRelationship).slice(0, 3).map(([rel, contacts]) => (
                      <div key={rel} className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                        <span className="text-sm text-gray-600">{rel}</span>
                        <span className="text-xs text-gray-500 ml-auto">{contacts.length}</span>
                      </div>
                    ))}
                    {Object.keys(contactsByRelationship).length > 3 && (
                      <div className="text-xs text-blue-600 font-medium">+{Object.keys(contactsByRelationship).length - 3} lainnya</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Completion Trend */}
              <div className="bg-white p-5 rounded-xl shadow-lg border border-blue-50">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <FiTrendingUp className="text-blue-600" /> Tren Penyelesaian
                </h3>
                <div className="h-64 flex items-end justify-between pt-4 border-b border-l border-blue-100">
                  {/* Placeholder for bar chart */}
                  {[20, 40, 60, 80, 45, 65, 30].map((value, index) => (
                    <div key={index} className="flex flex-col items-center" style={{ height: '100%' }}>
                      <div
                        className="w-6 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-sm hover:from-blue-500 hover:to-blue-700 transition-all"
                        style={{ height: `${value}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Kontak */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-700">
                  {editContactId ? (
                    <>
                      <FiEdit2 className="inline mr-2" />
                      Edit Kontak
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="inline mr-2" />
                      Tambah Kontak
                    </>
                  )}
                </h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-9 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      placeholder="Nama lengkap"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-9 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      placeholder="Alamat lengkap"
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hubungan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUsers className="text-gray-400" />
                    </div>
                    <select
                      className="pl-9 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm appearance-none"
                      value={contactForm.relationship}
                      onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                      required
                    >
                      <option value="" disabled>Pilih Hubungan</option>
                      <option value="Teman">Teman</option>
                      <option value="Keluarga">Keluarga</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiChevronDown className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-3">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FiSave size={16} /> {editContactId ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowContactModal(false);
                      setShowKadoModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <FiGift size={16} /> Tambah Kado
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kado */}
      {showKadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-700">
                  {editKadoId ? (
                    <>
                      <FiEdit2 className="inline mr-2" />
                      Edit Kado
                    </>
                  ) : (
                    <>
                      <FiGift className="inline mr-2" />
                      Tambah Kado
                    </>
                  )}
                </h2>
                <button
                  onClick={() => setShowKadoModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitKado} className="space-y-4">
                {/* Enhanced Contact Selection with Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Untuk Kontak</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-9 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      placeholder="Cari kontak..."
                      value={contactSearchQuery}
                      onChange={(e) => setContactSearchQuery(e.target.value)}
                      onFocus={() => setShowContactDropdown(true)}
                      onBlur={() => setTimeout(() => setShowContactDropdown(false), 200)}
                    />
                    {showContactDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {contacts
                          .filter(contact =>
                            contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                            contact.address.toLowerCase().includes(contactSearchQuery.toLowerCase())
                          )
                          .map(contact => (
                            <div
                              key={contact._id}
                              className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setKadoForm({ ...kadoForm, contact_id: contact._id });
                                setContactSearchQuery(contact.name);
                                setShowContactDropdown(false);
                              }}
                            >
                              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                                {contact.name.charAt(0)}
                              </div>
                              <div className="truncate">
                                <p className="font-medium text-sm">{contact.name}</p>
                                <p className="text-xs text-gray-500 truncate">{contact.address}</p>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                  {kadoForm.contact_id && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                      <FiCheck className="text-green-500" size={14} />
                      <span>Kontak terpilih: {
                        contacts.find(c => c._id === kadoForm.contact_id)?.name
                      }</span>
                    </div>
                  )}
                </div>

                {/* Kado Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kado</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={`flex items-center justify-center gap-1 p-2 border rounded-lg transition-colors text-sm ${kadoForm.type === 'memberi'
                        ? 'bg-blue-50 border-blue-400 text-blue-600'
                        : 'hover:bg-gray-50'
                        }`}
                      onClick={() => setKadoForm({ ...kadoForm, type: 'memberi' })}
                    >
                      <FiArrowUpCircle size={16} />
                      Memberi
                    </button>
                    <button
                      type="button"
                      className={`flex items-center justify-center gap-1 p-2 border rounded-lg transition-colors text-sm ${kadoForm.type === 'menerima'
                        ? 'bg-blue-50 border-blue-400 text-blue-600'
                        : 'hover:bg-gray-50'
                        }`}
                      onClick={() => setKadoForm({ ...kadoForm, type: 'menerima' })}
                    >
                      <FiArrowDownCircle size={16} />
                      Menerima
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <FiFileText className="text-gray-400" size={16} />
                    </div>
                    <textarea
                      className="pl-9 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      placeholder="Deskripsi kado (contoh: Baju batik, Amplop, dll)"
                      rows={3}
                      value={kadoForm.description}
                      onChange={(e) => setKadoForm({ ...kadoForm, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="date"
                      className="pl-9 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      value={kadoForm.date}
                      onChange={(e) => setKadoForm({ ...kadoForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FiSave size={16} /> {editKadoId ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowKadoModal(false);
                      setShowContactModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <FiUserPlus size={16} /> Kontak Baru
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Kontak */}
      {showContactDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <FiUser size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-700">Detail Kontak</h2>
                    {selectedContact.is_selesai && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        <FiCheck size={14} /> Selesai
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowContactDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Informasi Kontak */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                      <FiInfo className="text-blue-600" /> Informasi Kontak
                    </h3>
                    <div className="space-y-3 pl-1">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Nama</p>
                        <p className="font-medium text-gray-800">{selectedContact.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Alamat</p>
                        <p className="font-medium text-gray-800">{selectedContact.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Hubungan</p>
                        <p className="font-medium text-gray-800">{selectedContact.relationship}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setKadoForm({
                          contact_id: selectedContact._id,
                          type: '',
                          description: '',
                          date: ''
                        });
                        setEditKadoId(null);
                        setShowContactDetailModal(false);
                        setShowKadoModal(true);
                      }}
                      className="flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FiGift size={16} /> Kado
                    </button>
                    <button
                      onClick={() => {
                        setEditContactId(selectedContact._id);
                        setContactForm({
                          name: selectedContact.name,
                          address: selectedContact.address,
                          relationship: selectedContact.relationship
                        });
                        setShowContactDetailModal(false);
                        setShowContactModal(true);
                      }}
                      className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <FiEdit2 size={16} /> Edit
                    </button>
                    {selectedContact.is_selesai ? (
                      <button
                        onClick={() => handleSetSelesai(selectedContact._id, false)}
                        className="flex items-center justify-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors col-span-2 text-sm"
                      >
                        <FiX size={16} /> Batalkan Selesai
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSetSelesai(selectedContact._id, true)}
                        className="flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors col-span-2 text-sm"
                      >
                        <FiCheck size={16} /> Tandai Selesai
                      </button>
                    )}
                  </div>
                </div>

                {/* Daftar Kado */}
                <div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                      <FiGift className="text-blue-600" /> Daftar Kado
                    </h3>

                    {kados.filter(kado => kado.contact_id === selectedContact._id).length > 0 ? (
                      <div className="space-y-2">
                        {kados
                          .filter(kado => kado.contact_id === selectedContact._id)
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map(kado => (
                            <div key={kado._id} className="border border-blue-100 bg-white p-3 rounded-lg hover:shadow-sm transition-shadow">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${kado.type === 'memberi'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                    }`}>
                                    {kado.type === 'memberi' ? 'Memberi' : 'Menerima'}
                                  </span>
                                  <p className="mt-1 font-medium text-sm text-gray-800">{kado.description}</p>
                                </div>
                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(kado.date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => {
                                    setEditKadoId(kado._id);
                                    setKadoForm({
                                      contact_id: kado.contact_id,
                                      type: kado.type,
                                      description: kado.description,
                                      date: kado.date.split('T')[0]
                                    });
                                    setShowContactDetailModal(false);
                                    setShowKadoModal(true);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <FiEdit2 size={12} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteKado(kado._id)}
                                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                                >
                                  <FiTrash2 size={12} /> Hapus
                                </button>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <FiInbox size={20} className="mx-auto mb-2 text-gray-400" />
                        Belum ada kado untuk kontak ini
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && userProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiUser /> Profil Pengguna
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-gray-700 mb-3">Ubah Password</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Kosongkan jika tidak ingin mengubah"
                        value={profileForm.password}
                        onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Kosongkan jika tidak ingin mengubah"
                        value={profileForm.confirmPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiSave /> Simpan Perubahan
                  </button>
                </div>
              </form>

              {/* Delete Account Section */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-medium text-red-600 mb-3">Zona Berbahaya</h3>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-700 mb-3">
                    Menghapus akun akan menghilangkan semua data Anda secara permanen.
                    Aksi ini tidak dapat dibatalkan.
                  </p>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-red-700 mb-1">
                      Ketik <span className="font-bold">HAPUS</span> untuk konfirmasi
                    </label>
                    <input
                      type="text"
                      className="w-full border border-red-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleDeleteProfile}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiTrash2 /> Hapus Akun Saya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 py-4 px-4 border-t border-gray-200">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="mb-2 md:mb-0">© 2025 Gift Tracker. All rights reserved.</p>
            <a
              href="https://instagram.com/romynn10"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Dibuat oleh Romi
            </a>
          </div>
        </div>
      </footer>
    </div >
  );
}


export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}