Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    getDirectory: function(file, formData) {
      return formData.contentType;
    },
    finished: function(file, folder, formData) {
      // for reactivity you can write to the collection
      // e.g. SomeCollection.insert({path: folder + '/' + file});
      console.log('Write to database: ' + folder + '/' + file);
    }
  })
});