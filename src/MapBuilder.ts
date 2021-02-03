export class MapBuilder<Key, Value> {
  constructor(private readonly map = new Map<Key, Value>()) {}

  add(key: Key, value: Value): this {
    this.map.set(key, value);
    return this;
  }

  build(): Map<Key, Value> {
    return this.map;
  }
}
