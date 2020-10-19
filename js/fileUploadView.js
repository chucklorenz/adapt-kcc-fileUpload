import ComponentView from 'core/js/views/componentView';
import 'libraries/jquery.fileupload.js';
import 'libraries/jquery.fileupload-ui.js';

class FileUploadView extends ComponentView {

  preRender() {
    /* this.listenTo(this.model.getChildren(), {
      'change:_isActive': this.onItemsActiveChange,
      'change:_isVisited': this.onItemsVisitedChange,
      'all': this.changed
    }); */
  }

  postRender() {
    //console.log('$(\'#fileupload\'):', $('#fileupload'));

    /*$('#fileupload').fileupload({
      // Uncomment the following to send cross-domain cookies:
      //xhrFields: {withCredentials: true},
      url: this.model.get('url')
    });*/

    $('#fileupload').fileupload({
      url: this.model.get('url'),
      uploadTemplateId: null,
      downloadTemplateId: null,
      uploadTemplate: function(data) {
        var rows = $();
        $.each(data.files, function(index, file) {
          var row = $('<tr class="template-upload fade">' +
            '<td><span class="preview"></span></td>' +
            '<td><p class="name"></p>' +
            '<div class="error"></div>' +
            '</td>' +
            '<td><p class="size"></p>' +
            '<div class="progress"></div>' +
            '</td>' +
            '<td>' +
            (!index && !data.options.autoUpload ?
              '<button class="fileupload-controls start"' +
              ' disabled>Start</button>' : '') +
            (!index ? '<button class="fileupload-controls' +
              ' cancel">Cancel</button>' : '') +
            '</td>' +
            '</tr>');
          row.find('.name').text(file.name);
          row.find('.size').text(data.formatFileSize(file.size));
          if (file.error) {
            row.find('.error').text(file.error);
          }
          rows = rows.add(row);
        });
        return rows;
      },
      downloadTemplate: function(result) {
        console.log('result:', result);
        var rows = $();
        $.each(result.files, function(index, file) {
          var row = $('<tr class="template-download fade">' +
            '<td><span class="preview"></span></td>' +
            '<td><p class="name"></p>' +
            (file.error ? '<div class="error"></div>' : '') +
            '</td>' +
            '<td><span class="size"></span></td>' +
            /*'<td><button class="fileupload-controls' +
            ' delete">Delete</button></td>' +*/
            '</tr>');
          row.find('.size').text(result.formatFileSize(file.size));
          if (file.error) {
            row.find('.name').text(file.name);
            row.find('.error').text(file.error);
          } else {
            row.find('.name').append($('<a></a>').text(file.name));
            if (file.thumbnailUrl) {
              row.find('.preview').append(
                $('<a></a>').append(
                  $('<img>').prop('src', file.thumbnailUrl)
                )
              );
            }
            row.find('a')
              .attr('data-gallery', '')
              .prop('href', file.url);
            row.find('button.delete')
              .attr('data-type', file.delete_type)
              .attr('data-url', file.delete_url);
          }
          rows = rows.add(row);
        });
        return rows;
      }
    });

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

    this.setReadyStatus();
    if (this.model.get('_setCompletionOn') !== 'inview') return;
    this.setupInviewCompletion();
  }

  /**
   * TODO CL: add prefixes to file upload name:
   * date/time stamp
   * user initials
   * substitute name
   */

  /**
   * TODO CL: scale uploaded image w maxDimension
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
