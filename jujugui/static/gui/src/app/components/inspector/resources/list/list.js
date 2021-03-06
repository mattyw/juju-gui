/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2016 Canonical Ltd.

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

class InspectorResourcesList extends React.Component {
  /**
    Generate a list of resources to display.

    @returns {Object} The resource list markup.
  */
  _generateResources() {
    const resources = this.props.resources;
    const resourceList = resources.map((resource, i) => {
      return (
        <li className="inspector-resources-list__resource"
          key={resource.Name + i}>
          <p>{resource.Name}</p>
          <p>{resource.Description}</p>
        </li>);
    });
    return (
      <ul className="inspector-resources-list__list">
        {resourceList}
      </ul>);
  }

  render() {
    return (
      <div className="inspector-resources-list">
        {this._generateResources()}
      </div>
    );
  }
};

InspectorResourcesList.propTypes = {
  acl: PropTypes.object.isRequired,
  resources: PropTypes.array.isRequired
};

YUI.add('inspector-resources-list', function() {
  juju.components.InspectorResourcesList = InspectorResourcesList;
}, '0.1.0', { requires: [
  'loading-spinner'
]});
