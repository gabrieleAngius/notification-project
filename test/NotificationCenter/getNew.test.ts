import { notificationCenter } from '../../src/singleton';
import fetchMock, { MockResponseInit } from 'jest-fetch-mock';
import { logMessages } from '../../src/utils/messages';
import { onNewNotification } from '../../src/utils/onNewNotification';

const testFetchUrl = 'http://any-domain.com/';
const errorFetchUrl = 'http://error-404.com/';

describe('NotificationCenter', () => {

  describe('getNew', () => {
    beforeAll(async () => {
      fetchMock.enableMocks();

      fetchMock.mockIf(
        testFetchUrl,
        async (): Promise<MockResponseInit> => {
          return {
            body: JSON.stringify([{ title: 'old notification' }]),
            status: 200,
          };
        }
      );

      const channelName = 'testChannel';
      notificationCenter.addChannel(channelName, testFetchUrl);

      await notificationCenter.getAll(channelName);
    });

    test('Canale inserito NON esistente', async () => {
      const channelName = 'insesistentChannel';
      const notificationList = await notificationCenter.getNew(channelName);

      expect(notificationList).toBeUndefined();
    });

    test('Error - not success response', async () => {
      fetchMock.mockIf(
        errorFetchUrl,
        async (): Promise<MockResponseInit> => {
          return {
            body: JSON.stringify([{ title: 'notifica1' }]),
            status: 400,
          };
        }
      );

      const channelName = 'canaleErrore';
      notificationCenter.addChannel(channelName, errorFetchUrl);

      const spy = jest.spyOn(logMessages, 'error');

      await notificationCenter.getNew(channelName);
      expect(spy).toBeCalled();
    });

    test('there are new notifications - return just the new', async () => {
      fetchMock.mockIf(
        testFetchUrl,
        async (): Promise<MockResponseInit> => {
          return {
            body: JSON.stringify([
              { title: 'old notification' },
              { title: 'new notification' },
            ]),
            status: 200,
          };
        }
      );

      const channelName = 'testChannel';
      const newNotificationList = await notificationCenter.getNew(channelName);

      expect(newNotificationList).toEqual([{ title: 'new notification' }]);
    });

    test('there are NOT new notifications - return undefined', async () => {
      fetchMock.mockIf(
        testFetchUrl,
        async (): Promise<MockResponseInit> => {
          return {
            body: JSON.stringify([{ title: 'old notification' }]),
            status: 200,
          };
        }
      );

      const channelName = 'testChannel';
      const newNotificationList = await notificationCenter.getNew(channelName);

      expect(newNotificationList).toBeUndefined();
    });

    describe('there are new notifications', () => {
      test('there are subscribers - call them', async () => {
        fetchMock.mockIf(
          testFetchUrl,
          async (): Promise<MockResponseInit> => {
            return {
              body: JSON.stringify([
                { title: 'old notification' },
                {
                  data: { title: 'new notification', message: 'any string' },
                  id: '123',
                  created_at: Date.now(),
                  read_at: 0,
                  sender: '',
                },
              ]),
              status: 200,
            };
          }
        );

        const spy = jest.spyOn(logMessages, 'info');
        const channelName = 'testChannel';
        notificationCenter.subscribe(channelName, onNewNotification);
        await notificationCenter.getNew(channelName);

        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
