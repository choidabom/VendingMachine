import create from "zustand";
interface totalPrice {
    totalPrice: number;
    setTotalPrice: (totalPrice: number) => void;
}

const TotalPriceStore = create<totalPrice>((set) => ({
    totalPrice: 0,
    setTotalPrice: (totalPrice) => {
        set((state) => ({ totalPrice: totalPrice }));
    }
}));

export default TotalPriceStore;