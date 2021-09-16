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

    describe("subscribe - add one or more callback to a subscribed channel", () => {
        
        const expected = [
            ...notificationCenter.subscribed[channelName] || [],
            ...[callback1, callback2],
        ]

        beforeAll(() => {
            notificationCenter.addChannel(channelName, url);
        });
        
        test("Channel exist - subscriber added", () => {
            notificationCenter.subscribe(channelName, callback1, callback2);
            expect(notificationCenter.subscribed[channelName]).toEqual(expected);
        });
        
        test("Channel NOT exist - subscribers NOT added", () => {
            notificationCenter.subscribe("insesistentChannel", callback1, callback2);
            expect(notificationCenter.subscribed).not.toEqual(expected);
        });
        
    });
});