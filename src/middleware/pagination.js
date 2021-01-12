const config = require('config');

module.exports = {

  init: function init( req, res, next ) {
    if ( typeof req.query.page == 'undefined' ) return next();
    if ( typeof req.query.search != 'undefined' ) return next(); // if search then pagination after the search

    let currentPage = parseInt(req.query.page) || 0;

    let pageSize = parseInt(req.query.pageSize) || 20;
    // if ( pageSize > 50 ) pageSize = 50; // maximaze page size?

    req.dbQuery.pageSize = pageSize;
    req.dbQuery.offset = currentPage * pageSize;
    req.dbQuery.limit = pageSize;

    return next();

  },

  paginateResults: function paginateResults( req, res, next ) {

    if ( typeof req.query.page == 'undefined' ) return next();

    let list = req.results;

    let currentPage = parseInt(req.query.page) || 0;
    let pageSize = req.dbQuery.pageSize; // if defined then paging was done in the query
    let listLength = pageSize ? req.dbQuery.count : list.length;
    let pageCount = parseInt( listLength / pageSize ) + ( listLength % pageSize ? 1 : 0 );

    // if (currentPage >= pageCount) currentPage = pageCount - 1;
    if (currentPage < 0) currentPage = 0;

    if (!pageSize) {
      pageSize = parseInt(req.query.pageSize) || 20;
      pageCount = parseInt( listLength / pageSize ) + ( listLength % pageSize ? 1 : 0 );
      list = list.slice( currentPage * pageSize, ( currentPage + 1 ) * pageSize )
    }

    let url = req.originalUrl;
    let match = url.match(/(?:\?|&)page=.*?(?:&|$)/);
    if (!match) {
      url += url.match(/\?/) ? '&' : '?';
      url += `page=${currentPage}`
    }
    url = url.replace(/(\?|&)pageSize=.*?(&|$)/, `$1pageSize=${pageSize}$2`);

    let metadata = {
      page: currentPage,
      pageSize,
      pageCount,
      totalCount: listLength,
      links: {
        self: url.replace(/(\?|&)page=.*?(&|$)/, `$1page=${currentPage}$2`),
        first: url.replace(/(\?|&)page=.*?(&|$)/, `$1page=0$2`),
        last: url.replace(/(\?|&)page=.*?(&|$)/, `$1page=${pageCount - 1}$2`),
      },
    }
    if (currentPage > 0) {
      metadata.links.previous = url.replace(/(\?|&)page=.*?(&|$)/, `$1page=${currentPage - 1}$2`);
    }
    if (currentPage < pageCount - 1) {
      metadata.links.next = url.replace(/(\?|&)page=.*?(&|$)/, `$1page=${currentPage + 1}$2`);
    }

    req.results = {
      metadata,
      records: list
    };

    return next();
  }

}
