
import { HistoryItem, Feedback, User } from '../types';

const KEYS = {
  HISTORY: 'iitm_buddy_history',
  USERS: 'iitm_buddy_users',
};

export const StorageService = {
  // --- History & Tags ---
  saveHistory: (question: string, analysis: any): HistoryItem => {
    const history = StorageService.getHistory();
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      question,
      analysis,
      tags: [analysis.concept], // Default tag
      timestamp: Date.now(),
    };
    
    history.unshift(newItem);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    return newItem;
  },

  getHistory: (): HistoryItem[] => {
    return JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]');
  },

  addTag: (itemId: string, newTag: string) => {
    const history = StorageService.getHistory();
    const item = history.find(h => h.id === itemId);
    if (item && !item.tags.includes(newTag)) {
      item.tags.push(newTag);
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    }
    return history;
  },

  removeTag: (itemId: string, tagToRemove: string) => {
    const history = StorageService.getHistory();
    const item = history.find(h => h.id === itemId);
    if (item) {
      item.tags = item.tags.filter(t => t !== tagToRemove);
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    }
    return history;
  },

  // --- Feedback ---
  submitFeedback: (itemId: string, feedback: Feedback) => {
    const history = StorageService.getHistory();
    const item = history.find(h => h.id === itemId);
    if (item) {
      item.feedback = feedback;
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    }
  },

  // --- Auth (Mock) ---
  login: (email: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    return { name: user.name, email: user.email };
  },

  signup: (email: string, name: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    if (users.some((u: any) => u.email === email)) {
      throw new Error("User already exists");
    }
    
    const newUser = { email, name, password };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    
    return { name, email };
  }
};
