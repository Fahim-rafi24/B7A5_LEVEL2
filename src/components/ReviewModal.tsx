'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Star, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { useCreateReview, useHandleMutationError } from '@/hooks/mutations';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyTitle?: string;
}

export default function ReviewModal({ isOpen, onClose, propertyId, propertyTitle }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const createReview = useCreateReview();
  const handleError = useHandleMutationError();

  const reset = () => {
    setRating(5);
    setHoverRating(0);
    setComment('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId) return;
    createReview.mutate(
      { propertyId, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Review submitted! Thank you for your feedback.');
          reset();
          onClose();
        },
        onError: (err) => handleError(err, 'Submitting review'),
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
      <p className="text-xs text-slate-500 mb-4">
        Property: <strong className="text-slate-800">{propertyTitle}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl transition hover:scale-110"
                aria-label={`${star} star`}
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-sm font-bold text-slate-600 ml-2">{rating} / 5</span>
          </div>
        </div>

        <div>
          <label className="form-label">Your Experience</label>
          <textarea
            rows={4}
            required
            placeholder="Share your experience staying at this property..."
            className="form-input text-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={createReview.isPending} className="btn-primary flex-1 justify-center text-sm">
            {createReview.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary text-sm">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
