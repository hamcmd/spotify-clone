import { create } from "zustand";

interface PlayerStore {
    ids: string[];
    activeId?: string;
    setActiveId: (id: string) => void;
    setActiveIds: (ids: string[]) => void;
    reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    activeId: undefined,
    setActiveId: (id: string) => set((state) => ({ activeId: id })),
    setActiveIds: (ids: string[]) => set((state) => ({ ids })),
    reset: () => set((state) => ({ ids: [], activeId: undefined })),
}));

export default usePlayer;