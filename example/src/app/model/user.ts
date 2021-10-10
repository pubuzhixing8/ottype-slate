import * as faker from "faker";

export interface User {
    id: string;
    name: string;
}

export const createUser = (): User => ({
    id: faker.random.uuid(),
    name: `${faker.name.firstName()}`,
});