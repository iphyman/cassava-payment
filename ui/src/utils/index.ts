export const poll = async (
  getter: any,
  validation: any,
  time: number = 20000
) => {
  let result = await getter();
  while (validation(result)) {
    await new Promise((resolve) => {
      setTimeout(resolve, time);
    });

    result = await getter();
  }

  return result;
};
