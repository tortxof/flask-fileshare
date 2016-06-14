var content_type_input = document.getElementById('content_type_input')
var file_input = document.getElementById('file_input');
var upload_form = document.getElementById('upload_form');
var upload_status = document.getElementById('upload_status');
var progress_bar = document.getElementById('progress_bar');

if (file_input) {
  file_input.addEventListener('change', function(event) {
    content_type_input.value = file_input.files[0].type || 'application/octet-stream';
    var formData = new FormData(upload_form);
    var xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', function(event) {
      if (event.lengthComputable) {
        var percentComplete = Math.floor((event.loaded / event.total) * 100);
        console.log(percentComplete);
        upload_status.innerHTML = 'Uploading...';
        progress_bar.value = event.loaded;
        progress_bar.max = event.total;
      }
    });

    xhr.addEventListener('loadend', function(event) {
      upload_status.innerHTML = 'Upload Complete';
      console.log(xhr);
      console.log(xhr.upload);
      console.log(event);
      console.log(this);
    });

    xhr.open('POST', upload_form.action, true);

    xhr.send(formData);
  });
}

var filesize_elems = document.getElementsByClassName('filesize');
for (var i=0; i<filesize_elems.length; i++) {
  filesize_elems[i].textContent = 'Size: ' + filesize(filesize_elems[i].dataset.filesize);
}

var clipboard = new Clipboard('.copy-button');
