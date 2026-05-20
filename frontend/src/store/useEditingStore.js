import { create } from 'zustand';

export const useEditingStore = create((set) => ({

    editingNode: null,

    setEditingNode: (node) =>
        set({
            editingNode: node
        }),

    clearEditingNode: () =>
        set({
            editingNode: null
        })
}));