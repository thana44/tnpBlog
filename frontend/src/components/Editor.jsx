import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css"

function Editor({value, onChange}) {

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
        ]
      },
    
      formats = [
        'bold', 'italic', 'underline', 'strike'
      ]
      
  return (
    <div>
        <ReactQuill onChange={onChange} value={value} className='h-full' modules={modules} formats={formats}/>
    </div>
  )
}

export default Editor