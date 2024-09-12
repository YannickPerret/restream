'use client';
import React, { useEffect } from 'react';
import Table from '#components/table/Table';
import useOrderStore from "#stores/useOrderStore";
import { useAuthStore } from "#stores/useAuthStore.js";

export default function OrdersIndexPage() {
    const { user } = useAuthStore();
    const { orders, fetchOrders } = useOrderStore();

    // Colonnes de la table
    const columns = [
        { key: 'orderId', title: 'Order ID' },
        { key: 'productName', title: 'Product Name' },
        { key: 'status', title: 'Status' },
        { key: 'createdAt', title: 'Order Date' },
        { key: 'totalAmount', title: 'Total Amount' },
    ];

    // Charger les commandes de l'utilisateur
    useEffect(() => {
        const _fetchOrders = async () => {
            try {
                await fetchOrders();

            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        _fetchOrders();
    }, [user, fetchOrders]);

    return (
        <section className="flex flex-col w-full h-full rounded-2xl justify-center shadow-2xl">
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <div className="container mx-auto">
                    <h1 className="text-3xl text-white py-4">Your Orders</h1>
                </div>
                <hr className="border-b-1 border-blueGray-300 pb-6" />

                <div className="p-6">
                    {/* Si aucun ordre n'est trouvé */}
                    {Array.isArray(orders) && orders.length > 0 ? (
                            <Table
                                columns={columns}
                                data={orders.map(order => ({
                                    orderId: order.id,
                                    productName: order.product.title,
                                    status: order.status,
                                    createdAt: new Date(order.created_at).toLocaleDateString(),
                                    totalAmount: `$${order.total_amount.toFixed(2)}`,
                                }))}
                                darkMode={true} // Utiliser le mode sombre
                            />
                        ) : (
                        <p className="text-center text-white">No orders found.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
