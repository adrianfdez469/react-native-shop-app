import { IProduct } from '../types';

export default class Product implements IProduct{
    constructor(public id:string, public ownerId:string, public title:string, public imageUrl:string, public description:string, public price:number){}
}