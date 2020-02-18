/*
  - Copyright (c) 2014-2016 Neto Ranito & Seabra LDA. All rights reserved.
  -
  - This file is part of casper-common-ui.
  -
  - casper-common-ui is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - casper-common-ui  is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with casper-common-ui.  If not, see <http://www.gnu.org/licenses/>.
  -
 */

import './build-src/print.js';
import './casper-socket2.js';
import './casper-i18n-behavior.js';
import '@vaadin/vaadin-upload/vaadin-upload.js';
import '@polymer/paper-styles/color.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class CasperJobDialog extends Casper.I18n(PolymerElement) {

  static get is () {
    return 'casper-job-dialog';
  }

  static get template () {
    return html`
      <style>
        :host {
          display: block;
        }

        paper-progress {
          margin-top: 5px;
          margin-bottom:  20px;
          width: 100%;
        }

        paper-progress.slow {
          --paper-progress-indeterminate-cycle-duration: 5s;
          --paper-progress-active-color: var(--primary-color);
          --paper-progress-secondary-color: var(--paper-red-100);
        }

        paper-button {
          font-weight: normal;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
          background-color: #101010;
          color: white;
          margin: 0 12px 12px 12px;
          height: 36px;
        }

        #dialog {
          display: flex;
          flex-direction: column;
          max-width: 400px;
          min-width: 400px;
          max-height: 450px;
          min-height: 250px;
        }

        .paper-dialog-0 > * {
          padding: 0px;
          margin: 0px;
        }

        #header {
          background-color: black;
          height: 42px;
          color: white;
          padding: 0px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        #pager {
          flex-grow: 2;
          display: flex;
        }

        .page {
          display: flex;
          flex-direction: column;
          flex-grow: 2;
          background-color: white;
          margin: 12px;
        }

        .message {
          height: 16px;
          max-height: 16px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 377px;
        }

        .hidden {
          display: none;
        }

        #upload {
          flex-grow: 2;
          border-width: 2px;
        }

        .header {
          fill: white;
          margin: 8px;
        }

        .close {
          fill: white;
          margin: 8px;
        }

        #error_panel, #completed_panel {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          max-width: 350px;
        }

        .error_pad, .completed_pad {
          width: 72px;
          height: 100%;
          margin-right: 12px;
        }

        .error_icon {
          fill: #B94F4F;
          --iron-icon-height: 72px;
          --iron-icon-width: 72px;
        }

        .completed_icon {
          fill: var(--primary-color);
          --iron-icon-height: 72px;
          --iron-icon-width: 72px;
        }

        .error_message, .completed_message {
          font-size: 16px;
          font-weight: 500;
          color: #444;
          right: 0;
          top: 0;
          overflow: auto;
          margin: 0;
          max-height: 250px;
        }

        .close:hover {
          background-color: var(--primary-color);
        }

        #button_container {
          display: flex;
        }

        #submit, #close_button {
          background-color: var(--primary-color);
          width: 100%;
          text-align: center;
        }
      </style>

      <casper-socket2 id="self_socket"></casper-socket2>
      <paper-tooltip id="tooltip" for="close">[[tooltip]]</paper-tooltip>
      <paper-dialog id="dialog" opened modal>
        <div id="header">
          <h2 id="title" class="header"></h2>
          <iron-icon icon="close" id="close" class="close" on-tap="_closeDialog"></iron-icon>
        </div>
        <div id="pager">
          <div id="status_panel" class="page">
            <span class="message" alt="[[i18n('i18n_waiting_on_queue')]]" title="[[i18n('i18n_waiting_on_queue')]]">[[i18n('i18n_waiting_on_queue')]]</span>
            <paper-progress indeterminate class="slow"></paper-progress>
            <span class="message"></span>
            <paper-progress indeterminate class="slow hidden"></paper-progress>
            <span class="message"></span>
            <paper-progress indeterminate class="slow hidden"></paper-progress>
          </div>
          <div id="upload_panel" class="page">
            <vaadin-upload id="upload"
                         accept="[[uploadMimeTypes]]"
                         target="[[uploadUrl]]"
                         max-files="1"
                         method="POST"
                         timeout="300000"
                         form-data-name="my-attachment">
            </vaadin-upload>
          </div>
          <div id="error_panel" class="page error_panel">
            <div class="error_pad">
              <iron-icon icon="error-outline" class="error_icon"></iron-icon>
            </div>
            <div class="error_message">
              <h2>[[i18n('i18n_error')]]</h2>
              <span id="error_message"></span>
            </div>
          </div>
          <div id="completed_panel" class="page completed_panel">
            <div class="completed_pad">
              <iron-icon id="completed_icon" icon="info-outline" class="completed_icon"></iron-icon>
            </div>
            <div class="completed_message">
              <h2>[[i18n('i18n_completed')]]</h2>
              <span id="completed_message"></span>
            </div>
          </div>
        </div>
        <div id="button_container">
          <paper-button id="submit" on-tap="_submitData">[[i18n('i18n_submit')]]</paper-button>
          <paper-button id="close_button" on-tap="_closeDialog"></paper-button>
        </div>
      </paper-dialog>
    `;
  }

  static get properties () {
    return {
      socket: {
        type: Object
      },
      jobId: {
        type: String
      },
      iframe: {
        type: Object,
        value: undefined
      },
      uploadUrl: {
        type: String,
        value: "/upload"
      },
      noAuto: {
        type: Boolean,
        value: false
      },
      method: {
        type: String,
        value: 'GET'
      },
      content_type: {
        type: String,
        value: 'application/html'
      },
      handle_as: {
        type: String,
        value: 'html'
      },
      uploadMimeTypes: {
        type: String,
        value: 'image/jpeg, image/png'
      },
      originalFileName: {
        type: String
      },
      closeAction: {
        type: String,
        value: 'close',
        observer: '_setUpCloseAction'
      },
      tooltip: String,
      monitorProgress: {
        type: Boolean,
        value: false
      },
      jobInfo: {
        type: Object,
        value: { urn: '', reference: '', operation: ''}
      }
    };
  }

  attached () {
    if ( this.socket === undefined ) {
      this.socket = this.$.self_socket;
      this._closeSocket = true;
    } else {
      this._closeSocket = false;
    }
    this.socket.client = this;
    this.onUploadCallback = undefined;
    this.i18nUpdateUpload(this.$.upload);
    this.listen(this.$.upload, 'upload-success', '_uploadSuccess');
    this.listen(this.$.upload, 'upload-request', '_uploadRequest');

    this.$.upload_panel.style.display = 'none';
    this.$.status_panel.style.display = 'none';
    this.$.error_panel.style.display = 'none';
    this.$.completed_panel.style.display = 'none';

    this.$.submit.style.display = 'none';
    this.$.close_button.style.display = 'block';

    this.cancelOnClose = true;
    this._showingError = false;
    this._stashed = false;
    this._stashedMessage = undefined;
    this._cancelOnClose = true;
    this._hasPublicLink = false;
    this._closingSocket = false;
    this._dialogOpenTimestamp = new Date().getTime();
    this._scheduledReplyTimeout = new Array();
    this._jobCancelled              = false;
    this._jobCancelledReportTimeout = 10000; // 10s
    this._jobMonitorInterval        = 10000; // 10s
    this._jobMonitorMaxReports      = 5;
    this._jobMonitorReplyTimeout    = 10000; // 10s
    this._jobMonitorObject          = { new: undefined, old: undefined };
  }

  closeSelfSocket () {
    if ( this._closeSocket ) {
      if( 1 === this.socket._socketState() ){
      }
      this._closingSocket = true;
      this.socket.disconnect();
    }
  }

  detached () {
    this.unlisten(this.$.upload, 'upload-request', '_uploadRequest');
    this.unlisten(this.$.upload, 'upload-success', '_uploadSuccess');
    this.closeSelfSocket();
  }

  _setUpCloseAction (value) {
    switch (value) {
      case 'close':
        this.$.close_button.textContent = this.i18n('i18n_close');
        this.tooltip = this.i18n('i18n_close');
        this._cancelOnClose = true;
        break;
      case 'cancel':
      default:
        this.$.close_button.textContent = this.i18n('i18n_cancel');
        this.tooltip = this.i18n('i18n_close_and_cancel');
        this._cancelOnClose = true;
        break;
      case 'continue':
        this.$.close_button.textContent = this.i18n('i18n_continue');
        this.tooltip = this.i18n('i18n_close_and_continue');
        this._cancelOnClose = false;
        break;
      }
  }

  subscribeJob (jobId) {
    this.$.upload_panel.style.display = 'none';
    this.$.status_panel.style.display = 'flex';
    this.$.error_panel.style.display = 'none';
    this.$.completed_panel.style.display = 'none';
    this.jobId = jobId;
    this._setReplyTimeout('subscribe', this._jobMonitorReplyTimeout, function() {
      // ... remove from control array ...
      this._cancelReplyTimeout('subscribe');
      // ... report to rollbar ...
      this._reportToRollbar('warning', 'Subscription Timming', new Error('taking to long to receive job subscription response.'));
    }.bind(this));
    this.socket.subscribeJob(this.jobId, this._subscribeResponse.bind(this));
  }

  _subscribeResponse (response) {
    if ( true === this._jobCancelled ) {
      return;
    }
    this._cancelReplyTimeout('subscribe');
    var hasStatus = ( undefined !== response.status && undefined !== response.status.status );
    if ( true === hasStatus && (response.status.status === 'failed' || response.status.status === 'error') ) {
      if ( ! response.status.message ) {
        response.status.message = [ 'i18n_submit_job_error$tube', { tube: this.jobId.split(':')[0] } ];
      }
      this._reportToRollbar('error', 'Subscription Error', response);
    }
    this._loadUI(response);
    this._monitorProgress(response);
  }

  submitJob (job, options) {
    this.$.upload_panel.style.display = 'none';
    this.$.status_panel.style.display = 'flex';
    this.$.error_panel.style.display = 'none';
    this.$.completed_panel.style.display = 'none';
    this._submitedTube = job.tube;
    this.submited_job = job;
    this._setReplyTimeout('submit', this._jobMonitorReplyTimeout, function() {
      // ... remove from control array ...
      this._cancelReplyTimeout('submit');
      // ... report to rollbar ...
      this._reportToRollbar('warning', 'Submit Timming', new Error('taking to long to receive job submission response.'));
    }.bind(this));
    this.socket.submitJob(job, this.submitJobResponse.bind(this), options);
  }

  submitJobResponse (response) {
    if ( true === this._jobCancelled ) {
      return;
    }
    this._cancelReplyTimeout('submit');
    if ( response.success === true ) {
      this.jobId = this._submitedTube + ':' + response.id;
      this.socket.updateUI(this.jobId, { title: this._title });
    } else {
      response.status = 'failed';
      response.message = [ 'i18n_submit_job_error$tube', { tube: this._submitedTube } ];
      response.job = this.submited_job;
      this._updateUI(response);
      this._reportToRollbar('critical', 'Submit Error', response);
    }
    this._monitorProgress(response);
  }

  fileUpload (onUploadCallback, onUploadCompletedCallback) {
    this.$.upload_panel.style.display = 'flex';
    this.$.status_panel.style.display = 'none';
    this.$.error_panel.style.display = 'none';
    this.$.completed_panel.style.display = 'none';
    this._onUploadCallback = onUploadCallback;
    this._onUploadCompletedCallback = onUploadCompletedCallback;
    this._onUploadCompletedCallbackData = undefined
  }

  setTitle (i18n_key) {
    this._title = i18n_key;
    this.$.title.textContent = this.i18n(i18n_key);
  }

  registerSubmit (callback) {
    this.$.submit.style.display = 'block';
    this.$.close_button.style.display = 'none';

    this.$._onSubmitClick = callback;
  }

  getDate(){
    var today = new Date();
    var year = today.getFullYear();
    var base_month = today.getMonth() + 1
    var month = base_month.toString().length == 1 ? '0' + base_month : base_month;
    var full_date = year + '-' + month;
    return full_date;
  }

  getFilename(i18n_key, translation_parameters){
    i18n_key = 'i18n_filename_' + i18n_key;

    if(translation_parameters.date === undefined){
      Polymer.Base.extend(translation_parameters, {date: this.getDate()})
    }

    try {
      var translation_obj = { name: this.i18n(i18n_key, translation_parameters), title: this.i18n(i18n_key, translation_parameters) }
      return translation_obj;
    } catch (e) {
      console.error(i18n_key, e);
      return undefined;
    }

  }

  setUploadMimeTypes(mimeTypes) {
    this.uploadMimeTypes = mimeTypes;
  }

  onSocketOpen (message) {
    // empty
  }

  onCasperNotification (notification) {
    if ( notification.message ) {
      var idx = notification.index || 0;
      var msg = this.$$('#status_panel span:nth-of-type('+(idx+1)+')');
      if ( msg !== null ) {
        msg.textContent = this.i18n.apply(this, notification.message);
      }
    }
    this._updateUI(notification);
  }

  onSocketClose (message) {
    // display error only if socket close was not ordered by this dialog
    if ( false === this._closingSocket ) {
      this._showError(['i18n_websocket_disconnected']);
    }
  }

  _uploadRequest (event) {
    event.preventDefault();
    event.detail.xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    this.originalFileName = event.detail.file.name;
    filename = 'uploaded_file';
    event.detail.xhr.setRequestHeader('Content-Disposition', 'form-data; name="'+event.detail.file.formDataName+'"; filename="'+filename+'";');
    event.detail.xhr.send(event.detail.file);
  }

  _uploadSuccess (event) {
    if ( event.detail.xhr.status == 200 ) {
      try {
        response = JSON.parse(event.detail.xhr.responseText)
        if ( this._onUploadCallback !== undefined ) {
          this._uploadedTemporaryFile = response.file;
          this._hasPublicLink = true;
          this._onUploadCallback();
          this._onUploadCallback = undefined;
        }
      } catch (exception) {
        this._reportToRollbar('critical', 'Upload Exception', exception);
      }
    }
  }

  _closeDialog (event) {
    // .. ensure all timer stop ...
    this._cancelAllTimers();
    //
    var time_diff   = new Date().getTime() - this._dialogOpenTimestamp;
    var message     = '';
    var cancelledBy = '';
    if ( undefined !== event ){
      if ( event instanceof CustomEvent ) {
        message = ('_closeDialog: by ' + event.type + ' from ' + event.detail.source + ': ' + event.detail.message + ', was alive for ' + time_diff + 'ms');
        cancelledBy = event.type;
      } else if ( event instanceof Event ) {
        message = ('_closeDialog: by ' + event.type + ', was alive for ' + time_diff + 'ms');
        cancelledBy = ( event.type === 'tap') ? 'user' : event.type;
      } else {
        message = ('_closeDialog: by unexpected event, was alive for ' + time_diff + 'ms');
        cancelledBy = 'unexpected event';
      }
    } else {
      message = ('_closeDialog: by undefined event, was alive for ' + time_diff + 'ms');
      cancelledBy = 'undefined event';
    }
    if ( this.iframe ) {
      this.iframe.style.display = 'none';
    }
    if ( this.jobId && this._cancelOnClose ) {
      this._jobCancelled = true;
      this.socket.cancelJob(this.jobId, function() {
        this.closeSelfSocket();
      }.bind(this));
    } else {
      this.closeSelfSocket();
    }
    if ( undefined !== this._onUploadCompletedCallback ) {
      this._onUploadCompletedCallback(this._onUploadCompletedCallbackData);
      this._onUploadCompletedCallback = undefined;
      this._onUploadCompletedCallbackData = undefined;
    }
    this.$.upload_panel.style.display = 'none';
    this.$.status_panel.style.display = 'flex';
    this.$.error_panel.style.display = 'none';
    this.$.completed_panel.style.display = 'none';
    this.$.error_message.textContent = '';
    this.$.completed_message.textContent = '';
    window.parent.dispatchEvent(new CustomEvent('casper-job-dialog-close', { detail: { job_id: this.jobId, notification: this._notification } }));
    this.$.dialog.close();
    // report?
    var reportMessage = "";
    if ( false === this._hasPublicLink ) {
      reportMessage = ('job cancelled by ' + cancelledBy + ' after ' + time_diff + 'ms (no public link)');
      if ( 'user' === cancelledBy && time_diff >= this._jobCancelledReportTimeout ) {
        switch (this.jobInfo.operation) {
          case "print-epaper":
          case "download-epaper":
            this._reportToRollbar('warning', 'Cancelled by user', new Error(reportMessage));
            break;
          default:
        }
      }
    } else {
      reportMessage = 'job completed after ' + time_diff + 'ms'
    }
  }

  _handlePublicLink (notification) {
    if ( true === this._jobCancelled ) {
      return;
    }
    if ( notification.public_link !== undefined && notification.status !== 'error' ) {

      try {
          printJS({printable:notification.public_link, type: 'pdf', showModal:false});
        this._hasPublicLink = true;
      } catch (exception) {
        this._reportToRollbar('critical', 'Public Link Exception', exception);
      }
    }
  }

  _loadUI (uiState) {
    if ( uiState.ui ) {
      if ( uiState.ui.title ) {
        this._title = uiState.ui.title;
        this.$.title.textContent = this.i18n.apply(this, [ this._title ]);
      }
    }
    if ( uiState.status) {
      switch (uiState.status.status) {
      case 'error':
      case 'cancelled':
        this._showError(uiState.status.progress[0].message);
        break;
      case 'in-progress':
        if ( uiState.status.progress ) {
          for ( var idx = 0; idx < uiState.status.progress.length; idx++ ) {
            var pbar = this.$$('#status_panel paper-progress:nth-of-type('+(idx+1)+')');
            if ( pbar !== null ) {
              if ( uiState.status.progress[idx].value !== null ) {
                pbar.indeterminate = false;
                pbar.value = uiState.status.progress[idx].value;
              } else {
                pbar.indeterminate = true;
              }
              pbar.classList.remove('hidden');
            }
            var msg = this.$$('#status_panel span:nth-of-type('+(idx+1)+')');
            if ( msg !== null && uiState.status.progress[idx].message !== null ) {
             msg.textContent = this.i18n.apply(this, uiState.status.progress[idx].message);
            }
          }
          this._jobMonitorObject.new = uiState.status.progress;
        }
        break;
      case 'completed':
        // .. ensure all timer stop ...
        this._cancelAllTimers();
        if (this._stashed) {
          this._showCompleted(this._stashedMessage);
        } else {
          this._handlePublicLink(uiState.status);
          this._closeDialog(
            new CustomEvent("callback",{detail:{source:'_loadUI', message:'task completed'}})
          );
        }
        break;
      default:
        this._showError(['i18n_websocket_disconnected']);
        break;
      }
    }
  }

  _updateUI (notification) {
    this._notification = notification;
    if ( notification.progress !== undefined ) {
      var progress = parseFloat(notification.progress);

      if ( isNaN(progress) === false ) {
        var idx  = notification.index || 0; idx += 1;
        var pbar = this.$$('paper-progress:nth-of-type('+idx+')');
        pbar.indeterminate = false;
        pbar.value = progress;
        pbar.classList.remove('hidden');
      }
    }
    switch (notification.status) {
      case 'in-progress':
        if ( undefined !== notification.progress ) {
          this._jobMonitorObject.new = notification.progress;
        }
        break;
      case 'completed':
        // .. ensure all timer stop ...
        this._cancelAllTimers();
        if (typeof this._onCompletedCallback === 'function') {
          this._onCompletedCallback(notification);
          this._onCompletedCallback = undefined;
        }

        if (this._stashed) {
          this._showCompleted(this._stashedMessage);
        } else {
          this._handlePublicLink(notification);

          if (notification.link) {
            this._onUploadCompletedCallbackData = { link: notification.link };
          } else if (undefined !== this._onUploadCompletedCallback) {
            this._onUploadCompletedCallbackData = notification;
          }

          this._closeDialog(
            new CustomEvent("callback",{detail:{source:'_updateUI', message:'task completed'}})
          );
        }
        break;
      case 'follow-up':
        this.subscribeJob(notification.response.next_job_id);

        if (notification.response.stash !== undefined) {
          this._stashed = notification.response.stash;
          this._stashedMessage = this.i18n.apply(this, notification.message);
          if (notification.response.stash_icon !== undefined) {
            this.$.completed_icon.icon = notification.response.stash_icon;
          }
        }

        break;
      case 'cancelled':
      case 'failed':
      case 'error':
        if (typeof this._onErrorCallback === 'function') {
          this._onErrorCallback(notification);
          this._onErrorCallback = undefined;
          this._onUploadCompletedCallback = undefined;
          this._onUploadCompletedCallbackData = undefined;
          this._closeDialog(
            new CustomEvent("callback",{detail:{source:'_updateUI', message:'task with error'}})
          );
        } else {
          this._showError(notification.message);
        }
        break;
      default:
        break;
    }
  }

  _showError (message) {
    if ( this._showingError === false ) {
      this._showingError = true;
      this.$.upload_panel.style.display = 'none';
      this.$.status_panel.style.display = 'none';
      this.$.error_panel.style.display = 'inline-flex';
      this.$.error_message.textContent = this.i18n.apply(this, message);
    }
    this.closeSelfSocket();
  }

  _showCompleted (message) {
    this.$.submit.style.display = 'none';
    this.$.close_button.style.display = 'block';
    this.$.close_button.style.width = '100%';
    this.$.upload_panel.style.display = 'none';
    this.$.status_panel.style.display = 'none';
    this.$.error_panel.style.display = 'none';
    this.$.completed_panel.style.display = 'inline-flex';
    this.$.completed_message.innerHTML = message;
  }

  _submitData (event) {
    this.$._onSubmitClick();
  }

  _reportError (response) {
    this._reportToRollbar('error', 'Generic Error', response);
  }

  _reportToRollbar (level, title, object) {
    var innerTitle = 'CJD - ' + title;
    // console.log(innerTitle);
    if ( Rollbar !== undefined ) {
      if( object instanceof Error && (level === "debug" || level === "warning" || level === "info") ){
        object = { msg: object.message };
      } else {
        object = { obj: object };
      }

      object.job       = this.jobId || this.jobInfo.operation || this.jobInfo.urn;
      object.operation = this.jobInfo.operation;
      object.reference = this.jobInfo.reference;
      object.urn       = this.jobInfo.urn;

      switch(level) {
        case "debug":
          Rollbar.debug(innerTitle, object);
          break;
        case "info":
          Rollbar.info(innerTitle, object);
          break;
        case "warning":
          Rollbar.warning(innerTitle, object);
          break;
        case "critical":
          Rollbar.critical(innerTitle, object);
          break;
        case "error":
          Rollbar.error(innerTitle, object);
        default:
      }

    }
  }

  _monitorProgress (response) {
    if ( undefined === response || ( undefined === response.success && ( undefined === response.status || undefined === response.status.status ) ) ) {
      return;
    }
    if ( false === this.monitorProgress ) {
      return;
    }
    this._setReplyInterval('progress', this._jobMonitorInterval,
      function(object) {
        var now_timepoint = new Date().getTime();
        var elapsed       = ( now_timepoint - object.timepoint );
        // console.log(new Date(), 'start progress monitor(' + object.reportCount + '):', JSON.stringify(this._jobMonitorObject), ', elapsed ', elapsed, 'ms');
        if ( object.reportCount <= this._jobMonitorMaxReports && elapsed > ( object.reportCount * this._jobMonitorInterval ) ) {
          // ... check if progress changed ...
          var sendWarning = false;
          if ( undefined !== this._jobMonitorObject.new && undefined !== this._jobMonitorObject.old ) {
            if ( 'number' == typeof this._jobMonitorObject.new ) {
              sendWarning = ( this._jobMonitorObject.new === this._jobMonitorObject.old );
            }
          } else {
            sendWarning = ( object.reportCount > 1 );
          }
          if ( true === sendWarning ) {
            var msg = 'taking to long to receive job progress';
            if ( undefined != this._jobMonitorObject.new ) {
              msg += ', current value is ' +  this._jobMonitorObject.new + '%';
            }
            msg += ', last report was ' + elapsed + 'ms ago.';
            // this._reportToRollbar('warning', 'Progress Monitoring', new Error(msg));
            // console.log(new Date(), 'report to rollbar (' + object.reportCount + '):', msg);
          }
          object.reportCount += 1;
          object.timepoint    = now_timepoint;
        }
        this._jobMonitorObject.old = this._jobMonitorObject.new;
        if ( object.reportCount > this._jobMonitorMaxReports ) {
           this._cancelReplyTimeout('progress');
        }
      }.bind(this)
    );
  }

  _setReplyTimeout (id, timeoutInMS, callback) {
    this._scheduledReplyTimeout.push({id: id, handle: setTimeout(callback, timeoutInMS)});
  }

  _cancelReplyTimeout (id) {
    for ( var idx = 0 ; idx < this._scheduledReplyTimeout.length ; ++idx ) {
      if ( id === this._scheduledReplyTimeout[idx].id ) {
        clearTimeout(this._scheduledReplyTimeout[idx].handle);
        this._scheduledReplyTimeout.splice(idx, 1);
        break
      }
    }
  }

  _setReplyInterval (id, intervalInMS, callback) {
    var object = {id: id, handle: undefined, timepoint: new Date().getTime(), reportCount: 1};
    object.handle = setInterval(function() {
          callback(object);
      }.bind(this)
    ,intervalInMS);
    this._scheduledReplyTimeout.push(object);
  }

  _cancelAllTimers () {
    this._cancelReplyTimeout('submit');
    this._cancelReplyTimeout('subscribe');
    this._cancelReplyTimeout('progress');
  }
}
