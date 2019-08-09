# News

* 09/08/2019 - Update the DEMO application to Meteor 1.8.1
* 18/11/2015 - Yet another batch of bugfixes, this time concerning exception and validation handling.
* 2/10/2015 - Community is on fire! With their help, many new improvements are being included, such as dynamic from data.
* 29/6/2015 - Bugfixes, localisation
* 27/2/2015 - Validation of files on Client and Server (see section Validation)
* 26/2/2015 - Custom built templates
* 21/2/2015 - File caching now supported, configuration of mimeTypes to serve
* 18/2/2015 - **Full support for Cordova!**
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

**WARNING** If you plan to deploy your solution to free \*.meteor.com servers, this solution is not for you, since you have no write access outside of standard Meteor directories. Please use CollectionFS instead.

**WARNING** if you are submitting an issue on this website, please always use JavaScript. I do not use Coffee, nor anything else and it's just not polite.

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

[![Meteor Icon](http://icon.meteor.com/package/tomi:upload-jquery)](https://atmospherejs.com/tomi/upload-jquery)
[![Meteor Icon](http://icon.meteor.com/package/tomi:upload-server)](https://atmospherejs.com/tomi/upload-server)


Install ImageMagick (if you plan to use image resizing)

**If you want to use Imagemagick, follow [these](http://www.imagemagick.org/script/binary-releases.php) install instructions on your server**. Then install node tools for imagemagick.

```bash
npm install -g imagemagick
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
  });
});
```

Configure client (only necessary if deploying as a Cordova app)

```javascript
//file:/client/init.js
Meteor.startup(function() {
  Uploader.uploadUrl = Meteor.absoluteUrl("upload"); // Cordova needs absolute URL
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

# Deploying with MUP or MUPX?

Mup deployments need no special attention, just make sure that the target upload directory has sufficient priviledges. For MUPX, please follow this thread (https://github.com/tomitrescak/meteor-uploads/issues/235) for instructions on how to setup MUPX.

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
    },
    cacheTime: 100,
    mimeTypes: {
        "xml": "application/xml",
        "vcf": "text/x-vcard"
    }
  });
});
```

Following *options* are available for *UploadServer.init(options)*:

| Field        | Type | Default  | Description  |
| ------------- | ------------- | ----- | ------- |
| tmpDir | String | null | Temporary upload directory
| checkCreateDirectories | Boolean | false | Creates the upload and tmp directory if it does not exist
| uploadDir | String | null | Path to the upload directory  
| uploadUrl | String | '/upload/' | Upload route
| validateRequest | function | | function(request) - **Warning** - Does not run in fibre, you have no access to collections
| validateFile | function | | function(fileInfo) - **Warning** - Does not run in fibre, you have no access to collections
| maxPostSize | int | 11000000000 | Maximum post size (11 GB)
| minFileSize | int | 1 | Minimum file size
| maxFileSize | int | 10000000000 | Maximum file size (10 GB)
| overwrite | Boolean | false | overwrites existing file, rather than adds numerical suffix
| acceptFileTypes | RegEx | /.+/i, | Accepted types of files (e.g. prohibit .exe)
| imageTypes | RegEx | /\.(gif\|jpe?g\|png)$/i | Images which can be resized with *Imagemagick*
| imageVersions | Object | {} | Defines the sizes of images which will be converted and saved to upload directory. For example `{thumbnailBig: {width: 400, height: 300}, thumbnailSmall: {width: 200, height: 100}}` |
| crop | Boolean | false | Crops the image rather than resizes
| getDirectory | function |  | functions which decides the subdirectory in which the file will be saved. If this function is not defined, no sub-directory is created. For example: `function(fileInfo, formData) { return '/my/sub/directory';` }
| getFileName | function |  | Renames the file on the server. If no function is specified, file is saved with the original file name. For example: `function(fileInfo, formData) { return 'Saved-' + file.name; }`
| finished | function | | Callback - You have full access to collections, **but** you do not have access to Meteor.userId() since upload process runs in its own fiber.
| cacheTime | int | 86400 | Cache time, set 0 to disable cache
| mimeTypes | Object | see [here](https://github.com/tomitrescak/meteor-tomi-upload-server/blob/master/upload_server.js#L43-L56) | List of available mime types
| notFoundImage | String | null | If set, this is the name of an image within uploadDir which will be served as a 404 image, instead of the default text error message. Default value of null will 404 with text/html only.

In callbacks we pass the `fileInfo` with the following structure:

| Field        | Type | Description |
| ------------- | ------------- | ------------- |
| name | String | File name
| size | Number | Size in Bytes
| type | String | MIME file type (e.g. 'text/html')
| path | String | Path relative to upload directory
| url  | String | Full url to the uploaded file

#### Passing data from server back to client

It is possible to pass data from server back to client upon a successfull upload. The easiest way is to expand the fileInfo object on the server and add any data that we need. For this, you can use a `finished` callback:

```javascript
UploadServer.init({
   ...
   finished(fileInfo, formFields) {
      fileInfo.extraData = "12345676";
   }
});
```

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

Now, you need to specify the `formData` in the helper:

```javascript
Template.home.helpers({
  specificFormData: function() {
    return {
      id: this._id,
      other: this.other,
      hard: 'Lolcats'
    }
  }
});
```

If you need to change the **formData** dynamically, you can specify it as one of the callbacks (see section Callbacks below).

Following *options* are available for the template:

| Field        | Type | Default  | Description  |
| ------------- | ------------- | ----- | ------- |
| contentType | String | null | Describes the content that is uploaded via this control. This becomes part of the 'formData'
| fileTypes | String | null | Limits selection of files to specified extensions
| multiple | bool | true | Allows to select and upload of multiple files at the same time
| formData | Object | null | If necessary, we can send extra form data to the server, this is then available in callbacks under 'formData'

### Callbacks

We can also hook onto upload callbacks just like following:

```javascript
// file: client/init.js
Meteor.startup(function() {
  Uploader.finished = function(index, fileInfo, templateContext) {
    Uploads.insert(fileInfo);
  }
})
```

If you have several different upload controls on a page and you can execute different callbacks by passing them to the template:

```html
<template name="home">
    {{> upload_bootstrap callbacks=myCallbacks }}
</template>
```

And then pass the **finished** in the callback from helper

```javascript
Template.home.helpers({
  myCallbacks: function() {
    return {
    	formData: function() { return { id: "232323", other: Session.get("ReactiveParam") } },
        finished: function(index, fileInfo, context) { ... },
        ...
    }
  }
})
```

If you wish to use custom URL for your uploads this can be configured as following:

```javascript
Uploader.uploadUrl = 'http://yoururl';
```

### Localisation

All texts of the upload control can be set via following setting:
va
```javascript
	Uploader.localisation = {
	browse: "Browse",
	cancelled: "Cancelled",
	remove: "Remove",
	upload: "Upload",
	done: "Done",
	cancel: "Cancel"
}
```

### Logging

You can set the log level via `Uploader.logLevel = Uploader.logLevels.debug`

### Validation

It is possible to validate the uploaded file both on client and on server.

On **client** you pass the validation function via helper, just like for the *finished* callback:

```html
<template name="home">
    {{> upload_bootstrap callbacks=myCallbacks }}
</template>
```

And then pass the **finished** in the callback from helper

```javascript
Template.home.helpers({
  myCallbacks: function() {
    return {
        ...
        validate: function(file) { ... }
    }
  }
})
```

On server, you can configure validation of both, *request* and the uploaded *file* using the two functions below. **IMPORTANT** Validate function has to return a **description of error** in case validation fails (e.g. *validationFailed*). In case validation passes, function has to return *null*. Failed validation also returns code 403.

Use `validateRequest` to cancel any upload that is not valid **BEFORE** it starts uploading and save on server resources. Use `validateFile` to validate the integrity of uploaded file **AFTER** it was uploaded on the server.

```javascript
//file:/server/init.js
Meteor.startup(function () {
  UploadServer.init({
    ...
    validateRequest: function(req) {
    	if (req.headers["content-length"] > 1000) {
    	    return "File is too long!";
    	}
    	return null;
    },
    validateFile: function(file, req) {
    	// e.g. read file content
    	if (doSomethingWith(file.path)) {
    	    return "Error Message";
    	}
    	return null;
    }
  })
});
```

In callbacks, *req* contains the request data and *file* contains a following structure:

* `size` - file size in bytes
* `path` - absolute path on server
* `name` - file name
* `type` - MIME type (e.g. application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
* `mtime` - UTC of upload time

### Custom Templates

It is easy to create a custom template.  Following is an example of such:

Template:

```html
<template name="customUpload">
    <form method="POST" enctype="multipart/form-data">
        <input type="file" class="jqUploadclass" data-form-data='{{ submitData }}'>
        {{#with infoLabel}}
            {{ infoLabel}} <button class="start">StartUpload</button>
            <div style="width: 200px; height: 30px; border: 1px solid black">
                <div style="background: red; height: 30px; width: {{ progress }}">
                    {{ progress }}
                </div>
            </div>
        {{/with}}

    </form>
</template>
```

Javascript:

```javascript
Template.customUpload.created = function() {
  Uploader.init(this);
}

Template.customUpload.rendered = function () {
  Uploader.render.call(this);
};

Template.customUpload.events({
  'click .start': function (e) {
    Uploader.startUpload.call(Template.instance(), e);
  }
});

Template.customUpload.helpers({
  'infoLabel': function() {
    var instance = Template.instance();

    // we may have not yet selected a file
    var info = instance.info.get()
    if (!info) {
      return;
    }

    var progress = instance.globalInfo.get();

    // we display different result when running or not
    return progress.running ?
      info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
      info.name + ' - ' + info.size + 'B';
  },
  'progress': function() {
    return Template.instance().globalInfo.get().progress + '%';
  }
})
```

#### Material UI

Thanks to @misteio, here is a little tutorial on how to add Material UI support to uploads via custom templates:

> I did it with a custom CSS based on Materialize.

Hope this will help:

In your main template where you want the upload form, you have to add this:
`{{> customUpload fileTypes='.jpg' formData=uploadHeader callbacks=uploadCallbacks}}`

Then create a custom template where you want following this :

```html
<template name="customUpload">
    <form method="POST" enctype="multipart/form-data" class="uk-form">
        <a class="uk-form-file md-btn">{{_ "chooseFile" }}
            <input id="file_upload-select" type="file" class="jqUploadclass header_main_search_btn uk-button-link" data-form-data='{{ submitData }}' accept="{{ fileTypes }}">
        </a>

        {{#with infoLabel}}
            {{ infoLabel}} <button class="header_main_search_btn uk-button-link start"><i class="md-icon material-icons">&#xE2C6;</i></button>
            <div id="file_upload-progressbar" class="uk-progress">
                <div class="uk-progress-bar" style="width:{{ progress }}">{{ progress }}</div>
            </div>
        {{/with}}
    </form>
</template>
```

And finally add the custom Javascript for the custom Template :

```javascript
Template.customUpload.created = function() {
    Uploader.init(this);
}

Template.customUpload.rendered = function () {
    Uploader.render.call(this);
};

Template.customUpload.events({
    'click .start': function (e) {
        Uploader.startUpload.call(Template.instance(), e);
    }
});

Template.customUpload.helpers({
    'infoLabel': function() {
        var instance = Template.instance();

        // we may have not yet selected a file
        var info = instance.info.get()
        if (!info) {
            return;
        }

        var progress = instance.globalInfo.get();

        // we display different result when running or not
        return progress.running ?
        info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
        info.name + ' - ' + info.size + 'B';
    },
    'progress': function() {
        return Template.instance().globalInfo.get().progress + '%';
    },
    'submitData': function() {
        if (this.formData) {
            this.formData['contentType'] = this.contentType;
        } else {
            this.formData = {contentType: this.contentType};
        }
        return typeof this.formData == 'string' ? this.formData : JSON.stringify(this.formData);
    },
})
```

And that's it. You can better custom it by yourself, just a little base.

# Troubleshooting

* **503 (Service Unavailable)** can have following two reasons
    * You have incorrectly set up your directories for upload or directories have no rights for writing. Please check your server console for any messages.
    * If server console is clean, the problem could be on client with JS debugging tools such as Firebug. Please disable any JS debugging tool and restart your browser. Problem should disappear.

# Screenshots

Single file image upload with preview:

![Screenshot](https://dl.dropboxusercontent.com/u/3418607/Screenshots/Uploads-Single.png)

Multiple file upload with queue:

![Screenshot](https://dl.dropboxusercontent.com/u/3418607/Screenshots/Uploads.png)

Dropzone

![Screenshot](https://dl.dropboxusercontent.com/u/3418607/screenshots/Uploads-Dropzone.png)
