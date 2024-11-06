import { create } from "zustand";

const useSocketStore = create((set) => ({
  socket: null,
  setSocket: (connect) => set({ socket: connect }),
}));

export default useSocketStore;
