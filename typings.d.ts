type Message = {
    id: string
    timestamp: any

    text: string
    attachedFileUrl?: string

    user: UserType

    isDeleted: boolean
    replyToMsgId?: string

    reactions: any[]        //todo: make specific
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
    fcmToken: string
}

type Reaction = {
    name: string
    icon: string;
    gif: string;
}