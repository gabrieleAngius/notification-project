import { onNewNotification } from "../../src/utils/onNewNotification";
import { Notification } from "../../src/classes/Notification";

describe("onNewNotification", () => {
    test("call notifyAllProperties() for each new Notification", () => {
        const spy = jest.spyOn(console, "log");
        const newNotification = new Notification("notification title", "notification message");
        const newNotification2 = new Notification("notification title", "notification message");
        
        const listOfNewNotifications = [newNotification, newNotification2];

        onNewNotification(listOfNewNotifications);

        expect(spy).toHaveBeenCalledTimes(7 * listOfNewNotifications.length);
    })
})