
import type React from "react";
import { useState, useRef, useEffect } from "react";
import type { Chat, Message } from "../types";
import { formatDate } from "../utils/dateUtils";
import { ArrowLeft, Send, Smile, Paperclip, MoreVertical } from "lucide-react";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
    chat: Chat;
    messages: Message[];
    onSendMessage: (text: string) => void;
    onBack?: () => void;
}

export default function ChatWindow({ chat, messages, onSendMessage, onBack }: ChatWindowProps) {
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (messageText.trim()) {
            onSendMessage(messageText);
            setMessageText("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Group messages by date
    const groupedMessages = messages.reduce(
        (groups: { [key: string]: Message[] }, message) => {
        const date = formatDate(message.timestamp);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        },
        {}
    );

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center">
                {onBack && (
                    <button onClick={onBack} className="mr-3 md:hidden">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                )}

                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">
                        {chat.profile_name
                        ? chat.profile_name.charAt(0).toUpperCase()
                        : chat.wa_id.slice(-2)}
                    </span>
                </div>

                <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">
                        {chat.profile_name || chat.wa_id}
                    </h2>
                    <p className="text-sm text-gray-500">{chat.wa_id}</p>
                </div>

                <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                    {/* Date separator */}
                    <div className="flex justify-center mb-4">
                        <span className="bg-white px-3 py-1 rounded-lg text-xs text-gray-500 shadow-sm">
                            {date}
                        </span>
                    </div>

                    {/* Messages for this date */}
                    {dateMessages.map((message, index) => (
                        <MessageBubble key={message._id || index} message={message} />
                    ))}
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-gray-100 p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                        <Smile className="w-5 h-5" />
                    </button>

                    <button className="p-2 text-gray-500 hover:text-gray-700">
                        <Paperclip className="w-5 h-5" />
                    </button>

                    <div className="flex-1 relative">
                        <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!messageText.trim()}
                        className="p-2 text-green-500 hover:text-green-600 disabled:text-gray-400"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
