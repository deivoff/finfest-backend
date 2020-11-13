import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import jwt from 'jsonwebtoken';
import CONFIG from '$configs/index';
import { Field, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '$helpers/scalars';
import { AuthData } from '../auth';

@ObjectType()
export class UserPhoto {

  @Field(() => String)
  @Property({ required: true })
  url!: string;

}

@ObjectType()
class VKProvider {

  @Field()
  @Property({ required: true })
  id!: string;

  @Field()
  @Property({ required: true })
  token!: string;

}

@ObjectType()
class UserSocial {

  @Field(() => VKProvider)
  @Property({ _id: false })
  vkProvider!: VKProvider;

}

@ObjectType()
export class UserName {

  @Field(() => String)
  @Property({ required: true })
  familyName!: string;

  @Field(() => String)
  @Property({ required: true })
  givenName!: string;

}

@ObjectType()
export class User {

  @Field(() => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field({ nullable: true })
  @Property()
  email?: string;

  @Field(() => UserName)
  @Property({ _id: false })
  name!: UserName;

  @Field(() => [UserPhoto])
  @Property({ type: UserPhoto, _id: false })
  photos?: UserPhoto[];

  @Field(() => UserSocial)
  @Property({ _id: false })
  social!: UserSocial;

  @Field({ nullable: true })
  @Property()
  score?: number;

  generateJWT() {
    return jwt.sign(
      {
        email: this.email,
        name: this.name,
        photos: this.photos ? this.photos : [],
        id: this._id,
      },
      CONFIG.secretKey!,
    { expiresIn: '20d' },
    );
  }

  static async upsetVKUser({ accessToken, profile: {
    name, id, photos
  } }: AuthData, onNewUser?: () => void) {
    try {
      const user = await UserModel.findOne({ 'social.vkProvider.id': id });
      if (!user) {
        if (onNewUser) {
          onNewUser();
        }
        return await UserModel.create({
          name,
          // @ts-ignore
          'social.vkProvider': {
            id,
            token: accessToken,
          },
          photos,
        });
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

}

export const UserModel = getModelForClass(User);
