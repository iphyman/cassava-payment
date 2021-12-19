import { Reef } from "libs/reef";
// import { ApiHandler } from "typings";

export const handler = (): Promise<void> => {
  const controller = new Reef();

  return controller.startSyncingBlocks();
};
