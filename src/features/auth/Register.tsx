import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import Layout from '@/shared/components/Layout';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Lengkapi semua data'); return; }
    if (password.length < 6) { toast.error('Password minimal 6 karakter'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Akun berhasil dibuat! Silakan cek email untuk verifikasi.');
    navigate('/login');
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
            <CardDescription>Buat akun untuk mulai memesan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nama Lengkap</label>
                <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <Input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Sudah punya akun? <Link to="/login" className="text-primary font-medium hover:underline">Masuk</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
