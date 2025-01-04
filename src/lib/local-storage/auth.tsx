export const getLocalStorageUserAddress = (): string | undefined => {
  return localStorage.getItem("loggedUserAddress") || undefined;
};

export const setLocalStorageUserAddress = (userAddress: string) => {
  localStorage.setItem("loggedUserAddress", userAddress);
};

export const clearLocalStorageUserAddress = () => {
  localStorage.removeItem("loggedUserAddress");
};
