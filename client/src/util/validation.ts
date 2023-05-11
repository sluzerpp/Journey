export const isValidEmail = (email: string) => {
  const reg = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (email.match(reg)) {
    return true;
  }
  return false;
}

export const isNotEmpty = (value: string) => {
  if (value !== '') {
    return true;
  }
  return false;
}

export const isImageFile = (file?: File) => {
  if (file && file.type.includes('image')) {
    return true;
  }
  return false;
}