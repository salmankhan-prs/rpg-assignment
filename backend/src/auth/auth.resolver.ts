import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, UserModel } from './models/auth.model';
import { RegisterInput, LoginInput } from './dto/auth.input';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Query(() => UserModel)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { id: string }): Promise<UserModel> {
    const fullUser = await this.authService.getUserById(user.id);
    if (!fullUser) {
      throw new Error('User not found');
    }
    return {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      createdAt: fullUser.createdAt,
    };
  }
}
