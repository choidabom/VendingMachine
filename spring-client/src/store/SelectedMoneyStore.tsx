import { create } from "zustand";

interface selectedMoneyState {
    selectedMoney: number;
    setSelectedMoney: (price: number) => void;
}

const SelectedMoneyStore = create<selectedMoneyState>((set) => ({
    selectedMoney: 0,
    setSelectedMoney: (price: number) => {
        set({ selectedMoney: price });
    }
}));

export default SelectedMoneyStore;