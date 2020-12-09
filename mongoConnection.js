const MongoClient = require("mongodb").MongoClient;

var url =
  "mongodb+srv://userBosi:ryfAwtPiPoxstV8t@cluster0.wqqph.mongodb.net/test?retryWrites=true&w=majority";


async function addPostToDataBase(user, blogName, post) {
  try {
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  const db = client.db(blogName);
  db.collection("posts")
    .insertOne({
      author: post.author,
      title: post.title,
      image: post.image,
      content: post.content,
      tags: post.tags,
    })
    .then(function (result) {
      // process result
    });

    client.close();
  } catch (e) {
    console.error(e);
  }
}
