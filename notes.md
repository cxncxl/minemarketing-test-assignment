# Architecture

The app is build according to standard REST architecture:
- Each data entity has its own module
- Each module consists of controller (interaction interface), service (business
logic unit), and data transfer objets definitions (.dto.ts files)
- Database logic is isolated in its own module that provides interactions with
the DB to other modules as DbOperations (details below) and incapsulates
database connection, structure and calls
- Since in this case database **is** core of the app (app's goal is to provide
way for interactions with the DB), API is dependent on database. Yet, in other
applications, where business logic is in the app itself, dependency inversion
could be used to move DB-related logic to outer level

## Db Operations

Calls to the DB are incapsulated using `DbOperation` interface and several classes
implementing it (`src/db/operations`). This allows to separate app's code (services,
controlers) from DB-related things

## Pagination

Pagination logic is common in all three modules, so I've moved it to a separate
class (`src/api/shared/pagination.ts`) to simplify working with it and follow DRY

# Tests

Currently only a few classes are covered with tests (some of database operations
and products module). Test definitions can be found at `src/db/operations/db-operations.spec.ts`
and `src/api/product/products.spec.ts`

# Queries

All the queries are done using either TypeORM's repositories' methods directly
(e.g., `findOneBy`, etc) or its `QueryBuilder` for more complex scenarious. With that
TypeORM's sanitization is used ensuring database security
Models are defined with foreign key relationships to ensure data close connection,
database normalization and speed up queries over multiple entities (i.e. select
products with categories)

# The Cron job

The job is implemented in `src/api/api.service.ts`, using `@nest/schedule` package.
The job is created automatically on application's bootstrap and being called
every 6 hours. It calls a database operation (`src/db/operations/update-stocks-db-operation.ts`)
that contains all the logic. The operation is using transactions to assure data is
not corrupted in case of a brekdown

# Further improvements

While this is quite a small project, there's room for further improvements that
I'd done if this was a production code. Among those:

1. Authorization

JWT Authorization could be done relatively easy within the app. Yet, this is out
of scope accordingly to the assignment

2. Exception handling

Currently controllers are running services wrapped in try-catch block and send
standardized error messaged back using HttpException in case of any problem.
A function or decorator could be used to keep the code DRY and error messages
more standardized, possibly with event logging, error codes or localization

3. Generic services

Accordingly to the assignment, each module has different amount of endpoints,
yet, if that was a full CRUD/REST app, services could be done as abstract classes,
having 4 `DbOperation` fields and 4 methods (`create`, `update`, `read`, `delete`) calling
the abovementioned operations. With that, defining a service would be as simple
as defining constructor with the operations. This also would allow to make controllers
generic making it only neccessary to define models and db operations

4. More tests

As metnioned above, currently only a few classes are covered with tests. In production
code coverage should be 80%+, so I would add more tests
