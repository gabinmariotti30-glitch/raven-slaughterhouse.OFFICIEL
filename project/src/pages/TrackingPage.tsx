import { useState } from 'react';
import { supabase, Order } from '../lib/supabase';
import { Search, Package, CheckCircle, XCircle, Clock } from 'lucide-react';

export function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSearching(true);
    setOrder(null);

    try {
      const { data, error: searchError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim())
        .maybeSingle();

      if (searchError) throw searchError;

      if (!data) {
        setError('Aucune commande trouvée avec ce numéro');
      } else {
        setOrder(data as Order);
      }
    } catch (err) {
      setError('Erreur lors de la recherche de la commande');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-8 h-8" />,
          label: 'En attente',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
        };
      case 'accepted':
        return {
          icon: <CheckCircle className="w-8 h-8" />,
          label: 'Acceptée',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'refused':
        return {
          icon: <XCircle className="w-8 h-8" />,
          label: 'Refusée',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        };
      default:
        return {
          icon: <Clock className="w-8 h-8" />,
          label: 'Inconnu',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        };
    }
  };

  const calculateTotal = (products: Array<{ price: number; quantity: number }>) => {
    return products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#3C1D0E] mb-8 text-center">
          Suivi de commande
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-[#3C1D0E] font-semibold mb-2">
                Numéro de commande
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Ex: RV1699..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D38A00] focus:outline-none text-lg"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-[#3C1D0E] text-[#FDFDFD] px-8 py-3 rounded-lg font-semibold hover:bg-[#D38A00] hover:text-[#000000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  {isSearching ? 'Recherche...' : 'Rechercher'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {order && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#D38A00] pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#3C1D0E]">
                  Commande {order.order_number}
                </h2>
                <p className="text-gray-600 mt-1">
                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div
                className={`flex items-center gap-3 px-6 py-3 rounded-lg ${
                  getStatusInfo(order.status).bgColor
                } ${getStatusInfo(order.status).color}`}
              >
                {getStatusInfo(order.status).icon}
                <span className="font-bold text-lg">
                  {getStatusInfo(order.status).label}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-[#3C1D0E] mb-2">Client</h3>
                <p className="text-gray-700">{order.client_name}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#3C1D0E] mb-2">Entreprise</h3>
                <p className="text-gray-700">{order.company_name}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#3C1D0E] mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produits commandés
              </h3>
              <div className="bg-[#FDFDFD] rounded-lg p-4 space-y-2">
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-gray-600">
                      {product.quantity} × {product.price}$ ={' '}
                      <span className="font-bold text-[#3C1D0E]">
                        {product.quantity * product.price}$
                      </span>
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t-2 border-[#D38A00]">
                  <span className="font-bold text-lg text-[#3C1D0E]">
                    Total
                  </span>
                  <span className="font-bold text-xl text-[#D38A00]">
                    {calculateTotal(order.products)}$
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-[#3C1D0E] mb-2">Livraison</h3>
                <p className="text-gray-700">
                  {order.delivery_type === 'pickup'
                    ? 'À récupérer'
                    : 'Livrée'}
                </p>
              </div>
              {order.comment && (
                <div>
                  <h3 className="font-bold text-[#3C1D0E] mb-2">
                    Commentaire
                  </h3>
                  <p className="text-gray-700">{order.comment}</p>
                </div>
              )}
            </div>

            {order.status === 'refused' && order.refusal_message && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-2">
                  Motif du refus
                </h3>
                <p className="text-red-700">{order.refusal_message}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setOrder(null);
                  setOrderNumber('');
                }}
                className="flex-1 bg-[#3C1D0E] text-[#FDFDFD] py-3 rounded-lg font-semibold hover:bg-[#D38A00] hover:text-[#000000] transition-colors"
              >
                Nouvelle recherche
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
