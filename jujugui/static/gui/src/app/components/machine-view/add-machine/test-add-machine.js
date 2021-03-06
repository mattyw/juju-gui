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

var juju = {components: {}}; // eslint-disable-line no-unused-vars
var testUtils = React.addons.TestUtils;

describe('MachineViewAddMachine', function() {
  let acl;

  beforeAll(function(done) {
    // By loading this file it adds the component to the juju components.
    YUI().use('machine-view-add-machine', function() { done(); });
  });

  beforeEach(() => {
    acl = shapeup.deepFreeze({isReadOnly: () => false});
  });

  it('can render for creating a machine', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub();
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        modelAPI={{
          createMachine: createMachine,
          providerType: 'ec2'
        }}
      />, true);
    const instance = renderer.getMountedInstance();
    const output = renderer.getRenderOutput();
    const buttons = [{
      title: 'Cancel',
      type: 'base',
      action: close
    }, {
      title: 'Create',
      action: instance._submitForm,
      type: 'neutral',
      disabled: undefined
    }];
    const expected = (
      <div className="add-machine">
        <div className="add-machine__constraints" key="constraints">
          <h4 className="add-machine__title">
            Define constraints
          </h4>
          <juju.components.Constraints
            containerType={''}
            disabled={false}
            hasUnit={false}
            providerType={'ec2'}
            valuesChanged={instance._updateConstraints} />
        </div>
        <juju.components.ButtonRow
          buttons={buttons}
          key="buttons" />
      </div>);
    expect(output).toEqualJSX(expected);
  });

  it('can disable the controls when read only', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub();
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={shapeup.deepFreeze({isReadOnly: () => true})}
        close={close}
        modelAPI={{
          createMachine: createMachine,
          providerType: 'lxd'
        }}
      />, true);
    const instance = renderer.getMountedInstance();
    const output = renderer.getRenderOutput();
    const buttons = [{
      title: 'Cancel',
      type: 'base',
      action: close
    }, {
      title: 'Create',
      action: instance._submitForm,
      type: 'neutral',
      disabled: true
    }];
    const expected = (
      <div className="add-machine">
        <div className="add-machine__constraints" key="constraints">
          <h4 className="add-machine__title">
            Define constraints
          </h4>
          <juju.components.Constraints
            containerType={''}
            disabled={true}
            hasUnit={false}
            providerType={'lxd'}
            valuesChanged={instance._updateConstraints} />
        </div>
        <juju.components.ButtonRow
          buttons={buttons}
          key="buttons" />
      </div>);
    expect(output).toEqualJSX(expected);
  });

  it('can render for creating a container', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub();
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        modelAPI={{
          createMachine: createMachine
        }}
        parentId="new0" />, true);
    const instance = renderer.getMountedInstance();
    const output = renderer.getRenderOutput();
    const expected = (
      <div className="add-machine">{[
        <select className="add-machine__container"
          defaultValue=""
          disabled={false}
          key="containers"
          onChange={instance._updateSelectedContainer}>
          <option disabled={true} value="">
            Choose container type...
          </option>
          {undefined}
          <option value="lxd">LXD</option>
          <option value="kvm">KVM</option>
        </select>
      ]}</div>);
    expect(output).toEqualJSX(expected);
  });

  it('can render for selecting a machine', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub();
    const unit = {};
    const machines = {
      filterByParent: sinon.stub().returns([{
        id: 'new0',
        displayName: 'new0'
      }, {
        id: 'new1',
        displayName: 'new1'
      }, {
        // Deleted machines should not appear in the list of options.
        id: 'new2',
        deleted: true,
        displayName: 'new2'
      }])
    };
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        dbAPI={{
          machines: machines
        }}
        modelAPI={{
          createMachine: createMachine
        }}
        parentId="new0"
        unit={unit} />, true);
    const instance = renderer.getMountedInstance();
    const output = renderer.getRenderOutput();
    const expected = (
      <select
        defaultValue=""
        disabled={false}
        key="machines"
        onChange={instance._updateSelectedMachine}>
        <option disabled={true} value="">
          Move to...
        </option>
        <option value="new">
          New machine
        </option>
        {[
          <option
            key="new0"
            value="new0">
            new0
          </option>,
          <option
            key="new1"
            value="new1">
            new1
          </option>
        ]}
      </select>);
    expect(output.props.children[0]).toEqualJSX(expected);
  });

  it('can call the cancel method', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub();
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        modelAPI={{
          createMachine: createMachine
        }}
      />, true);
    const output = renderer.getRenderOutput();
    output.props.children[1].props.buttons[0].action();
    assert.equal(close.callCount, 1);
  });

  it('can create a machine', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub();
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        modelAPI={{
          createMachine: createMachine
        }}
      />, true);
    const instance = renderer.getMountedInstance();
    const output = renderer.getRenderOutput();
    output.props.children[1].props.buttons[1].action();
    assert.equal(createMachine.callCount, 1);
    assert.equal(createMachine.args[0][0], null);
    assert.equal(createMachine.args[0][1], null);
    assert.equal(createMachine.args[0][2], instance.state.constraints);
  });

  it('can create a container', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub();
    const output = testUtils.renderIntoDocument(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        modelAPI={{
          createMachine: createMachine
        }}
        parentId="new0" />);
    const outputNode = ReactDOM.findDOMNode(output);
    const selectNode = outputNode.querySelector('.add-machine__container');
    selectNode.value = 'lxd';
    testUtils.Simulate.change(selectNode);
    testUtils.Simulate.click(outputNode.querySelector(
      '.button--neutral'));
    assert.equal(createMachine.callCount, 1);
    assert.equal(createMachine.args[0][0], 'lxd');
    assert.equal(createMachine.args[0][1], 'new0');
  });

  it('can place a unit on a new machine', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub().returns({id: 'new0'});
    const machines = {
      filterByParent: sinon.stub().returns([])
    };
    const placeUnit = sinon.stub();
    const unit = {id: 'unit1'};
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        dbAPI={{
          machines: machines
        }}
        modelAPI={{
          createMachine: createMachine,
          placeUnit: placeUnit
        }}
        parentId="new0"
        unit={unit}
      />, true);
    const instance = renderer.getMountedInstance();
    instance.state = {selectedMachine: 'new'};
    instance._submitForm();
    assert.equal(createMachine.callCount, 1);
    assert.equal(createMachine.args[0][0], null);
    assert.equal(createMachine.args[0][1], null);
    assert.equal(createMachine.args[0][2], instance.state.constraints);
    assert.equal(placeUnit.callCount, 1);
    assert.deepEqual(placeUnit.args[0][0], {id: 'unit1'});
    assert.equal(placeUnit.args[0][1], 'new0');
  });

  it('can place a unit on a new container', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub().returns({id: 'new0/lxc/new1'});
    const machines = {
      filterByParent: sinon.stub().returns([])
    };
    const placeUnit = sinon.stub();
    const unit = {id: 'unit1'};
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        dbAPI={{
          machines: machines
        }}
        modelAPI={{
          createMachine: createMachine,
          placeUnit: placeUnit
        }}
        parentId="new0"
        unit={unit} />, true);
    const instance = renderer.getMountedInstance();
    instance.state = {
      selectedContainer: 'lxc'
    };
    instance._submitForm();
    assert.equal(createMachine.callCount, 1);
    assert.equal(createMachine.args[0][0], 'lxc');
    assert.equal(createMachine.args[0][1], 'new0');
    assert.equal(createMachine.args[0][2], instance.state.constraints);
    assert.equal(placeUnit.callCount, 1);
    assert.deepEqual(placeUnit.args[0][0], {id: 'unit1'});
    assert.equal(placeUnit.args[0][1], 'new0/lxc/new1');
  });

  it('can place a unit on an existing machine', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub().returns({id: 'new0'});
    const machines = {
      filterByParent: sinon.stub().returns([])
    };
    const placeUnit = sinon.stub();
    const unit = {id: 'unit1'};
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        dbAPI={{
          machines: machines
        }}
        modelAPI={{
          createMachine: createMachine,
          placeUnit: placeUnit
        }}
        parentId="new0"
        unit={unit}
      />, true);
    const instance = renderer.getMountedInstance();
    instance.state = {
      selectedMachine: 'new0',
      selectedContainer: 'new0'
    };
    instance._submitForm();
    assert.equal(createMachine.callCount, 0);
    assert.equal(placeUnit.callCount, 1);
    assert.deepEqual(placeUnit.args[0][0], {id: 'unit1'});
    assert.equal(placeUnit.args[0][1], 'new0');
  });

  it('can place a unit on an existing container', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub().returns({id: 'new0'});
    const machines = {
      filterByParent: sinon.stub().returns([])
    };
    const placeUnit = sinon.stub();
    const unit = {id: 'unit1'};
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        dbAPI={{
          machines: machines
        }}
        modelAPI={{
          createMachine: createMachine,
          placeUnit: placeUnit
        }}
        parentId="new0"
        unit={unit}
      />, true);
    const instance = renderer.getMountedInstance();
    instance.state = {
      selectedMachine: 'new0',
      selectedContainer: 'new0/lxc/new0'
    };
    instance._submitForm();
    assert.equal(createMachine.callCount, 0);
    assert.equal(placeUnit.callCount, 1);
    assert.deepEqual(placeUnit.args[0][0], {id: 'unit1'});
    assert.equal(placeUnit.args[0][1], 'new0/lxc/new0');
  });

  it('can select a machine when created', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub().returns({id: 'new0'});
    const machines = {
      filterByParent: sinon.stub().returns([])
    };
    const placeUnit = sinon.stub();
    const selectMachine = sinon.stub();
    const unit = {id: 'unit1'};
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        dbAPI={{
          machines: machines
        }}
        modelAPI={{
          createMachine: createMachine,
          placeUnit: placeUnit
        }}
        parentId="new0"
        selectMachine={selectMachine}
        unit={unit}
      />, true);
    const instance = renderer.getMountedInstance();
    instance.state = {selectedMachine: 'new'};
    instance._submitForm();
    assert.equal(selectMachine.callCount, 1);
    assert.equal(selectMachine.args[0][0], 'new0');
  });

  it('does not select a container when created', function() {
    const close = sinon.stub();
    const createMachine = sinon.stub().returns({id: 'new0/lxc/new1'});
    const machines = {
      filterByParent: sinon.stub().returns([])
    };
    const placeUnit = sinon.stub();
    const selectMachine = sinon.stub();
    const unit = {id: 'unit1'};
    const renderer = jsTestUtils.shallowRender(
      <juju.components.MachineViewAddMachine
        acl={acl}
        close={close}
        dbAPI={{
          machines: machines
        }}
        modelAPI={{
          createMachine: createMachine,
          placeUnit: placeUnit
        }}
        parentId="new0"
        selectMachine={selectMachine}
        unit={unit}
      />, true);
    const instance = renderer.getMountedInstance();
    instance.state = {
      selectedContainer: 'lxc'
    };
    instance._submitForm();
    assert.equal(selectMachine.callCount, 0);
  });
});
