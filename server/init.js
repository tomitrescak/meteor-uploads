Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    getDirectory: function(file, formData) {
      return formData.contentType;
    },
    finished: function(file, folder, formData) {
      // perform some disk operation

    }
  })
});