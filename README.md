# News

* 23/1/2015:
    *  Full support for Semantic UI
    * **Breaking change in 'getFileInfo', 'getDirectory' and 'finished' callbacks**, which is now passing `fileInfo` object instead of just a file name and folder. See documentation.
    * Possibility to automatically create directories on server
    * Possibility to delete files on server with UploadServer.delete(path), see DEMO
    * Possibility to easily modify the looks of the upload component or even add new upload templates for various frameworks by modifying the Uploader.UI.<framework> classes
    * Several bug fixes
    * Update the DEMO application to showcase all current possibilities
* 1/12/2014 Now with drag and drop support!!!

# Introduction

These packages allow you to easily setup a file upload service to your Meteor server. This solution has following perks:

1. Uses the famous [jQuery file upload](https://blueimp.github.io/jQuery-File-Upload/) system from blueimp. 
	1. As a result you can upload any file size (default limit 11GB)
	2. **Displays upload progress**
	3. **Uploads can be canceled**
	4. You can upload **multiple files**
	4. Images can be resized to various sizes using the *imagemagick*
1. **NEW!** Support for Semantic UI!
1. **NEW!** You can use drag and drop to upload your files!
1. Saves and serves file from arbitrary folder on your server. This solves problems with hot-code reload, when files are saved into Meteor's *public* directory
	1. Possibility to save files to subfolders
	2. Possibility to rename files on the server
1. Simple configuration and installation! No need to install 10+ packages like with Collection-FS solution 

> Please note that since we are using blueimp's juery solution, this solution has a full potential of performing client image resizes, chunked uploads, upload resume and more. These features will be gradually added. Pull requests are welcome!

**For all the screen-shots, please scroll to the bottom of the page.**

# Quick Start

Install packages
```
$ meteor add tomi:upload-server
$ meteor add tomi:upload-jquery
```

Create directory in the application root
```
mkdir -p .uploads/tmp
```

Configure server

```javascript
//file:/server/init.js
Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    checkCreateDirectories: true //create the directories for you
  })
});
```
	
Use template with bootstrap *or* semantic UI support

```html
<template name="yourTemplate">
	{{> upload_bootstrap }}
</template>
```

```html
<template name="yourTemplate">
	{{> upload_semanticUI }}
</template>
```

DONE!

You can also use the drag and drop zone!

```html
<template name="yourTemplate">
	{{> dropzone }}
</template>
```

If you are using dropzone, you may want to set-up some css styles to give your user some visual cues:

```css
.jqDropZone {
    background: lightgrey;
    width: 150px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-weight: bold;
}
.jqDropZone.in {
    width: 600px;
    height: 200px;
    line-height: 200px;
    font-size: larger;
}
.jqDropZone.hover {
    background: lawngreen;
}
.jqDropZone.fade {
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
    opacity: 1;
}
```

# Installation

The installation is very simple and consists of installing two packages:

```bash
$ meteor add tomi:upload-server
$ meteor add tomi:upload-jquery
```

I have separated these two packages, because often you will want to run your upload service as a separate application. There are several options supported by blueimp, such as [Java, ASP, Ruby and more](https://github.com/blueimp/jQuery-File-Upload/wiki) or even [node.js Express server](https://www.npmjs.org/package/blueimp-file-upload-node) installed via NPM. If you wish to use self standing server, install only the *tomi:upload-jquery* package.

# Configuration
### Server

First, we need to initialise the server and configure upload paths. We also allow server to create directories for us:

```javascript
//file:/server/init.js
Meteor.startup(function () {
  UploadServer.init({
    tmpDir: '/Users/tomi/Documents/Uploads/tmp',
    uploadDir: '/Users/tomi/Documents/Uploads/',
    checkCreateDirectories: true,
    getDirectory: function(fileInfo, formData) {
      // create a sub-directory in the uploadDir based on the content type (e.g. 'images')
      return formData.contentType;
    },
    finished: function(fileInfo, formFields) {
      // perform a disk operation
    }
  })
});
```

Following *options* are available for *UploadServer.init(options)*:

| Field        | Type | Default  | Description  |
| ------------- | ------------- | ----- | ------- |
| tmpDir | String | null | Temporary upload directory
| checkCreateDirectories | Boolean | false | Creates the upload and tmp directory if it does not exist
| uploadDir | String | null | Path to the upload directory  
| uploadUrl | String | '/upload/' | Upload route
| maxPostSize | int | 11000000000 | Maximum post size (11 GB)
| minFileSize | int | 1 | Minimum file size
| maxFileSize | int | 10000000000 | Maximum file size (10 GB) 
| acceptFileTypes | RegEx | /.+/i, | Accepted types of files (e.g. prohibit .exe)
| imageTypes | RegEx | /\.(gif\|jpe?g\|png)$/i | Images which can be resized with *Imagemagick*
| imageVersions | Object | {} | Defines the sizes of images which will be converted and saved to upload directory. For example `{thumbnailBig: {width: 400, height: 300}, thumbnailSmall: {width: 200, height: 100}}` | 
| getDirectory | function |  | functions which decides the subdirectory in which the file will be saved. In this function is not defined, no sub-directory is created. For example: `function(fileInfo, formData) { return '/my/sub/directory';` }
| getFileName | function |  | Renames the file on the server. In no function is specified, file is saved with the original file name. For example: `function(fileInfo, formData) { return 'Saved-' + file.name; }`
| finished | function | | Callback 

In callbacks we pass the `fileInfo` with the following structure:

| Field        | Type | Description |
| ------------- | ------------- | ------------- |
| name | String | File name
| size | Number | Size in Bytes
| type | String | MIME file type (e.g. 'text/html')
| path | String | Path relative to upload directory
| url  | String | Full url to the uploaded file


### Client

On client we have a possibility to use pre-defined templates for **Bootstrap** or **Semantic UI**, or use the **dropzone**. We can use several upload forms on the page. We can provide extra data to upload control via `formData` parameter. We can also limit the file type available for the file picker using parameter `fileTypes`. Following is an example of how you can include the upload form on your page:

```html
<template name="home">
    <h3>Images</h3>
    {{> upload_bootstrap fileTypes='.jpg' multiple=true formData=specificFormData }}
</template>
```

or

```html
<template name="home">
    <h3>Drag and drop image on the target area</h3>
    {{> dropzone contentType='images' fileTypes='.jpg' multiple=true formData=specificFormData }}
</template>
```

Following *options* are available for the template:

| Field        | Type | Default  | Description  |
| ------------- | ------------- | ----- | ------- |
| contentType | String | null | Describes the content that is uploaded via this control. This becomes part of the 'formData'
| fileTypes | String | null | Limits selection of files to specified extensions
| multiple | bool | true | Allows to select and upload of multiple files at the same time
| formData | Object | null | If necessary, we can send extra form data to the server, this is then available in callbacks under 'formData'

We can also hook onto upload callbacks just like following:

```javascript
// file: client/init.js
Meteor.startup(function() {
  Uploader.finished = function(fileInfo, templateContext) {
    Uploads.insert(fileInfo);
  }
})
```


If you wish to use custom URL for your uploads this can be configured as following:

```javascript
Uploader.uploadUrl = 'http://yoururl';
```

# Troubleshooting

* **503 (Service Unavailable)** can have following two reasons
    * You have incorrectly set up your directories for upload or directories have no rights for writing. Please check your server console for any messages.
    * If server console is clean, the problem could be on client with JS debugging tools such as Firebug. Please disable any JS debugging tool and restart your browser. Problem should disappear.

# Screeenshots

Single file image upload with preview:

![Screenshot](https://dl.dropboxusercontent.com/u/3418607/Screenshots/Uploads-Single.png)

Multiple file upload with queue:

![Screenshot](https://dl.dropboxusercontent.com/u/3418607/Screenshots/Uploads.png)

Dropzone

![Screenshot](https://dl.dropboxusercontent.com/u/3418607/screenshots/Uploads-Dropzone.png)



