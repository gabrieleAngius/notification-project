export interface AllMessages {
    channelNotFound: string;
    channelAlreadyExist: string;
    alreadySubscribed: string;
    notSubscribed: string;
    subscriberSetted: string;
    subscriberCalled: string;
    senderSetted: string;
    senderAlreadyExist: string;
    notificationNotFound: string;
    notificationAlreadyRead: string;
    notificationListEmpty: string;
    notificationListNotEmpty: string;
    getDone: string;
    getFailed: string;
    refreshDone: string;
    postDone: string;
    postFailed: string;
    patchDone: string;
    patchFailed: string;
}

export interface Messages {
    error: (message: keyof AllMessages, element: string) => void;
    warn: (message: keyof AllMessages, element: string) => void;
    info: (message: keyof AllMessages, element: string) => void;
}