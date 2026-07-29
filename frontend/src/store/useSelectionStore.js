import { create } from 'zustand';

export const useSelectionStore = create((set) => ({

    selectedNodeIds: [],

    setSelectedNodeIds: (ids) =>
        set({
            selectedNodeIds: ids
        })
}));