import { create } from 'zustand';

export const useBoardStore = create((set) => ({

    nodes: [],

    setNodes: (nodes) => set({ nodes }),

    addNode: (node) =>
        set((state) => ({
            nodes: [...state.nodes, node]
        })),

    updateNode: (id, updates) =>
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node._id === id
                    ? { ...node, ...updates }
                    : node
            )
        }))
}));