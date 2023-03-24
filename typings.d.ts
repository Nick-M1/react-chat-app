type Message = {
    id: string
    timestamp: any
    text: string

    user: UserType
    isDeleted: boolean
}

type ChatRoom = {
    id: string
    name: string
    name_lowercase: string
    timestamp: any
    userIds: string[]
    users: UserType[]
}

type UserType = {
    id: string
    displayname: string
    email: string
    image: string
}