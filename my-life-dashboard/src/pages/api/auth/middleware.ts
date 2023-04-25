import jwt from "jsonwebtoken";

const protectRoute = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Token não fornecido");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userData = { email: decodedToken.email };
    next();
  } catch (err) {
    return res.status(401).send("Token inválido");
  }
};

export default protectRoute;
