
import express from "express"
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from "cors"

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("wanderlust")
const destinationsCollection = db.collection("destinations")
app.get("/",(req, res) =>{
    res.send({message: "server is running fine"})
})

const bokingCollections = db.collection("bookings")

app.post("/add-destinations",async (req,res) => {

  const data = {
    ...req.body,
    category: typeof req.body.category === "string"
      ? req.body.category.trim()
      : req.body.category,
  }
  const result = await destinationsCollection.insertOne(data)

  res.send(result)
})

app.get("/destinations", async(req,res) => {
  const result = await destinationsCollection.find().toArray()
  res.send(result)
})

app.get("/destination/:id" , async (req,res) => {
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await destinationsCollection.findOne(query)
  

  res.send(result)
})

app.patch("/destination/:id", async(req,res) => {
   const id = req.params.id
   const updateData = req.body

   const result = await destinationsCollection.updateOne(
    {_id : new ObjectId(id)},
    {$set: updateData}
   )
   res.send(result)
})

app.delete("/destination/:id", async(req,res) =>{
  const id = req.params.id
  const result = await destinationsCollection.deleteOne({_id: new ObjectId(id)})
  res.send(result)
  console.log(result)
})


app.post("/bookings", async(req,res) => {
    const data = req.body
    const result = await bokingCollections.insertOne(data)
    res.send(result)
  
})


export default app;
