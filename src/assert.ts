import { strict } from "assert";

export function assert<T>(condition?: T, msg?: string): NonNullable<T> {
  strict.ok(condition, msg);
  return condition!;
}
