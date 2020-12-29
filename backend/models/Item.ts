import BaseModel from "./BaseModel"
import softDelete from 'objection-soft-delete';
import { mixin } from "objection"

export default class Item extends mixin(BaseModel, [
  softDelete({ columnName: "deleted" }),
]) {
  id: string
  text: string
  checked: boolean

  static get tableName() {
    return "items"
  }
}
