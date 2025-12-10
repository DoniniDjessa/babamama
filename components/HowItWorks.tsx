'use client';

import { Search, Plane, PackageCheck, ArrowRight } from 'lucide-react';
import AnimatedContainer from './AnimatedContainer';

const steps = [
  {
    icon: Search,
    title: 'Commandez',
    desc: 'Prix tout compris en FCFA.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Plane,
    title: 'On Importe',
    desc: 'Transport & Douane gérés.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: PackageCheck,
    title: 'Vous Recevez',
    desc: 'Livraison à domicile.',
    color: 'bg-green-50 text-green-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-4 sm:py-6 md:py-8 px-2 sm:px-4 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <AnimatedContainer direction="up" delay={0.1}>
          <h2 className="font-title text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">
            Simple comme bonjour
          </h2>
        </AnimatedContainer>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimatedContainer key={index} direction="up" delay={0.1 + index * 0.1}>
                <div className="flex flex-col items-center text-center relative">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Arrow (Desktop only, between steps) */}
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-full w-full -ml-8">
                      <ArrowRight className="w-6 h-6 text-slate-300 mx-auto" />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-title text-base font-bold text-slate-900 mb-1">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>
                </div>
              </AnimatedContainer>
            );
          })}
        </div>
      </div>
    </section>
  );
}

