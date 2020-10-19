import Adapt from 'core/js/adapt';
import {compile, classes, _classes, templates, html} from 'core/js/reactHelpers';

export default function(model, view) {
  const data = model.toJSON();
  data._globals = Adapt.course.get('_globals');

  /*const data = model.toJSON();
  const { _graphic } = data;

  const screenSize = Adapt.device.screenSize;
  const imageWidth = (screenSize === 'medium') ? 'small' : screenSize;*/

  return (

    <div
      className={classes([
      'component-inner',
      'adapt-kcc-fileUpload-inner'
    ])}
    >
      {templates.component(model, view)}
      <div
           className={classes([
             'component-widget',
             'adapt-kcc-fileUpload-widget'
           ])}></div>
      <form
        id="fileupload"
        action="https://jquery-file-upload.appspot.com/"
        method="POST"
        encType="multipart/form-data"
      >
        <div className="row fileupload-buttonbar">
            <span
              className={classes([
                'fileupload-controls',
                'btn-success',
                'fileinput-button'
              ])}>
              <i className="glyphicon glyphicon-plus"></i>
              <span>Add files...</span>
              <input type="file" name="files[]" data-url="server/php/" multiple/>
            </span>
            <button type="submit" className="fileupload-controls btn-primary start">
              <i className={classes([
                'glyphicon',
                'glyphicon-upload'
              ])}
                ></i>
              <span>Start upload</span>
            </button>
            <button type="reset" className="fileupload-controls btn-warning cancel">
              <i className="glyphicon glyphicon-ban-circle"></i>
              <span>Cancel upload</span>
            </button>
            {/*<button type="button" className="fileupload-controls btn-danger delete">
              <i className="glyphicon glyphicon-trash"></i>
              <span>Delete selected</span>
            </button>*/}
            {/*<input type="checkbox" class="toggle" />*/}
            <span class="fileupload-process"></span>
        <div
           className={classes([
             'col-lg-5',
             'fileupload-progress fade'
           ])}>
          <div
            className={classes([
              'progress',
              'progress-striped active'
            ])}
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
          >
          <div
            className={classes([
              'progress-bar',
              'progress-bar-success'
            ])}
            style={{width: '0%'}}
          ></div>
        </div>
        <div
             className={classes([
               'progress-extended'
             ])}>&nbsp;</div>
        </div>
        </div>
        <table role="presentation"
               className={classes([
          'table table-striped'
        ])}
        >
          <tbody className={classes([
            'files'
          ])}
          >

          </tbody>
        </table>
      </form>

    </div>
  );
}
