import {
  Resolver, Query, Arg, Mutation, PubSub,
} from 'type-graphql';
import { AuthResponse, AuthRedirect } from '.';
import { VKOAuth } from '$components/auth/vk';
import { User } from '$components/user';
import { PubSubEngine } from 'graphql-subscriptions';

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
    @Arg('code') code: string,
    @PubSub() pubSub: PubSubEngine,
): Promise<AuthResponse> {
     const { accessToken, profile } = await this.vkOAuth.serializeAccountFromCode(code);
     const user = await User.upsetVKUser(
       { accessToken, profile },
       () => pubSub.publish('NEW_USER', 1)
       );
     const token = user.generateJWT();
    return {
      token
    }
  }

}
