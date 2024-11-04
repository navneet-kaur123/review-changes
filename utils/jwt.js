import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// Function to generate JWT tokens
export function generateTokens(payload, authorizationHeader) {
  if (authorizationHeader === "null") {
    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '1d' });
    console.log("token generated");
    return { accessToken, refreshToken };
  }

  else {
    return null;  
  }
}
export function refreshTokenExpired(payload) {
  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '1d' });
  return { accessToken, refreshToken };
}
// Function to verify JWT token
export function verifyToken(token) {
  try {
    const x = jwt.verify(token, SECRET_KEY);
    
    return "valid token";
  } catch (err) {
    console.log(err.message, "acesss toekn verification error");
    return err.message;
  }
}
// Function to refresh the access token using the refresh token
export function refreshAccessToken(refreshToken) {
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    delete payload.exp;
    payload.iat = Math.floor(Date.now() / 1000);
    const newAccessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '30m' });
    console.log("new access token is generated..", newAccessToken);
    return {newAccessToken};
  } catch (err) {
    console.log(err.message, "refresh token varification error");
    return err.message;
  }
}
// Function to handle token generation and validation
export function generateToken(jwtRefreshToken, jwtaccessToken) {
  const validationResult = verifyToken(jwtaccessToken);
  console.log(validationResult, "jhelllo");
  if (validationResult === "valid token") {
    return "valid token";
  } else if (validationResult === "jwt expired") {
    console.log("Access token expired, generating new access token using refresh token");
    const newAccessToken = refreshAccessToken(jwtRefreshToken);
    return newAccessToken;
  }
  else{
    console.log("Access token is invalid , check the refersh token");
    const newAccessToken = refreshAccessToken(jwtRefreshToken);
    console.log(newAccessToken,"newAccessTokennewAccessToken");
    return newAccessToken;
  }
  // else{
  //   return "there is some server error  "
  // }
  // }
}