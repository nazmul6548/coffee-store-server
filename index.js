const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5175;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASSWORD}@cluster0.ce00xrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffee/:id",async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};

      // const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);



    })
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);

      const result = await coffeeCollection.insertOne(newCoffee);
      // res.json({ message: 'Coffee added successfully' });
      res.send(result);
    });



app.put("/coffee/:id",async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)};
  const options = {upsert:true}
  const updatedCoffee =req.body;
  const coffee = {
    $set:{
      name:updatedCoffee.name, quantity:updatedCoffee.quantity, supplier:updatedCoffee.supplier, taste:updatedCoffee.taste, category:updatedCoffee.category, details:updatedCoffee.details,image:updatedCoffee.image
    }

  }
  const result = await coffeeCollection.updateOne(filter,coffee,options)
  res.send(result)
})


    app.delete('/coffee/:id',async (req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee making server is running");
});

app.listen(port, () => {
  console.log(`coffee server is running on port: ${port}`);
});
