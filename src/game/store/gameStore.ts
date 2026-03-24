import { create } from "zustand";

type GameState = {
    score: number;
    isPaused: boolean;


    addScore: (value: number) => void;
    resetScore: () => void;

    setPaused: (value: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
    score: 0,
    isPaused: false,

    addScore: (value) => set((state) => ({score: state.score + value})),
    resetScore: () => set({score: 0}),

    setPaused: (value) => set({isPaused: value}),
}));
