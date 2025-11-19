
import React, { useState } from 'react';
import { BookOpen, Brain, ChevronRight, GraduationCap, Sparkles, LayoutGrid, Plus, ListChecks } from 'lucide-react';
import { analyzeQuestion, generateQuizQuestion } from './services/geminiService';
import { StorageService } from './services/storage';
import { AnalysisResult, QuizQuestion, ViewState, HistoryItem } from './types';
import { Spinner } from './components/Spinner';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { QuizModal } from './components/QuizModal';
import { Dashboard } from './components/Dashboard';
import { FeedbackWidget } from './components/FeedbackWidget';

export default function App() {
  const [input, setInput] = useState('');
  const [viewState, setViewState] = useState<ViewState>(ViewState.IDLE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [quizData, setQuizData] = useState<QuizQuestion | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setViewState(ViewState.ANALYZING);
    setAnalysis(null);
    setCurrentHistoryId(null);
    
    try {
      const result = await analyzeQuestion(input);
      setAnalysis(result);
      
      // Auto-save to history
      const savedItem = StorageService.saveHistory(input, result);
      setCurrentHistoryId(savedItem.id);

      setViewState(ViewState.LEARNING);
    } catch (error) {
      console.error(error);
      setViewState(ViewState.IDLE);
      alert("Something went wrong analyzing the question. Please try again.");
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.question);
    setAnalysis(item.analysis);
    setCurrentHistoryId(item.id);
    setViewState(ViewState.LEARNING);
  };

  const handleQuizStart = async () => {
    if (!analysis) return;
    
    setIsGeneratingQuiz(true);
    try {
      const question = await generateQuizQuestion(analysis.concept, input);
      setQuizData(question);
      setIsQuizOpen(true);
    } catch (e) {
      alert("Could not generate quiz at this time.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };
  
  const handleNextQuizQuestion = async () => {
    handleQuizStart();
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-800 bg-iitm-beige font-sans">
      {/* Header */}
      <header className="bg-iitm-red text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewState(ViewState.IDLE)}>
            <div className="p-1.5 bg-white/10 rounded-lg">
                <GraduationCap className="w-6 h-6 text-iitm-beige-dark" />
            </div>
            <h1 className="text-xl font-bold tracking-wide font-serif">IITM Study Buddy</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setViewState(ViewState.DASHBOARD)}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewState === ViewState.DASHBOARD ? 'bg-white text-iitm-red' : 'hover:bg-white/10'}`}
             >
               <LayoutGrid className="w-4 h-4" /> My Library
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* IDLE STATE - LANDING */}
        {viewState === ViewState.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 font-serif">Master Complex Concepts</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Paste your Data Science, Math, or Programming problem below. 
                AI will break it down, explain the theory, and help you solve it step-by-step.
              </p>
            </div>

            <div className="w-full bg-white p-2 rounded-2xl shadow-xl border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-iitm-red/20">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Explain how to implement a binary search tree in Python..."
                className="w-full p-4 text-lg bg-transparent border-none focus:ring-0 resize-none text-gray-800 placeholder-gray-400 min-h-[120px]"
              />
              <div className="flex justify-between items-center px-4 pb-2">
                <span className="text-xs text-gray-400 font-medium">Supported by Gemini 3</span>
                <button
                  onClick={handleAnalyze}
                  disabled={!input.trim()}
                  className="flex items-center gap-2 bg-iitm-red text-white px-6 py-2.5 rounded-xl font-medium hover:bg-iitm-red-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                  Submit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
               <FeatureCard icon={<Brain className="w-5 h-5" />} title="Reasoning Engine" desc="Deep conceptual breakdowns." />
               <FeatureCard icon={<BookOpen className="w-5 h-5" />} title="Step-by-Step" desc="Learn the methodology." />
               <FeatureCard icon={<ListChecks className="w-5 h-5" />} title="Practice Quizzes" desc="Test your knowledge instantly." />
            </div>
          </div>
        )}

        {/* ANALYZING STATE */}
        {viewState === ViewState.ANALYZING && (
          <div className="min-h-[60vh] flex items-center justify-center">
             <Spinner message="Analyzing problem structure and identifying concepts..." />
          </div>
        )}

        {/* DASHBOARD STATE */}
        {viewState === ViewState.DASHBOARD && (
          <Dashboard onSelectQuestion={handleHistorySelect} />
        )}

        {/* LEARNING STATE */}
        {viewState === ViewState.LEARNING && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Main Content Column (Centered) */}
            <div className="flex flex-col gap-6 lg:col-span-8 lg:col-start-3">
              
              {/* Breadcrumb / Navigation */}
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => setViewState(ViewState.DASHBOARD)}
                  className="text-sm text-gray-500 hover:text-iitm-red"
                 >
                   My Library
                 </button>
                 <ChevronRight className="w-3 h-3 text-gray-400" />
                 <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{input}</span>
              </div>

              {/* Concept Header Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-iitm-red">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-1 block">Core Concept</span>
                    <h2 className="text-2xl font-bold text-gray-900 font-serif">{analysis.concept}</h2>
                  </div>
                  <button 
                    onClick={handleQuizStart}
                    disabled={isGeneratingQuiz}
                    className="flex items-center gap-2 px-4 py-2 bg-iitm-beige-dark text-iitm-red rounded-lg font-semibold hover:bg-opacity-80 transition-colors text-sm border border-iitm-beige-border"
                  >
                     {isGeneratingQuiz ? <Sparkles className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                     Quiz Me
                  </button>
                </div>
              </div>

              {/* Main Explanation */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <MarkdownRenderer content={analysis.explanationMarkdown} />
              </div>
              
              {/* Feedback Section */}
              {currentHistoryId && (
                <FeedbackWidget 
                  itemId={currentHistoryId} 
                  existingFeedback={StorageService.getHistory().find(h => h.id === currentHistoryId)?.feedback}
                />
              )}

              <div className="flex justify-center pb-10">
                <button 
                  onClick={() => { setInput(''); setViewState(ViewState.IDLE); }}
                  className="flex items-center gap-2 text-gray-500 hover:text-iitm-red text-sm font-medium transition-colors group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Ask another question
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quiz Modal */}
      {quizData && (
        <QuizModal 
          isOpen={isQuizOpen} 
          onClose={() => setIsQuizOpen(false)} 
          data={quizData} 
          onNext={handleNextQuizQuestion}
          loadingNext={isGeneratingQuiz}
        />
      )}
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-8 h-8 bg-iitm-red-light text-iitm-red rounded-lg flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);
