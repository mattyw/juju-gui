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

YUI.add('unit-list', function() {

  juju.components.UnitList = React.createClass({

    /**
      Get the current state of the inspector.

      @method getInitialState
      @returns {String} The current state.
    */
    getInitialState: function() {
      // Setting a default state object.
      return {
        selectAll: false
      };
    },
    /**
      Fires changeState to update the UI based on the component clicked.

      @method _navigate
      @param {Object} e The click event.
    */
    _navigate: function(e) { },

    /**
      Sets the selectAll state property based on the "select all" child
      component.

      @method _selectAllUnits
      @param {Boolean} checked Whether the "select all" child component is
        checked.
    */
    _selectAllUnits: function(checked) {
      this.setState({selectAll: checked});
    },

    /**
      The callable to be passed to the unit items for navigating to the unit
      details.

      @method _unitItemAction
      @param {Object} e The click event.
    */
    _unitItemAction: function(e) {
      var unitId = e.currentTarget.getAttribute('data-id').split('/')[1];
      this.props.changeState({
        sectionA: {
          component: 'inspector',
          metadata: {
            id: this.props.serviceId,
            unit: unitId,
            activeComponent: 'unit'
          }
        }
      });
    },

    /**
      Generates a list of unit components.

      @method _generateUnitList
      @param {Array} units Collection of units.
      @returns {Array} Collection of unit components.
    */
    _generateUnitList: function(units) {
      var components = [
        <juju.components.UnitListItem
          key='select-all'
          label='Select all units'
          whenChanged={this._selectAllUnits}/>
      ];
      units.forEach((unit) => {
        components.push(
          <juju.components.UnitListItem
            key={unit.displayName}
            label={unit.displayName}
            action={this._unitItemAction}
            checked={this.state.selectAll}
            unitId={unit.id} />);
      });
      return components;
    },

    render: function() {
      var units = this._generateUnitList(this.props.units.toArray());
      return (
        <div className="unit-list">
          <div className="unit-list__actions">
            <juju.components.OverviewAction
              action={this._navigate}
              title="Scale Service" />
          </div>
          <ul>
            {units}
          </ul>
        </div>
      );
    }

  });

}, '0.1.0', { requires: [
  'unit-list-item'
]});