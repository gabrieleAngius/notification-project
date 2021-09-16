import fetchMock, {MockResponseInit} from "jest-fetch-mock";
import { notificationCenter } from "../../src/singleton";
import { Notification } from "../../src/classes/Notification";

const testFetchUrl = "http://any-domain.com/";
const errorFetchUrl = "http://error-404.com/";

beforeAll(() => {
    fetchMock.enableMocks();
})


describe("NotificationCenter", () => {

    const notificationToPush: Notification = {
        data: {
            title: "any string",
            message: "any string"
        },
        created_at: 123,
        read_at: 0,
        sender: "",
        id: "123"
    }
    
    test("push - channel not found", async () => {
        
        const channelName = "inesistentChannel";
        const newNotifications = await notificationCenter.push(channelName, notificationToPush);
        
        expect(newNotifications).toBeUndefined();
    });

    test("Success response", async () => {
        fetchMock.mockIf(testFetchUrl, async (): Promise <MockResponseInit> => {
            return { 
                body: JSON.stringify({title: "any string", data: "any string"}),
                status: 201
            };
        });
        const channelName = "testChannel";
        notificationCenter.addChannel(channelName, testFetchUrl);
        
        const newNotifications = await notificationCenter.push(channelName, notificationToPush);
        
        expect(newNotifications).toEqual(
            [
                {
                    data: {
                    title: "any string",
                    message: "any string"
                },
                created_at: 123,
                read_at: 0,
                sender: "",
                id: "123"
                }
            ]
        );

    });

    test("Error - not success response", async () => {
        fetchMock.mockIf(errorFetchUrl, async (): Promise <MockResponseInit> => {
            return { 
                body: JSON.stringify([{title: "notifica1" }]),
                status: 400
            };
        });
        
        const channelName = "canaleErrore";
        notificationCenter.addChannel(channelName, errorFetchUrl);
        
        const newNotifications = await notificationCenter.push(channelName, notificationToPush);

        expect(newNotifications).toBeDefined();
    });
    
})