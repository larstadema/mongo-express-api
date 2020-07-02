export const prepareResponse = (data, { limit, next, previous }) => {
  let results = data;

  const hasMore = results.length > limit;

  if (hasMore) {
    results.pop();
  }

  const hasPrevious = !!next || !!(previous && hasMore);
  const hasNext = !!previous || hasMore;

  // If we sorted reverse to get the previous page, correct the sort order.
  if (previous) {
    results = results.reverse();
  }

  const firstResult = results[0];
  const lastResult = results[results.length - 1];

  const response = {
    results,
    previous: firstResult,
    hasPrevious,
    next: lastResult,
    hasNext,
  };

  if (firstResult) {
    response.previous = firstResult.id;
  }
  if (lastResult) {
    response.next = lastResult.id;
  }

  return response;
};

export const generateSort = ({ previous, sortAscending }) => {
  const sortAsc = (!sortAscending && previous) || (sortAscending && !previous);
  const sortDir = sortAsc ? 1 : -1;

  return {
    _id: sortDir,
  };
};

export const generateQuery = ({ next, previous, sortAscending }) => {
  if (!next && !previous) {
    return {};
  }

  const sortAsc = (!sortAscending && previous) || (sortAscending && !previous);
  const comparisonOp = sortAsc ? '$gt' : '$lt';

  // `next` cursor takes precedence over a `previous`
  const op = next || previous;

  return {
    _id: {
      [comparisonOp]: op,
    },
  };
};
