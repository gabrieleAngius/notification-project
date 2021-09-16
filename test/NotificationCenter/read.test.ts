import fetchMock, { MockResponseInit } from 'jest-fetch-mock';
import { logMessages } from '../../src/utils/messages';
import { notificationCenter } from '../../src/singleton';

const testFetchUrl = 'http://any-domain.com/';
const errorFetchUrl = 'http://error-404.com';

beforeAll(() => {
  fetchMock.enableMocks();
});

describe("NotificationCenter", () => {
  const correctId = '123';
  const incorrectId = '000';

  const channelName = 'testChannel';
  notificationCenter.addChannel(channelName, testFetchUrl);
  notificationCenter.addChannel('canaleErrore', errorFetchUrl);

  const notificationToPush = {
    data: {
      title: 'any string',
      message: 'any string',
    },
    created_at: 123,
    read_at: 0,
    sender: '',
    id: correctId,
  };
  notificationCenter.allNotifications[channelName].push(notificationToPush);

  test("read - inesistent channel", async () => {

    const channelName = 'inesistentChannel';
    const readedNotification = await notificationCenter.read(correctId, channelName);

    expect(readedNotification).toBeUndefined();
  });

  test("read - can't found the id entered", async () => {
    const readedNotification = await notificationCenter.read(incorrectId, channelName);

    expect(readedNotification).toBeUndefined();
  });

  test('read - NOT success response', async () => {
    fetchMock.mockIf(
      "http://error-404.com/123",
      async (): Promise<MockResponseInit> => {
        return {
          body: JSON.stringify(''),
          status: 404,
        };
      }
    );

    const channelName = 'canaleErrore';
    notificationCenter.allNotifications[channelName].push(notificationToPush);
    const spy = jest.spyOn(logMessages, 'error');

    await notificationCenter.read(correctId, channelName);

    expect(spy).toBeCalled();
  });

  test('read - success response', async () => {
    fetchMock.mockIf(
      "http://any-domain.com/123",
      async (): Promise<MockResponseInit> => {
        return {
          body: JSON.stringify({ read_at: 12 }),
          status: 200,
        };
      }
    );

    const channelName = 'testChannel';
    await notificationCenter.read(correctId, channelName);

    expect(
      notificationCenter.allNotifications[channelName][0].read_at
    ).toBeGreaterThan(0);
  });

  describe('read - try to read an already readed notification', () => {

    fetchMock.mockIf(
      "http://any-domain.com/123",
      async (): Promise<MockResponseInit> => {
        return {
          body: JSON.stringify({ read_at: 12 }),
          status: 200,
        };
      }
    );


    test('read_at remain the same', async () => {

      const channelName = 'testChannel';
      await notificationCenter.read(correctId, channelName);

      const spy = jest.spyOn(logMessages, 'error');
      await notificationCenter.read(correctId, channelName);

      expect(spy).toBeCalled();
    })
  });
});
