import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type MenuContextValue = {
    isMenuOpen: boolean;
    openMenu: () => void;
    closeMenu: () => void;
};

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const value: MenuContextValue = {
        isMenuOpen,
        openMenu: () => setMenuOpen(true),
        closeMenu: () => setMenuOpen(false),
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu는 MenuProvider 안에서만 쓸 수 있어요.");
    }
    return context;
}