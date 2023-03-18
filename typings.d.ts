type Message = {
    id: string
    createdAt: number
    text: string

    userId: string
    userDisplayname: string
    userImage: string
}

type ChatRoom = {
    id: string
    users: string[]
    messages: Message[]
}