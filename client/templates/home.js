Template['home'].helpers({
  myFormData: function() {
    return { myParameter1: "value1", myParameter2: "value2" }
  },
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
});