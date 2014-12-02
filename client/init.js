Meteor.startup(function() {
  Uploader.finished = function(index, file) {
    if (!Session.get("UploadedFiles")) {
      Session.set("UploadedFiles", []);
    }

    var files = Session.get("UploadedFiles");
    files.push(file);
    Session.set("UploadedFiles", files);
  }
})