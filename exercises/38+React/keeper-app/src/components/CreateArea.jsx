import React, {useState} from "react";

function CreateArea(props) {
    const [note, setNote] = useState({title:"", content:""}); //set note state and kept track from input area

    const updateNote = (event)=>{
        const {name, value} = event.target; //tracking input event's target caller: input in CreateArea
        setNote((prevNoteState)=>{
            return {
                ...prevNoteState,
                [name] : value //set the field that's tracked by 'name' to 'value'
            };
        });
    };

    const submitNote = (event) =>{
        props.onAdd(note); //call parent state changer function
        setNote({
            title: "",
            content: ""
          }); //rezero the field being tracked all day
        event.preventDefault();
    }

    return (
    <div>
        <form>
        <input onChange={updateNote} name="title" value={note.title} placeholder="Title" />
        <textarea onChange={updateNote} name="content" value={note.content} placeholder="Take a note..." rows="3" />
        <button onClick={submitNote}>Add</button>
        </form>
    </div>
    );
}

export default CreateArea;