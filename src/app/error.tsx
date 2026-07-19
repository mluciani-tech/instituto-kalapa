"use client";

import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-brand-terracotta mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-charcoal mb-2">
          Algo deu errado
        </h2>
        <p className="text-brand-charcoal/60 mb-6">
          Não foi possível carregar esta página. Tente novamente.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-charcoal/20 text-brand-charcoal font-semibold rounded-xl hover:bg-brand-charcoal/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Início
          </a>
        </div>
      </div>
    </div>
  );
}
