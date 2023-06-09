import { create } from "zustand";

interface saveMoneyState {
    saveMoney: number;
    setSaveMoney: (price: number) => void;
    payment(selectedProduct: Array<any>): Promise<void>;
}

const SaveMoneyStore = create<saveMoneyState>((set, get) => ({
    saveMoney: 0,
    setSaveMoney: (price: number) => {
        set({ saveMoney: price });
    },

    payment: async (selectedProduct: Array<any>) => {
        //service.payment(vmId,paymentMethod,get().saveMoney,selectedProduct);
        return;
    }
}));

export default SaveMoneyStore;