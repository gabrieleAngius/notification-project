# Notification Library

## Description
This library is meant for create and manage notifications through a **JSON server**. Is possible to add channels (that exists in the server) and push notification, get the notifications from remote and read them. 

## Usage example

### Add a channel
```typescript
addChannel(channelName: string, newUrl: string): void
```

### Set the name of the sender
```typescript
setSender(name: string, flag?: string): void
```

### Subscribe in a channel
```typescript
subscribe(channelName: string, ...callbacks: SubscriberCallback[]): void
```

This method is meant for subscribe in a channel: add a list of callback function, called evrytime you get new notifications.

The `onNewNotification()` function is wrote just for give an example: it simply log all properties of all new notifications obtained.

### Unsubscribe
```typescript
unSubscribe(channelName: string): void
```

### Get the notification

For better functionality, the get method has been split into **two differents**: 

```typescript
async getAll(channelName: string): Promise<Notification[] | void>
```
This method get all notification from the channel, but before do the remote call, it **check if there already are notifications in the local list.**
So, if the local list of notifications isn't empty, it calls the server and return the list of notifications obtained, otherwise it just return the local list of notifications.*

```typescript
async getNew(channelName: string): Promise<Notification[] | void>
```
This one, instead, calls the server **without check** if there are some notifications in local. 
The return value depends: if there are new notifications, return them and call the subscribers (if some callback are subscribed in that channel), otherwise return undefined.

So, the main difference between the two methods is the return value: the first one always* return all notifications, the second one just* the new notifications or undefined.

### Push
```typescript
async push(channelName: string, ...newNotifications: Notification[]): Promise<Notification[] | void>
```
The push method send notifications to the server (and push them in local). You can call the method once for send several notifications. 
The return value is a list of the notifications that you have send.*

### Read
```typescript
async read(idNotifica: string, channelName: string): Promise<Notification | void>
```
The read method add a date timestamp to the notification you want (in both local and remore). It return the readed notification.*

### Notify one
```typescript
notifyOneByIdAndChannelName(idNotifica: string, channelName: string): void | Notification
```
This method simply return a notification ad log all the properties.* It look for that one just in local.

*: *as long as the process is successfully* 