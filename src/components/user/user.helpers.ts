import DataLoader from 'dataloader';
import { DocumentType} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { ApolloContext } from '$types/index';

import { UserModel, User } from '.';

type UserLoader = DataLoader<string | ObjectId, DocumentType<User>, string>
export const getUserLoader = (key, { dataloaders }: ApolloContext): UserLoader => {
  let dl = dataloaders.get(key);
  if (!dl) {
    dl = new DataLoader(async (keys: readonly (string | ObjectId)[]) => {
      const stringKeys = keys.map(key => key.toString());
      return UserModel.find({ _id: { $in: stringKeys } });
    }, { cacheKeyFn: key => key.toString() });
    dataloaders.set(key, dl);
  }

  return dl;
};
