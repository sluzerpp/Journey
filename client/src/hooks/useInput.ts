import { useState } from "react"

export const useInput = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value as T);
  }

  return {
    value,
    onChange,
    setValue
  }
}