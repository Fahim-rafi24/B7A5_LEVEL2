'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Calendar, Loader2, Send, ShieldCheck } from 'lucide-react';
import Modal from './Modal';
import { useSubmitRental, useHandleMutationError } from '@/hooks/mutations';
import { useAuth } from '@/context/AuthContext';

interface RequestRentModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId?: string;
    propertyTitle?: string;
}

export default function RequestRentModal({ isOpen, onClose, propertyId, propertyTitle }: RequestRentModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [moveInDate, setMoveInDate] = useState('');
    const [message, setMessage] = useState('');
    const submitRental = useSubmitRental();
    const handleError = useHandleMutationError();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!propertyId) return;

        if (!user) {
            toast.error('Please sign in as a Tenant to submit a rental request.');
            onClose();
            router.push(`/auth/login?callbackUrl=/properties/${propertyId}`);
            return;
        }

        submitRental.mutate(
            { propertyId, moveInDate: moveInDate || undefined, message: message.trim() || undefined },
            {
                onSuccess: () => {
                    toast.success('Rental request submitted!', {
                        description: 'The landlord will review your request. Track it in your dashboard.',
                    });
                    setMoveInDate('');
                    setMessage('');
                    onClose();
                    router.push('/dashboard/tenant');
                },
                onError: (err) => handleError(err, 'Submitting rental request'),
            }
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request to Rent">
            <p className="text-xs text-slate-500 mb-4">
                Property: <strong className="text-slate-800">{propertyTitle}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="form-label">Desired Move-in Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="form-input text-sm pl-10"
                            value={moveInDate}
                            onChange={(e) => setMoveInDate(e.target.value)}
                        />
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                </div>

                <div>
                    <label className="form-label">Message to Landlord</label>
                    <textarea
                        rows={3}
                        placeholder="Hi, I am interested in renting this property..."
                        className="form-input text-sm"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitRental.isPending}
                    className="btn-primary w-full justify-center py-3 text-sm font-semibold disabled:opacity-50"
                >
                    {submitRental.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    {submitRental.isPending ? 'Submitting...' : 'Submit Rental Request'}
                </button>

                <div className="p-3 bg-blue-50/80 rounded-2xl text-xs text-blue-800 flex items-start gap-2 border border-blue-100">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Your request is secure. The landlord will review your profile before approval.</span>
                </div>
            </form>
        </Modal>
    );
}
