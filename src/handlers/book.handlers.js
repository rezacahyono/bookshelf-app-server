const { nanoid } = require('nanoid')
const books = require('../models/book.model')

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
  } = request.payload

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
    response.statusCode = 400
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.statusCode = 400
    return response
  }

  const id = nanoid(16)

  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const finished = pageCount === readPage

  const bookshelf = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  }

  books.push(bookshelf)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    })
    response.statusCode = 500
    return response
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: bookshelf.id,
    },
  })
  response.statusCode = 201
  return response
}

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query

  let bookshelf = books
  if (name !== undefined) {
    bookshelf = bookshelf
      .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading !== undefined) {
    if (reading !== '0' && reading !== '1') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menampilkan buku. reading hanya boleh berisi 0 dan 1',
      })
      response.statusCode = 400
      return response
    }
    const read = reading === '1'
    bookshelf = bookshelf.filter((book) => book.reading === read)
  }

  if (finished !== undefined) {
    if (finished !== '0' && finished !== '1') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menampilkan buku. finished hanya boleh berisi 0 dan 1',
      })
      response.statusCode = 400
      return response
    }

    const finish = finished === '1'
    bookshelf = bookshelf.filter((book) => book.finished === finish)
  }

  bookshelf = bookshelf.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }))
  const response = h.response({
    status: 'success',
    data: {
      books: bookshelf,
    },
  })
  response.statusCode = 200
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const bookshelf = books.filter((book) => book.id === bookId)[0]

  if (bookshelf === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    response.statusCode = 404
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      book: bookshelf,
    },
  })
  response.statusCode = 200
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    })
    response.statusCode = 400
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.statusCode = 400
    return response
  }

  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    response.statusCode = 404
    return response
  }

  const updatedAt = new Date().toISOString()
  const finished = pageCount === readPage

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  })
  response.statusCode = 200
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    response.statusCode = 404
    return response
  }

  books.splice(index, 1)

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  })
  response.statusCode = 200
  return response
}

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
}
