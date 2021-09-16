import { logMessages } from "../../src/utils/messages";
import { notificationCenter } from "../../src/singleton";

describe("NotificationCenter", () => {

    describe("setSender - set the sender of a Notification", () => {
        const warnLog = jest.spyOn(logMessages, "warn");
        const errorLog = jest.spyOn(logMessages, "error");
        beforeAll(() => {
            notificationCenter.setSender("Gabriele");
        });
        
        test("senderName setted - first call of the method", () => {
            expect(notificationCenter.senderName).toBe("Gabriele");
            expect(warnLog).toBeCalled();
        });
        
        test("sender already setted - call the second time the method", () => {
            notificationCenter.setSender("Massimo");
            expect(notificationCenter.senderName).toBe("Gabriele");
            expect(errorLog).toBeCalled();
        });
    });
    
    describe("modify the sender name", () => {
        const warnLog = jest.spyOn(logMessages, "warn");
        test("senderName already exist - force the new setup", () => {
            notificationCenter.setSender("Massimo", "force");
            expect(notificationCenter.senderName).toBe("Massimo");
            expect(warnLog).toBeCalled();
        });
    }); 
});