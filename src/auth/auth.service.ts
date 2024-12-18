import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './Dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    // @Inject('UserRepository')
    private userRepository: UserRepository,
    private jswtService: JwtService,
  ) {}

  async signUp(authCred: AuthCredentialDto): Promise<void> {
    return this.userRepository.createUser(authCred);
  }

  async signIn(authCred: AuthCredentialDto): Promise<{ accessToken: string }> {
    const { username, password } = authCred;
    const user = await this.userRepository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jswtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check you username or password');
    }
  }
}
