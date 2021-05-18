const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  if (readPage === pageCount) {
    finished = true;
  }
  //   let finished = readPage === pageCount ? true : false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };
  // Push Books
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

// const getAllBookHandler = () => ({
//   status: 'success',
//   data: {
//     books,
//   },
// });
const getAllBookHandler = (request, h) => {
  const params = request.query;

  // console.log(params);
  if (params.name) {
    const book = books.filter(
      // eslint-disable-next-line comma-dangle
      (b) => b.name.toLowerCase().includes(params.name.toLowerCase())
      // eslint-disable-next-line function-paren-newline
    );
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (params.reading) {
    let response;
    // console.log('masuk sini');
    if (params.reading === '0') {
      const book = books.filter((b) => b.reading === false);
      response = h.response({
        status: 'success',
        data: {
          books: book.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      });
    } else if (params.reading === '1') {
      const book = books.filter((b) => b.reading === true);
      response = h.response({
        status: 'success',
        data: {
          books: book.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      });
    } else {
      response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
    }
    return response;
  }

  if (params.finished) {
    let response;
    if (params.finished === '0') {
      const book = books.filter((b) => b.finished === false);
      response = h.response({
        status: 'success',
        data: {
          books: book.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      });
    } else if (params.finished === '1') {
      const book = books.filter((b) => b.finished === true);
      response = h.response({
        status: 'success',
        data: {
          books: book.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      });
    } else {
      response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
    }
    return response;
  }

  if (books === []) {
    const response = h.response({
      status: 'success',
      data: { books },
    });
    response.code(200);
    return response;
  }

  // console.log(params);
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const updateBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
