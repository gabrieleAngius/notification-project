import { notificationCenter } from "../../src/singleton";
import fetchMock, {MockResponseInit} from "jest-fetch-mock";
import { getFromRemote } from "../../src/utils/fetch/getFromRemote";
import { logMessages } from "../../src/utils/messages";

const testFetchUrl = "http://any-domain.com/";
const errorFetchUrl = "http://error-404.com/"

beforeAll(() => {
    fetchMock.enableMocks();
})

describe("NotificationCenter", () => {
    const channelName = "testChannel";
    notificationCenter.addChannel(channelName, testFetchUrl);
    
    describe("getAll", () => {
        
        test("Channel NOT exists", async () => {

            const notificationList = await notificationCenter.getAll('inesistentChannel');

            expect(notificationList).toBeUndefined();
        });

        
        test("Success response", async () => {
            fetchMock.mockIf(testFetchUrl, async (): Promise <MockResponseInit> => {
                return { 
                    body: JSON.stringify([{title: "notification title" }, ]),
                    status: 200
                };
            });
            
            const channelName = "testChannel";
            
            const notificationList = await notificationCenter.getAll(channelName);

            expect(notificationList).toEqual([{title: "notification title" }, ]);
        });
        
        test("Error - not success response", async () => {
            fetchMock.mockIf(errorFetchUrl, async (): Promise <MockResponseInit> => {
                return { 
                    body: JSON.stringify([{title: "notifica1" }]),
                    status: 400
                };
            });

            const spy = jest.spyOn(logMessages, "error");

            const channelName = "canaleErrore";
            notificationCenter.addChannel(channelName, errorFetchUrl);
    
            await notificationCenter.getAll(channelName);

            expect(spy).toBeCalled();
        });
    });

    describe("getAll - there already are notifications in local array", () => {

        test("try to call 2 times getAll", async () => {
            fetchMock.mockIf(testFetchUrl, async (): Promise <MockResponseInit> => {
                return { 
                    body: JSON.stringify([{title: "notification title" }, ]),
                    status: 200
                };
            });
            
            const channelName = "testChannel";
            await notificationCenter.getAll(channelName);

            const spy = jest.fn(getFromRemote);
            await notificationCenter.getAll(channelName);
            expect(spy).not.toHaveBeenCalled();
        })
    })
})