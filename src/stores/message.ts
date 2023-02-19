import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import type { MessageItem, MessageStore } from ".";
import { hasReadList, recycleList, unreadList } from "@/test/message";

export const useMessageStore = defineStore("messageStore", () => {
  const message = reactive<MessageStore>({
    unreadList: [],
    hasReadList: [],
    recycleList: [],
  });

  const getMessageList = () => {
    return new Promise((resolve, reject) => {
      // 模拟请求消息
      setMessageUnReadList(unreadList);
      setMessageHasReadList(hasReadList);
      setMessageRecycleList(recycleList);
      resolve("");
    });
  };

  const messageHasRead = ({ id }: { id: string }) => {
    return new Promise((resolve, reject) => {
      moveMessage({
        to: "hasReadList",
        from: "unreadList",
        id,
      });
      resolve("");
    });
  };

  const removeReadMessage = ({ id }: { id: string }) => {
    return new Promise((resolve, reject) => {
      moveMessage({
        to: "recycleList",
        from: "hasReadList",
        id,
      });
      resolve("");
    });
  };

  const restoreRecycleMessage = ({ id }: { id: string }) => {
    return new Promise((resolve, reject) => {
      moveMessage({
        to: "hasReadList",
        from: "recycleList",
        id,
      });
      resolve("");
    });
  };

  const setMessageUnReadList = (unreadList: MessageItem[]) => {
    unreadList = unreadList.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    message.unreadList = unreadList;
  };

  const setMessageHasReadList = (hasReadList: MessageItem[]) => {
    hasReadList = hasReadList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    message.hasReadList = hasReadList;
  };

  const setMessageRecycleList = (recycleList: MessageItem[]) => {
    recycleList = recycleList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    message.recycleList = recycleList;
  };

  const moveMessage = (messageRoute: {
    to: "hasReadList" | "recycleList";
    from: "unreadList" | "hasReadList" | "recycleList";
    id: string;
  }) => {
    let { from, to, id } = messageRoute;
    const index = message[from].findIndex((item: MessageItem) => item.id === id);
    const messageItem = message[from].splice(index, 1)[0];
    messageItem.loading = false;
    message[to].unshift(messageItem);
  };

  return {
    message,
    
    getMessageList,
    messageHasRead,
    removeReadMessage,
    restoreRecycleMessage,
  };
});
