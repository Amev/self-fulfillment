export type SupportedVariableTypes = string | number | boolean;

export default class Variables {
  #values: Record<string, SupportedVariableTypes> = {};

  #types: Record<string, string> = {};

  constructor(
    initialVariables: { name: string; value: SupportedVariableTypes }[] = [],
  ) {
    initialVariables.forEach(({ name, value }) => {
      this.#values[name] = value;
      this.#types[name] = typeof value;
    });
  }

  getValue(name: string) {
    return this.#values[name];
  }

  getType(name: string) {
    return this.#types[name];
  }

  setValue(name: string, value: SupportedVariableTypes) {
    if (!Object.prototype.hasOwnProperty.call(this.#values, name)) {
      this.#types[name] = typeof value;
    }
    // eslint-disable-next-line valid-typeof
    if (typeof value !== this.#types[name]) {
      throw new Error(
        `Invalid type, can’t set variable ${name} of initial ${this.#types[name]} type, value of ${typeof value} received.`,
      );
    }
    this.#values[name] = value;
  }

  display() {
    Object.entries(this.#values).forEach(([name, value]) => {
      // eslint-disable-next-line no-console
      console.log(`${name}: ${this.#types[name]} = ${value}`);
    });
  }
}
