import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import Layout from '@/shared/components/Layout';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/AuthContext';
import { validateAuthForm, RateLimiter } from '@/lib/validation';

const loginRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Check rate limiting
    if (!loginRateLimiter.isAllowed()) {
      const remainingTime = loginRateLimiter.getRemainingTime();
      toast.error(`Terlalu banyak percobaan. Coba lagi dalam ${remainingTime} detik`);
      return;
    }

    // Validate inputs
    const validation = validateAuthForm(email, password);

    const newErrors: Record<string, string> = {};
    if (!validation.email.valid) newErrors.email = validation.email.error || '';
    if (!validation.password.valid) newErrors.password = validation.password.error || '';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Berhasil masuk!');
    navigate('/beranda');
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Masuk ke PYU GO</CardTitle>
            <CardDescription>Masukkan email dan password Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="email@contoh.com"
                  disabled={loading}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  disabled={loading}
                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Belum punya akun?{' '}
              <Link to="/daftar" className="text-primary font-medium hover:underline">
                Daftar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
