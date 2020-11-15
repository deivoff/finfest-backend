import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import _ from 'lodash';
import { Product, ProductModel, PurchaseResult } from './product.entity';
import { ApolloContext } from '$types/index';
import { ObjectIdScalar } from '$helpers/scalars';
import { UserModel } from '$components/user';
import CONFIG from '$configs/index';

const generateCode = (productName: string, userName: string) => {
  return 'Приз: '
    + productName
    + ', Победитель: '
    + userName
    + ', Уникальный идентификатор победы:'
    + _.uniqueId('FinFеst_')
};

@Resolver(() => Product)
export class ProductResolver {

  @Authorized()
  @Query(() => [Product])
  async products() {
    try {
      return await ProductModel.find({
        count: { $gt: 0 },
      });
    } catch (e) {
      throw e;
    }
  }

  @Authorized()
  @Mutation(() => PurchaseResult)
  async purchase(
    @Ctx() { state }: ApolloContext,
    @Arg('productId', () => ObjectIdScalar) productId: string
  ) {
    try {
      const [user, product] = await Promise.all([
        UserModel.findById(state.decodedUser!.id!),
        ProductModel.findById(productId)
      ]);

      const userObj = user!.toObject();

      if (!product?.count) throw new Error('Эти призы закончились');
      if (!userObj.score) {
        return {
          newScore: user!.score
        }
      }

      if (userObj.score < (product?.price!)) {
        return {
          newScore: userObj.score
        }
      }


      const newScore = userObj.score - product!.price;
      const newProductCount = product!.count - 1;

      const productUserCode = generateCode(
        product.description,
        `${userObj.name.givenName} ${userObj.name.familyName}`);

      user!.productCodes = userObj?.productCodes ? [
        ...userObj.productCodes,
        productUserCode
      ] : [productUserCode];

      user!.score = newScore;
      product!.count = newProductCount;

      await user!.save();
      await product!.save();

      return {
        code: productUserCode,
        newScore,
      }

    } catch (e) {
      throw e;
    }
  }

  @FieldResolver()
  async images(
    @Root() { images }: Product
  ) {
    return images.map(img => CONFIG.urls.http + 'static/' + img);
  }
}
