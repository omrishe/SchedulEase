  import { useState } from "react";
  import { createStore } from "../api/store";

  function SuperAdminPanel(){
    const [message,setMessage]=useState();
    const [formData, setFormData] = useState({
    storeName: "",
    storeNote: "",
    storeAnnouncement: "",
    storeSlug:"",
    services : [
      { name: "Haircut", price: "20", serviceNote: "Includes wash" }
    ]
  });
  async function createNewStore(e){
    e.preventDefault();
    const storeToSend = {
    ...formData,
    storeSlug: cleanName(formData.storeName)
  };
    const response = await createStore(storeToSend);
    setMessage(response.message);
    return response.message;
  }

  function cleanName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") 
    .replace(/\s+/g, "-");        
}

function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

return(
    <div>
    <form>
        <label htmlFor="storeName">store name</label>
        <input name="storeName" onChange={handleChange} value={formData["storeName"]}/>
        <label htmlFor="storeNote">store note</label>
        <input name="storeNote" onChange={handleChange} value={formData["storeNote"]}/>
        <label htmlFor="storeAnnouncement">store announcement</label>
        <input name="storeAnnouncement" onChange={handleChange} value={formData["storeAnnouncement"]}/>
        <button type="submit" onClick={createNewStore}>create a new store</button>
    </form>
    
    <label>{message}</label>
    </div>
)
  }
  export default SuperAdminPanel;