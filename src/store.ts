import {create} from "zustand";
import { persist } from 'zustand/middleware'

// CHATROOMS STORE:
type StateChatrooms = {
    chatrooms: {
        [key: string]: number
    }
}

type ActionChatrooms = {
    updateChatrooms: (chatrooms: StateChatrooms['chatrooms']) => void

    addNewChatroom: (newChatroomId: string) => void
    updateChatroomTimestamp: (chatroomId: string, newTimestamp: number) => void

    resetChatrooms: () => void
}

export const useStoreChatrooms = create<StateChatrooms & ActionChatrooms>()(
    persist(
        (set, get) => ({
            chatrooms: {},
            updateChatrooms: (chatrooms) => set(() => ({ chatrooms: chatrooms })),

            addNewChatroom: (newChatroomId) => set((state) => ({ chatrooms: {...state.chatrooms, [newChatroomId]: Date.now()} })),
            updateChatroomTimestamp: (chatroomId, newTimestamp) => set((state) => ({ chatrooms: {...state.chatrooms, [chatroomId]: newTimestamp} })),

            resetChatrooms: () => set({chatrooms: {}})
        }),
        {
            name: 'chatrooms-storage'
        }
    )
)