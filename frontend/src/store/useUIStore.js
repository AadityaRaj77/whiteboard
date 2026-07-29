import { create } from 'zustand';

export const useUIStore = create((set) => ({

    creatingNode: false,

    setCreatingNode: (value) =>
        set({
            creatingNode: value
        })
}));