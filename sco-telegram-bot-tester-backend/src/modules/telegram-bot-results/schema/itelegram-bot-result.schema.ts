import { ITelegramBotResult } from './../interface/itelegram-bot-result.interface';
import { Schema, Types } from 'mongoose';

export const telegramBotResultSchema = new Schema<ITelegramBotResult>(
  {
    user: { 
      type: Types.ObjectId, 
      ref: 'User', 
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    chat_id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    errorCode: {
      type: Number,
      required: false,
      default: null,
    },
    errorMessage: {
      type: String,
      required: false,
      default: null,
    },
    typeObj: {
      type: String,
      required: false,
      default: 'TelegramBotResult',
    },
  },
  {
    timestamps: true,
  },
);