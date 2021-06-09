
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
   const { title, tags, body } = request.payload;

   const id = nanoid(16);
   const createdAt = new Date().toISOString();
   const updatedAt = createdAt;

   // memasukan kedalam array notes
   const newNote = {
      title, tags, body, id, createdAt, updatedAt,
   };
   
   notes.push(newNote);

   // apakah newNote sudah masuk ke dalam array notes?
   const isSuccess = notes.filter((note) => note.id === id).length > 0;

   // Jika isSuccess bernilai true, maka beri respons berhasil
   if(isSuccess) {
      const response = h.response({
         status: 'success',
         message: 'Catatan berhasil ditambahkan',
         data: {
            noteId: id,
         },
      });
      response.code(201);
      return response;
   }

   // Jika false, maka beri respons gagal
   const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
   });
   response.code(500);
   return response;
}

// menampilkan semua data notes dihome
const getAllNotesHandler = () => ({
   status: 'success',
   data: {
      notes,
   },
});

const getNoteByIdHandler = (request, h) => {
   // tangkap idnya
   const { id } = request.params;

   // dapatkan object note dgn id dari object array notes
   const note = notes.filter((n) => n.id === id)[0];

   // jika note ada
   if(note !== undefined) {
      return {
         status: 'success',
         data: {
            note,
         },
      };
   }

   // jika undefined
   const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan.',
   });
   response.code(404);
   return response;
}

const editNoteByIdHandler = (request, h) => {
   // tangkap idnya
   const { id } = request.params;

   // dapatkan data note baru yang dikirimkan client
   const { title, tags, body } = request.payload;
   const updatedAt = new Date().toISOString();

   const index = notes.findIndex((note) => note.id === id);

   if(index !== -1) {
      notes[index] = {
         ...notes[index],
         title,
         tags,
         body,
         updatedAt,
      };

      const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
      });
      response.code(200);
      return response;
   }

   // jika gagal
   const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan',
   });
   response.code(404);
   return response;
};

const deleteNoteByIdHandler = (request, h) => {
   const { id } = request.params;

   const index = notes.findIndex((note) => note.id === id);
   if(index !== -1) {
      notes.splice(index, 1);
      const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
      });
      response.code(200);
      return response;
   }

   const response = h.response({
      status: 'fail',
      message: 'Catatan gagal dihapus. Id tidak ditemukan',
   });
   response.code(404);
   return response;
};

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };