import React, { useState, useEffect } from 'react';
import { Search, Filter, Tag, Clock, ChevronRight, Plus } from 'lucide-react';
import { HistoryItem } from '../types';
import { StorageService } from '../services/storage';

interface DashboardProps {
  onSelectQuestion: (item: HistoryItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectQuestion }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagInputs, setNewTagInputs] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setHistory(StorageService.getHistory());
  }, []);

  const allTags = Array.from(new Set(history.flatMap(h => h.tags)));

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.analysis.concept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleAddTag = (itemId: string) => {
    const tagToAdd = newTagInputs[itemId]?.trim();
    if (tagToAdd) {
      const updatedHistory = StorageService.addTag(itemId, tagToAdd);
      setHistory(updatedHistory);
      setNewTagInputs({ ...newTagInputs, [itemId]: '' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 font-serif">My Library</h2>
           <p className="text-gray-500 text-sm">Review your past questions and concepts</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-iitm-red"
             />
          </div>
          
          <div className="relative">
             <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <select 
               value={selectedTag || ''} 
               onChange={(e) => setSelectedTag(e.target.value || null)}
               className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-iitm-red appearance-none cursor-pointer"
             >
               <option value="">All Topics</option>
               {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
             </select>
          </div>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">No questions found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredHistory.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleDateString()}
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="font-bold text-iitm-red">{item.analysis.concept}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.question}</h3>
                  
                  {/* Tags Section */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {tag}
                      </span>
                    ))}
                    
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="+ Tag"
                        value={newTagInputs[item.id] || ''}
                        onChange={(e) => setNewTagInputs({...newTagInputs, [item.id]: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag(item.id)}
                        className="w-16 px-2 py-0.5 text-xs border border-gray-200 rounded bg-transparent focus:w-24 focus:border-iitm-red focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onSelectQuestion(item)}
                  className="p-2 text-gray-400 hover:text-iitm-red hover:bg-iitm-red-light rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};