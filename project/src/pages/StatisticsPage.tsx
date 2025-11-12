import { useState, useEffect } from 'react';
import { supabase, Order } from '../lib/supabase';
import {
  Lock,
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const ACCESS_CODE = '0637';

export function StatisticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refusalMessages, setRefusalMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allOrders = (data as Order[]) || [];
      setOrders(allOrders);
      setPendingOrders(allOrders.filter((o) => o.status === 'pending'));
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === ACCESS_CODE) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Code d\'accès incorrect');
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      await loadOrders();
    } catch (err) {
      console.error('Error accepting order:', err);
    }
  };

  const handleRefuseOrder = async (orderId: string) => {
    const message = refusalMessages[orderId] || 'Commande refusée';
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'refused',
          refusal_message: message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;
      setRefusalMessages({ ...refusalMessages, [orderId]: '' });
      await loadOrders();
    } catch (err) {
      console.error('Error refusing order:', err);
    }
  };

  const calculateStatistics = () => {
    const processedOrders = orders.filter((o) => o.status !== 'pending');
    const totalRevenue = processedOrders
      .filter((o) => o.status === 'accepted')
      .reduce((sum, order) => {
        return (
          sum +
          order.products.reduce(
            (orderSum, product) => orderSum + product.price * product.quantity,
            0
          )
        );
      }, 0);

    const productCounts: Record<string, number> = {};
    processedOrders
      .filter((o) => o.status === 'accepted')
      .forEach((order) => {
        order.products.forEach((product) => {
          productCounts[product.name] =
            (productCounts[product.name] || 0) + product.quantity;
        });
      });

    const sortedProducts = Object.entries(productCounts).sort(
      ([, a], [, b]) => b - a
    );

    return {
      totalRevenue,
      processedCount: processedOrders.length,
      productCounts,
      topProducts: sortedProducts.slice(0, 3),
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] py-12 px-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#3C1D0E] rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#D38A00]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#3C1D0E] text-center mb-6">
              Accès sécurisé
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[#3C1D0E] font-semibold mb-2">
                  Code d'accès
                </label>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D38A00] focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="••••"
                />
              </div>
              {error && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg text-center">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#3C1D0E] text-[#FDFDFD] py-3 rounded-lg font-bold hover:bg-[#D38A00] hover:text-[#000000] transition-colors"
              >
                Accéder
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStatistics();

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#3C1D0E]">
            Tableau de bord
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-[#3C1D0E] text-[#FDFDFD] px-6 py-2 rounded-lg font-semibold hover:bg-[#D38A00] hover:text-[#000000] transition-colors"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <h3 className="font-bold text-gray-600">Chiffre d'affaires</h3>
            </div>
            <p className="text-3xl font-bold text-[#3C1D0E]">
              {stats.totalRevenue}$
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-gray-600">Commandes traitées</h3>
            </div>
            <p className="text-3xl font-bold text-[#3C1D0E]">
              {stats.processedCount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-orange-600" />
              <h3 className="font-bold text-gray-600">En attente</h3>
            </div>
            <p className="text-3xl font-bold text-[#D38A00]">
              {pendingOrders.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h3 className="font-bold text-gray-600">Produits vendus</h3>
            </div>
            <p className="text-3xl font-bold text-[#3C1D0E]">
              {Object.values(stats.productCounts).reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#3C1D0E] mb-4">
              Produits les plus commandés
            </h2>
            {stats.topProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.topProducts.map(([name, count], index) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#D38A00] text-[#000000] rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className="font-semibold">{name}</span>
                    </div>
                    <span className="text-[#3C1D0E] font-bold">
                      {count} unités
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune donnée disponible</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#3C1D0E] mb-4">
              Quantités vendues par produit
            </h2>
            {Object.keys(stats.productCounts).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(stats.productCounts).map(([name, count]) => (
                  <div
                    key={name}
                    className="flex justify-between p-2 border-b border-gray-200"
                  >
                    <span className="font-medium">{name}</span>
                    <span className="font-bold text-[#3C1D0E]">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#3C1D0E] mb-6">
            Commandes en attente ({pendingOrders.length})
          </h2>
          {isLoading ? (
            <p className="text-gray-500 text-center py-8">Chargement...</p>
          ) : pendingOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune commande en attente
            </p>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-gray-300 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-[#3C1D0E] text-lg">
                        {order.order_number}
                      </h3>
                      <p className="text-gray-600">
                        {order.client_name} - {order.company_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString(
                          'fr-FR',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      En attente
                    </span>
                  </div>

                  <div className="bg-[#FDFDFD] rounded p-3 mb-3">
                    <h4 className="font-semibold text-[#3C1D0E] mb-2">
                      Produits:
                    </h4>
                    <div className="space-y-1">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {product.name} × {product.quantity}
                          </span>
                          <span className="font-semibold">
                            {product.price * product.quantity}$
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-[#D38A00]">
                        {order.products.reduce(
                          (sum, p) => sum + p.price * p.quantity,
                          0
                        )}
                        $
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm">
                      <span className="font-semibold">Livraison:</span>{' '}
                      {order.delivery_type === 'pickup'
                        ? 'À récupérer'
                        : 'Livrée'}
                    </p>
                    {order.comment && (
                      <p className="text-sm mt-1">
                        <span className="font-semibold">Commentaire:</span>{' '}
                        {order.comment}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Message de refus (optionnel)"
                      value={refusalMessages[order.id] || ''}
                      onChange={(e) =>
                        setRefusalMessages({
                          ...refusalMessages,
                          [order.id]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D38A00] focus:outline-none text-sm"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Valider
                      </button>
                      <button
                        onClick={() => handleRefuseOrder(order.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
