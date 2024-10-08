'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Form from '#components/_forms/Form';
import FormGroup from '#components/_forms/FormGroup';
import Input from '#components/_forms/Input';
import Button from '#components/_forms/Button';
import useProductStore from '#stores/useProductStore';
import ProductApi from '#api/product';
import FileUpload from '#components/_forms/FileUpload';
import Image from 'next/image';
import Panel from "#components/layout/panel/Panel.jsx";

const EditProductPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { fetchProductById, isLoading } = useProductStore();
    const [product, setProduct] = useState(null);
    const [title, setTitle] = useState('');
    const [monthlyPrice, setMonthlyPrice] = useState('');
    const [annualPrice, setAnnualPrice] = useState('');
    const [directDiscount, setDirectDiscount] = useState('');
    const [labelFeatures, setLabelFeatures] = useState('');
    const [features, setFeatures] = useState([]);
    const [logoPath, setLogoPath] = useState('');  // Nouveau logo
    const [initialLogoPath, setInitialLogoPath] = useState('');
    const [isFileUploadVisible, setFileUploadVisible] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            const fetchedProduct = await fetchProductById(id);
            setProduct(fetchedProduct);
            setTitle(fetchedProduct.title);
            setMonthlyPrice(fetchedProduct.monthlyPrice);
            setAnnualPrice(fetchedProduct.annualPrice);
            setDirectDiscount(fetchedProduct.directDiscount);
            setLabelFeatures(fetchedProduct.labelFeatures);
            setFeatures(fetchedProduct.features.map(feature => ({
                id: feature.id,
                name: feature.name,
                value: feature.pivotValue || ''
            })));
            setLogoPath(fetchedProduct.signedLogoPath);
            setInitialLogoPath(fetchedProduct.logoPath);  // Stocker le logo initial
        };

        if (id) {
            loadProduct();
        }
    }, [id, fetchProductById]);

    const handleFeatureChange = (index, field, value) => {
        const updatedFeatures = [...features];
        updatedFeatures[index][field] = value;
        setFeatures(updatedFeatures);
    };

    const handleAddFeature = () => {
        setFeatures([...features, { id: null, name: '', value: '' }]);
    };

    const handleRemoveFeature = (index) => {
        const updatedFeatures = features.filter((_, i) => i !== index);
        setFeatures(updatedFeatures);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProductData = {
            title,
            monthlyPrice: parseInt(monthlyPrice, 10),
            annualPrice: parseInt(annualPrice, 10),
            directDiscount: parseInt(directDiscount, 10),
            labelFeatures: labelFeatures,
            features: features.map(({ name, value }) => ({ name, value })),
        };

        // Ajouter le logo uniquement s'il a changé
        if (logoPath !== initialLogoPath) {
            updatedProductData.logoPath = logoPath;
        }

        try {
            await ProductApi.update(id, updatedProductData);
            //router.push('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleFileUpload = (newLogoPath) => {
        setLogoPath(newLogoPath);
        setFileUploadVisible(false);
    };

    if (isLoading || !product) {
        return <div>Loading...</div>;
    }

    return (
        <Panel title="Edit Product" darkMode={true}>
            <Form onSubmit={handleSubmit}>
                <FormGroup title="Product Information">
                    <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Input label="Monthly Price" type="number" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} />
                    <Input label="Annual Price" type="number" value={annualPrice} onChange={(e) => setAnnualPrice(e.target.value)} />
                    <Input label="Direct Discount (%)" type="number" value={directDiscount} onChange={(e) => setDirectDiscount(e.target.value)} />
                    <Input label="Label Features"  value={labelFeatures.join(', ')} onChange={(e) => setLabelFeatures(e.target.value)} />
                </FormGroup>

                <FormGroup title="Product Logo">
                    <div className="flex items-center mb-4">
                        {logoPath && (
                            <Image
                                src={logoPath}
                                alt="Product Logo"
                                width={100}
                                height={100}
                                className="rounded-lg mr-4"
                            />
                        )}
                        <Button
                            type="button"
                            label="Change Logo"
                            onClick={() => setFileUploadVisible(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg"
                        />
                    </div>

                    {isFileUploadVisible && (
                        <FileUpload
                            label={"Upload a new logo"}
                            accept={['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/svg+xml']}
                            multiple={false}
                            id="logo-upload"
                            onChange={handleFileUpload}
                        />
                    )}
                </FormGroup>

                <FormGroup title="Features">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <Input
                                label="Feature Name"
                                value={feature.name}
                                onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                                className="mr-2"
                            />
                            <Input
                                label="Value"
                                value={feature.value}
                                onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                                className="mr-2"
                            />
                            <Button type="button" label="Remove" onClick={() => handleRemoveFeature(index)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-lg" />
                        </div>
                    ))}
                    <Button type="button" label="Add Feature" onClick={handleAddFeature} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-lg mt-2" />
                </FormGroup>

                <div className="flex justify-end mt-4">
                    <Button label="Update Product" type="submit" />
                </div>
            </Form>
        </Panel>
    );
};

export default EditProductPage;
