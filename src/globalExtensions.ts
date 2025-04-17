// Sigh... since Javascript's standard library is woefully incomplete,
// I've had to amend it in some ways to fit my needs. This file is it.

declare global {
  interface Array<T> {
    intersperse(this: Array<T>, separator: T): T[];
    indexOfMax(this: Array<number>): number | undefined;
  }
}

if (!Object.prototype.hasOwnProperty.call(Array, "intersperse")) {
  Object.defineProperty(Array.prototype, "intersperse", {
    value: function intersperse<T>(this: T[], separator: T): T[] {
      return this.flatMap((item, idx) =>
        idx === 0 ? [item] : [separator, item]
      );
    },
  });
}

if (!Object.prototype.hasOwnProperty.call(Array, "indexOfMax")) {
  Object.defineProperty(Array.prototype, "indexOfMax", {
    value: function indexOfMax(this: number[]): number | undefined {
      let max = 0;
      let max_index: number | undefined = undefined;
      this.forEach((value, index) => {
        if (value > max) {
          max = value;
          max_index = index;
        }
      });
      return max_index;
    },
  });
}

// Needed to make this a module
export {};
