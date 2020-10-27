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
      .on('fileuploadsend', function (e, data) {
        console.log('++++++++++++++++++');
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

  checkCompletionStatus(e, data) {
    console.log('in checkCompletionStatus');
    console.log('this.model.get(\'_minReqUploads\'): ', this.model.get('_minReqUploads'));
    console.log('completed data: ', data);
    if (this.model.get('_setCompletionOn') === 'inview') return;
    //if (data.getNumberOfFiles() < this.model.get('_minReqUploads')) return;
    if (this.model.get('_qtyFilesProcessedNoError') < this.model.get('_minReqUploads')) return;
    //console.log('originalFiles.length: ', numFiles);

    //if (!this.areAllItemsCompleted()) return;
    this.setCompletionStatus();
  }

  /**
   * TODO CL: add prefixes to file upload name:
   * date/time stamp
   * user initials
   * substitute name
   * https://github.com/blueimp/jQuery-File-Upload/wiki/API
   */

  /**
   * TODO CL: accept images from camera with 'capture'
   */

  /**
   * TODO CL: establish categories to restrict uploading file types:
   * images, docs, video, audio
   */

  /**
   * TODO CL: allow for multiple upload widgets on the same page
   * https://github.com/blueimp/jQuery-File-Upload/wiki/Multiple-File-Upload-Widgets-on-the-same-page
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
