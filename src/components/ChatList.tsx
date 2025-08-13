import { useState } from "react";
import type { Chat } from "../types";
import { formatTime } from "../utils/dateUtils";
import { Search, MoreVertical } from "lucide-react";

interface ChatListProps {
    chats: Chat[];
    selectedChat: Chat | null;
    onChatSelect: (chat: Chat) => void;
}

export default function ChatList({ chats, selectedChat, onChatSelect }: ChatListProps) {
    const [searchPrompt, setSearchPrompt] = useState<string>("")

    const filterUser = (chats: Chat[]): Chat[] => {
        return chats.filter(item => (item.profile_name?.includes(searchPrompt) || item.wa_id.includes(searchPrompt))) || [] as Chat[]
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gray-100 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
                    <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                        value={searchPrompt}
                        onChange={e => setSearchPrompt(e.target.value)}
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {filterUser(chats).length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    <p>No chats available</p>
                </div>
                ) : (
                filterUser(chats).map((chat) => (
                    <div
                        key={chat.wa_id}
                        onClick={() => onChatSelect(chat)}
                        className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                            selectedChat?.wa_id === chat.wa_id ? "bg-gray-100" : ""
                        }`}
                    >
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-semibold">
                        {chat.profile_name
                            ? chat.profile_name.charAt(0).toUpperCase()
                            : chat.wa_id.slice(-2)}
                        </span>
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                                {chat.profile_name || chat.wa_id}
                            </h3>
                            {chat.lastMessage && (
                                <span className="text-xs text-gray-500 ml-2">
                                {formatTime(chat.lastMessage.timestamp)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                                {chat.lastMessage?.text || "No messages yet"}
                            </p>

                            {chat.unreadCount > 0 && (
                                <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                                {chat.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>
        </div>
    );
}
