import React from "react";
import LarkContentEditable, {
  ContentEditableEvent,
} from "../Containers/LarkContentEditable";
import { updateCaretPos } from "./../../actions/index";
import { connect } from "react-redux";
import "./styles.css";

type InputRegionProps = {
  // Variables
  html: string;
  input_region_tag_style: string;
  // Callback functions
  handleChange: (event: ContentEditableEvent) => void;
  handleKeyPresses: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleFocus: (event: React.FocusEvent<HTMLDivElement>) => void;
  updateCaretPos: (arg1: number) => void;
};

type InputRegionState = {
  html: string;
  should_focus: boolean;
  caret_pos_before_rerender: number;
};

function getCaretCharacterOffsetWithin(element: HTMLElement | null) {
  var caretOffset = 0;
  var doc: Document | null = element.ownerDocument || element.document;
  var win: Window = doc?.defaultView || doc?.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

function replaceCaret(el: HTMLElement | null) {
  // Place the caret at the end of the element
  const target = document.createTextNode("");

  el?.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    var sel = window.getSelection();
    if (sel !== null) {
      var range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
}

function moveCaretTo(el: HTMLElement | null, new_pos: number) {
  // Place the caret at new_pos
  const target = document.createTextNode("");

  el?.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    var sel = window.getSelection();
    if (sel !== null) {
      if (sel.rangeCount > 0) {
        var textNode = sel.focusNode;
        var newOffset = sel.focusOffset + new_pos;
        sel.collapse(
          textNode,
          Math.min(String(textNode?.textContent).length, newOffset)
        );
      }
    }
    if (el instanceof HTMLElement) el.focus();
  }
}

class InputRegion extends React.Component<InputRegionProps, InputRegionState> {
  inputRegionReftest: React.RefObject<HTMLElement>;

  constructor(props: InputRegionProps) {
    super(props);
    this.inputRegionReftest = React.createRef();
    this.state = {
      html: "",
      // By default on program load input region doesn't have focus
      should_focus: true,
      caret_pos_before_rerender: 0,
    };
  }

  /*     updateCaretPos = () => {
          this.setState({
              caret_pos: getCaretCharacterOffsetWithin(this.inputRegionReftest?.current)
          })
      } */
  focus = () => {
    // Helper function to set focus
    console.log("Input region focus Function call");
    if (this.state.should_focus == true)
      this.inputRegionReftest.current?.focus();
  };

  cursorToEnd = () => {
    replaceCaret(this.inputRegionReftest.current);
  };

  allowFocus = () => {
    this.setState({
      should_focus: true,
    });
  };

  preventFocus = () => {
    this.setState({
      should_focus: false,
    });
  };

  componentWillReceiveProps(newProps: InputRegionProps) {
    if (newProps.input_region_tag_style != this.props.input_region_tag_style) {
      var new_caret_pos: number = getCaretCharacterOffsetWithin(
        this.inputRegionReftest.current
      );
      console.log("CARET POS", new_caret_pos);
      if (this.state.caret_pos_before_rerender != new_caret_pos) {
        this.setState({
          caret_pos_before_rerender: new_caret_pos,
        });
      }
    }
  }

  componentDidUpdate(oldProps: InputRegionProps) {
    //console.log("Input region UPDATE old(", oldProps, ") new(", this.props, ")")
    // Focus gets lost when tag style changes causing a rerender, so we need to explicitly
    // Set focus when this happens and move the cursor to the end
    var new_caret_pos: number = getCaretCharacterOffsetWithin(
      this.inputRegionReftest.current
    );

    this.props.updateCaretPos(new_caret_pos);
    if (oldProps.input_region_tag_style != this.props.input_region_tag_style) {
      this.focus();

      moveCaretTo(
        this.inputRegionReftest.current,
        this.state.caret_pos_before_rerender
      );
    }
  }

  render() {
    return (
      <LarkContentEditable
        innerRef={this.inputRegionReftest}
        html={this.props.html} // innerHTML of the editable div
        disabled={false} // use true to disable editing
        onChange={this.props.handleChange} // handle innerHTML change
        onKeyDown={this.props.handleKeyPresses} // handle Key Presses
        tagName={this.props.input_region_tag_style} // Use a custom HTML tag (uses a div by default)
        placeholder="type something"
        onFocus={this.props.handleFocus}
      />
    );
  }
}

const mapDispatchToProps = (dispatch: (arg1: any) => void) => {
  return {
    updateCaretPos: (new_pos: Number) => dispatch(updateCaretPos(new_pos)),
  };
};

export default connect(null, mapDispatchToProps)(InputRegion);
