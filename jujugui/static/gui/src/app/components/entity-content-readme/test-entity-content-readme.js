/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2015 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

var juju = {components: {}};
var testUtils = React.addons.TestUtils;

describe('EntityContentReadme', function() {
  var mockEntity;

  beforeAll(function(done) {
    // By loading this file it adds the component to the juju components.
    YUI().use('entity-content-readme', function() { done(); });
  });

  beforeEach(function() {
    mockEntity = makeEntity();
  });

  afterEach(function() {
    mockEntity = undefined;
  });

  function makeEntity(files=[]) {
    var pojo = {
      name: 'django',
      description: 'Django framework.',
      displayName: 'django',
      url: 'http://example.com/django',
      downloads: 1000,
      owner: 'test-owner',
      promulgated: true,
      id: 'django',
      type: 'charm',
      iconPath: 'data:image/gif;base64,',
      tags: ['database'],
      options: {},
      files: files
    };
    var mockEntity = {};
    mockEntity.toEntity = sinon.stub().returns(pojo);
    mockEntity.get = function(key) {
      return pojo[key];
    };
    return mockEntity;
  }

  it('can display a readme', function() {
    var renderMarkdown = sinon.stub().returns('<p>Readme</p>');
    var getFile = sinon.stub().callsArgWith(2, {target: {
      responseText: 'mock markdown'
    }});
    var mockEntity = makeEntity(['Readme.md']);
    var shallowRenderer = jsTestUtils.shallowRender(
      <juju.components.EntityContentReadme
        renderMarkdown={renderMarkdown}
        getFile={getFile}
        entityModel={mockEntity} />, true);
    shallowRenderer.getMountedInstance().componentDidMount();
    var output = shallowRenderer.getRenderOutput();
    assert.equal(getFile.callCount, 1);
    assert.equal(getFile.args[0][0], 'django');
    assert.equal(getFile.args[0][1], 'Readme.md');
    assert.equal(renderMarkdown.callCount, 1);
    assert.equal(renderMarkdown.args[0][0], 'mock markdown');
    assert.deepEqual(output,
      <div className="entity-content_readme">
        <h2 id="readme">Readme</h2>
        <div className="entity-content_readme-content"
          dangerouslySetInnerHTML={{__html: '<p>Readme</p>'}} />
      </div>);
  });

  it('will not try to display a readme if already unmounted', function() {
    var renderMarkdown = sinon.stub().returns('<p>Readme</p>');
    var getFile = sinon.stub().callsArgWith(2, {target: {
      responseText: 'mock markdown'
    }});
    var mockEntity = makeEntity(['Readme.md']);
    var shallowRenderer = jsTestUtils.shallowRender(
      <juju.components.EntityContentReadme
        renderMarkdown={renderMarkdown}
        getFile={getFile}
        entityModel={mockEntity} />, true);
    shallowRenderer.unmount();
    shallowRenderer.getMountedInstance()._getReadmeSuccess();
    var output = shallowRenderer.getRenderOutput();
    assert.equal(renderMarkdown.callCount, 0);
  });

  it('can display a message if there is no readme file', function() {
    var shallowRenderer = jsTestUtils.shallowRender(
      <juju.components.EntityContentReadme
        entityModel={mockEntity} />, true);
    shallowRenderer.getMountedInstance().componentDidMount();
    var output = shallowRenderer.getRenderOutput();
    assert.deepEqual(output,
      <div className="entity-content_readme">
        <h2 id="readme">Readme</h2>
        <div className="entity-content_readme-content"
          dangerouslySetInnerHTML={{__html: 'No readme.'}} />
      </div>);
  });

  it('displays a message if there is an error getting the file', function() {
    var renderMarkdown = sinon.stub().returns('<p>Readme</p>');
    var getFile = sinon.stub().callsArg(3);
    var mockEntity = makeEntity(['Readme.md']);
    var shallowRenderer = jsTestUtils.shallowRender(
      <juju.components.EntityContentReadme
        renderMarkdown={renderMarkdown}
        getFile={getFile}
        entityModel={mockEntity} />, true);
    shallowRenderer.getMountedInstance().componentDidMount();
    var output = shallowRenderer.getRenderOutput();
    assert.equal(getFile.callCount, 1);
    assert.equal(getFile.args[0][0], 'django');
    assert.equal(getFile.args[0][1], 'Readme.md');
    assert.equal(renderMarkdown.callCount, 0);
    assert.deepEqual(output,
      <div className="entity-content_readme">
        <h2 id="readme">Readme</h2>
        <div className="entity-content_readme-content"
          dangerouslySetInnerHTML={{__html: 'No readme.'}} />
      </div>);
  });
});
