import { logMessages } from "../utils/messages";
import { notifyAllProperties } from "../utils/notifyAllProperties";
import { findMyIndexByIdAndNotificationList } from "../utils/findIndex";
import { getFromRemote } from "../utils/fetch/getFromRemote";
import { postRemoteData } from "../utils/fetch/postRemoteData";
import { patchRemoteData } from "../utils/fetch/patchRemoteData";

//classes
import { Notification } from "./Notification";

// interfaces
import { NotificationContainer } from "../interfaces/NotificationContainer";
import { SubscriberContainer, SubscriberCallback } from "../interfaces/SubscriberInterface";
import { Channel, ChannelContainer } from "../interfaces/ChannelInterface";

export class NotificationCenter {
	senderName: string;
	channels: ChannelContainer;
	allNotifications: NotificationContainer;
	subscribed: SubscriberContainer;

	constructor() {
		this.allNotifications = {};
		this.channels = {};
		this.senderName = "";
		this.subscribed = {};
	}

	setSender(name: string, flag?: string): void {

		if (flag === undefined) {
			flag = "";
		}

		if (this.senderName != "" && !/force/i.test(flag)) {
			logMessages.error("senderAlreadyExist", name);
			return;
		}

		logMessages.warn("senderSetted", name);
		this.senderName = name;
	}

	addChannel(channelName: string, newUrl: string): void {

		if (this.channels[channelName]) {
			logMessages.error("channelAlreadyExist", channelName);
			return;
		}

		this.channels = {
			...this.channels,
			[channelName]: {
				url: newUrl,
				patchOption: {
					method: 'PATCH',
					headers: {
						'Accept': 'application/json',
						'Content-Type': "application/json"
					},
				},
				postOption: {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': "application/json"
					},
				}
			}
		}

		// imposta un array vuoto nella lista di notifiche
		this.allNotifications[channelName] = [];
		return;
	}

	subscribe(channelName: string, ...callbacks: SubscriberCallback[]): void {

		if (!this.channels[channelName]) {
			logMessages.error("channelNotFound", channelName);
			return;
		}

		this.subscribed = {
			...this.subscribed,
			[channelName]: [
				...this.subscribed[channelName] || [],
				...callbacks
			]
		}

		logMessages.warn("subscriberSetted", channelName);
		return;
	}

	unSubscribe(channelName: string): void {

		if (!this.channels[channelName]) {
			logMessages.error("channelNotFound", channelName);
			return;
		}

		if (!this.subscribed[channelName]) {
			logMessages.error("notSubscribed", channelName);
			return;
		}

		delete this.subscribed[channelName];

		return;
	}

	async getNew(channelName: string): Promise<Notification[] | void> {

		if (!this.channels[channelName]) {
			logMessages.error("channelNotFound", channelName);
			return;
		}

		const oldNotifications = this.allNotifications[channelName];
		const config = { ...this.channels[channelName] };
		const response = await getFromRemote(config);

		if (response.status != 200) {
			logMessages.error("getFailed", channelName);
			return;
		}

		this.allNotifications[channelName] = await response.json();
		logMessages.warn("getDone", channelName);


		if (this.allNotifications[channelName].length > oldNotifications.length) {

			const newNotifications = this.allNotifications[channelName].filter((element) => {
				if (!JSON.stringify(oldNotifications).includes(JSON.stringify(element))) {
					return element;
				}
				return;
			});

			// se NON ci sono subscriber
			if (this.subscribed[channelName] === undefined || this.subscribed[channelName].length < 1) {
				logMessages.error("notSubscribed", channelName);
				return newNotifications;
			}

			// se ci sono
			logMessages.info("subscriberCalled", channelName);
			this.subscribed[channelName].forEach(fun => {
				fun(newNotifications);
			});

			return newNotifications;
		}

		// se non ci sono nuove notifiche
		console.warn("Nessuna nuova notifica.");
		return;
	}

	async getAll(channelName: string): Promise<Notification[] | void> {

		if (!this.channels[channelName]) {
			logMessages.error("channelNotFound", channelName);
			return;
		}

		if (Array.isArray(this.allNotifications[channelName]) && this.allNotifications[channelName].length > 0) {
			logMessages.error("notificationListNotEmpty", channelName);
			return this.allNotifications[channelName];
		}

		const config = { ...this.channels[channelName] };
		const response = await getFromRemote(config);

		if (response.status != 200) {
			logMessages.error("getFailed", channelName);
			return;
		}

		this.allNotifications[channelName] = await response.json();
		logMessages.warn("getDone", channelName);

		console.warn(`Ci sono ${this.allNotifications[channelName].length} nuove notifiche sul canale ${channelName}`);
		return this.allNotifications[channelName];
	}

	async push(channelName: string, ...newNotifications: Notification[]): Promise<Notification[] | void> {

		if (!this.channels[channelName]) {
			logMessages.error("channelNotFound", channelName);
			return;
		}

		const config: Channel = {
			...this.channels[channelName],
			postOption: { ...this.channels[channelName].postOption }
		};

		newNotifications.forEach(async (notification) => {

			notification.sender = this.senderName;
			
			this.allNotifications[channelName].push(notification);
			config.postOption.body = JSON.stringify(notification);

			// POST
			const response = await postRemoteData(config);

			if (response.status != 201) {
				logMessages.error("postFailed", channelName);
				return;
			}

			logMessages.warn("postDone", channelName);
			return;
		});

		console.warn(`${newNotifications.length} nuove notifiche aggiunte sul canale:`);

		return newNotifications;
	}

	async read(notificationId: string, channelName: string): Promise<Notification | void> {

		if (!this.channels[channelName]) {
			logMessages.error("channelNotFound", channelName);
			return;
		}

		const indexOfNotification = findMyIndexByIdAndNotificationList(notificationId, this.allNotifications[channelName]);
		if (indexOfNotification < 0) {
			logMessages.error("notificationNotFound", notificationId);
			return;
		}

		// controlla che non sia già stata letta
		const currentNotification = this.allNotifications[channelName][indexOfNotification];
		if (currentNotification.read_at != 0) {
			logMessages.error("notificationAlreadyRead", notificationId);
			return;
		}

		// ottieni la data
		const currentDate = Date.now();

		// imposta la config
		const config: Channel = {
			...this.channels[channelName],
			patchOption: { ...this.channels[channelName].patchOption }
		};

		config.url = `${config.url}${config.url.endsWith("/") ? "" : "/"}${notificationId}`;
		config.patchOption.body = JSON.stringify({
			read_at: currentDate,
		});

		// esegui la patch
		const response = await patchRemoteData(config);

		if (response.status != 200) {
			logMessages.error("patchFailed", channelName);
			return;
		}

		logMessages.warn("patchDone", channelName);
		console.warn(`La notifica con id ${notificationId} è stata letta alle: ${currentDate}`);

		// imposta anche in locale la data di lettura
		this.allNotifications[channelName][indexOfNotification].read_at = currentDate;
		currentNotification.read_at = currentDate;
		return currentNotification;
	}

	notifyOneByIdAndChannelName(notificationId: string, channelName: string): void | Notification {

		if (!this.channels[channelName]) {
			logMessages.error("channelNotFound", channelName);
			return;
		}

		const indexOfNotification = findMyIndexByIdAndNotificationList(notificationId, this.allNotifications[channelName]);
		if (indexOfNotification < 0) {
			logMessages.error("notificationNotFound", notificationId);
			return;
		}

		notifyAllProperties(this.allNotifications[channelName][indexOfNotification]);

		return this.allNotifications[channelName][indexOfNotification];
	}
}