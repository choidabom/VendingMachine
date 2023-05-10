import create from "zustand";

interface ID {
    id: number,
    setId: (id: number) => void;
}

const IdStore = create<ID>((set) => ({
    id: 0,
    setId: (id) => {
        set((state) => ({ id: id }));
    }
}));

export default IdStore;