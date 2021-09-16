import { v4 as uuidv4 } from 'uuid';

export class Notification {
	data: {
    title: string,
    message: string
  };
  created_at: number = Date.now();
  read_at: number = 0;
  id: string = uuidv4();
  sender: string = "";
  
  constructor(title: string, message: string) {
		this.data = {
			title: title,
			message: message
		}
	}
}
