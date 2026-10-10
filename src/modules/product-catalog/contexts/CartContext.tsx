'use client';

import { toast } from 'react-toastify';
import React, { useEffect, useContext, useReducer, useCallback, createContext } from 'react';

import { cartService } from '../services/cartService';

import type { ICart, ICartItem, IGuestCartItem } from '../types/cartTypes';

// ----------------------------------------------------------------------

const GUEST_CART_KEY = 'guest_cart';

type CartState = {
  cart: ICart | null;
  guestItems: IGuestCartItem[];
  open: boolean;
};

type CartAction =
  | { type: 'SET_CART'; payload: ICart }
  | { type: 'SET_GUEST'; payload: IGuestCartItem[] }
  | { type: 'TOGGLE_DRAWER'; payload?: boolean };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_GUEST':
      if (typeof window !== 'undefined') {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(action.payload));
      }
      return { ...state, guestItems: action.payload };
    case 'TOGGLE_DRAWER':
      return { ...state, open: action.payload ?? !state.open };
    default:
      return state;
  }
}

// ----------------------------------------------------------------------

export type CartContextType = {
  cart: ICart | null;
  guestItems: IGuestCartItem[];
  totalItems: number;
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (
    item: {
      ProductId: string;
      VariantId: string;
      Quantity: number;
      ProductName: string;
      VariantName: string;
      EffectivePrice: number;
      ImageUrl?: string | null;
      StockQuantity: number;
      MetrixWeight: number;
      ProductWeight: number;
    },
    isLoggedIn: boolean
  ) => Promise<void>;
  updateItem: (
    cartItemId: string,
    quantity: number,
    isLoggedIn: boolean,
    variantId?: string
  ) => Promise<void>;
  removeItem: (cartItemId: string, isLoggedIn: boolean, variantId?: string) => Promise<void>;
  clearCart: (isLoggedIn: boolean) => Promise<void>;
  mergeAndLoad: () => Promise<void>;
  fetchCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextType>({} as CartContextType);

// ----------------------------------------------------------------------

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    cart: null,
    guestItems: [],
    open: false,
  });

  // Load guest items from localStorage after mount (SSR-safe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (stored) {
        try {
          dispatch({ type: 'SET_GUEST', payload: JSON.parse(stored) });
        } catch {}
      }
    }
  }, []);

  const loggedIn = typeof window !== 'undefined' && !!localStorage.getItem('EcomAccessToken');

  const fetchCart = useCallback(async () => {
    try {
      const data = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: data });
    } catch {
      // silently fail — user may not be logged in
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    cartService
      .getCart()
      .then((data) => {
        dispatch({ type: 'SET_CART', payload: data });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mergeAndLoad = useCallback(async () => {
    const guests: IGuestCartItem[] = JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? '[]');
    try {
      if (guests.length > 0) {
        const merged = await cartService.mergeGuestCart(guests);
        dispatch({ type: 'SET_CART', payload: merged });
        dispatch({ type: 'SET_GUEST', payload: [] });
      } else {
        await fetchCart();
      }
    } catch {
      await fetchCart();
    }
  }, [fetchCart]);

  const addToCart = useCallback(
    async (
      item: {
        ProductId: string;
        VariantId: string;
        Quantity: number;
        ProductName: string;
        VariantName: string;
        EffectivePrice: number;
        ImageUrl?: string | null;
        StockQuantity: number;
      },
      isLoggedIn: boolean
    ) => {
      if (isLoggedIn) {
        await cartService.addToCart({
          ProductId: item.ProductId,
          VariantId: item.VariantId,
          Quantity: item.Quantity,
        });
        await fetchCart();
      } else {
        const guests = [...state.guestItems];
        const idx = guests.findIndex((g) => g.VariantId === item.VariantId);
        if (idx >= 0) {
          guests[idx] = { ...guests[idx], Quantity: guests[idx].Quantity + item.Quantity };
        } else {
          guests.push({
            ProductId: item.ProductId,
            VariantId: item.VariantId,
            Quantity: item.Quantity,
            ProductName: item.ProductName,
            VariantName: item.VariantName,
            EffectivePrice: item.EffectivePrice,
            ImageUrl: item.ImageUrl,
            StockQuantity: item.StockQuantity,
          });
        }
        dispatch({ type: 'SET_GUEST', payload: guests });
      }
      toast.success('Added to cart');
    },
    [state.guestItems, fetchCart]
  );

  const updateItem = useCallback(
    async (cartItemId: string, quantity: number, isLoggedIn: boolean, variantId?: string) => {
      if (isLoggedIn) {
        await cartService.updateCartItem(cartItemId, quantity);
        await fetchCart();
      } else {
        const guests = state.guestItems
          .map((g) => (g.VariantId === variantId ? { ...g, Quantity: quantity } : g))
          .filter((g) => g.Quantity > 0);
        dispatch({ type: 'SET_GUEST', payload: guests });
      }
    },
    [state.guestItems, fetchCart]
  );

  const removeItem = useCallback(
    async (cartItemId: string, isLoggedIn: boolean, variantId?: string) => {
      if (isLoggedIn) {
        await cartService.removeCartItem(cartItemId);
        await fetchCart();
      } else {
        dispatch({
          type: 'SET_GUEST',
          payload: state.guestItems.filter((g) => g.VariantId !== variantId),
        });
      }
    },
    [state.guestItems, fetchCart]
  );

  const clearCart = useCallback(async (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      await cartService.clearCart();
      dispatch({
        type: 'SET_CART',
        payload: { CartId: '', Items: [], SubTotal: 0, TotalItems: 0 },
      });
    } else {
      dispatch({ type: 'SET_GUEST', payload: [] });
    }
  }, []);

  const serverItems: ICartItem[] = state.cart?.Items ?? [];
  const totalItems = loggedIn
    ? serverItems.reduce((s, i) => s + i.Quantity, 0)
    : state.guestItems.reduce((s, i) => s + i.Quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        guestItems: state.guestItems,
        totalItems,
        open: state.open,
        openDrawer: () => dispatch({ type: 'TOGGLE_DRAWER', payload: true }),
        closeDrawer: () => dispatch({ type: 'TOGGLE_DRAWER', payload: false }),
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        mergeAndLoad,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
