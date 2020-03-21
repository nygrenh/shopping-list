import { Model } from "objection"

export default class Item extends Model {
  static get tableName() {
    return "items"
  }
}
