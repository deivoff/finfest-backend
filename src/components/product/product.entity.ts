import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '$helpers/scalars';

@ObjectType()
export class Product {

  @Field(() => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field(() => String)
  @Property({ required: true })
  organization!: string;

  @Field(() => String)
  @Property({ required: true })
  description!: string;

  @Field(() => Number)
  @Property({ required: true })
  count!: number;

  @Field(() => Number)
  @Property({ required: true })
  price!: number;

  @Field(() => [String])
  @Property({ required: true, type: () => [String] })
  images!: string[];

}

@ObjectType()
export class PurchaseResult {

  @Field({ nullable: true })
  code?: string;

  @Field()
  newScore!: number;

}

export const ProductModel = getModelForClass(Product);
