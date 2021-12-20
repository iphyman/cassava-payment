import { ReefTransaction } from "libs/reef/transaction";
// import { ApiHandler } from "typings";

export const handler = (): Promise<void> => {
  const controller = new ReefTransaction();

  return controller.startSyncingBlocks();
};
