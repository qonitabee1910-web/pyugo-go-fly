import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertCircle, Zap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              404
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <AlertCircle size={32} className="text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Halaman Tidak Ditemukan
        </h1>

        {/* Description */}
        <div className="mb-8 space-y-3">
          <p className="text-lg text-gray-600">
            Maaf, halaman yang Anda cari sedang dalam pengembangan
          </p>
          <p className="text-sm text-gray-500">
            Rute: <code className="inline-block bg-gray-200 px-3 py-1 rounded font-mono text-xs mt-2">
              {location.pathname}
            </code>
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Zap size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Fitur ini akan segera tersedia. Nantikan update terbaru dari PYU-GO!
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
          <a
            href="/beranda"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:shadow-lg transition"
          >
            Ke Beranda
          </a>
        </div>

        {/* Fun Message */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            💡 "Kesalahan terbaik adalah yang membawa peluang terbaik"
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
