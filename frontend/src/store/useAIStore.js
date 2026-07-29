import { create } from 'zustand';

export const useAIStore = create((set) => ({

    loading: false,

    critique: null,
    validation: null,
    expansion: null,
    plan: null,

    setLoading: (loading) =>
        set({ loading }),

    setCritique: (data) =>
        set({ critique: data }),

    setValidation: (data) =>
        set({ validation: data }),

    setExpansion: (data) =>
        set({ expansion: data }),

    setPlan: (data) =>
        set({ plan: data }),

    clearResults: () =>
        set({
            critique: null,
            validation: null,
            expansion: null,
            plan: null
        })
}));