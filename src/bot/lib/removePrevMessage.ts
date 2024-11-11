export const removePrevMessage = async (ctx: any, messageId: any) => {
  if (ctx.session[messageId]) {
    try {
      await ctx.api.deleteMessage(ctx.chat.id, ctx.session[messageId]);
    } catch (error) {
      console.error("Failed to delete previous message:", error);
    }
  }
};

export const setMessageId = (ctx: any, session: any, messageId: any) => {
  ctx.session[session] = messageId;
};
