import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  currentUserState,
  flashState,
  loadingState,
} from "../globalStates/atoms";
import { logIn } from "../features/api/authApi";

const logInFields = [
  {
    name: "email",
    label: "メールアドレス",
    type: "text",
    helperText: "",
  },
  {
    name: "password",
    label: "パスワード",
    type: "password",
    helperText: "6文字以上",
  },
];

const initialUser = {
  email: "",
  password: "",
};

export const useLogIn = () => {
  const [user, setUser] = useState(initialUser);

  const navigate = useNavigate();

  const setFlash = useSetRecoilState(flashState);
  const setLoading = useSetRecoilState(loadingState);
  const setCurrentUser = useSetRecoilState(currentUserState);

  const query = new URLSearchParams(useLocation().search);
  const isAccountConfirmationSuccess = JSON.parse(
    query.get("account_confirmation_success")
  );

  useEffect(() => {
    if (!isAccountConfirmationSuccess) return;

    setFlash({
      isOpen: true,
      severity: "success",
      message: "メール認証に成功しました。\r\nログインを行ってください。",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeUser = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const isBlankSomeField = (user) => {
    return Object.keys(user).some((key) => !user[key]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlankSomeField(user)) {
      setFlash({
        isOpen: true,
        severity: "info",
        message: "空欄の項目があります。",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await logIn(user);

      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"], {
          path: "/",
          sameSite: "Lax",
        });
        Cookies.set("_client", res.headers["client"], {
          path: "/",
          sameSite: "Lax",
        });
        Cookies.set("_uid", res.headers["uid"], { path: "/", sameSite: "Lax" });

        setCurrentUser(res.data.user);

        navigate("/home");

        setFlash({
          isOpen: true,
          severity: "success",
          message: "ログインに成功しました。",
        });
      } else {
        setFlash({
          isOpen: true,
          severity: "error",
          message: res.data.errors.join("\r\n"),
        });
      }
    } catch (err) {
      console.log("err", err);
      setFlash({
        isOpen: true,
        severity: "error",
        message:
          err.response?.data?.errors?.join("\r\n") ||
          "ログインに失敗しました。",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    logInFields,
    onChangeUser,
    handleSubmit,
  };
};
