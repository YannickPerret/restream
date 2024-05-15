'use client'

import {useEffect} from "react";
import {ProviderApi} from "../../../../api/provider";
import {useProviderStore} from "../../../../stores/useProviderStore";
import ProviderIndex from "@/views/providers";

export default function ProvidersPage() {

    useEffect(() => {
        const fetchProviders = async () => {
            await ProviderApi.getAll().then((data) => {
                useProviderStore.setState({
                    providers: data.providers
                })
            })
        }
        fetchProviders();
    }, []);
    return (
        <section className="flex flex-col w-full h-full rounded-2xl justify-center shadow-2xl">
            <div className="bg-slate-500">
                <header className="container mx-auto">
                    <h1 className="text-3xl text-white py-4">Providers</h1>
                    <hr className="border-b-1 border-blueGray-300 pb-6"/>

                </header>

                <ProviderIndex/>
            </div>
        </section>
    )
}