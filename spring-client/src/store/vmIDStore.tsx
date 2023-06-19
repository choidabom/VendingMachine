import { create } from "zustand";

interface vmIDState {
    vmID: number;
    setVMId: (vmID: number) => void;
}

const vmIDStore = create<vmIDState>((set) => ({
    vmID: 0,
    setVMId: (vmID) => {
        set({ vmID: vmID });
    }
}));

export default vmIDStore;