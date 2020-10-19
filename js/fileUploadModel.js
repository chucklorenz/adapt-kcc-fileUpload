import ComponentModel from 'core/js/models/componentModel';

export default class FileUploadModel extends ComponentModel {

  defaults() {
    return ComponentModel.resultExtend('defaults', {
      _shouldCollapseItems: true,
      _toggleSpeed: 200
    });
  }
}
