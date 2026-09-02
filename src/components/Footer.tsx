import React from 'react';
import {
  Zap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Truck,
  Heart
} from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import { SGCLogo } from './SGCLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="kontak" className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 pt-16 pb-12 border-t border-slate-300 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-300 dark:border-slate-800">

          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="pb-1">
              <SGCLogo variant="horizontal" size="md" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Pusat rental dan persewaan genset silent (10 - 500+ kVA) serta AC standing floor (3 &amp; 5 PK). Menyediakan unit berkualitas prima, super dingin, super hening, instalasi rapi, dan teknisi standby 24 jam.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Navigasi Cepat</h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'beranda', label: 'Beranda Utama' },
                { id: 'katalog', label: 'Katalog Genset & AC' },
                { id: 'booking', label: 'Form Booking WA' },
                { id: 'portofolio', label: 'Portofolio Acara' },
                { id: 'keunggulan', label: 'Keunggulan SGC' },
                { id: 'testimoni', label: 'Testimoni Klien' },
                { id: 'artikel', label: 'Portal Artikel & Tips' },
                { id: 'faq', label: 'Tanya Jawab (FAQ)' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-amber-600 dark:hover:text-amber-400 font-medium text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Capacities Ready */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{COMPANY_INFO.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white">{COMPANY_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{COMPANY_INFO.email}</span>
            </div>
          </div>

          {/* Col 4: Area Coverage & WhatsApp Call */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Area Layanan Utama</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Kota Cirebon (Kejaksan, Kesambi, Harjamukti, Lemahwungkuk, Pekalipan), Kab. Cirebon, Kuningan, Majalengka (Kertajati), Indramayu.
            </p>

            <div className="pt-2">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi WA Admin Langsung</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} <strong>{COMPANY_INFO.name}</strong>. Hak Cipta Dilindungi. Kota Cirebon, Jawa Barat, Indonesia.
          </div>
        </div>

      </div>
    </footer>
  );
};
