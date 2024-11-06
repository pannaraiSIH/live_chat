import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      userId: null,
      username: null,
      role: null,
      profileImage: null,
      setUser: (data) =>
        set({
          userId: data.userId,
          username: data.username,
          role: data.role,
          profileImage: data.profileImage,
        }),
      logout: () => {
        set(() => ({
          userId: null,
          username: null,
          role: null,
          profileImage: null,
        }));
        localStorage.removeItem("user");
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
