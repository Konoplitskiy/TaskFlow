import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskStatus } from "./enums/task-status.enum";
import { User } from "../user/user.entity";

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @Column({type:'text',nullable:true})
    description:string|null;

    @Column({type:'enum', enum:TaskStatus, default:TaskStatus.TODO})
    status:TaskStatus;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.tasks, {onDelete:'CASCADE'})
    user:User;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

}