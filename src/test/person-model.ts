import {Model, Field} from "../model/decorators";

@Model()
export class Person {

  @Field({type: 'number'})
  id;

  @Field({type: 'string'})
  firstName:string;

  @Field({type: 'string'})
  lastName:string;

  @Field({type: 'date'})
  birthDate:Date;


  constructor(firstName?:string, lastName?:string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
