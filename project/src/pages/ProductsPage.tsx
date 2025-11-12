import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle } from 'lucide-react';
import tariffPoster from '../assets/tarif-abattoir.svg';

const PRODUCTS = [
  { name: 'Steak', price: 140 },
  { name: 'Lait', price: 140 },
  { name: 'Peaux', price: 140 },
  { name: 'Jambon', price: 170 },
  { name: 'Saucisson', price: 170 },
  { name: 'Poulet', price: 140 },
  { name: 'Sac à dos', price: 800 },
];

export function ProductsPage() {
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    comment: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, number>
  >({});
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (productName: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedProducts };
      delete newSelected[productName];
      setSelectedProducts(newSelected);
    } else {
      setSelectedProducts({ ...selectedProducts, [productName]: quantity });
    }
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RV${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (Object.keys(selectedProducts).length === 0) {
      setError('Veuillez sélectionner au moins un produit');
      setIsSubmitting(false);
      return;
    }

    const newOrderNumber = generateOrderNumber();
    const productsArray = Object.entries(selectedProducts).map(
      ([name, quantity]) => {
        const product = PRODUCTS.find((p) => p.name === name);
        return {
          name,
          quantity,
          price: product?.price || 0,
        };
      }
    );

    try {
      const { error: insertError } = await supabase.from('orders').insert({
        order_number: newOrderNumber,
        client_name: formData.clientName,
        company_name: formData.companyName,
        products: productsArray,
        delivery_type: formData.deliveryType,
        comment: formData.comment || null,
        status: 'pending',
      });

      if (insertError) throw insertError;

      setOrderNumber(newOrderNumber);
      setFormData({
        clientName: '',
        companyName: '',
        deliveryType: 'pickup',
        comment: '',
      });
      setSelectedProducts({});
    } catch (err) {
      setError('Erreur lors de la création de la commande');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#3C1D0E] mb-4">
              Commande enregistrée
            </h2>
            <div className="bg-[#D38A00] text-[#000000] text-2xl font-bold py-4 px-6 rounded-lg mb-6">
              Numéro de commande : {orderNumber}
            </div>
            <p className="text-gray-700 mb-8">
              Conservez ce numéro pour suivre votre commande
            </p>
            <button
              onClick={() => setOrderNumber(null)}
              className="bg-[#3C1D0E] text-[#FDFDFD] px-8 py-3 rounded-lg font-semibold hover:bg-[#D38A00] hover:text-[#000000] transition-colors"
            >
              Nouvelle commande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#3C1D0E] mb-8 text-center">
          Produits & Commande
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#3C1D0E] mb-6">
            Nos produits
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#D38A00]">
                  <th className="text-left py-3 px-4 text-[#3C1D0E] font-bold">
                    Produit
                  </th>
                  <th className="text-right py-3 px-4 text-[#3C1D0E] font-bold">
                    Prix / unité
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((product) => (
                  <tr key={product.name} className="border-b border-gray-200">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {product.price}$
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10">
            <img
              src={tariffPoster}
              alt="Tarif abattoir Raven Slaughterhouse"
              className="w-full rounded-lg border-4 border-[#D38A00] shadow-md"
            />
          </div>

          <div className="mt-6 bg-[#D38A00] text-[#000000] p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <p className="font-semibold">
              Produits vendus exclusivement aux entreprises agréées.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#3C1D0E] mb-6">
            Passer une commande
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#3C1D0E] font-semibold mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D38A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#3C1D0E] font-semibold mb-2">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D38A00] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#3C1D0E] font-semibold mb-3">
                Sélection des produits *
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {PRODUCTS.map((product) => (
                  <div
                    key={product.name}
                    className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-lg"
                  >
                    <span className="flex-1 font-medium">{product.name}</span>
                    <input
                      type="number"
                      min="0"
                      value={selectedProducts[product.name] || 0}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.name,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D38A00] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#3C1D0E] font-semibold mb-3">
                Livraison *
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="pickup"
                    checked={formData.deliveryType === 'pickup'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryType: e.target.value as 'pickup' | 'delivery',
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span>À récupérer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="delivery"
                    checked={formData.deliveryType === 'delivery'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryType: e.target.value as 'pickup' | 'delivery',
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span>Livrée</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[#3C1D0E] font-semibold mb-2">
                Commentaire (facultatif)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D38A00] focus:outline-none resize-none"
              ></textarea>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3C1D0E] text-[#FDFDFD] py-4 rounded-lg font-bold text-lg hover:bg-[#D38A00] hover:text-[#000000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Passer commande'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
