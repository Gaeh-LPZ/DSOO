import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export class JwtService {
  async sign(payload: any) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10h")
      .sign(secret);
  }

  async verify(token: string) {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  }
}