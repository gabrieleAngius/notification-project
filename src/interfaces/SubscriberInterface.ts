import { Notification } from "../classes/Notification";

export type SubscriberCallback = (newNotifications: Notification[]) => void;

export type SubscriberContainer = {
	[key: string]: SubscriberCallback[]
}