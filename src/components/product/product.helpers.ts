import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';
import { ApolloContext } from '$types/index';

import { ProductModel } from '.';

export const getProductLoader = (key, { dataloaders }: ApolloContext) => {
  let dl = dataloaders.get(key);
  if (!dl) {
    dl = new DataLoader(async (keys: readonly (string | ObjectId)[]) => {
      const stringKeys = keys.map(key => key.toString());
      return ProductModel.find({ _id: { $in: stringKeys } });
    }, { cacheKeyFn: key => key.toString() });
    dataloaders.set(key, dl);
  }

  return dl;
};
