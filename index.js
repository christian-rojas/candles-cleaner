const { MongoClient } = require("mongodb");

const handler = async (event, context) => {
  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@pepper.hsalogm.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("pepper").collection("candles"); // Replace with your database name

    // const data = database.find({})
    // const count = await data.sort({'data.insertDate':-1}).limit(10).toArray();

    // const dates = await database.find({
    //   insertDate: {
    //       $lt: "2023-07-01 22:34:06.716333",
    //   }
    // }).sort({insertDate: -1}).toArray()
    // Get the current date
    // const currentDate = new Date();
    // // Calculate one week behind
    // const oneWeekBehind = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // console.log(oneWeekBehind);

    const currentDate = new Date();

    // Set a specific time zone
    const targetTimeZone = "America/Santiago";
    const options = { timeZone: targetTimeZone };

    const oneWeekBehind = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    // Format the date in the target time zone
    const formattedDate = oneWeekBehind.toISOString("en-US", options);
    

    // console.log(oneWeekBehind);
    

    await database.deleteMany(
      {
        insertDate: {
          $lt: formattedDate,
        },
      },
      function (err, obj) {
        if (err) throw err;
        console.log("Number of documents deleted: " + obj.result.n);
      }
    );
    // for(const item of count) {
    //     let date = new Date(item.insertDate);
    //     date = date.toLocaleString();
    //     console.log(JSON.stringify(date));
    // }
    // console.log(JSON.stringify(dates, null, 2));

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

handler();
