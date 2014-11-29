Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/uploads/tmp',
    uploadDir: process.env.PWD + '/uploads',
    getDirectory: function(file, formData) {
      return formData.contentType;
    },
    finished: function(file, folder, formFields) {
      console.log('Write to database: ' + folder + '/' + file);
    }
  })
});