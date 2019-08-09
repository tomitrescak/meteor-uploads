Meteor.startup(function() {
    // init items collection
    if (Items.find().count() == 0) {
        Items.insert({ name: 'My Item', uploads: [] })
    }

    UploadServer.init({
        tmpDir: (process.env.PWD ? process.env.PWD : process.cwd())  '/.uploads/tmp',
        uploadDir: (process.env.PWD ? process.env.PWD : process.cwd()) + '/.uploads/',
        checkCreateDirectories: true,
        getDirectory: function(fileInfo, formData) {
            if (formData && formData.directoryName != null) {
                return formData.directoryName
            }
            return ''
        },
        getFileName: function(fileInfo, formData) {
            if (formData && formData.prefix != null) {
                return formData.prefix + '_' + fileInfo.name
            }
            return fileInfo.name
        },
        finished: function(fileInfo, formData) {
            if (formData && formData._id != null) {
                Items.update(
                    { _id: formData._id },
                    { $push: { uploads: fileInfo } }
                )
            }
        },
    })
})
