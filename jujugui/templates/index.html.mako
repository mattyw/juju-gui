<!DOCTYPE html>
<html>
<!-- !IE will be true for all non-IE browsers and IE10 since it does not
 recognize conditional flags. -->
<!--[if !IE]><!--><script>
if (/*@cc_on!@*/false) {
  // Only IE10 has cc_on as false.
  document.documentElement.className+=' ie10';
}
</script><!--<![endif]-->
<head>
    <title>Juju Admin</title>
    <!-- Disable backwards compatible mode for IE on an intranet.
         For an explanation see http://bit.ly/14VytlD
         Also note this must be the first <meta> to appear. -->
    <meta http-equiv="x-ua-compatible" content="IE=edge">
    <meta charset="utf-8">
<!-- The license statement comes after the charset declaration so that the
     charset is delivered within the first 1024 characters. -->
<!--
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2012-2013 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
-->
    <meta name="viewport" content="width=device-width,initial-scale=1.0 maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="">
    <meta name="author" content="Juju team">
    <!-- Make sure the config is loaded before other JS for use in the page
         below.
    -->
    <script src="${config_url}"></script>
    <link rel="shortcut icon" href="juju-ui/favicon.ico">
    <link rel="stylesheet" href="${convoy_url}?app/assets/stylesheets/normalize.css&app/assets/stylesheets/prettify.css&app/assets/stylesheets/cssgrids-responsive-min.css&app/assets/javascripts/yui/app-transitions-css/app-transitions-css-min.css&app/assets/javascripts/yui/panel/assets/panel-core.css&app/assets/javascripts/yui/widget-base/assets/widget-base-core.css&app/assets/javascripts/yui/widget-stack/assets/widget-stack-core.css&app/assets/juju-gui.css">

    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Set up Google analytics async tracking. -->
    <script type="text/javascript">
      var _gaq = _gaq || [];
      window._gaq = _gaq;
      // Do not call _setAccount as we need to get the key from
      // the config file which is not yet available.
    </script>
  </head>

  <body>
      <div class="hidden">
        ## Include the svg sprite image inside the body.
        <%include file="../static/gui/build/app/assets/stack/svg/sprite.css.svg" />
      </div>
      <!-- This <img> tag is here just to force early loading of the background
        image so it displays more quickly.  This makes a large improvement to
        the way the app looks while loading on a slow connection. -->
      <div id="full-screen-mask">
        <div id="browser-warning" class="centered-column"
            style="display:none;">
          <svg class="svg-icon"
            viewBox="0 0 75 30"
            style="width:75px; height:30px;">
            <use xlink:href="#juju-logo" />
          </svg>
          <div class="panel">
            <div class="header">
                  Your browser is not supported
            </div>
            <p>
              If you continue to use Juju with your current browser your
              experience may not be as good as we would like it to be.
            </p>
            <p>
              Please use the latest version of
              <a href="http://www.google.com/chrome">Chrome</a> to be fully
              supported.
            </p>
            <form onsubmit="return continueWithCurrentBrowser();">
              <input type="submit" value="Continue"/>
            </form>
          </div>
        </div>
        <div id="loading-message" class="centered-column">
          <svg class="svg-icon"
            viewBox="0 0 75 30"
            style="width:75px; height:30px;">
            <use xlink:href="#juju-logo" />
          </svg>
          <div class="panel">
            <div id="loading-message-text" class="header">
              Loading the Juju GUI
            </div>
            <div id="loading-spinner">
              <span class="spinner-loading"></span>
            </div>
          </div>
        </div>
      </div>

      <div id="charmbrowser-container"></div>
      <div id="deployment-container"></div>
      <div id="env-size-display-container"></div>
      <div id="inspector-container"></div>
      <div id="white-box-container"></div>
      <div id="machine-view-panel"></div>
      <div id="machine-view"></div>

      <div class="cookie-policy" style="display:none;">
        <div class="wrapper">
          <a href="" class="link-cta">Close</a>
          <p>
            We use cookies to improve your experience. By your continued use of
            this application you accept such use. To change your settings please
            <a href="http://www.ubuntu.com/privacy-policy#cookies">see our policy</a>
          </p>
        </div>
      </div>
      <div id="viewport">
        <header class="header-banner">
          <ul id="browser-nav" class="header-banner__list">
            <li id="nav-brand-env" class="header-banner__list-item">
              <a class="header-banner__link" href="/">
                <svg class="svg-icon header-banner__logo"
                  viewBox="0 0 75 30"
                  style="width:75px; height:30px;">
                  <use xlink:href="#juju-logo" />
                </svg>
              </a>
            </li>
            <li id="user-name" class="header-banner__list-item">
              <a class="header-banner__link--breadcrumb" href="#">
                anonymous
              </a>
            </li>
            <li class="header-banner__list-item">
              <span id="environment-name" class="environment-name" draggable="true"></span>
              <div id="environment-switcher"></div>
            </li>
          </ul>
          <ul class="header-banner__list--right">
            <li class="user-dropdown header-banner__list-item">
              <span id="user-dropdown hidden"></span>
            </li>
            <li id="maas-server" style="display:none" class="header-banner__list-item">
              <a href="" target="_blank" class="header-banner__link">MAAS UI</a>
            </li>
            <li id="get-started" class="hidden header-banner__list-item">
              <a href="http://jujucharms.com" class="header-banner__link" target="_blank">
                Get started
              </a>
            </li>
            <li class="header-banner__list-item hidden">
              <a href="/login/" class="header-banner__link">
                Sign in
              </a>
            </li>
            <li id="header-search-container"
                class="header-banner__list-item header-banner__list-item--no-padding"></li>
          </ul>
        </header>
        <div id="content">
            <div id="shortcut-help" style="display:none"></div>
            <div id="main">
            </div> <!-- /container -->
        </div>
        <div id="notifications-container"></div>
    </div>
    <script id="app-startup">
      // Global to store all of the shared application data.
      var juju = {
        // Collection of components.
        components: {},
        utils: {}
      };

      var flags = {}; // Declare an empty set of feature flags.

      getDocument = function() {
        return document;
      };

      setLoadingMessageText = function(newText) {
        getDocument()
          .getElementById('loading-message-text').innerHTML = newText;
      };

      isBrowserSupported = function(agent) {
        // Latest Chrome, Firefox, IE10 are supported
        return (/Chrome|Firefox|Safari|MSIE\ 10/.test(agent));
      };

      displayBrowserWarning = function() {
        getDocument()
          .getElementById('browser-warning').style.display = 'block';
      };

      hideBrowserWarning = function() {
        getDocument()
          .getElementById('browser-warning').style.display = 'none';
      };

      displayLoadingMessage = function() {
        getDocument()
          .getElementById('loading-message').style.display = 'block';
      };

      hideLoadingMessage = function() {
        getDocument()
          .getElementById('loading-message').style.display = 'none';
      };

      hideLoginButton = function(userDropdown, hideLoginButton) {
        if (hideLoginButton) {
          userDropdown.classList.add('hidden');
        } else {
          userDropdown.classList.remove('hidden');
        }
      };

      continueWithCurrentBrowser = function() {
        hideBrowserWarning();
        displayLoadingMessage();
        startTheApp();
        // Signal that we want to stop event propagation.
        return false;
      };

      startTheApp = function() {
        // This function will be redefined when all the app's JavaScript is
        // loaded.  We want to keep trying until that happens.

        // Tell jslint that we really do want to evaluate a string:
        /*jslint evil: true */
        window.setTimeout('startTheApp()', 100);
      };

      go = function(agent) {
        if (isBrowserSupported(agent)) {
          startTheApp();
        } else {
          hideLoadingMessage();
          displayBrowserWarning();
        }
      };

      /**
        Feature flags support.

        :WARNING: this is stuck on the window object to make sure it's
        available everywhere. This means mocking this out in tests can be
        dangerous and evil. Be careful.

        This allows us to use the :flags: NS to set either boolean or string
        feature flags to control various features in the app.  A simple /<flag>/
        will set that flag as true in the global flags variable.  A
        /<flag>=<val>/ will set that flag to that value in the global flags
        variable. An example usage would be to turn on the ability to drag_and_
        drop a feature by wrapping that feature code in something like:

          if (flags.gui_featuredrag_enable) { ... }

        From the Launchpad feature flags documentation:

        > As a general rule, each switch should be checked only once or only a
        > few time in the codebase. We don't want to disable the same thing in
        > the ui, the model, and the database.
        >
        > The name looks like dotted python identifiers, with the form
        > APP_FEATURE_EFFECT. The value is a Unicode string.

        A shortened version of key can be used if they follow this pattern:

        - The feature flag applies to the gui.
        - The presence of the flag indicates Boolean enablement
        - The (default) absence of the flag indicates the feature will not be
          available.

        If those conditions are met then you may simply use the descriptive
        name of the feature, taking care it uniquely defines the feature. An
        example is, rather than specifying gui_dndexport_enable you can specify
        dndexport as a flag.

        @method featureFlags
        @param {object} url The url to parse for flags.
        @param {object} configFlags An optional config object to merge with.
      */
      window.featureFlags = function(url, configFlags) {
        var flags = configFlags || {},
            flagsRegex = new RegExp(/:flags:\/([^:])*/g);

        var found = url.match(flagsRegex);

        // The matches come back as an array.
        if (found && found.length) {
          found = found[0];
        }

        // Check if the :flags: namespace is in the url.
        if (found) {
          // Make sure we trim a trailing / to prevent extra data in the split.
          var urlFlags = found.replace(/\/+$/, '').split('/');

          // Remove the first :flags: match from the split results.
          urlFlags = urlFlags.slice(1);

          urlFlags.forEach(function(flag) {
            var key = flag;
            var value = true;

            // Allow setting a specific value other than true.
            var equals = flag.indexOf('=');
            if (equals !== -1) {
              key = flag.slice(0, equals);
              // Add one to the index to make sure we drop the first "equals"
              // from the string.
              value = flag.slice((equals + 1));
            }

            flags[key] = value;
          });
        }

        return flags;
      };
      // The browser driver does not accept anything but `true` as a value
      // to indicate that it's available so we use this as a flag to indicate
      // that the scripts are loaded and that the above methods are available.
      applicationLoaded = true;
    </script>
    <script>
      // This code is here instead of in the "app-startup" script tag above
      // because we extract that JS in order to test it.  This bit here is just
      // to bootstrap the app when actually loaded into a browser.
      go(navigator.userAgent);
    </script>
    <!--
      Load the (potentially slow to download) core of the app.  We do this here
      because we want the browser warning to execute before spending the time
      to download an app the user might not be able to use anyway.
    -->

    <!--
      d3 must be loaded with the initial yui assets. if loaded by the combo loader
      it will be combined with our app code and be interpreted under global
      'use strict' and d3 doesn't work under strict.
    -->
    % if raw:
    <script src="${convoy_url}?app/assets/javascripts/react-with-addons.js&app/assets/javascripts/react-dom.js&app/assets/javascripts/classnames.js&app/assets/javascripts/clipboard.js&app/assets/javascripts/react-onclickoutside.js"></script>
    <script src="${convoy_url}?app/assets/javascripts/handlebars.runtime.js"></script>
    <script src="${convoy_url}?app/assets/javascripts/yui/yui/yui.js&app/assets/javascripts/yui/loader/loader.js&app/assets/javascripts/d3.js"></script>
    <script src="${convoy_url}?modules.js"></script>
    <script src="${convoy_url}?app/assets/javascripts/gallery-markdown.js"></script>
    <script src="${convoy_url}?app/store/env/bakery.js&app/assets/javascripts/jujulib/juju.js"></script>
    % else:
    <script src="${convoy_url}?app/assets/javascripts/react-with-addons.min.js&app/assets/javascripts/react-dom.min.js&app/assets/javascripts/classnames-min.js&app/assets/javascripts/clipboard.min.js&app/assets/javascripts/react-onclickoutside-min.js"></script>
    <script src="${convoy_url}?app/assets/javascripts/handlebars.runtime.min.js"></script>
    <script src="${convoy_url}?app/assets/javascripts/yui/yui/yui-min.js&app/assets/javascripts/yui/loader/loader-min.js&app/assets/javascripts/d3-min.js"></script>
    <script src="${convoy_url}?modules-min.js"></script>
    <script src="${convoy_url}?app/store/env/bakery-min.js&app/assets/javascripts/jujulib/juju-min.js"></script>
    <script src="${convoy_url}?app/assets/javascripts/gallery-markdown-min.js"></script>
    % endif

    <script>
      // Now that all of the above JS is loaded we can define the real start
      // function which will be picked up by the setTimeout, and the app will
      // start.
      startTheApp = function() {
        setLoadingMessageText('Connecting to the Juju environment');

        window.flags = featureFlags(
            window.location.href,
            window.juju_config.flags || {}
        );

        // Add the current flags to the body so they can be used to flag CSS.
        for (var flag in window.flags) {
          if (flag) {
            document.getElementsByTagName(
                'body')[0].className += ' flag-' + flag;
          }
        }

        // This config property is passed in to allow for testing.
        var userDropdown = getDocument().getElementsByClassName(
            'user-dropdown')[0];
        hideLoginButton(userDropdown, juju_config.hideLoginButton);

        var GlobalConfig = {
          combine: true,
          base: '${convoy_url}?/app/assets/javascripts/yui/',
          comboBase: '${convoy_url}?',
          maxURLLenght: 1300,
          root: 'app/assets/javascripts/yui/',
          groups: {
            app: {
                % if raw:
                filter: 'raw',
                % endif
                % if combine:
                combine: true,
                % else:
                combine: false,
                % endif
                base: "${convoy_url}?app/",
                comboBase: "${convoy_url}?",
                root: 'app/',
                // From modules.js
                modules: YUI_MODULES,
            },
          }
        };

        YUI(GlobalConfig).use(['juju-gui', 'yui-patches'], function(Y) {
          app = new Y.juju.App(juju_config);
          // We need to activate the hotkeys when running the application
          // in production. Unit tests should call it manually.
          app.activateHotkeys();

          window.ga_id = juju_config.GA_key || '';
          if (window.ga_id != '') {
            _gaq.push(['_setAccount', window.ga_id]);
            _gaq.push (['_gat._anonymizeIp']);
            _gaq.push(['_setDomainName', 'none']);
            _gaq.push(['_setAllowLinker', true]);
            _gaq.push(['_trackPageview']);
          }
        });

      };
    </script>
    <script async type="text/javascript">
      (function() {
      var ga = document.createElement('script');
      ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ?
                'https://ssl' : 'http://www') +
                '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(ga, s);
      })();
    </script>

  </body>
</html>
