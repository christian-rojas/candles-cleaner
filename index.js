const { MongoClient } = require("mongodb");

const handler = async (event, context) => {
  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@pepper.hsalogm.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("pepper").collection('candles'); // Replace with your database name
    
    const data = database.find({})
    const count = await data.sort({'data.insertDate':-1}).limit(10).toArray();    
    // for(const item of count) {
    //     let date = new Date(item.insertDate);
    //     date = date.toLocaleString();
    //     console.log(JSON.stringify(date));
    // }
    console.log(JSON.stringify(count, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data listed successfully" }),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  } finally {
    await client.close();
  }
};

// handler();