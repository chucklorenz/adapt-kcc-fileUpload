import Adapt from 'core/js/adapt';
import {compile, classes, templates, html} from 'core/js/reactHelpers';

export default function(model, view) {
  const data = model.toJSON();
  data._globals = Adapt.course.get('_globals');
  return (

    <div class="component-inner adapt-kcc-fileUpload-inner">
      {templates.component(model, view)}
      <div class="component-widget adapt-kcc-fileUpload-widget"></div>
    </div>
  );
}
