import * as React from 'react';
import { ReactComponent as Check } from '../Assets/check.svg'
import { InputWithLabel } from './InputWithLabel';
import {StyledSearchForm,StyledButtonLarge} from './StyleComponent'

const SearchForm = (({ handleSearchInput, handleSearchSubmit, searchTerm }) => {
    return (
      <StyledSearchForm onSubmit={(event) => handleSearchSubmit(event)}  >
        <InputWithLabel
          onInputChange={handleSearchInput}
          value={searchTerm}
          id={searchTerm}
          type='text'
          isFocused
        > <strong>Search :</strong></InputWithLabel>
        <StyledButtonLarge type="submit" disabled={!searchTerm} >
          <Check height="18px" width="18px" />
        </StyledButtonLarge>
      </StyledSearchForm>
    )
  })
  export {SearchForm}