export default interface IImages extends Array<Item> { }

export interface Item {
  url?: string
  image?: string
  image_type?: string
}