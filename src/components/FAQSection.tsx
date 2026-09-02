import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { FAQ_LIST } from '../data/faqs';
import { COMPANY_INFO } from '../data/company';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export const FAQSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? '' : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Dapatkan jawaban cepat mengenai prosedur booking, pengiriman ke area Cirebon, operator standby, dan ketentuan bahan bakar solar.
          </p>
        </motion.div>

        {/* FAQ Accordion List (Clean Direct List with Motion) */}
        <div className="space-y-3">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openFaqId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400' : ''
                    }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Still Have Questions Box with Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Masih Memiliki Pertanyaan Lain?</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tim admin teknis kami di Cirebon siap menjawab kebutuhan spesifikasi genset Anda 24 jam.
            </p>
          </div>

          <a
            href={getGeneralWhatsAppUrl('Pertanyaan Tambahan')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm shrink-0 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tanya Admin via WhatsApp</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};
