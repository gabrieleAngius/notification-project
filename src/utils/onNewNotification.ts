import { Notification } from "../classes/Notification";
import { notifyAllProperties } from "./notifyAllProperties";

export function onNewNotification(notificationList: Notification[]): void {

	console.warn(`Ci sono ${notificationList.length} nuove notifiche sul canale:`);
	notificationList.forEach((element) => {
		notifyAllProperties(element);
	});
}