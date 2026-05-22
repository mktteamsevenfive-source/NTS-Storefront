export const PAGE_SIZE_OPTIONS = [12, 36, 64, 128];

export const COLLECTION_SORT_OPTIONS = [
  {value: 'manual',      label: 'Featured'},
  {value: 'best-selling',label: 'Best selling'},
  {value: 'name-asc',    label: 'Product name A–Z'},
  {value: 'name-desc',   label: 'Product name Z–A'},
  {value: 'price-asc',   label: 'Lowest price'},
  {value: 'price-desc',  label: 'Highest price'},
  {value: 'newest',      label: 'New arrivals'},
];

export const COLLECTION_SORT_MAP: Record<string, {sortKey: string; reverse: boolean}> = {
  manual:        {sortKey: 'MANUAL',           reverse: false},
  'best-selling':{sortKey: 'BEST_SELLING',     reverse: false},
  'name-asc':    {sortKey: 'TITLE',            reverse: false},
  'name-desc':   {sortKey: 'TITLE',            reverse: true},
  'price-asc':   {sortKey: 'PRICE',            reverse: false},
  'price-desc':  {sortKey: 'PRICE',            reverse: true},
  newest:        {sortKey: 'CREATED',          reverse: true},
};

export const SEARCH_SORT_OPTIONS = [
  {value: 'relevance',   label: 'Relevance'},
  {value: 'name-asc',    label: 'Product name A-Z'},
  {value: 'name-desc',   label: 'Product name Z-A'},
  {value: 'price-desc',  label: 'Highest price'},
  {value: 'price-asc',   label: 'Lowest price'},
  {value: 'newest',      label: 'New arrivals'},
];

export const SEARCH_SORT_MAP: Record<string, {sortKey: string; reverse: boolean}> = {
  relevance:   {sortKey: 'RELEVANCE',    reverse: false},
  'name-asc':  {sortKey: 'RELEVANCE',    reverse: false},
  'name-desc': {sortKey: 'RELEVANCE',    reverse: false},
  'price-asc': {sortKey: 'PRICE',        reverse: false},
  'price-desc':{sortKey: 'PRICE',        reverse: true},
  newest:      {sortKey: 'RELEVANCE',    reverse: false},
  popular:     {sortKey: 'RELEVANCE',    reverse: false},
};
