## Backend for Finrie

*Stack: Typescript, Fastify, Zod, Prisma, PostgreSQL*

In **Finrie**, it is possible to create 'local financial systems' in which users can register. The administrator can then issue coins to users and they can transfer them to each other

Coins are exchanged between users through transactions. First, they go into the transaction pool (an entry is created in the "transactions_pool" table), which is constantly monitored and from which they are registered (an entry is created in the "transactions" table)

**Run Dev:** `npm run dev`

### Database Schema
![Schema](https://s1.hostingkartinok.com/uploads/images/2023/05/5601d880da9175d663059eef6f74e42e.png)

**Migrate:** `npx prisma migrate dev --name <name>`

##### System
It is an aforementioned 'local financial system'. Registering a system is essentially the same as registering a user who can only operate it (set up issuance, hand out coins, accept participants)

##### User
A user is a participant in a system. He can receive coins from the administrator and transfer them to other users. The difference with system registration is that the user specifies the name of an existing system

##### Sender
The sender can be a user or a system, this object is created for them by default and then used in transactions

##### Receiver
The same as the sender, but for the recipient

##### Pool transaction
A transaction that is in the transaction pool. It is created when a user sends coins to another user. The transaction pool is constantly monitored and transactions are registered from it

##### Transaction
Coin transfer transaction. It is created when a transaction is registered from the transaction pool

##### Weekly statement
A weekly report on the movement of coins in the system. It is created every week and balances calculates with it to improve performance (not to calculate balances every time from the beginning of the system)

### API

##### System
- `POST /system` - Register a system
- `POST /system/login` - Login to the system
- - `GET /system/:id` - Get system by id (*auth*)
- `GET /system` - Get all systems (*auth*)
- `GET /system/issuance` - Get free issuance of authenticated system (*auth*)

##### User
- `POST /user` - Register a user
- `POST /user/login` - Login to the user
- `GET /user/:system_id/:id` - Get user of system by id (*auth*)
- `GET /user/:system_id` - Get all users of the system (*auth*)
- `GET /user/balance` - Get balance of authenticated user (*auth user*)

##### Pool Transaction
- `POST /pool_tx` - Create a pool transaction (if you log in as a system, then the sender will be the system, if you log in as a user, then the sender will be the user) (*auth*)
- `GET /pool_tx/:id` - Get pool transaction of auth system (*auth*)
- `GET /pool_tx/system` - Get all pool transactions of authenticated system (or system of authenticated user) (*auth*)
- `GET /pool_tx` - Get all pool transactions of authenticated user where he is the sender or recipient (*auth user*)

##### Transaction
- `GET /tx/:id` - Get transaction of auth system (*auth*)
- `GET /tx/system` - Get all transactions of authenticated system (or system of authenticated user) (*auth*)
- `GET /tx` - Get all transactions of authenticated user where he is the sender or recipient (*auth user*)

### Nice to have
- KYC Fields for user, user accepting by system creator (removed for the first version)
- Orders/Promises system
