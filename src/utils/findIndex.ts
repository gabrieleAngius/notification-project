import { Notification } from "../classes/Notification";

export function findMyIndexByIdAndNotificationList(idDaCercare: string, notificationList: Notification[]): number {
	const indexFound = notificationList.findIndex((value) => {
		return value.id === idDaCercare;
	});
	return indexFound;
}