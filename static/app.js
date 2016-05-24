var content_type_input = document.getElementById('content_type_input')
var file_input = document.getElementById('file_input');

if (file_input) {
  file_input.addEventListener('change', function(event) {
    content_type_input.value = file_input.files[0].type;
    if (content_type_input.value === '') {
      content_type_input.value = 'application/octet-stream';
    }
  });
}

var filesize_elems = document.getElementsByClassName('filesize');
for (var i=0; i<filesize_elems.length; i++) {
  filesize_elems[i].textContent = 'Size: ' + filesize(filesize_elems[i].dataset.filesize);
}

var clipboard = new Clipboard('.copy-button');
