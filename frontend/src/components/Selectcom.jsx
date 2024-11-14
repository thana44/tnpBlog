import React, { useEffect, useState } from 'react'
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

function Selectcom({type, onSelectChange, getCate }) {
  const [selectedOption, setSelectedOption] = useState("")

  useEffect(()=>{
    if(type === "show"){
      onSelectChange("All")
      return setSelectedOption("All")
    }
    if(getCate){
      return setSelectedOption(getCate)
    }
  },[type, getCate])

  const handleSelectChange = (event, newValue) => {
    setSelectedOption(newValue); // รับค่าจากการเลือกใหม่โดยตรง
    return onSelectChange(newValue)
  };
  


  return (
    <div>
        <Select
            placeholder="Categories"
            value={selectedOption}
            onChange={handleSelectChange}
            indicator={<KeyboardArrowDown />}
            sx={{
                width: 130,
                [`& .${selectClasses.indicator}`]: {
                transition: '0.2s',
                [`&.${selectClasses.expanded}`]: {
                    transform: 'rotate(-180deg)',
                },
                },
            }}
            >
              {
                type === "show" && <Option value="All">All</Option>
              }
            <Option value="Business">Business</Option>
            <Option value="Education">Education</Option>
            <Option value="Entertainment">Entertainment</Option>
            <Option value="Food">Food</Option>
            <Option value="Lifestyle">Lifestyle</Option>
            <Option value="Technology">Technology</Option>
            <Option value="Travel">Travel</Option>
            <Option value="Other">Other</Option>
        </Select>
    </div>
  )
}

export default Selectcom