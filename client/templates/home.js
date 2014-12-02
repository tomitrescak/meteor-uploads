Template['home'].helpers({
  filesToUpload: function() {
    return Uploader.info.get();
  },
  filesUploaded: function() {
    return Session.get('UploadedFiles');
  }
})

Template['uploadedInfo'].helpers({
  src: function() {
    if (this.type.indexOf('image') >= 0) {
      return this.url;
    } else return 'file_icon.png';
  }
})