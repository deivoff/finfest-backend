import CONFIG from '$configs/index';
import { AccessRightsUser, VKClient } from './utils';

export class VKOAuth {
  config = CONFIG.vkConfig;
  VKClient = new VKClient(
    this.config.clientId!,
    this.config.clientSecret!,
    this.config.redirectUrl
  );

  getOAuthUrl() {
    return this.VKClient.generateAuthUrl({
      display: 'page',
      response_type: 'code',
      scope: AccessRightsUser.photos
    })
  }

  async serializeAccountFromCode(code: string) {
    const { access_token, user_id } = await this.VKClient.getToken(code);
    const [user] = await this.VKClient.getUsers(
      access_token, [user_id], ['photo_id']);
    const userName = {
      familyName: user.last_name,
      givenName: user.first_name
    };

    const [photo] = await this.VKClient.getPhotosUrl(access_token, [user.photo_id]);
    return {
        accessToken: access_token,
        profile: {
          id: user_id,
          name: userName,
          photos: [{ url: photo.sizes[0].url }],
        },
    }
  }
}
