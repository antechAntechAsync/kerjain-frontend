import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  UserCircle, 
  Target, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  Briefcase,
  Search,
  Award
} from 'lucide-react';
import logo from '../assets/kerjain_logo_final.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface font-body selection:bg-secondary/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 bg-surface-variant backdrop-blur-[20px] border border-outline-variant rounded-full shadow-sm">
          <Link to="/" className="flex items-center gap-2 px-2">
            <img src={logo} alt="KerjaIn Logo" className="h-8 md:h-10 object-contain" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" className="font-heading text-sm md:text-base">Masuk</Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="primary" className="font-heading text-sm md:text-base px-6">Daftar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold tracking-wide uppercase">
              <Zap className="w-4 h-4 mr-2" />
              Era Baru Rekrutmen SMK
            </div>
            <h1 className="text-6xl lg:text-[5.5rem] font-heading font-extrabold text-primary leading-[1.05] tracking-tighter">
              Galeri Talenta <br /> Masa <span className="text-secondary">Depan.</span>
            </h1>
            <p className="text-xl text-customText/70 font-body max-w-xl leading-relaxed">
              KerjaIn adalah ekosistem digital premium yang memvalidasi potensi siswa SMK dan menghubungkan mereka dengan industri melalui AI-driven assessment.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link to="/student/interest" className="w-full sm:w-auto">
                <Button size="lg" className="w-full px-10 h-16 text-lg group">
                  Mulai Asesmen Minat
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/hr" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full px-10 h-16 text-lg bg-white">
                  Dashboard Rekruter
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-sq-xl bg-primary p-10 shadow-ambient relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/30 rounded-full blur-3xl -mr-24 -mt-24 transition-all duration-1000 group-hover:bg-secondary/50" />
              <div className="relative z-10 h-full flex flex-col justify-between text-white">
                <div className="space-y-6">
                  <Award className="w-14 h-14 text-secondary" />
                  <h3 className="text-3xl font-heading font-bold leading-tight">
                    Validasi Kompetensi Berbasis Industri
                  </h3>
                  <p className="text-white/60 leading-relaxed text-lg font-body">
                    Kami memastikan setiap profil kandidat mencerminkan keahlian yang telah terverifikasi melalui Knowledge Checks yang ketat.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-sq-md p-6 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-heading font-black text-secondary">89%</div>
                    <div className="text-sm font-body leading-tight text-white/80">
                      Tingkat Akurasi <br /> Matching Talenta
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section className="py-32 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 space-y-4">
                  <Target className="w-10 h-10 text-secondary" />
                  <h4 className="font-heading font-bold text-primary">Mapping Minat</h4>
                  <p className="text-xs text-customText/60 leading-relaxed font-body">Temukan jalur karir yang paling sesuai dengan passion Anda.</p>
                </Card>
                <Card className="p-6 space-y-4 mt-8">
                  <ShieldCheck className="w-10 h-10 text-secondary" />
                  <h4 className="font-heading font-bold text-primary">Skill Verified</h4>
                  <p className="text-xs text-customText/60 leading-relaxed font-body">Dapatkan lencana verifikasi untuk setiap kompetensi yang dikuasai.</p>
                </Card>
                <Card className="p-6 space-y-4">
                  <Layout className="w-10 h-10 text-secondary" />
                  <h4 className="font-heading font-bold text-primary">Portofolio Hidup</h4>
                  <p className="text-xs text-customText/60 leading-relaxed font-body">Tampilkan proyek terbaik Anda dalam format galeri editorial.</p>
                </Card>
                <Card className="p-6 space-y-4 mt-8">
                  <Zap className="w-10 h-10 text-secondary" />
                  <h4 className="font-heading font-bold text-primary">Akses Industri</h4>
                  <p className="text-xs text-customText/60 leading-relaxed font-body">Langsung dilirik oleh perusahaan ternama yang mencari talenta SMK.</p>
                </Card>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                Untuk Siswa SMK
              </div>
              <h2 className="text-5xl lg:text-6xl font-heading font-extrabold text-primary tracking-tight leading-tight">
                Ubah <span className="text-secondary">Potensi</span> Menjadi Portofolio <span className="italic">Bernilai Tinggi.</span>
              </h2>
              <div className="space-y-6 pt-4">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-heading font-black text-xl">1</div>
                  <div className="space-y-2">
                    <h5 className="text-xl font-heading font-bold text-primary">Asesmen Minat Berbasis AI</h5>
                    <p className="text-customText/70 font-body">Sistem kami menganalisis kecenderungan minat Anda untuk memberikan rekomendasi jalur karir yang presisi.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-heading font-black text-xl">2</div>
                  <div className="space-y-2">
                    <h5 className="text-xl font-heading font-bold text-primary">Validasi Pengetahuan</h5>
                    <p className="text-customText/70 font-body">Uji kemampuan teknis Anda melalui modul Knowledge Check yang disusun oleh pakar industri.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-heading font-black text-xl">3</div>
                  <div className="space-y-2">
                    <h5 className="text-xl font-heading font-bold text-primary">Showcase Portofolio</h5>
                    <p className="text-customText/70 font-body">Bangun profil profesional yang tidak hanya sekadar CV, tapi sebuah perjalanan karya yang memukau.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For HR Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
                Untuk HR & Rekruter
              </div>
              <h2 className="text-5xl lg:text-6xl font-heading font-extrabold text-primary tracking-tight leading-tight">
                Rekrutmen Presisi dengan <span className="text-secondary">Talenta Terverifikasi.</span>
              </h2>
              <p className="text-xl text-customText/70 font-body max-w-2xl leading-relaxed">
                Kurangi bias dan waktu rekrutmen. Akses kandidat SMK yang telah divalidasi kemampuannya melalui sistem asesmen multi-layer kami.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-secondary" />
                    <h6 className="text-lg font-heading font-bold text-primary">Matching Score</h6>
                  </div>
                  <p className="text-sm text-customText/60 font-body">Lihat tingkat kecocokan kandidat dengan kebutuhan spesifik lowongan Anda secara instan.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-secondary" />
                    <h6 className="text-lg font-heading font-bold text-primary">Pipeline Management</h6>
                  </div>
                  <p className="text-sm text-customText/60 font-body">Kelola proses seleksi dari review hingga hiring dalam satu dashboard yang intuitif.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Search className="w-6 h-6 text-secondary" />
                    <h6 className="text-lg font-heading font-bold text-primary">Advanced Search</h6>
                  </div>
                  <p className="text-sm text-customText/60 font-body">Cari talenta berdasarkan skill spesifik, sekolah, atau hasil asesmen teknis.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-secondary" />
                    <h6 className="text-lg font-heading font-bold text-primary">Verified Data</h6>
                  </div>
                  <p className="text-sm text-customText/60 font-body">Setiap sertifikasi dan portofolio dalam sistem kami telah melalui proses validasi sistem.</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="space-y-6">
                <Card className="p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-xl bg-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">AM</div>
                    <div>
                      <h4 className="font-heading font-bold text-primary">Aji Pamungkas</h4>
                      <p className="text-xs text-customText/60 font-body font-medium">Frontend Developer • SMK Negeri 1</p>
                    </div>
                    <div className="ml-auto bg-green-50 text-green-600 px-3 py-1 rounded-full font-heading font-bold text-xs uppercase tracking-widest">Verified</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[92%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-customText/40">
                      <span>Match Score</span>
                      <span className="text-secondary">92%</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-500 shadow-xl bg-white">
                  <h4 className="font-heading font-bold text-primary mb-4">Statistik Rekrutmen</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-surface-container-low rounded-sq-md">
                      <div className="text-2xl font-heading font-black text-primary">120+</div>
                      <div className="text-[10px] font-bold uppercase text-customText/40 mt-1">Siswa Aktif</div>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-sq-md">
                      <div className="text-2xl font-heading font-black text-primary">15</div>
                      <div className="text-[10px] font-bold uppercase text-customText/40 mt-1">Mitra Industri</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto rounded-sq-xl bg-primary p-12 lg:p-24 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl lg:text-7xl font-heading font-extrabold text-white tracking-tighter leading-tight">
              Siap Memulai Perjalanan <br /> <span className="text-secondary italic">Karir Profesional Anda?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full px-12 h-16 text-lg bg-secondary text-white border-none">
                  Gabung Sekarang
                </Button>
              </Link>
              <Link to="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="glass" className="w-full px-12 h-16 text-lg">
                  Masuk ke Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-outline-variant">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <img src={logo} alt="KerjaIn Logo" className="h-10" />
            <p className="text-customText/60 font-body max-w-sm leading-relaxed">
              Platform validasi talenta dan rekrutmen presisi yang dirancang khusus untuk ekosistem SMK Indonesia.
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="font-heading font-bold text-primary">Tautan Cepat</h5>
            <ul className="space-y-4 text-sm text-customText/60 font-body">
              <li><Link to="/student/interest" className="hover:text-secondary transition-colors">Asesmen Minat</Link></li>
              <li><Link to="/hr/jobs" className="hover:text-secondary transition-colors">Cari Lowongan</Link></li>
              <li><Link to="/auth/register" className="hover:text-secondary transition-colors">Daftar Akun</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-heading font-bold text-primary">Kontak</h5>
            <ul className="space-y-4 text-sm text-customText/60 font-body">
              <li>info@kerjain.id</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-customText/30 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} KerjaIn. The Kinetic Atelier. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-secondary transition-colors">Kebijakan Privasi</span>
            <span className="cursor-pointer hover:text-secondary transition-colors">Syarat & Ketentuan</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icon for internal use
function Layout(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}
