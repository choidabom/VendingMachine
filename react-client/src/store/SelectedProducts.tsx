import { create } from "zustand";
import { ProductEntity } from "../entity/ProductEntity";

interface SelectedProductsSate {
    selectedProducts: ProductEntity[];
    setSelectedProducts: (products: ProductEntity[]) => void;
}

const SelectedProductsStore = create<SelectedProductsSate>((set) => ({
    selectedProducts: [],
    setSelectedProducts: (products) => {
        set({ selectedProducts: products });
    }
}));

export default SelectedProductsStore;