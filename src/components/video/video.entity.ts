import { Field, ObjectType } from 'type-graphql';
import { ObjectIdScalar } from '$helpers/scalars';
import { ObjectId } from 'mongodb';
import { getModelForClass, prop as Property } from '@typegoose/typegoose';

@ObjectType()
export class Video {

  @Field(() => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field(() => String)
  @Property({ required: true })
  url!: string;

  @Field(() => String)
  @Property({ required: true })
  placeName!: string;

  @Field(() => String)
  @Property({ required: true })
  name!: string;

}

export const VideoModel = getModelForClass(Video);
