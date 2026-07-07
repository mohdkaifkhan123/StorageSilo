export const setCookie = (res, token, sessionExpiry) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: sessionExpiry,
    signed: true,
  });
};
