import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './Dto/auth-credential.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCred: AuthCredentialDto): Promise<void> {
    const { username, password } = authCred;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      username,
      password: hashPassword,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
      // console.log(error.code);
    }
  }
}
