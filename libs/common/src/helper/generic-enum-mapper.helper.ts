export class GenericEnumMapper {
  static map<T extends string, U extends string>(
    value: T,
    mapping: Record<T, U>
  ): U {
    const mapped = mapping[value];
    if (!mapped) {
      throw new Error(`No mapping found for value: ${value}`);
    }
    return mapped;
  }
}