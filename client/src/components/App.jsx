import React, {useState, useEffect} from "react";
import Note from "./Note";
import Header from "./Header";
import axios from "axios";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';

const defaultNote = {
  title: "",
  content: ""
};


function App() {
  const [note, setNote] = useState(defaultNote);
  const [notes, setNotes] = useState([]);
  const [isStarted, setStarted] = useState(false);

  useEffect(() => {
    axios.get("/api/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  });

  function handleChange(event) {
    const {name, value} = event.target;
    setNote({...note, [name]: value});
  }

  function addNote(newNote) {
    axios.post("/api/note/add", newNote)
      .then((res) => setNotes([...notes, res.data]))
      .catch((err) => console.log(err));
  }

  function onDelete(id){
    axios.delete("/api/note/delete", { data: notes[id]})
    .then(
      setNotes(prevNotes => {
        return prevNotes.filter((noteItem, index) => {
          return index !== id;
        })
      }) // updating state to not refresh manually!
    )
    .catch((err) => console.log(err))

  }

  function clickButton(){
    if (note.title && note.content){
      addNote(note);
      setNote(defaultNote);
      console.log(note);
    }else{
      console.log("Not compeletely!!!");
    }
  }

  function toStart(event){
    setStarted(true);
  }

  return (
    <>
    <Header />

    <form className="create-note" onSubmit={(e) => e.preventDefault()}>
        {isStarted&&<input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />}
        <textarea
          onClick={toStart}
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isStarted?"3":"1"}
        />

        <Zoom in={isStarted}>
        <Fab onClick={clickButton}><AddIcon /></Fab>
        </Zoom>
      </form>
         
        { notes.length>0?
          notes.map((note,index) => (
          <Note
            key={index}
            id={index}
            title={note.title}
            content={note.content}
            onDelete={onDelete}
          />
        )):null}
    
    </>
  );
}
export default App;
