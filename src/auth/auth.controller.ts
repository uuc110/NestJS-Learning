import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialDto } from './Dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUP(@Body() authCred: AuthCredentialDto): Promise<void> {
    return this.authService.signUp(authCred);
  }

  @Post('/signin')
  signIn(
    @Body() authCred: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCred);
  }
}
