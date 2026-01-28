export abstract class BaseEntity {
    abstract readonly id: string;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    abstract validate(): boolean;

    abstract clone(): BaseEntity;

    abstract toJson(): any;

    touch(): void  {
        this.updatedAt = new Date();
    }
}