import { useState, useMemo, useCallback } from "react";
import { Select, Option, HStack, FormControl } from "@yamada-ui/react";

export const BirthdateSelect = ({ onChange }) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const years = useMemo(
    () => Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i),
    []
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const getDaysInMonth = useCallback((year, month) => {
    if (!year || !month) return 31;
    return new Date(year, month, 0).getDate();
  }, []);

  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1),
    [year, month, getDaysInMonth]
  );

  const handleChange = useCallback(
    (type, value) => {
      switch (type) {
        case "year":
          setYear(value);
          break;
        case "month":
          setMonth(value);
          break;
        case "day":
          setDay(value);
          break;
      }

      if (type === "year" || type === "month") {
        setDay("");
      }

      const newYear = type === "year" ? value : year;
      const newMonth = type === "month" ? value : month;
      const newDay = type === "day" ? value : "";

      if (newYear && newMonth && newDay) {
        const formattedDate = `${newYear}-${newMonth.padStart(
          2,
          "0"
        )}-${newDay.padStart(2, "0")}`;
        onChange(formattedDate);
      } else {
        onChange("");
      }
    },
    [year, month, onChange]
  );

  return (
    <FormControl label="生年月日">
      <HStack spacing={2}>
        <Select
          placeholder="年"
          value={year}
          onChange={(value) => handleChange("year", value)}
        >
          {years.map((y) => (
            <Option key={y} value={y.toString()}>
              {y}年
            </Option>
          ))}
        </Select>
        <Select
          placeholder="月"
          value={month}
          onChange={(value) => handleChange("month", value)}
        >
          {months.map((m) => (
            <Option key={m} value={m.toString().padStart(2, "0")}>
              {m}月
            </Option>
          ))}
        </Select>
        <Select
          placeholder="日"
          value={day}
          onChange={(value) => handleChange("day", value)}
        >
          {days.map((d) => (
            <Option key={d} value={d.toString().padStart(2, "0")}>
              {d}日
            </Option>
          ))}
        </Select>
      </HStack>
    </FormControl>
  );
};
