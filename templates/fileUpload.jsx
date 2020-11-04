import Adapt from 'core/js/adapt';
import {compile, classes, html, templates} from 'core/js/reactHelpers';

export default function(model, view) {
  const data = model.toJSON();
  const buttons = data._buttons;

  return (
  /* CL: classes 'start' and 'cancel' act as js hooks.
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
          <label htmlFor="chuck" className='fileinput__button'>
            <span className='fileupload__controls btn__add'
              role="button"
              aria-label={buttons._addFile.ariaLabel}
              tabIndex="0"
              onKeyPress={(event) => view.onKeyPress(event)}
            >
              {html(compile(buttons._addFile.buttonText))}
            </span>
            <input
              id="chuck"
              type="file"
              name="files[]"
              data-url="server/php/"
              multiple
              capture={data.allowCameraCapture}
            />
          </label>
          <button
            type="submit"
            className={classes([
              'fileupload__controls btn__upload start',
              (data._qtyFilesFromAdd === 0) && 'is-disabled'
            ])}
            aria-label={buttons._uploadAll.ariaLabel}
            disabled={ data._qtyFilesFromAdd === 0}
          >
            {html(compile(buttons._uploadAll.buttonText))}
          </button>
          <button
            type="reset"
            className={classes([
              'fileupload__controls btn__cancel cancel',
              (data._qtyFilesFromAdd === 0) && 'is-disabled'
            ])}
            aria-label={buttons._cancelAll.ariaLabel}
            disabled={ data._qtyFilesFromAdd === 0}
          >
            {html(compile(buttons._cancelAll.buttonText))}
          </button>
          <span className="fileupload-process"></span>
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
