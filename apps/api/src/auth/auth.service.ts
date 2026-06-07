import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createUserDto: any): Promise<any> {
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    return { message: 'Registration successful' };
  }

  async login(loginDto: any): Promise<any> {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user || user.passwordHash !== loginDto.passwordHash) { // Simple check for MVP
      throw new UnauthorizedException('Invalid credentials');
    }
    // Return a mock JWT token
    return { access_token: 'mock-jwt-token-12345' };
  }
}
