require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

//const cors = require("cors");

const path = require("path");
const app = express();

const PORT     = process.env.PORT || 4747;
const DB_URI   = "mongodb+srv://pluto:mRne7r8USydZ@cluster0.hwdm7.mongodb.net/"
const DB       = "NoteDB";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../client/build')));
// app.use(cors());

// Establish DB connection
mongoose.connect(DB_URI + DB, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   connectTimeoutMS: 10000
});

const db = mongoose.connection;

db.once('open', () => console.log(`Connected to ${DB} database`));

let NoteSchema = new mongoose.Schema(
  {
    title: String,
    content: String
  },
)


let Note = db.model("Note",NoteSchema);


app.get("/api/notes", function(req,res){
  Note.find({ }, (err, notes) =>{
    if(!err){
      res.json(notes);
    }else{
      res.status(400).json({"error": err});
    }
  });
});

app.post("/api/note/add", (req,res)=>{
  let note = new Note(req.body);

  note.save( (err,result)=>{
    if(!err){
      res.json(result);
    }else{
      res.status(400).json({"error": err});
    }
  });
});

app.delete("/api/note/delete", (req,res)=>{
  let note = req.body;
  Note.deleteOne({ title: req.body.title}, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
  });
  note.save( (err,result)=>{
    if(!err){
      res.json(result);
    }else{
      res.status(400).json({"error": err});
    }
  });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});
