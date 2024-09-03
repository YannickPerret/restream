'use client'
import React, { Suspense, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import useProductStore from '#stores/useProductStore.js';
import { CheckoutForm } from "#components/shop/CheckoutForm.jsx";
import { useSearchParams } from 'next/navigation';
import { redirect } from "next/navigation.js";
import { useSessionStore } from "#stores/useSessionStore.js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutPageContent = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const isMonthly = searchParams.get('isMonthly') === 'true'; // Assurez-vous que isMonthly est un booléen
    const { fetchProductById, isLoading } = useProductStore();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const fetchedProduct = await fetchProductById(productId);
            setProduct(fetchedProduct);
        };

        fetchProduct();
    }, [productId, fetchProductById]);

    if (isLoading || !product) {
        return <div>Loading...</div>;
    }

    // Calcul du prix final
    const basePrice = isMonthly ? product.monthlyPrice : product.annualPrice;
    const discount = product.directDiscount && !isMonthly ? product.directDiscount : 0;
    const finalPrice = (basePrice * (100 - discount) / 100).toFixed(2);

    return (
        <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Column - Personal Information */}
            <div className="flex-1 bg-gray-800 p-8 rounded-lg shadow-lg">
                <Elements stripe={stripePromise}>
                    <CheckoutForm product={product} />
                </Elements>
            </div>

            {/* Right Column - Order Summary */}
            <div className="flex-2 w-96 bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <p className="text-lg mb-4">{product.title}</p>
                <p className="text-gray-400">Price: ${basePrice}</p>
                <p className="text-gray-400">Discount: {discount}%</p>
                <hr className="my-4 border-gray-600" />
                <h3 className="text-xl font-bold">
                    Total: ${finalPrice}
                </h3>
            </div>
        </div>
    );
};

const CheckoutPage = () => {
    const { isAuthenticated } = useSessionStore();

    useEffect(() => {
        if (!isAuthenticated()) {
            redirect('/auth/login');
        }
    }, [isAuthenticated]);

    return (
        <section className="flex flex-col w-full h-full rounded-2xl justify-center shadow-2xl p-8 bg-gradient-to-r from-indigo-900 via-gray-900 to-black">
            <div className="container mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-center mb-8 text-white">Payment Checkout</h1>
                </header>
                <hr className="border-b-1 border-blueGray-300 pb-6" />
                <Suspense fallback={<div>Loading...</div>}>
                    <CheckoutPageContent />
                </Suspense>
            </div>
        </section>
    );
};

export default CheckoutPage;
