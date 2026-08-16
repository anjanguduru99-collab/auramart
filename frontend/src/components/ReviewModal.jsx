import React, { useState } from 'react';
import { X, Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { submitReview } from '../services/api';

export default function ReviewModal({ product, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('Sarah Jenkins');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a comment for your review.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const review = await submitReview({
        productId: product.id,
        rating,
        title: title.trim() || 'Verified Customer Review',
        comment: comment.trim(),
        userName: userName.trim() || 'Anonymous Customer'
      });

      setIsSubmitting(false);
      onReviewSubmitted(review);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in" />

      <div className="relative w-full max-w-lg glass-panel bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 z-10 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Write a Product Review</h3>
              <p className="text-xs text-slate-400 line-clamp-1">{product.title}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Picker */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Overall Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-amber-500">{rating} Out of 5 Stars</span>
              </div>
            </div>

            {/* User Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            {/* Review Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Review Headline</label>
              <input
                type="text"
                placeholder="e.g. Outstanding audio quality & ultra comfortable"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Review</label>
              <textarea
                rows={4}
                placeholder="Share what you liked, battery life, design, or performance..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            {error && <p className="text-xs font-bold text-rose-500">{error}</p>}

            <div className="pt-2 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 btn btn-secondary text-xs py-3">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 btn btn-primary text-xs py-3">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
