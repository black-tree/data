import {Serializer} from "./serializer";

/**
 * An simple implementation of the [[Serializer]] that serializes model data
 * as a JSON string
 */
export class JsonSerializer implements Serializer {

  /**
   * @inheritdoc
   */
  serialize(modelData:any[]):any {
    return JSON.stringify(modelData);
  }
}
