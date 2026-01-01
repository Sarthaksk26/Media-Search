
import { useState } from 'react'
import { useDispatch } from "react-redux";
import {  } from "module";
import { setQuery } from '../redux/features/searchSlice';

const SearchBar = () => {

    const [inputVal, setInputVal]= useState('')

    const dispatch = useDispatch()

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(setQuery(inputVal))
        setInputVal('')
    }

  return (
    <div>
        <form onSubmit={(e)=>{submitHandler(e)}} className='flex gap-5 p-8 bg-gray-800'>
            <input required className='w-full border-2 p-4 outline-none rounded-lg' onChange={(e)=>{setInputVal(e.target.value)}} type="text" placeholder='Search Anything....' value={inputVal}/>
            <button type='submit' className='active:scale-95 cursor-pointer border-2 p-4 outline-none rounded-lg bg-white text-gray-950'>Search</button>
        </form>

    </div>
  )
}

export default SearchBar