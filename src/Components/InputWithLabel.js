import * as React from 'react';
import {StyledLabel,StyledInput} from './StyleComponent'
const InputWithLabel = ({ id, onInputChange, value, type, isFocused, children }) => {
    const inputRef = React.useRef();
    React.useState(() => {
      if (isFocused && inputRef.current) {
        inputRef.current.focus()
      }
    }, [isFocused])
    return (
      <>
        <StyledLabel htmlFor={id} >{children}</StyledLabel>
        &nbsp;
        <StyledInput ref={inputRef} type={type} id={id} value={value} onChange={onInputChange} />
      </>
    )
  }
  export {InputWithLabel};