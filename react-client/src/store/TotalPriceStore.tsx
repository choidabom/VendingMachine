import { create } from "zustand";

interface totalPriceState {
    totalPrice: number;
    setTotalPrice: (price: number) => void;
}

const TotalPriceStore = create<totalPriceState>((set) => ({
    totalPrice: 0,
    setTotalPrice: (price: number) => {
        set({ totalPrice: price });
    }
}));

export default TotalPriceStore;