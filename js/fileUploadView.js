import ComponentView from 'core/js/views/componentView';
import 'libraries/jquery.fileupload.js';
import 'libraries/jquery.fileupload-ui.js';

class FileUploadView extends ComponentView {

  postRender() {
    const self = this;

    $('#fileupload').fileupload(this.model.get('_options'));

    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
      'option',
      'redirect',
      window.location.href.replace(/\/[^/]*$/, '/cors/result.html?%s')
    );

    // Load existing files:
    $('#fileupload').addClass('fileupload-processing');
    $.ajax({
      // Uncomment the following to send cross-domain cookies:
      //xhrFields: {withCredentials: true},
      url: $('#fileupload').fileupload('option', 'url'),
      dataType: 'json',
      context: $('#fileupload')[0]
    })
      .always(function() {
        $(this).removeClass('fileupload-processing');
      })
      .done(function(result) {
        $(this)
          .fileupload('option', 'done')
          // eslint-disable-next-line new-cap
          .call(this, $.Event('done'), {result: result});
      });

    $('#fileupload')
      .on('fileuploadadd', function (e, data) {
        //console.log('++++++++++++++++++');
        var fileNamePrefix = '';
        var userPrefix = '';
        var dateTimePrefix = '';
        if (self.model.get('enableUserInitialsPrefix')) {
          userPrefix = self.getUserInitials();
        }

        if (self.model.get('enableDateTimePrefix')) {
          dateTimePrefix = self.getDateTime();
        }

        fileNamePrefix = userPrefix + dateTimePrefix;
        if (fileNamePrefix.trim() !== '') fileNamePrefix += '_';

        let count = data.files.length;
        for (let i = 0; i < count; i++) {
          data.files[i].uploadName =
            fileNamePrefix + data.files[i].name;
        }
      })
      .on('fileuploadsend', function (e, data) {
        //console.log('data.getNumberOfFiles(): ', numFilesSent);
        let qtyFilesToUpload = self.model.get('_qtyFilesToUpload');
        //console.log('_qtyFilesToUpload before send: ', qtyFilesToUpload);
        self.model.set('_qtyFilesToUpload', ++qtyFilesToUpload);
        //console.log('_qtyFilesToUpload after send: ',
        // self.model.get('_qtyFilesToUpload'));
      })
      .on('fileuploaddone', function(e, data) {
        // for successful server response: success and returned error response

        //console.log('e: ', e);
        //console.log('data: ', data); //data = options
        //console.log('data.result: ', data.result);
        //console.log('data.textStatus: ', data.textStatus);
        //console.log('data.jqXHR: ', data.jqXHR);

        //let numFiles = data.getNumberOfFiles();
        //console.log('getNumberOfFiles: ', numFiles);

        let qtyFilesProcessedNoError = self.model.get('_qtyFilesProcessedNoError');
        $.each(data.result.files, function(index, file) {
          if (!file.error) {
            self.model.set('_qtyFilesProcessedNoError', ++qtyFilesProcessedNoError);
          }
        });
        console.log('_qtyFilesProcessedNoError after upload error/success: ', self.model.get('_qtyFilesProcessedNoError'));
        self.checkCompletionStatus(e, data);
      });

    this.setReadyStatus();
    if (this.model.get('_setCompletionOn') !== 'inview') return;
    this.setupInviewCompletion();
  }

  getUserInitials() {
    const _globals = this.model.get('_globals'),
      fName = _globals._learnerInfo.firstname || '',
      lName = _globals._learnerInfo.lastname || '',
      uName = (fName.charAt(0) || '') + (lName.charAt(0) || '');
    if (uName === '') console.log('User name was not available');
    return uName.toUpperCase();
  }

  getDateTime() {
    const d = new Date();
    const year = d.getFullYear().toString().substr(2, 2),
      month = this.pad((d.getMonth() + 1), 2).toString(),
      day = this.pad(d.getDate(), 2).toString(),
      hrs = this.pad(d.getHours(), 2).toString(),
      mins = this.pad(d.getMinutes(), 2).toString(),
      secs = this.pad(d.getSeconds(), 2).toString();

    return year + month + day + ':' + hrs + ':' + mins + ':' + secs;
  }

  checkCompletionStatus(e, data) {
    console.log('in checkCompletionStatus');
    console.log('this.model.get(\'_minReqUploads\'): ', this.model.get('_minReqUploads'));
    console.log('completed data: ', data);
    if (this.model.get('_setCompletionOn') === 'inview') return;
    //if (data.getNumberOfFiles() < this.model.get('_minReqUploads')) return;
    if (this.model.get('_qtyFilesProcessedNoError') < this.model.get('_minReqUploads')) return;
    //console.log('originalFiles.length: ', numFiles);

    this.setCompletionStatus();
  }

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  /**
   * TODO CL: implement v5 CSS classes
   */

  /**
   * TODO CL: implement accessibility in jsx
   */

  /**
   * TODO CL: implement drop zones in desktop
   */

  /**
   * TODO CL: establish categories and accept to restrict uploading file types:
   * images, docs, video, audio
   */

  /**
   * TODO CL: allow for multiple upload widgets on the same page
   * https://github.com/blueimp/jQuery-File-Upload/wiki/Multiple-File-Upload-Widgets-on-the-same-page
   */

  /**
   * TODO CL: allow file delete after upload
   * add model config; toggle button visibility; decrement filesProcessed; and
   * checkCompletionStatus
   */

  /**
   * TODO CL: restore uploaded file name and date/timestamp on revisit
   * reference Matching's storeUserAnswer function
   */

  /**
   * TODO CL: minify javascript files
   * https://github.com/blueimp/jQuery-File-Upload/wiki/Performance-Optimizations#javascript-minification
   */


  /*checkIfResetOnRevisit() {
    const isResetOnRevisit = this.model.get('_isResetOnRevisit');
    // If reset is enabled set defaults
    if (!isResetOnRevisit) return;
    this.model.reset(isResetOnRevisit);
  }*/

  /* onClick(event) {
     this.model.toggleItemsState($(event.currentTarget).parent().data('index'));
   }*/

}

FileUploadView.template = 'fileUpload.jsx';

export default FileUploadView;
