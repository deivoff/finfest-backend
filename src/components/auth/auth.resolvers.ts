import {
  Resolver, Query, Arg, Mutation
} from 'type-graphql';
import { AuthResponse, AuthRedirect } from '.';
import { VKOAuth } from '$components/auth/vk';
import { User } from '$components/user';

@Resolver(() => AuthResponse)
export class AuthResolvers {

  vkOAuth = new VKOAuth();

  @Query(() => AuthRedirect)
  async getVKOAuthRedirect(): Promise<AuthRedirect> {
    return {
      url: this.vkOAuth.getOAuthUrl()
    }
  }

  @Mutation(() => AuthResponse)
  async authVK(
    @Arg('code') code: string
  ): Promise<AuthResponse> {
     const { accessToken, profile } = await this.vkOAuth.serializeAccountFromCode(code);
     const user = await User.upsetVKUser({ accessToken, profile });
     const token = user.generateJWT();
    return {
      token
    }
  }
  // googleOAuth = new GoogleOAuth();

  // @Query(() => AuthRedirect)
  // async getGoogleOAuthRedirect(): Promise<AuthRedirect> {
  //   return {
  //     url: this.googleOAuth.urlGoogle(),
  //   };
  // }
  //
  // @Mutation(() => AuthResponse)
  // async authGoogle(@Arg('code') code: string): Promise<AuthResponse> {
  //   try {
  //     const { accessToken, refreshToken, profile } = await this.googleOAuth.serializeAccountFromCode(code);
  //     const user = await User.upsetGoogleUser({ accessToken, refreshToken, profile });
  //     const token = user.generateJWT();
  //     return {
  //       token,
  //     }!;
  //   } catch (error) {
  //     return error;
  //   }
  // }

}
