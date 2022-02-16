import * as React from 'react';
import axios from 'axios';

import { SearchForm } from './Components/SearchForm';
import { List } from './Components/List';
import { StyledComponent, StyledHeadlinePrimary } from './Components/StyleComponent';
import storiesReducer from './Reducer/index'
import useSemiPersistentState from './ReusableComponent/index';
import LastSearches from './Components/LastSearches';


const getSumComments = (stories) => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments, 0
  )
};

const extractSearchTerm = (url) => {
  let extract = url
    .substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
    .replace(PARAM_SEARCH, '') 
  return extract
};
const getLastSearches = (urls) => {

  let res = urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);
      if (index === 0) {
        return result.concat(searchTerm);
      }
      const previousSearchTerm = result[result.length - 1];
      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-5)
    .slice(0, -1)

  return res

};

//const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
// careful: notice the ? in between
const getUrl = (searchTerm, page) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const App = () => {

  //for searching term 
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'react');
  const [urls, setUrls] = React.useState(
    [getUrl(searchTerm, 0)],
  );
  const lastSearches = getLastSearches(urls);

  const handleSearch = (searchTerm, page) => {
    let url = getUrl(searchTerm, page)
    setUrls(urls.concat(url));
  };
  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  }
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }
  const handleSearchSubmit = (event) => {
    event.preventDefault()
    handleSearch(searchTerm, 0)
  }

  //for stories

  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], page: 0, isLoading: false, isError: false });

  const handleFetchStories = React.useCallback(async () => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const lastUrl = urls[urls.length - 1]
      const result = await axios.get(lastUrl);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
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

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };
  return (
    <StyledComponent>
      <StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments</StyledHeadlinePrimary>
      <SearchForm
        handleSearchInput={handleSearchInput}
        handleSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
      />
      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />
      < hr />
      {stories.isError ? <p>Something went wrong ...</p>
        : <div>
          {stories.isLoading ? <p>Loading ....</p>
            : <div>
              <List list={stories.data} onRemoveItem={handleRemoveStory} />
              <button type="button" onClick={handleMore}>
                <strong>Read more ...</strong>
              </button>
            </div>}
        </div>}

    </StyledComponent>
  );
}


export default App;
