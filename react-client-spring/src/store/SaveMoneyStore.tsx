import { create } from "zustand";

interface saveMoneyState {
    saveMoney: number;
    setSaveMoney: (price: number) => void;
}

const SaveMoneyStore = create<saveMoneyState>((set) => ({
    saveMoney: 0,
    setSaveMoney: (price: number) => {
        set({ saveMoney: price });
    }
}));

export default SaveMoneyStore;