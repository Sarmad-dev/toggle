import { create } from 'zustand';
import { createTimeEntry } from '@/lib/actions/time-entries';

interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  description: string;
  selectedProjectId: string | null;
  duration: number;
  start: (projectId?: string) => void;
  stop: (userId: string) => Promise<void>;
  reset: () => void;
  setDescription: (description: string) => void;
  setSelectedProject: (projectId: string) => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  startTime: null,
  description: "",
  selectedProjectId: null,
  duration: 0,

  start: (projectId?: string) => {
    if (projectId) {
      set({ selectedProjectId: projectId });
    }
    set({ isRunning: true, startTime: new Date(), duration: 0 });
  },

  stop: async (userId: string) => {
    const { startTime, description, selectedProjectId, duration } = get();
    set({ isRunning: false });

    if (startTime && selectedProjectId) {
      try {
        await createTimeEntry({
          description,
          startTime,
          endTime: new Date(),
          duration,
          projectId: selectedProjectId,
          userId,
        });
        set({ description: "", duration: 0 });
      } catch (error) {
        console.error('Failed to save time entry:', error);
        throw error;
      }
    }
  },

  reset: () => {
    set({
      isRunning: false,
      startTime: null,
      description: "",
      selectedProjectId: null,
      duration: 0,
    });
  },

  setDescription: (description: string) => set({ description }),
  setSelectedProject: (projectId: string) => set({ selectedProjectId: projectId }),
  tick: () => set((state) => ({ duration: state.duration + 1 })),
})); 