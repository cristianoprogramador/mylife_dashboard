import jwt from "jsonwebtoken";

export function generateToken(data: any) {
  const token = jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  return token;
}

export function verifyJWT(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error("Erro ao verificar JWT:", error);
    throw error;
  }
}
