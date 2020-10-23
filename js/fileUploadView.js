import ComponentView from 'core/js/views/componentView';
import 'libraries/jquery.fileupload.js';
import 'libraries/jquery.fileupload-ui.js';

class FileUploadView extends ComponentView {

  /*preRender() {
    this.listenTo(this.model.getChildren(), {
      'change:_isActive': this.onItemsActiveChange,
      'change:_isVisited': this.onItemsVisitedChange,
      'all': this.changed
    });
  }*/
  postRender() {
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
      .on('fileuploaddone', function(e, data) {
        // for successful server response: success and returned error response

        console.log('data: ', data);
        console.log('data.result: ', data.result);
        console.log('data.textStatus: ', data.textStatus);
        console.log('data.jqXHR: ', data.jqXHR);

        if (data.status === 200) {
          // process upload success
        } else {
          // report error message
        }
      })
      .on('fileuploadfail', function(e, data) {
        // for unsuccessful server response

        // data.errorThrown
        // data.textStatus;
        // data.jqXHR;
      });

    this.setReadyStatus();
    if (this.model.get('_setCompletionOn') !== 'inview') return;
    this.setupInviewCompletion();
  }

  /**
   * TODO CL: "_setCompletionOn":
   * "_comment": "_setCompletionOn = inview | uploaded",
   * "_setCompletionOn": "uploaded",
   * reference Media
   */

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
