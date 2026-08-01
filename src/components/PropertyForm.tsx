'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/queries';
import { useCreateProperty, useUpdateProperty, useHandleMutationError } from '@/hooks/mutations';
import type { Property } from '@/types';

const AMENITY_OPTIONS = ['Wi-Fi', 'Parking', 'Gym', 'Pool', 'Pet Friendly', 'Air Conditioning', 'Security', 'Balcony', 'Generator', 'Elevator'];

interface PropertyFormProps {
    property?: Property;
}

export default function PropertyForm({ property }: PropertyFormProps) {
    const router = useRouter();
    const { data: categories = [] } = useCategories();
    const createProperty = useCreateProperty();
    const updateProperty = useUpdateProperty();
    const handleError = useHandleMutationError();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [area, setArea] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [imagesText, setImagesText] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const isEdit = Boolean(property);

    useEffect(() => {
        if (!property) return;
        setTitle(property.title);
        setDescription(property.description);
        setLocation(property.location);
        setPrice(String(property.price ?? ''));
        setBedrooms(property.bedrooms ? String(property.bedrooms) : '');
        setBathrooms(property.bathrooms ? String(property.bathrooms) : '');
        setArea(property.area ? String(property.area) : '');
        setCategoryId(property.categoryId || property.category?.id || '');
        setImagesText((property.images || []).join('\n'));
        setSelectedAmenities(property.amenities || []);
    }, [property]);

    const toggleAmenity = (amt: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amt) ? prev.filter((a) => a !== amt) : [...prev, amt]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const numPrice = Number(price);
        if (!title.trim() || !description.trim() || !location.trim() || !numPrice || !categoryId) {
            setError('Please fill in all required fields (title, description, location, price, category).');
            return;
        }
        if (numPrice <= 0) {
            setError('Price must be a positive number.');
            return;
        }

        const payload = {
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            price: numPrice,
            bedrooms: bedrooms ? Number(bedrooms) : undefined,
            bathrooms: bathrooms ? Number(bathrooms) : undefined,
            area: area ? Number(area) : undefined,
            categoryId,
            amenities: selectedAmenities,
            images: imagesText
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
        };

        if (isEdit && property) {
            updateProperty.mutate(
                { id: property.id, payload },
                {
                    onSuccess: () => {
                        toast.success('Property updated successfully!');
                        router.push('/dashboard/landlord');
                    },
                    onError: (err) => handleError(err, 'Updating property'),
                }
            );
        } else {
            createProperty.mutate(payload, {
                onSuccess: () => {
                    toast.success('Property created successfully!');
                    router.push('/dashboard/landlord');
                },
                onError: (err) => handleError(err, 'Creating property'),
            });
        }
    };

    const isSubmitting = createProperty.isPending || updateProperty.isPending;

    return (
        <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
            {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <div>
                <h2 className="font-bold text-lg text-slate-900 mb-4">
                    {isEdit ? 'Edit Property' : 'List a New Property'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="form-label">Title *</label>
                        <input type="text" required className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Luxury Apartment in Gulshan" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="form-label">Description *</label>
                        <textarea rows={4} required className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the property, its features, and nearby amenities..." />
                    </div>

                    <div>
                        <label className="form-label">Location *</label>
                        <input type="text" required className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Gulshan, Dhaka" />
                    </div>

                    <div>
                        <label className="form-label">Monthly Price (USD) *</label>
                        <input type="number" required min={1} className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="25000" />
                    </div>

                    <div>
                        <label className="form-label">Bedrooms</label>
                        <input type="number" min={0} className="form-input" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="3" />
                    </div>

                    <div>
                        <label className="form-label">Bathrooms</label>
                        <input type="number" min={0} className="form-input" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} placeholder="2" />
                    </div>

                    <div>
                        <label className="form-label">Area (sqft)</label>
                        <input type="number" min={0} className="form-input" value={area} onChange={(e) => setArea(e.target.value)} placeholder="1500" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="form-label">Category *</label>
                        <select required className="form-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="form-label">Image URLs (one per line)</label>
                        <textarea rows={3} className="form-input" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="https://images.unsplash.com/photo-..." />
                        <p className="text-[11px] text-slate-400 mt-1">
                            Paste direct image URLs. Unsplash links work well.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="form-label">Amenities</label>
                        <div className="flex flex-wrap gap-1.5">
                            {AMENITY_OPTIONS.map((amt) => (
                                <button
                                    type="button"
                                    key={amt}
                                    onClick={() => toggleAmenity(amt)}
                                    className={`filter-chip text-xs ${selectedAmenities.includes(amt) ? 'active' : ''}`}
                                >
                                    {amt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="submit" disabled={isSubmitting} className="btn-primary justify-center text-sm">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Property'}
                </button>
                <button type="button" onClick={() => router.push('/dashboard/landlord')} className="btn-secondary text-sm">
                    Cancel
                </button>
            </div>
        </form>
    );
}
