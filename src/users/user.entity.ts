import { Exclude } from "class-transformer";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log("User is inserted with id ", this.id); 
    }

    @AfterUpdate()
    logUpdate() {
        console.log("User is updated with id ", this.id);
    }

    @AfterRemove() 
    logRemove() {
        console.log("User is removed with id ", this.id);
    }
}