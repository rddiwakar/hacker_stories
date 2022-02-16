import * as React from 'react'
const useSemiPersistentState = (key, initialState) => {
    const isMounted = React.useRef(false);
    const [value, setValue] = React.useState(localStorage.getItem('search') || initialState)
    React.useEffect(() => {
      if (!isMounted.current) {
        isMounted.current = true
      } else {
        localStorage.setItem(key, value);
      }
  
    }, [value]);
    return [value, setValue]
  }
export default useSemiPersistentState  ;