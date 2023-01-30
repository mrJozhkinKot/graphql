## Assignment: Graphql

### Tasks:

1.  Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).  
    1.1. npm run test - 100%
2.  Add logic to the graphql endpoint (graphql folder in ./src/routes).  
     Constraints and logic for gql queries should be done based on restful implementation.  
     For each subtask provide an example of POST body in the PR.  
     All dynamic values should be sent via "variables" field.  
     If the properties of the entity are not specified, then return the id of it.  
     `userSubscribedTo` - these are users that the current user is following.  
     `subscribedToUser` - these are users who are following the current user.

        - Get gql requests:

               2.1. Get users, profiles, posts, memberTypes - 4 operations in one query. <br>
               _QUERY:_ <br>
               query findAllEntities {
               users {
               id, firstName, lastName, email, subscribedToUserIds
               }
               profiles {
               id, avatar, sex, birthday, country, street, city, memberTypeId
               }
               posts {
               id, title, content, userId
               }
               memberTypes {
               id, discount, monthPostsLimit
               }
               } <br>
               2.2. Get user, profile, post, memberType by id - 4 operations in one query. <br>
               _QUERY:_ <br>
               query findByIds ($userId:ID, $profileId: ID, $postId:ID, $memberTypeId: ID){
              user (id: $userId) {
                   id, firstName, lastName, email, subscribedToUserIds
              }
              profile (id: $profileId) {
                  id, avatar, sex, birthday, country, street, city, memberTypeId
              }
              post (id: $postId) {
                  id, title, content, userId
              }
              memberType (id: $memberTypeId) {
                  id, discount, monthPostsLimit
              }

          } <br>
          _VARIABLES_ <br>
          {
          "userId": "paste id",
          "profileId": "paste id",
          "postId": "paste id",
          "memberTypeId": "paste basic or business"
          } <br>
          2.3. Get users with their posts, profiles, memberTypes. <br>
          _QUERY_ <br>
          query findUsersWithInfo {
          usersWithInfo {
          id, firstName, lastName, email, subscribedToUserIds, profile {
          id, avatar, sex, birthday, country, street, city, memberTypeId
          },
          posts {
          id, title, content
          }, memberType {
          id, discount, monthPostsLimit
          }
          }
          } <br>
          2.4. Get user by id with his posts, profile, memberType. <br>
          _QUERY_ <br>
          query findUserWithInfo ($userId:ID){
         userWithInfo(id: $userId){
        id, firstName, lastName, email, subscribedToUserIds,
        profile {
        id, avatar, sex, birthday, country, street, city, memberTypeId
        }
        posts {
        id, title, content, userId
        }
           memberType {
            id, discount, monthPostsLimit
        }
        }

    } <br>
    _VARIABLES_ <br>
    {
    "userId": "f1399e51-d974-4fdc-b260-2149b295ddc8"
    } <br>
    2.5. Get users with their `userSubscribedTo`, profile. <br>
    _QUERY_ <br>
    query findUsersWithSubsribedToAndProfile {
    usersWithSubscribeTo {
    id, firstName, lastName, email
    subscribedToUserIds
    userSubscribeTo {
    id, firstName, lastName, email, subscribedToUserIds
    }
    profile {
    id, avatar, sex, birthday, country, street, city,memberTypeId
    }
    }
    }
    <br>
    2.6. Get user by id with his `subscribedToUser`, posts. <br>
    _QUERY_ <br>
    query findUserWithSubsribedToUserAndPosts ($userId:ID) {
    userWithSubscribers(id: $userId){
    id, firstName, lastName, email, subscribedToUserIds,
    posts {
    id, title, content
    }, subscribedToUser {
    id, firstName, lastName, email, subscribedToUserIds
    }
    }
    } <br>
    _VARIABLES_ <br>
    {
    "userId": "c3a73bca-c097-4c1f-a0f8-e5c9c49190c1"
    } <br>
    2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`). <br>
    _QUERY_ <br>
    query findUsersWithSubscribersAndSubscriptions {
    usersWithSubscribersAndSubscriptions{
    id, firstName, lastName, email, subscribedToUserIds,
    userSubscribeTo {
    id, firstName, lastName, email, subscribedToUserIds
    }, subscribedToUser {
    id, firstName, lastName, email, subscribedToUserIds
    }
    }
    } <br>

        - Create gql requests: <br>

          2.8. Create user. <br>
          _MUTATION_ <br>
          mutation createNewUser{
          createUser (input: {
          firstName: "John",
          lastName: "Doe",
          email: "doe@gmail.com"
          }){
          id, firstName, lastName, email, subscribedToUserIds
          }
          } <br>
          2.9. Create profile. <br>
          _MUTATION_ <br>
          mutation createNewProfile{
          createProfile (input: {
          avatar:"src/...",
          sex: "man",
          birthday: 10.08,
          country: "USA",
          street: "unknown str",
          city: "New York",
          userId: "fbe2223c-db10-40af-8042-2614d85a90c7",
          memberTypeId: "basic"
          }){
          id, avatar, sex, birthday, country, street, city, userId, memberTypeId
          }
          } <br>
          2.10. Create post. <br>
          _MUTATION_ <br>
          mutation createNewPost{
          createPost (input: {
          title: "new Post",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          userId: "431f1127-4711-45a6-8fad-5ba392ee02fc"
          }){
          id, title, content, userId
          }
          } <br>
          2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs. <br>

        - Update gql requests:

          2.12. Update user. <br>
          _MUTATION_ <br>
          mutation updateUser{
          updateUser (input: {
          id: "431f1127-4711-45a6-8fad-5ba392ee02fc",
          firstName: "John",
          lastName: "Doe",
          email: "john-doe@gmail.com"
          }){
          id, firstName, lastName, email
          }
          }
          } <br>
          2.13. Update profile. <br>
          _MUTATION_ <br>
          mutation updateProfile{
          updateProfile (input: {
          id: "8bbfdf6e-7270-497e-bb82-8c5ffefc1058",
          avatar:"src/...",
          sex: "man",
          birthday: 10.08,
          country: "USA",
          street: "updated str",
          city: "New York",
          userId: "431f1127-4711-45a6-8fad-5ba392ee02fc",
          memberTypeId: "basic"
          }){
          id, avatar, sex, birthday, country, street, city, userId, memberTypeId
          }
          } <br>
          2.14. Update post. <br>
          _MUTATION_ <br>
          mutation updatePost{
          updatePost (input: {
          id: "ba97786b-049c-4163-98a9-1814e1a03882",
          title: "updated Post",
          content: "updated Text",
          userId: "431f1127-4711-45a6-8fad-5ba392ee02fc"
          }){
          id, title, content, userId
          }
          2.15. Update memberType. <br>
          _MUTATION_ <br>
          mutation updateMemberType{
          updateMemberType (input: {
          id: "basic",
          discount: 10,
          monthPostsLimit: 30,
          }){
          id, discount, monthPostsLimit
          }
          } <br>
          2.16. Subscribe to; unsubscribe from. <br>
          _MUTATION_ <br>
          mutation subscribeTo{
          subscribeTo (input: {
          id: "431f1127-4711-45a6-8fad-5ba392ee02fc",
          userId: "eba06236-6678-4869-9eb9-063fe193860e",
          }){
          id, firstName, lastName, email, subscribedToUserIds
          }
          } <br>
          _MUTATION_ <br>
          mutation unsubscribeFrom{
          unsubscribeFrom (input: {
          id: "431f1127-4711-45a6-8fad-5ba392ee02fc",
          userId: "eba06236-6678-4869-9eb9-063fe193860e",
          }){
          id, firstName, lastName, email, subscribedToUserIds
          }
          } <br>
          2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.

3.  Solve `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.  
    You can use only one "findMany" call per loader to consider this task completed.  
    It's ok to leave the use of the dataloader even if only one entity was requested. But additionally (no extra score) you can optimize the behavior for such cases => +1 db call is allowed per loader.  
    3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).
4.  Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.  
     4.1. Provide a link to the line of code where it was used.  
     4.2. Specify a POST body of gql query that ends with an error due to the operation of the rule. Request result should be with `errors` field (and with or without `data:null`) describing the error.
    _QUERY_ <br>
    query depthLimitError ($userId:ID){
    userWithInfo(id: $userId){
    id, firstName, lastName, email, subscribedToUserIds,
    profile {
    id, avatar, sex, birthday, country, street, city, memberTypeId
    }
    id {
    id {
    id {
    id {
    id{
    id {
    id
    }
    }
    }
    }
    }
    }
    posts {
    id, title, content, userId
    }
    memberType {
    id, discount, monthPostsLimit
    }
    }
    } <br>

### Description:

All dependencies to complete this task are already installed.  
You are free to install new dependencies as long as you use them.  
App template was made with fastify, but you don't need to know much about fastify to get the tasks done.  
All templates for restful endpoints are placed, just fill in the logic for each of them.  
Use the "db" property of the "fastify" object as a database access methods ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).  
Body, params have fixed structure for each restful endpoint due to jsonSchema (schema.ts files near index.ts).

### Description for the 1 task:

If the requested entity is missing - send 404 http code.  
If operation cannot be performed because of the client input - send 400 http code.  
You can use methods of "reply" to set http code or throw an [http error](https://github.com/fastify/fastify-sensible#fastifyhttperrors).  
If operation is successfully completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).

Relation fields are only stored in dependent/child entities. E.g. profile stores "userId" field.  
You are also responsible for verifying that the relations are real. E.g. "userId" belongs to the real user.  
So when you delete dependent entity, you automatically delete relations with its parents.  
But when you delete parent entity, you need to delete relations from child entities yourself to keep the data relevant.  
(In the next rss-school task, you will use a full-fledged database that also can automatically remove child entities when the parent is deleted, verify keys ownership and instead of arrays for storing keys, you will use additional "join" tables)

To determine that all your restful logic works correctly => run the script "npm run test".  
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).

### Description for the 2 task:

You are free to create your own gql environment as long as you use predefined graphql endpoint (./src/routes/graphql/index.ts).  
(or stick to the [default code-first](https://github.dev/graphql/graphql-js/blob/ffa18e9de0ae630d7e5f264f72c94d497c70016b/src/__tests__/starWarsSchema.ts))

### Description for the 3 task:

If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.

### Description for the 4 task:

If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  
E.g. User can refer to other users via properties `userSubscribedTo`, `subscribedToUser` and users within them can also have `userSubscribedTo`, `subscribedToUser` and so on.  
Your task is to add a new rule (created by "graphql-depth-limit") in [validation](https://graphql.org/graphql-js/validation/) to limit such nesting to (for example) 6 levels max.
