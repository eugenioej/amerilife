"use client";
import { useState, useEffect} from "react";



type Item = {
  id: number;
  name: string;
  priority: string;
  category: string;
};

export default function TestPageAV() {
  const [categories, setcategories] = useState(["Todo", "Task"]);

  const [newcat, setNewCat] = useState("");
  const [cat, setCat] = useState("");
  const [deleteitem, setDeleteItem] = useState(0);
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  /*This function prevents the browser from reloading and calls the addcat function to complete the process of adding a new category*/
  function handleNewCat(e: React.FormEvent){
    e.preventDefault();
    addCategory(newcat);
  }
  useEffect(() => {
  console.log(items);
}, [items]);
  /*This function uses state to securely change the category variable and sets the newcat variable back to empty*/
  function addCategory( category: string) {
    setcategories([...categories, category]);
    setNewCat("")
    }

    function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        newItem();
    }
    function newItem(){
        const object = {
            id: items.length+1+deleteitem,
            category: cat,
            name: content,
            priority: priority,
        };
        setItems([...items, object]);
        setContent("")
        setPriority("")
        setCat("");
    }

    function handleDelete(id: number){
    deletEvent(id);
    }

    function deletEvent(id:number){
        setItems(items.filter(item => item.id !==id));
        setDeleteItem(deleteitem+1);
    }

  return (
    
    <div>
        <style>
            {`
             h1{
                font-size: 20px;
                font-weight: bold;
                }
            .button{
             background-color: blue !important;
            }
            `}
        </style>
        {/*Top Banner Section*/}
      <div className="card text-center bg-primary p-5 text-white">
        <h1>
          Interactive Content Explorer
        </h1>

        <div className="card-body">
          <h5>Search, Input items into Lists</h5>
        </div>
      </div>

    {/*Form Section*/}
      <div className="p-5">
        <h2 className="text-center">Add to your Lists</h2>

        <form className="w-75 mx-auto" onSubmit={handleSubmit}>
            <div>
                <div>
                    <select name="categories" value={cat} onChange={(e) => setCat(e.target.value)} id="Categories">
                    <option value="">Please Choose a Category</option>
                    {/*Mapping through the Categories list using the map() feature*/}
                    {categories.map(category =>(
                        <option key={category} value={category}>{category}</option>
                    ))}
                    </select>
                </div>
                {/*using functions and the setnewcat to add new categories*/}
                <input type="text"className="mb-3" value={newcat} onChange={(e) => setNewCat(e.target.value)} placeholder="Add Category"/>
                <button className="button" type="button" onClick={handleNewCat}>Add</button>
            </div>
            <div>
                <input className="w-75 mb-3 border p-1" type="text" placeholder="Name of the item or task" value={content} onChange={(e) => setContent(e.target.value)}/>
                <input className="w-75 mb-3 border p-1" type="text" placeholder="What is the Priority" value={priority} onChange={(e) => setPriority(e.target.value)}/>
                <button className="button text-white rounded p-2" type="submit">Submit</button>
            </div>
        </form>
      </div>
      
    <div className="bg-primary gap-3 p-4 " >
        <h2 className="text-white text-center py-3">Current Items</h2>
        <div style={{display: "flex", justifyContent:"center"}}>
            {items.map(item => (
                <div key={item.id} className="card p-3 bg-white text-black mx-3" style={{ width: "18rem" }}>
                <div className="card-body">
                    <h5 className="card-title ">Item: {item.name}</h5>
                    <h6 className="card-subtitle mb-2 ">Priority: {item.priority}</h6>
                    <p className="card-text ">Category: {item.category}</p>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
                </div>
            ))}
        </div>
    </div>
    </div>
  );
}