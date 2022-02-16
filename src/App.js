import * as React from 'react';
import axios from 'axios';

import { SearchForm } from './Components/SearchForm';
import { List } from './Components/List';
import { StyledComponent, StyledHeadlinePrimary } from './Components/StyleComponent';
import storiesReducer from './Reducer/index'
import useSemiPersistentState from './ReusableComponent/index';


const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const getSumComments = (stories) => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments, 0
  )
};

const extractSearchTerm = (url) => url.replace(API_ENDPOINT, '');
const getLastSearches = (urls) => {
  return urls.slice(-5).map(extractSearchTerm);
};

const getUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`;

const App = () => {

  //for search
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'react');
  const [urls, setUrls] = React.useState(
    [getUrl(searchTerm)],
  );
  const lastSearches = getLastSearches(urls);

  const handleSearch = (searchTerm) => {
    let url = `${API_ENDPOINT}${searchTerm}`;
    setUrls(urls.concat(url));
  };
  const handleLastSearch = (searchTerm) => {
    handleSearch(searchTerm);
  }
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }
  const handleSearchSubmit = (event) => {
    event.preventDefault()
    handleSearch(searchTerm)
  }

  //for stories

  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

  const handleFetchStories = React.useCallback(async () => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const lastUrl = urls[urls.length - 1]
      const result = await axios.get(lastUrl);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      })
    } catch (error) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    }
  }, [urls]
  )
  React.useEffect(() => {
    handleFetchStories()
  },
    [handleFetchStories]
  )

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  }
  const sumComments = React.useMemo(() => getSumComments(stories), [
    stories,
  ]);

  return (
    <StyledComponent>
      <StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments</StyledHeadlinePrimary>
      <SearchForm
        handleSearchInput={handleSearchInput}
        handleSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
      />
      {lastSearches.map((searchTerm) => (
        <button
          key={`${searchTerm + Math.random()}`}
          type="button"
          onClick={() => handleLastSearch(searchTerm)}
        >
          {searchTerm}
        </button>
      ))}
      < hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? <p>Loading ....</p> : <List list={stories.data} onRemoveItem={handleRemoveStory} />}

    </StyledComponent>
  );
}

export default App;
