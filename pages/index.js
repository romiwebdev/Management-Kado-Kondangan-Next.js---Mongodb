// pages/index.js
import Link from 'next/link';
import { 
  FiGift, 
  FiUsers, 
  FiMapPin, 
  FiHeart, 
  FiLogIn, 
  FiUserPlus,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';

export default function Home() {
  const features = [
    {
      icon: <FiGift className="text-4xl text-blue-500 group-hover:text-white transition-colors duration-300" />,
      title: "Catat Kado",
      description: "Rekam semua pemberian dan penerimaan kado dalam satu platform"
    },
    {
      icon: <FiUsers className="text-4xl text-blue-500 group-hover:text-white transition-colors duration-300" />,
      title: "Kelola Kontak",
      description: "Simpan informasi kontak lengkap beserta hubungannya dengan Anda"
    },
    {
      icon: <FiMapPin className="text-4xl text-blue-500 group-hover:text-white transition-colors duration-300" />,
      title: "Kategori Alamat",
      description: "Kelompokkan kontak berdasarkan lokasi untuk memudahkan pengelolaan"
    },
    {
      icon: <FiHeart className="text-4xl text-blue-500 group-hover:text-white transition-colors duration-300" />,
      title: "Status Hubungan",
      description: "Filter kontak berdasarkan jenis hubungan (keluarga, teman, rekan kerja)"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Tambah Kontak",
      description: "Masukkan data kontak beserta alamat dan hubungan dengan Anda"
    },
    {
      number: "02",
      title: "Catat Kado",
      description: "Tambahkan kado dengan status member atau diberi beserta detailnya"
    },
    {
      number: "03",
      title: "Kelola Status",
      description: "Tandai sebagai selesai ketika sudah tidak perlu menunggu balasan atau sudah membalas"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="py-4 px-6 absolute w-full z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FiGift className="text-2xl text-white mr-2" />
            <span className="font-bold text-xl text-white">Gift Tracker</span>
          </div>
          <div className="hidden md:flex space-x-6 text-white">
            <Link href="#features" className="hover:text-blue-200 transition-colors">Fitur</Link>
            <Link href="#how-it-works" className="hover:text-blue-200 transition-colors">Cara Kerja</Link>
            <Link href="/login" className="hover:text-blue-200 transition-colors">Masuk</Link>
            <Link href="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern glass morphism style */}
      <header className="relative bg-blue-600 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-300 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full opacity-20"></div>
        </div>
        
        <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-blue-200">Catat</span> dan <span className="text-blue-200">Kelola</span> <br />
              Kado Kondangan dengan <br />Mudah
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl">
              Solusi pintar untuk membantu Anda melacak semua kado yang diberikan dan diterima dalam satu platform modern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2 text-lg">
                <FiUserPlus /> Daftar Sekarang
              </Link>
              <Link href="/login" className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2 text-lg">
                <FiLogIn /> Masuk
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Utama</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gift Tracker hadir dengan berbagai fitur untuk mempermudah pengelolaan kado kondangan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 group-hover:text-blue-100 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Modern timeline style */}
      <section id="how-it-works" className="py-24 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cara Kerja Gift Tracker</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistem sederhana dan efisien untuk mengelola kado kondangan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full relative z-10">
                  <div className="text-blue-600 font-bold text-4xl mb-6 opacity-50">{step.number}</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <FiArrowRight className="text-3xl text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/Benefits Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Manfaat Menggunakan Gift Tracker</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rasakan berbagai kemudahan dalam mengelola kado kondangan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-start gap-4 mb-6">
                <FiCheckCircle className="text-2xl text-blue-500 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Tak Perlu Khawatir Lupa</h3>
                  <p className="text-gray-600">Rekam semua pemberian kado dan hindari rasa malu karena lupa telah memberi atau menerima kado dari seseorang</p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <FiCheckCircle className="text-2xl text-blue-500 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Pengingat Otomatis</h3>
                  <p className="text-gray-600">Dapatkan notifikasi saat ada acara atau kado yang perlu dibalas dalam waktu dekat</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-start gap-4 mb-6">
                <FiCheckCircle className="text-2xl text-blue-500 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Hemat Waktu</h3>
                  <p className="text-gray-600">Akses cepat ke riwayat kado yang pernah diberikan sebagai referensi untuk acara berikutnya</p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <FiCheckCircle className="text-2xl text-blue-500 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Statistik Terperinci</h3>
                  <p className="text-gray-600">Lihat ringkasan kado yang diterima dan diberikan serta pola pemberian kado Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Glass morphism style */}
      <section className="relative py-24 px-6 bg-blue-600 text-white overflow-hidden">
        {/* Background blur elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Mulai Kelola Kado Anda Sekarang</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Daftar gratis dan nikmati kemudahan dalam mencatat semua kado kondangan Anda. Tanpa biaya tersembunyi.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2 text-lg">
              <FiUserPlus /> Buat Akun Gratis
            </Link>
            <Link href="/tour" className="bg-blue-500 border border-blue-400 hover:bg-blue-400 px-8 py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-lg">
              <FiGift /> Lihat Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-6">
                <FiGift className="text-3xl text-blue-400 mr-2" />
                <span className="font-bold text-xl">Gift Tracker</span>
              </div>
              <p className="text-gray-400">
                Solusi modern untuk mengelola kado kondangan dengan cerdas
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <Link href="http://instagram.com/romynn10" className="text-gray-400 hover:text-blue-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Gift Tracker - Semua hak dilindungi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}