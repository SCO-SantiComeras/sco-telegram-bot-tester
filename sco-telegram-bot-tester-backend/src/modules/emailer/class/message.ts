export class Message {

  text: string;
  receivers: string[];
  subject: string;
  attachments?: any[];

  constructor(text: string, receivers: string[], subject: string, attachments: any[] = []) {
    this.text = text;
    this.receivers = receivers;
    this.subject = subject;
    this.attachments = attachments;
  }
}
