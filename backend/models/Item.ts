import { Model } from "objection"

export default class Item extends Model {
  id: string
  text: string
  checked: boolean

  static get tableName() {
    return "items"
  }
}
