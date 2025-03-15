import { useState, useEffect } from "react";
import { Button, FormControl, VStack, useNotice } from "@yamada-ui/react";
import { signUp } from "../../api/authApi";
import { BirthdateSelect } from "./BirthdateSelect";
import { FloatingInput } from "../../../components/FloatingInput";

export const SignUpForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    password: "",
    password_confirmation: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});

  const notice = useNotice();

  useEffect(() => {
    const { name, email, phone, birthdate, password, password_confirmation } =
      formData;
    const newIsFormValid =
      name !== "" &&
      email !== "" &&
      phone !== "" &&
      birthdate !== "" &&
      password !== "" &&
      password_confirmation !== "" &&
      password === password_confirmation;
    setIsFormValid(newIsFormValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleBirthdateChange = (value) => {
    setFormData({ ...formData, birthdate: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("送信データ:", formData);
    try {
      const response = await signUp(formData);
      console.log("登録完了、メールを確認してください。", response);
      notice({
        title: "登録完了、メールを確認してください。",
        status: "success",
      });
      onSuccess();
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
        notice({
          title: "登録に失敗しました",
          description: "入力内容を確認してください。",
          status: "error",
        });
      } else {
        notice({
          title: "登録に失敗しました",
          description: error.message || "予期せぬエラーが発生しました。",
          status: "error",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full pt-1">
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.name}>
          <FloatingInput
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="名前"
            required
            error={errors.name}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FloatingInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="メールアドレス"
            required
            error={errors.email}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.phone}>
          <FloatingInput
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="電話番号"
            required
            error={errors.phone}
          />
        </FormControl>

        <BirthdateSelect onChange={handleBirthdateChange} />

        <FormControl isInvalid={!!errors.password}>
          <FloatingInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="パスワード"
            required
            error={errors.password}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.password_confirmation}>
          <FloatingInput
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="パスワード確認"
            required
            error={errors.password_confirmation}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue" isDisabled={!isFormValid}>
          アカウントを作成
        </Button>
      </VStack>
    </form>
  );
};
