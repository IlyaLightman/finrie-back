## Backend for Finrie

*Stack: Typescript, Fastify, Prisma, PostgreSQL*

In Finrie, it is possible to create 'local financial systems' in which users can register. The administrator can then issue coins to users and they can transfer them to each other

Coins are exchanged between users through transactions. First, they go into the transaction pool (an entry is created in the "transactions_pool" table), which is constantly monitored and from which they are registered (an entry is created in the "transactions" table)

#### Database Schema
![Schema](https://i.ibb.co/94mstDC/schema.png)
