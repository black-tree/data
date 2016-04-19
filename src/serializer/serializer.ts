/**
 * Describes the interface that must be implemented by all model data
 * serializers.
 */
export interface Serializer {

  /**
   * Serializes the passed model data.
   * @param modelData
   */
  serialize(modelData:any[]):any;

}
