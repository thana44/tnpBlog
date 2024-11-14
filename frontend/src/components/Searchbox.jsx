import React, { useEffect, useState } from 'react'
import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Selectcom from './Selectcom';

function Searchbox({searchOnchange, categoryOnchange, radioOnchange}) {
    const [category, setCategory] = useState('')
    const [radio, setRadio] = useState('blogs')

    useEffect(()=>{
        if(category){
            categoryOnchange(category)
        }
        if(radio){
            radioOnchange(radio)
        }
    },[category, radio])


  return (
    <div className='flex flex-col items-start bg-transparent gap-3 sm:flex-row' style={{gridTemplateColumns:'1.7fr 0.3fr'}}>
        <TextField
            onChange={(e)=> searchOnchange(e.target.value)}
            color='#404040'
            fullWidth
            slotProps={{
                input: {
                    startAdornment: <InputAdornment position="start">
                        <SearchIcon/>
                    </InputAdornment>,
                    endAdornment: <InputAdornment position='end'>
                        {
                            radio === 'blogs' && <Selectcom type={'show'} onSelectChange={(e)=> setCategory(e)}/>
                        }
                    </InputAdornment>
                },
            }}
        />
        <RadioGroup onChange={(e)=> setRadio(e.target.value)} value={radio} defaultValue="blogs" name="radio-buttons-group">
            <Radio value="blogs" label="Blogs" variant="outlined" />
            <Radio value="users" label="Users" variant="outlined" />
      </RadioGroup>
    </div>
  )
}

export default Searchbox