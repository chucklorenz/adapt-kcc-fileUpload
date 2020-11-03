import Adapt from 'core/js/adapt';
import {compile, classes, templates} from 'core/js/reactHelpers';

export default function(model, view) {
  const data = model.toJSON();
  data._globals = Adapt.course.get('_globals');

  return (
  /* CL: classes 'start', 'cancel', and 'delete' act as js hooks.
  They do not conform to Adapt format conventions in order to
  reduce modifications within blueimp fileupload js files. */

    <div className='component__inner fileupload__inner'>
      {templates.component(model, view)}
      <div className='component__widget fileupload__widget'>
      </div>
      <form
        id="fileupload"
        action="https://jquery-file-upload.appspot.com/"
        method="POST"
        encType="multipart/form-data"
      >
        <div className="row fileupload__buttonbar">
          <span className='fileupload__controls fileinput__button btn__add'>
            {/* <i className="icon icon-add-to-list"></i> */}
            <span>Add files...</span>
            <input
              type="file"
              name="files[]"
              data-url="server/php/"
              multiple
              capture={data.allowCameraCapture}
            />
          </span>
          <button
            type="submit"
            className={classes([
              'fileupload__controls btn__upload start',
              (data._qtyFilesFromAdd === 0) && 'is-disabled'
            ])}
            disabled={ data._qtyFilesFromAdd === 0}
          >
            {/* <i className='icon icon-upload'></i> */}
            <span>Start upload</span>
          </button>
          <button
            type="reset"
            className={classes([
              'fileupload__controls btn__cancel cancel',
              (data._qtyFilesFromAdd === 0) && 'is-disabled'
            ])}
            disabled={ data._qtyFilesFromAdd === 0}
          >
            {/*<button
              type="button"
              className="fileupload__controls btn__cancel cancel is-disabled"
              disabled
            >*/}
            {/* <i className="icon icon-block"></i> */}
            <span>Cancel upload</span>
          </button>
          {/* <button type="button" className="fileupload__controls
           btn__delete delete is-disabled" disabled>
            <i className="icon icon-delete"></i>
            <span>Delete selected</span>
          </button> */}
          {/* <input type="checkbox" class="toggle" /> */}
          <span class="fileupload-process"></span>
          <div
            className='col-lg-5 fileupload-progress fade fileupload__progress'>
            <div
              className='progress progress-striped active fileuploadprogress__indicator'
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className='progress-bar progress-bar-success fileuploadprogress__indicator-bar'
                style={{width: '0%'}}
              >
              </div>
            </div>
            <div className='progress-extended'>&nbsp;</div>
          </div>
        </div>
        <table
          role="presentation"
          className='table table-striped'
        >
          <tbody className='files'>
          </tbody>
        </table>
      </form>
    </div>
  );
}
