import { notificationCenter } from '../../src/singleton';

describe('NotificationCenter', () => {

    const correctId = '123';
    const incorrectId = '000';

    const channelName = 'testChannel';
    notificationCenter.addChannel(channelName, 'http://any-domain.com/');

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

    test('Channel entered NOT exist', () => {

        const notification = notificationCenter.notifyOneByIdAndChannelName(correctId, 'insesistentChannel');

        expect(notification).toBeUndefined();
    });

    test('ID not found', () => {

        const notification = notificationCenter.notifyOneByIdAndChannelName(incorrectId, channelName);

        expect(notification).toBeUndefined();
    });

    test('Success operation - return the notification', () => {

        const notification = notificationCenter.notifyOneByIdAndChannelName(correctId, channelName);

        expect(notification).toBeDefined();
    });
});
