export interface Message {
    _id?: string
    wa_id: string
    from?: string
    text: string
    timestamp: string
    type: "text" | "image" | "document" | "outgoing"
    status?: "sent" | "delivered" | "read"
    meta_msg_id?: string
}

export interface Chat {
    wa_id: string
    profile_name?: string
    lastMessage?: Message
    unreadCount: number
}
