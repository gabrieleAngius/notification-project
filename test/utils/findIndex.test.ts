import  { findMyIndexByIdAndNotificationList } from "../../src/utils/findIndex";
import { Notification } from "../../src/classes/Notification";

describe("findIndex(id, notificationList)", () => {
    test("trova indice della notifica - cerca nell'array di oggetti notifica", () => {
        const notification1 = {
            data: {
            title: "any string",
            message: "any string"
            },
            created_at: Date.now(),
            read_at: 0,
            id: "123",
            sender: ""
        }
        const notification2 = {
            data: {
            title: "any string",
            message: "any string"
            },
            created_at: Date.now(),
            read_at: 0,
            id: "456",
            sender: ""
        }
        const notificationList: Notification[] = [notification1, notification2];
        const index = findMyIndexByIdAndNotificationList("123", notificationList);

        expect(index).toBe(0);
    })
})