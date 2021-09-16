import { Notification } from "../classes/Notification";

export function notifyAllProperties(notification: Notification) {
	console.log(`Titolo: ${notification.data.title}`);
	console.log(`Messaggio: ${notification.data.message}`);
	console.log(`Data di creazione: ${notification.created_at}`);
	console.log(`Data di lettura: ${notification.read_at > 0 ? notification.read_at : "Non è stato letto"}`);
	console.log(`Sender: ${notification.sender}`);
	console.log(`ID: ${notification.id}`);
	console.log(`-----------------`);
}