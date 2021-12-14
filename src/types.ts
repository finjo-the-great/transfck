export enum Operation {
  LEFT,
  RIGHT,
  INC,
  DEC,
  OUTPUT,
  INPUT,
  LOOP,
  BRANCH,
}

export type OperationList = (Operation | OperationList)[];
