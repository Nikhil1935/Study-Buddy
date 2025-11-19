import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuizQuestion;
  onNext?: () => void;
  loadingNext?: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, data, onNext, loadingNext }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedOption !== null) setIsSubmitted(true);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    if (onNext) onNext();
  };

  const isCorrect = selectedOption === data.correctOptionIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-t-4 border-iitm-red animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 font-serif">Practice Quiz</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{data.question}</p>

          <div className="space-y-3">
            {data.options.map((option, idx) => {
              let styles = "border-gray-200 hover:border-iitm-red hover:bg-iitm-red-light";
              
              if (isSubmitted) {
                if (idx === data.correctOptionIndex) {
                    styles = "border-green-500 bg-green-50 text-green-800 font-medium ring-1 ring-green-500";
                } else if (idx === selectedOption && idx !== data.correctOptionIndex) {
                    styles = "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500";
                } else {
                    styles = "border-gray-100 text-gray-400 opacity-50";
                }
              } else if (selectedOption === idx) {
                  styles = "border-iitm-red bg-iitm-red-light ring-1 ring-iitm-red";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isSubmitted && setSelectedOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${styles}`}
                >
                  <span>{option}</span>
                  {isSubmitted && idx === data.correctOptionIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {isSubmitted && idx === selectedOption && idx !== data.correctOptionIndex && <AlertCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-1">Explanation</h4>
              <p className="text-sm text-gray-600">{data.explanation}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
           {!isSubmitted ? (
             <button 
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-6 py-2.5 bg-iitm-red text-white font-medium rounded-lg hover:bg-iitm-red-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
             >
               Check Answer
             </button>
           ) : (
             <button 
                onClick={handleNext}
                disabled={loadingNext}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-all"
             >
               {loadingNext ? "Generating..." : "Next Question"}
               {!loadingNext && <ArrowRight className="w-4 h-4" />}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};