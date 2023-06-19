import { create } from "zustand";

interface paymentMethodState {
    paymentMethod: number;
    setPaymentMethod: (paymentMethod: number) => void;
}

const PaymentMethodStore = create<paymentMethodState>((set) => ({
    paymentMethod: 0,
    setPaymentMethod: (paymentMethod: number) => {
        set({ paymentMethod: paymentMethod });
    }
}));

export default PaymentMethodStore;