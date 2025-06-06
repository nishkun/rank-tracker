'use client';
import { useState } from "react";
import axios from "axios";



export default function NewDomainForm({onNew}){
  const [domain,setDomain] = useState('');
  
 async function handleSubmit(ev){
      ev.preventDefault();
      setDomain('');
    await  axios.post('/api/domains',{domain});
   onNew();
  }
    return (
        <form  
        onSubmit={handleSubmit}
        className="flex gap-2 my-8 ">
        <input 
        value={domain}
        onChange={ev => setDomain(ev.target.value)}
        className="bg-white border border-b-4 border-blue-200 px-4 py-2 text-xl rounded-lg grow" type="text" placeholder="NewDomain.com "></input>
        
        <button 
        type="submit"
        className="bg-indigo-500 text-white px-8 rounded-lg border border-b-4 border-indigo-700">
          Add
        </button>
      </form>
    )
}