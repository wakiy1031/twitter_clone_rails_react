import { atom } from "recoil";
import { initializeCurrentUser } from "../features/api/authApi";

export const currentUserState = atom({
  key: "currentUserState",
  default: null,
  effects: [
    ({ setSelf }) => {
      initializeCurrentUser()
        .then((user) => {
          setSelf(user);
        })
        .catch((error) => {
          console.error("ユーザーの初期化に失敗しました:", error);
        });
    },
  ],
});

export const loadingState = atom({
  key: "loadingState",
  default: true,
});

export const flashMessageState = atom({
  key: "flashMessageState",
  default: {
    isOpen: false,
    severity: "info",
    message: "",
  },
});
