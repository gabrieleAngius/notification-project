import { notifyAllProperties } from "../../src/utils/notifyAllProperties";
import { Notification } from "../../src/classes/Notification";

describe("notifyAllProperties(Notification)", () => {
    const spyLog = jest.spyOn(console, "log");
    const newNotification = new Notification("notification title", "notification message");

    test("notify all properties of a NOT readed notification", () => {
        
        notifyAllProperties(newNotification);

        expect(spyLog).toHaveBeenCalledTimes(7);
        expect(spyLog).toHaveBeenCalledWith("Data di lettura: Non è stato letto");
    });

    test("notify all properties of a readed notification", () => {
        const timestamp = Date.now();
        newNotification.read_at = timestamp;

        notifyAllProperties(newNotification);

        expect(spyLog).toHaveBeenCalledWith(`Data di lettura: ${timestamp}`);
    })
})