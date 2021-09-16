import { logMessages } from "../../src/utils/messages";
import { notificationCenter } from "../../src/singleton";

describe("NotificationCenter", () => {

    const channelName = "channelName";
    const url = "any-url";
    function callback1() {
        return;
    }
    function callback2() {
        return;
    }

    describe("unSubscribe - remove subscribers from a channel", () => {
        
        beforeAll(() => {
            notificationCenter.addChannel(channelName, url);
        });
    
        test("Channel and subscriber exist", () => {
            notificationCenter.subscribe(channelName, callback1, callback2);
            notificationCenter.unSubscribe(channelName);
            
            expect(notificationCenter.subscribed[channelName]).toBeUndefined();
        });
        
        test("Channel NOT exist", () => {
            const spyError = jest.spyOn(logMessages, "error");
            notificationCenter.unSubscribe("inesistentChannel");
    
            expect(spyError).toBeCalled();
        });
    
    });

    describe("subscriber not exist", () => {

        test("must call error", () => {
            const spyError = jest.spyOn(logMessages, "error");
            notificationCenter.unSubscribe(channelName);
    
            expect(spyError).toBeCalled();
        });
    })
})