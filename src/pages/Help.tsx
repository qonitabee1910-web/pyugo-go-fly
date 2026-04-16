import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Layout from '@/components/Layout';

const faqs = [
  { q: 'Bagaimana cara memesan hotel?', a: 'Cari hotel di halaman utama, pilih hotel dan tipe kamar, isi data tamu, lalu klik "Pesan Sekarang".' },
  { q: 'Bagaimana cara membatalkan pesanan?', a: 'Buka halaman Pesanan, temukan pesanan yang ingin dibatalkan, dan klik tombol batalkan. Kebijakan refund berlaku sesuai ketentuan.' },
  { q: 'Apakah bisa memilih kursi di shuttle?', a: 'Ya! Saat memesan shuttle, Anda bisa memilih kursi yang tersedia melalui peta kursi.' },
  { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Saat ini kami mendukung transfer bank, kartu kredit/debit, dan e-wallet.' },
];

export default function Help() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Pusat Bantuan</h1>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Mail, title: 'Email', detail: 'cs@pyugo.id' },
            { icon: Phone, title: 'Telepon', detail: '+62 21 1234 5678' },
            { icon: MessageCircle, title: 'Live Chat', detail: 'Senin - Jumat, 08:00 - 20:00' },
          ].map(({ icon: Icon, title, detail }) => (
            <Card key={title}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-4">Pertanyaan Umum (FAQ)</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
}
