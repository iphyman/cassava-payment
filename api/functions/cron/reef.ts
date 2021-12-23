import { ReefTransaction } from "libs/reef/transaction";
// import { ApiHandler } from "typings";

export const handler = async (): Promise<void> => {
  const controller = new ReefTransaction();

  await controller.startSyncingBlocks();

  return;
};
