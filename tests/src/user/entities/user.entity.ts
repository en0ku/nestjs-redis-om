import { Field, Schema, Entity } from '../../../../lib';

export interface UserEntity extends Entity {}
@Schema('user', { dataStructure: 'HASH' })
export class UserEntity {
  @Field({ type: 'number', sortable: true })
  id: number;

  @Field({ type: 'string', sortable: true })
  username: string;

  @Field({ type: 'date', sortable: true, field: 'registration_date' })
  registrationDate: Date;

  @Field({ type: 'boolean', sortable: true, field: 'is_active' })
  isActive: boolean;
}
