import { notificationCenter } from "../../src/singleton";

describe("NotificationCenter", () => {
    const channelName = "channelName";
    const url = "any-url";

    describe("addChannel - add a new channel", () => {

        const expected = {
            url: url,
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

        beforeAll(() => {
            notificationCenter.addChannel(channelName, url);
        });
        
        test("Channel NOT exists", () => {
            expect(notificationCenter.channels[channelName]).toEqual(expected);
        });
        
        test("Channel already exists", () => {
            notificationCenter.addChannel(channelName, url);
            expect(notificationCenter.channels).toEqual({[channelName]: expected});
        });
        
    });
});