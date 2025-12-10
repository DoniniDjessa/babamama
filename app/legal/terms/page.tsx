'use client';

import AnimatedContainer from '@/components/AnimatedContainer';

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedContainer direction="up" delay={0.1}>
          <h1 className="font-title text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Conditions Générales de Vente
          </h1>
          <p className="font-body text-sm text-slate-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </AnimatedContainer>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">1. Objet</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              Les présentes Conditions Générales de Vente (CGV) régissent les relations entre Babamama et ses clients 
              pour la vente de produits importés de Chine et livrés en Côte d'Ivoire. Toute commande implique l'acceptation 
              sans réserve des présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">2. Prix</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed mb-2">
              Les prix affichés sur le site sont exprimés en Francs CFA (FCFA) et incluent :
            </p>
            <ul className="font-body text-sm text-slate-600 space-y-1 ml-4 list-disc">
              <li>Le prix d'achat du produit</li>
              <li>Les frais de transport depuis la Chine</li>
              <li>Les frais de douane</li>
              <li>La marge commerciale</li>
            </ul>
            <p className="font-body text-sm text-slate-600 leading-relaxed mt-2">
              Aucun frais supplémentaire ne sera demandé au client.
            </p>
          </section>

          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">3. Commande</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              La commande est validée après confirmation par email ou SMS. Babamama se réserve le droit de refuser 
              toute commande pour motif légitime. En cas d'indisponibilité d'un produit, le client sera informé et 
              pourra soit annuler sa commande, soit choisir un produit de remplacement.
            </p>
          </section>

          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">4. Paiement</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed mb-2">
              Les modes de paiement acceptés sont :
            </p>
            <ul className="font-body text-sm text-slate-600 space-y-1 ml-4 list-disc">
              <li>Wave (Mobile Money)</li>
              <li>Orange Money</li>
              <li>Paiement à la livraison (espèces)</li>
            </ul>
            <p className="font-body text-sm text-slate-600 leading-relaxed mt-2">
              Le paiement est sécurisé et les informations bancaires ne sont jamais stockées.
            </p>
          </section>

          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">5. Livraison</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              Les délais de livraison sont indicatifs et peuvent varier selon les conditions de transport. 
              Les produits en stock à Abidjan sont livrés sous 24h. Les produits importés arrivent sous 10-15 jours ouvrés. 
              La livraison est effectuée à l'adresse indiquée par le client lors de la commande.
            </p>
          </section>

          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">6. Droit de rétractation</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              Conformément à la législation ivoirienne, le client dispose d'un délai de 7 jours pour retourner 
              un produit non utilisé et dans son emballage d'origine. Les frais de retour sont à la charge du client, 
              sauf en cas de produit défectueux ou non conforme.
            </p>
          </section>

          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">7. Garantie</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              Tous nos produits bénéficient d'une garantie constructeur. En cas de défaut de conformité ou de 
              vice caché, le client peut demander le remplacement ou le remboursement du produit dans un délai 
              raisonnable après la livraison.
            </p>
          </section>

          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">8. Données personnelles</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              Les données personnelles collectées lors de la commande sont utilisées uniquement pour le traitement 
              de la commande et la relation client. Elles ne sont jamais partagées avec des tiers sans consentement.
            </p>
          </section>

          <section>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-3">9. Contact</h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              Pour toute question concernant ces CGV, vous pouvez nous contacter via WhatsApp ou email à l'adresse 
              indiquée sur la page de contact.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

