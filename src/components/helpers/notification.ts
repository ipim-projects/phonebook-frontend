import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotification = (type: NotificationType, message: string, description: string) => {
	notification[type]({
		message,
		description,
		duration: 3,
	});
};