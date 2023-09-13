export const onlyLettersRegEx = /^[a-zA-Z]+$/;
export const mailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const noBlankSpacesRegEx = /^\S*$/;
export const stringWithSpaceRegEx = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
export const houseNumberRegEx = /^\d+\s?[A-Za-z]*$/;
export const phoneRegEx = /^(?:.*\d.*){7,}$/;
export const zipRegEx = /^\d+(?:-\d+)*\d+$/;

export const onlyLettersMessage = "This field must only contain letters";
export const invalidMailMessage = "Invalid email format";
export const noBlankSpacesMEssage = "Blank spaces are not allowed";
