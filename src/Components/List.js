import * as React from 'react';
import { sortBy } from 'lodash';
import { StyledItem, StyledColumn, StyledButtonSmall } from './StyleComponent';

const SORTS = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, 'title'),
    AUTHOR: (list) => sortBy(list, 'author'),
    COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
    POINT: (list) => sortBy(list, 'points').reverse(),
};

const List = ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState(
        {
            sortKey: 'NONE',
            isReverse: false,
        }
    );
    const handleSort = (sortKey) => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({ sortKey, isReverse });
    };

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
        ? sortFunction(list).reverse()
        : sortFunction(list);
    return (
        <ul>
            <StyledItem>
                <StyledColumn width='40%' >
                    <button type="button" onClick={() => handleSort('TITLE')}>
                        Title
                    </button>
                </StyledColumn>
                <StyledColumn width='20%' >
                    <button type="button" onClick={() => handleSort('AUTHOR')}>
                        Author
                    </button>
                </StyledColumn>
                <StyledColumn width='20%' >
                    <button type="button" onClick={() => handleSort('COMMENT')}>
                        Comments
                    </button>
                </StyledColumn>
                <StyledColumn width='10%' >
                    <button type="button" onClick={() => handleSort('POINT')}>
                        Points
                    </button>
                </StyledColumn>
                <StyledColumn width='10%' ><strong>Action</strong></StyledColumn>
            </StyledItem>
            {sortedList.map(item => {
                return <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
            })}
        </ul>
    )
}

const Item = ({ item, onRemoveItem }) => {
    return (
        <StyledItem key={item.objectID}>
            <StyledColumn width='40%' >
                <a href={item.url}>{item.title} </a>
            </StyledColumn>
            <StyledColumn width='20%'>{item.author}</StyledColumn>
            <StyledColumn width='20%'>{item.num_comments}</StyledColumn>
            <StyledColumn width='10%'>{item.points}</StyledColumn>
            <StyledColumn width='10%'>
                <StyledButtonSmall type='button' onClick={() => { onRemoveItem(item) }}>Dismiss</StyledButtonSmall>
            </StyledColumn>

        </StyledItem>
    )
}
export { List };