import React, {useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import Note from "./Note";
import CreateArea from "./CreateArea";
//import notes from '../notes';

function App() {
    const [noteList, setNoteList] = useState([]); //set the overall list to a state of lists


    const addNote = (note)=>{ //note is external to this file
        setNoteList((prevNotes)=>{
            return [...prevNotes, note];
        });
    }; //this is onClick event handler, no need to keep event in params

    const deleteNote = (id) =>{
        setNoteList((prevNotes)=>{
            return prevNotes.filter((note, index)=>{
                return index !== id;
            });
        })
    };

    return ( 
    <div>
        <Header />
        <CreateArea onAdd={addNote}/>
        {noteList.map((notei, index)=>{
            // console.log(notei);
            return <Note key={index} id={index} title={notei.title} content={notei.content} onDelete={deleteNote}/>
        })}
        <Footer />
    </div>);
}

/* {notes.map((note)=>{
        //input a js object, return a react component
        return (<Note id={note.key} title={note.title} content={note.content}/>);
})} */

export default App;