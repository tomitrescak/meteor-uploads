Meteor.startup(function() {


  Uploader.finished = function(index, file) {
    if (!Session.get("UploadedFiles")) {
      Session.set("UploadedFiles", []);
    }

    var files = Session.get("UploadedFiles");
    files.push(file);
    Session.set("UploadedFiles", files);

    // for reactivity you can write to the collection
    // e.g. SomeCollection.insert({path: folder + '/' + file});
    console.log('Write to database: ' + folder + '/' + file);

    Uploads.insert({folder: folder, file: file});
  }
})