import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-extrabold">P</span>
            </div>
            <span className="text-lg font-bold text-background">PYU <span className="text-primary">GO</span></span>
          </div>
          <p className="text-sm leading-relaxed text-background/60">
            Platform pemesanan hotel dan shuttle/travel terpercaya di Indonesia.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-background mb-3">Layanan</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/hotel" className="hover:text-primary transition-colors">Hotel</Link></li>
            <li><Link to="/shuttle" className="hover:text-primary transition-colors">Shuttle & Travel</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-background mb-3">Perusahaan</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/bantuan" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
            <li><Link to="/bantuan" className="hover:text-primary transition-colors">Bantuan</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-background mb-3">Kontak</h4>
          <ul className="space-y-2 text-sm">
            <li>cs@pyugo.id</li>
            <li>+62 21 1234 5678</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 text-center py-4 text-xs text-background/40">
        © 2026 PYU GO. Semua hak dilindungi.
      </div>
    </footer>
  );
}
