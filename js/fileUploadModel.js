import ComponentModel from 'core/js/models/componentModel';

export default class FileUploadModel extends ComponentModel {

  defaults() {
    return ComponentModel.resultExtend('defaults', {
      _qtyFilesToUpload: 0,
      _qtyFilesProcessedNoError: 0
    });
  }

  init() {
    ComponentModel.prototype.init.call(this);
    this.consolidateOptions();
  }

  consolidateOptions() {
    // options are seperated at beginning to facilitate categorization
    // within the properties.schema
    const basicOpts = this.get('_basicOptions');
    const genOpts = this.get('_generalOptions');
    const proImageOpts = this.get('_processingImageOptions');
    const proAudioOpts = this.get('_processingAudioOptions');
    const proVideoOpts = this.get('_processingVideoOptions');
    const valOpts = this.get('_validationOptions');
    const templateOptions = {
      uploadTemplateId: null,
      downloadTemplateId: null,
      uploadTemplate: function(data) {
        var rows = $();
        $.each(data.files, function(index, file) {
          var row = $('<tr class="template-upload fade">' +
            '<td><span class="preview"></span></td>' +
            '<td><p class="name"></p>' +
            '<strong class="error text-danger"></strong>' +
            '</td>' +
            '<td><p class="size"></p>' +
            '<div class="progress fileuploadprogress__indicator">' +
            '<div class="progress-bar progress-bar-success"' +
            ' style="width:0%;"></div></div>' +
            '</td>' +
            '<td>' +
            (!index && !data.options.autoUpload ?
              '<button class="fileupload-controls start"' +
              '>Start</button>' : '') +
            (!index ? '<button class="fileupload-controls' +
              ' cancel">Cancel</button>' : '') +
            '</td>' +
            '</tr>');
          row.find('.name').text(file.uploadName );
          row.find('.size').text(data.formatFileSize(file.size));
          if (file.error) {
            row.find('.error').text(file.error);
            row.find('.start').prop('disabled', true);
          }
          rows = rows.add(row);
        });
        return rows;
      },
      downloadTemplate: function(result) {
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
          }
          else {
            //row.find('.name').append($('<a></a>').text(file.name));
            row.find('.name').text(file.name);
            if (file.thumbnailUrl) {
              row.find('.preview').append(
                //$('<a></a>').append(
                $('<img>').prop('src', file.thumbnailUrl)
                //)
              );
            }
            /*row.find('a')
              .attr('data-gallery', '')
              .prop('href', file.url);
            row.find('button.delete')
              .attr('data-type', file.delete_type)
              .attr('data-url', file.delete_url);*/
          }
          rows = rows.add(row);
        });
        return rows;
      }
    };
    var _options = {};

    _.extend(_options, basicOpts, genOpts, genOpts, proImageOpts, proAudioOpts, proVideoOpts, valOpts, templateOptions);

    // remove opts with value='' to preserve code defaults
    let deleteOpts = _.pick(_options, function (value) {
      return value === '' || value === undefined || value === null;
    });
    _options = _.omit(_options, _.keys(deleteOpts));

    // a) JSON strings arrive escaped, and
    // b) jquery.fileupload-validate.js requires regex, not strings
    this.unescapeRegex(_options, 'acceptFileTypes');
    this.unescapeRegex(_options, 'loadImageFileTypes');
    this.unescapeRegex(_options, 'loadAudioFileTypes');
    this.unescapeRegex(_options, 'loadVideoFileTypes');

    this.set('_options', _options);
  }

  unescapeRegex(object, string) {
    if (!object[string]) return;

    let match = /^\/(.*)\/([a-z]*)$/.exec(object[string]);
    object[string] = new RegExp(match[1], match[2]);
  }

  /*unescapeRegex(object, string) {
    if (!object[string]) return;
    let unescapedString = object[string].replace(/\\(.)/g, function ($0, $1) {
      return $1;
    });
    console.log('unescapedString: ', unescapedString);
    let regexString = new RegExp(unescapedString);
    console.log('regexString: ', regexString);
    // remove leading and trailing /
    object[string] = regexString;
  }*/

}
