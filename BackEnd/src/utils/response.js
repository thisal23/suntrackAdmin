class ResponseHelper {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static error(res, message = 'Internal Server Error', statusCode = 500) {
    return res.status(statusCode).json({
      status: 'error',
      message
    });
  }

  static pagination(total, page, limit) {
    const pages = Math.ceil(total / limit);
    const hasMore = page < pages;

    return {
      total,
      page,
      limit,
      pages,
      hasMore
    };
  }
}

module.exports = ResponseHelper;



// class ResponseHelper {
//   static success(res, data, message = 'Success', statusCode = 200) {
//     return res.status(statusCode).json({
//       status: 'success',
//       message,
//       data
//     });
//   }

//   static error(res, message = 'Internal Server Error', statusCode = 500) {
//     return res.status(statusCode).json({
//       status: 'error',
//       message
//     });
//   }

//   static pagination(total, page, limit) {
//     const pages = Math.ceil(total / limit);
//     const hasMore = page < pages;

//     return {
//       total,
//       page,
//       limit,
//       pages,
//       hasMore
//     };
//   }
// }

// module.exports = ResponseHelper;
