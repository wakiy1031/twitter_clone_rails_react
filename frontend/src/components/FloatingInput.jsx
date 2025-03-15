import { useState, useEffect, useRef } from "react";
import { Input, Text } from "@yamada-ui/react";

export const FloatingInput = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsFloating(isActive || value !== "");
  }, [isActive, value]);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const formattedError =
    type === "password" ? `${name} ${error}` : `${value} ${error}`;

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        autoComplete="off"
        className={`pt-6 pb-2 w-full transition-all duration-300 ease-out hover:border-blue-500 ${
          isActive ? "border-blue-500" : ""
        } ${error ? "border-red-500" : ""}`}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-300 ease-out ${
          isFloating
            ? `text-xs top-1 ${isActive ? "text-blue-500" : "text-gray-500"}`
            : "text-base text-gray-400 top-1/2 -translate-y-1/2"
        }`}
      >
        {placeholder}
      </label>
      {error && (
        <Text color="red.500" fontSize="sm" className="mt-1">
          {formattedError}
        </Text>
      )}
    </div>
  );
};
