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

    $('#fileupload')
      .on('fileuploadadd', function(e, data) {
        let fileNamePrefix = '',
          userPrefix = '',
          dateTimePrefix = '';

        if (self.model.get('enableUserInitialsPrefix')) {
          userPrefix = self.getUserInitials();
        }

        if (self.model.get('enableDateTimePrefix')) {
          dateTimePrefix = self.getDateTime();
        }

        fileNamePrefix = dateTimePrefix + userPrefix;
        if (fileNamePrefix.trim() !== '') fileNamePrefix += '-';

        let count = data.files.length;
        for (let i = 0; i < count; i++) {
          data.files[i].uploadName =
            fileNamePrefix + data.files[i].name;
        }

        let qtyFilesFromAdd = self.model.get('_qtyFilesFromAdd');
        self.model.set('_qtyFilesFromAdd', ++qtyFilesFromAdd);
      })
      .on('fileuploaddone', function(e, data) {
        // for successful server response: both success and returned error
        // response
        let qtyFilesProcessedNoError = self.model.get('_qtyFilesProcessedNoError');
        let qtyFilesFromAdd = self.model.get('_qtyFilesFromAdd');
        $.each(data.result.files, function(index, file) {
          if (!file.error) {
            self.model.set('_qtyFilesProcessedNoError', ++qtyFilesProcessedNoError);
          }
        });
        self.model.set('_qtyFilesFromAdd', --qtyFilesFromAdd);
        self.checkCompletionStatus();
      })
      .on('fileuploadfail', function(e, data) {
        let qtyFilesFromAdd = self.model.get('_qtyFilesFromAdd');
        self.model.set('_qtyFilesFromAdd', --qtyFilesFromAdd);
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
    //const year = d.getFullYear().toString().substr(2, 2),
    const year = d.getFullYear().toString(),
      month = this.pad((d.getMonth() + 1), 2).toString(),
      day = this.pad(d.getDate(), 2).toString(),
      hrs = this.pad(d.getHours(), 2).toString(),
      mins = this.pad(d.getMinutes(), 2).toString(),
      secs = this.pad(d.getSeconds(), 2).toString();

    return year + month + day + hrs + mins + secs;
  }

  checkCompletionStatus() {
    if (this.model.get('_setCompletionOn') === 'inview') return;
    if (this.model.get('_qtyFilesProcessedNoError') < this.model.get('_minReqUploads')) return;

    this.setCompletionStatus();
  }

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  onKeyPress(event)
  {
    // 32:spacebar; 13: enter
    if (event.which === 32 || event.which === 13) {
      event.preventDefault();
      $(event.currentTarget).next('input').trigger('click');
    }
  }

  /**
   * TODO CL: retrieve button title values from model
   * mobile view
   * consolidate less files
   */

  /**
   * TODO CL: implement v5 CSS classes
   * mobile view
   * consolidate less files
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
}

FileUploadView.template = 'fileUpload.jsx';

export default FileUploadView;
