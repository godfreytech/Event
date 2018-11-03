import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { selectDate, closePanel } from '../../store/actions/calendarActions';
import EventForm from './EventForm';
import ModalEventsList from './ModalEventsList';
import './Modal.scss';

class Modal extends Component {
  handleKeyPress = (e, fn) => {
    const code = e.keyCode ? e.keyCode : e.which;
    if (code === 13) {
      fn();
    }
  };
  trapFocus = () => {
    const firstElemId = document.getElementById('modal').firstChild.id;
    const panel = document.getElementById(firstElemId);
    const close = document.getElementById('close');
    panel.firstChild.addEventListener('keydown', function(e) {
      if ((e.keyCode === 9 || e.which === 9) && e.shiftKey) {
        close.focus();
        e.preventDefault();
      }
    });
    panel.lastChild.addEventListener('keydown', function(e) {
      if (e.keyCode === 9 || e.which === 9) {
        close.focus();
        e.preventDefault();
      }
    });
  };
  render() {
    const { mode, selectedDate, closePanel } = this.props;
    let displayDate = format(new Date(selectedDate), 'eeee, d MMMM');

    return (
      <div className="modal__wrapper">
        <dialog className="modal__window">
          <button
            className="modal__iconBtn modal__iconBtn--close"
            onClick={closePanel}
            title="Close"
            id="close"
          >
            <i className="modal__icon modal__icon material-icons">clear</i>
          </button>

          {selectedDate && <h4 className="modal__header">{displayDate}</h4>}
          <div className="modal__body" id="modal">
            {(mode === 'edit' || mode === 'add') && (
              <EventForm
                handleKeyPress={this.handleKeyPress}
                trapFocus={this.trapFocus}
              />
            )}
            {mode === 'view' && <ModalEventsList trapFocus={this.trapFocus} />}
          </div>
        </dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedDate: state.calendar.selectedDate,
  selectedEvent: state.calendar.selectedEvent,
  panelOpened: state.calendar.panelOpened,
  mode: state.calendar.mode,
  events: state.events.events
});

Modal.propTypes = {
  selectedDate: PropTypes.string,
  panelOpened: PropTypes.bool.isRequired,
  mode: PropTypes.string,
  events: PropTypes.array,
  selectDate: PropTypes.func.isRequired,
  closePanel: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { selectDate, closePanel }
)(Modal);
