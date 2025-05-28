"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel - Branding and benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">AutoBooks</span>
          </Link>
          
          <div className="mt-24">
            <h2 className="text-4xl font-bold text-white mb-6">{t('auth.benefitsTitle')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">{t('auth.benefit1')}</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">{t('auth.benefit2')}</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">{t('auth.benefit3')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="relative h-48 w-full">
          <div className="absolute inset-0 bg-white/10 rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 mr-3"></div>
                <div>
                  <p className="text-white font-medium">Sarah Chen</p>
                  <p className="text-white/70 text-sm">Bookkeeper</p>
                </div>
              </div>
              <p className="text-white/90 italic">"{t('auth.testimonial')}"</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-8">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              {t('auth.backToHome')}
            </Link>
            
            <div className="lg:hidden mb-6">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">AutoBooks</span>
              </Link>
            </div>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
