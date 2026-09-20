//FridgeContext.tsx
// filepath: src/context/FridgeContext.tsx
import { createContext } from "react";
import { PantryItem } from "../types";
export interface FridgeContextType {
  addPantryItem: (item: Omit<PantryItem,'id'>) => Promise<void>;
  updatePantryItem: (id: string, item: Omit<PantryItem,'id'>) => Promise<void>;
  deletePantryItem: (id: string) => Promise<void>;
  addToast: (msg: string, variant: 'success'|'error') => void;
  
}
export const FridgeContext = createContext<FridgeContextType>({
  addPantryItem: async () => {},
  updatePantryItem: async () => {},
  deletePantryItem: async () => {},
  addToast: () => {},

});