import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_LIST } from '../data/faqs';
import { FAQItem } from '../types';
import { COMPANY_INFO } from '../data/company';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import { getFaqs } from '../utils/api';

export const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQ_LIST);
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  useEffect(() => {
    getFaqs().then((data) => {
      if (data && data.length > 0) {
        setFaqs(data);
      }
    });
  }, []);

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

        {/* FAQ Accordion List (Animated Smooth Expansion) */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
                  isOpen
                    ? 'border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors select-none"
                >
                  <span className={`font-bold text-sm sm:text-base leading-snug transition-colors ${
                    isOpen ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isOpen
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="faq-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.22, delay: 0.06 }
                        }
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.24, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.15 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

