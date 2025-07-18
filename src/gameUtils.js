export const generateRoomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generatePlayerId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const validateRoomCode = (code) => {
  return code && code.length === 6 && /^[A-Z0-9]+$/.test(code);
};

export const validatePlayerName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 20;
};
