import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { StorageService } from '../services/storage';

interface FeedbackWidgetProps {
  itemId: string;
  existingFeedback?: any;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ itemId, existingFeedback }) => {
  const [rating, setRating] = useState<number>(existingFeedback?.rating || 0);
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [submitted, setSubmitted] = useState(!!existingFeedback);

  const handleSubmit = () => {
    if (rating === 0) return;
    StorageService.submitFeedback(itemId, {
      rating,
      comment,
      timestamp: Date.now()
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
        <div className="bg-green-100 p-2 rounded-full">
           <Star className="w-4 h-4 text-green-600 fill-green-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-green-800">Feedback Sent!</p>
          <p className="text-xs text-green-600">Thank you for helping improve the Study Buddy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Was this explanation helpful?
      </h4>
      
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="focus:outline-none hover:scale-110 transition-transform"
          >
            <Star 
              className={`w-6 h-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Any specific feedback on the reasoning steps? (Optional)"
        className="w-full p-3 text-sm border border-gray-200 rounded-lg mb-3 focus:ring-1 focus:ring-iitm-red focus:border-iitm-red outline-none resize-none h-20"
      />

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit Feedback <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};