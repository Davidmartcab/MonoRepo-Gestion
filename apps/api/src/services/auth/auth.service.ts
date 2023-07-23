import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  public constructor(private readonly jwtService: JwtService) {}

  async generateToken(code: string): Promise<string> {
    const payload = { code };

    return this.jwtService.sign(payload);
  }

  async validateTokenAndGetCode(token: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(token);

      return decoded.code;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}
