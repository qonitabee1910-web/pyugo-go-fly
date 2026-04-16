import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hotel, Bus, Car, ClipboardList, Tag, HelpCircle, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Hotel', path: '/hotel', icon: Hotel },
  { label: 'Shuttle', path: '/shuttle', icon: Bus },
  { label: 'Ride', path: '/ride', icon: Car },
  { label: 'Pesanan', path: '/pesanan', icon: ClipboardList },
  { label: 'Promo', path: '/#promo', icon: Tag },
  { label: 'Bantuan', path: '/bantuan', icon: HelpCircle },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-extrabold text-lg">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            PYU <span className="text-primary">GO</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                location.pathname === item.path ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1">
                <LogOut className="h-4 w-4" /> Keluar
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Masuk</Button></Link>
              <Link to="/daftar"><Button size="sm">Daftar</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card px-4 pb-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted">
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            {user ? (
              <Button variant="outline" className="w-full" size="sm" onClick={() => { signOut(); setOpen(false); }}>
                <LogOut className="h-4 w-4 mr-1" /> Keluar
              </Button>
            ) : (
              <>
                <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Masuk</Button>
                </Link>
                <Link to="/daftar" className="flex-1" onClick={() => setOpen(false)}>
                  <Button className="w-full" size="sm">Daftar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
