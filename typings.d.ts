type Message = {
    id: string
    createdAt: number
    text: string

    user: UserType
}

type ChatRoom = {
    id: string
    userIds: string[]
    users: UserType[]
}

type UserType = {
    id: string
    displayname: string
    email: string
    image: string
}