import { Account, Client, ID, Query, TablesDB } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68aeae87002cbc4e6733");

const tablesDB = new TablesDB(client);

let promise = tablesDB.listRows("68b8eed9003464a538d4", "users", [
  Query.equal("accountId", "68b945f3003710387ada"),
]);

promise.then(
  function (response) {
    console.log(response);
  },
  function (error) {
    console.log(error);
  }
);

// const promise = tablesDB.createRow(
//   "68b8eed9003464a538d4",
//   "users",
//   ID.unique(),
//   {
//     accountId: "68b9284ab3cc8004550f",
//     email: "anirudhmounasamy@gmail.com",
//     name: "Anirudh Mounasamy",
//     imageUrl: "/assets/images/david.webp",
//     joinedAt: new Date().toISOString(),
//   }
// );

// promise.then(
//   function (response) {
//     console.log(response);
//   },
//   function (error) {
//     console.log(error);
//   }
// );
