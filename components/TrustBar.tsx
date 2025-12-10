'use client';

import { ShieldCheck, Plane, MessageCircle } from 'lucide-react';

export default function TrustBar() {
  return (
    <div className="flex justify-between items-center px-2 sm:px-4 py-3 sm:py-4 bg-slate-50 border-y border-slate-100">
      <div className="flex flex-col items-center gap-1 text-center flex-1">
        <ShieldCheck className="w-5 h-5 text-indigo-600" />
        <span className="font-body text-[10px] text-slate-600 font-medium leading-tight">
          Paiement
          <br />
          Sécurisé
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-1 text-center flex-1">
        <Plane className="w-5 h-5 text-indigo-600" />
        <span className="font-body text-[10px] text-slate-600 font-medium leading-tight">
          Tout Inclus
          <br />
          <span className="text-[9px] text-slate-500">Pas de douane</span>
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-1 text-center flex-1">
        <MessageCircle className="w-5 h-5 text-indigo-600" />
        <span className="font-body text-[10px] text-slate-600 font-medium leading-tight">
          Suivi
          <br />
          WhatsApp
        </span>
      </div>
    </div>
  );
}

