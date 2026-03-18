import jwt from "jsonwebtoken";

type JwtPayload = {
  id: number;
  email: string;
  role: string;
};

export function verifyToken(req: Request): JwtPayload {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Non autorisé");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  return decoded;
}