import { create } from "zustand";

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "DISPUTED";

export interface Order {
  id: string;
  title: string;
  description: string;
  status: OrderStatus;
  salary: number;
  salaryType: "HOURLY" | "DAILY" | "FIXED";
  serviceCategory: string;
  skills: string[];
  location: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime?: string;
  employerId: string;
  workerId?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  filter: {
    status?: OrderStatus;
    serviceCategory?: string;
  };
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  setCurrentOrder: (order: Order | null) => void;
  setFilter: (filter: Partial<OrderState["filter"]>) => void;
  clearFilter: () => void;
  setLoading: (loading: boolean) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  filter: {},
  setOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? { ...o, ...updates, updatedAt: new Date().toISOString() }
          : o,
      ),
      currentOrder:
        state.currentOrder?.id === id
          ? {
              ...state.currentOrder,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : state.currentOrder,
    })),
  setCurrentOrder: (currentOrder) => set({ currentOrder }),
  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),
  clearFilter: () => set({ filter: {} }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export const useFilteredOrders = () => {
  return useOrderStore((state) => {
    let filtered = state.orders;

    if (state.filter.status) {
      filtered = filtered.filter((o) => o.status === state.filter.status);
    }

    if (state.filter.serviceCategory) {
      filtered = filtered.filter(
        (o) => o.serviceCategory === state.filter.serviceCategory,
      );
    }

    return filtered;
  });
};
