import { useState } from "react";
import { useInput } from "./useInput"

export const useValidate = <T>(ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement> | null, callback: CallableFunction, initialValue: T) => {
  const {value, onChange, setValue} = useInput<T>(initialValue); 

  const isValid = () => {
    if (ref && ref.current) {
      if (callback(ref.current.value)) {
        ref.current.classList.remove('invalid');
        return true;
      }
      ref.current.classList.add('invalid');
      return false
    }
    return false;
  }

  return { input: { value, onChange }, isValid, setValue }
}

export const useFileValidate = (ref: React.RefObject<HTMLInputElement> | null, callback: CallableFunction) => {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState('');

  const setImage = (image?: File) => {
    setFile(image);
    if (image) {
      setPreview(URL.createObjectURL(image));
    } else {
      setPreview('');
    }
  } 

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  }

  const isValid = () => {
    if (ref && ref.current) {
      if (file && callback(file)) {
        ref.current.classList.remove('invalid');
        return true;
      }
      ref.current.classList.add('invalid');
      return false;
    }
    return false;
  }

  return {file, preview, onChange, isValid, setImage};
}