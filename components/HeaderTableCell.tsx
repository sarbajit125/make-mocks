import React, { ChangeEvent, useState } from 'react'
import { TableCell, TextField } from '@mui/material';
import { HeaderTableModel } from '../DTO/components';
import { text } from 'stream/consumers';
function HeaderTableCell({ content,name, onTextChange, isKey }:HeaderTableCellProps) {
    const { isEditable } = content;
    const  [text, setText] = useState(name);
    const handleTextChange = (event) => {
      setText(event.target.value)
      onTextChange(text, content, isKey)
    }
    return (
        <>
        <TableCell align="left">
        {isEditable ? (
         <TextField
          variant='filled'
          id={content.key}
          value={text}
          onChange={handleTextChange}
         />
        ) : (
          name
        )}
      </TableCell>
        </>
    );
}

export interface HeaderTableCellProps {
    content: HeaderTableModel
    name: string;
    isKey: boolean
    onTextChange: (newText: string, row: HeaderTableModel, isKey: boolean) => void
}
export default HeaderTableCell
