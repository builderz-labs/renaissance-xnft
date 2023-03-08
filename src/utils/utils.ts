import { DateTime } from "@metaplex-foundation/js";

export const toDate = (value?: DateTime) => {
  if (!value) {
    return;
  }

  return new Date(value.toNumber() * 1000);
};
