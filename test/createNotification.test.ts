import { Notification } from "../src/classes/Notification";

describe("new Notification(title, message)", () => {
    test("Create Notification object by a title and a message", () => {
        const title = "any string";
        const messagge = "any string";
        const newNotification = new Notification(title, messagge);
        const expected = {
            data: {
                title: title,
                message: messagge
            }
        }
        expect(newNotification.data).toEqual(expected.data);
    })
})