Meteor.startup(function () {
  UploadServer.init({
    tmpDir: '/Users/tomi/Documents/Uploads/tmp',
    uploadDir: '/Users/tomi/Documents/Uploads/',
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