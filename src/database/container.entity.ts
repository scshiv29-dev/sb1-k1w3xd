import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Container {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  containerId: string;

  @Column()
  name: string;

  @Column()
  databaseType: string;

  @Column()
  port: number;

  @Column('simple-json')
  envVars: Record<string, string>;
}