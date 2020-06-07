import React from 'react';
import LarkContentEditable, { ContentEditableEvent } from '../Containers/LarkContentEditable'
import { connect } from 'react-redux';
import InputRegion from './InputRegion'

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import "./styles.css"

// (input_variable: input_variable_type): return type
function isBlockElement(input_text: string | null): [boolean, string, string] {
    // Checks to see if text is a supported block element type

    var is_block_element: boolean = false
    // possible values of block_element_html_tag_style are 'h1', 'div'. etc
    var block_element_id: string = "";
    var block_element_html_tag_style: string = ""
    var text: string = "";

    if (typeof (input_text) != null)
        text = input_text;

    // Object literals equivalent to hash tables
    // Checks to see if text exists in object literals

    var supported_block_element_types: { [key: string]: string } = {
        "#": "h1",
    };


    block_element_html_tag_style = supported_block_element_types[text];
    console.log("isBlockElementFunct input -> ", text)
    //console.log("Test 1", block_element_html_tag_style)

    // block_element_type will be undefined if our input text isn't present in supported_block_element_types
    if (block_element_html_tag_style === undefined) {
        block_element_html_tag_style = "";
        // Check if input_text could be a subheader e.g. "##" or "###" etc
        // Note: only headers up to h6 are supported in html
        if (text.length <= 6) {
            var equiv_subheading_text: string = "#".repeat(text.length);
            //console.log("Test 2", equiv_subheading_text);

            // At this point is equiv_subheading_text is a string with the character '#' repeated based on 
            // the size of input_text (text = input_text at this point)
            if (text == equiv_subheading_text && equiv_subheading_text.length > 0) {
                is_block_element = true;
                block_element_id = "#".repeat(text.length);
                block_element_html_tag_style = "h" + (text.length).toString();

                //console.log("Test 3", block_element_html_tag_style);
                //console.log("Test 4 ", (text.length).toString())
            }
        }
    }
    else {
        is_block_element = true;
        // temporary hard code
        block_element_id = "#"
    }

    /*     if (text in supported_block_element_types) {
            is_block_element = true;
        } */

    // Return tuple 
    console.log("Block element ->", [is_block_element, block_element_html_tag_style]);
    return [is_block_element, block_element_id, block_element_html_tag_style];
}

var testdebug = 1;
type LarkInputLineProps = {
    position: Number
};
type LarkInputLineState = {
    // Variables
    block_element_id_visible: boolean,
    input_region_visible: boolean,
    is_block_element: boolean,
    block_element_id: string,
    input_region_text: string,
    input_region_html: string,
    // Depends on value of block_element_id (e.g. if block_element_id is '#' then input_tag_style will be 'h1' - Header 1)
    // ^^ Based on markdown syntax
    input_block_id_tag_style: string,
    input_region_tag_style: string,
};

class LarkInputLine extends React.Component<LarkInputLineProps, LarkInputLineState> {
    blockElementIDRef: React.RefObject<BlockElementID>;
    inputRegionRef: React.RefObject<InputRegion>;
    constructor(props: LarkInputLineProps) {
        super(props);
        // Initialize react references (needed to set focus for components)
        this.blockElementIDRef = React.createRef();
        this.inputRegionRef = React.createRef();

        this.state = {
            block_element_id_visible: true,
            input_region_visible: false,
            is_block_element: false,
            block_element_id: "",
            input_region_text: "",
            input_region_html: "",
            input_block_id_tag_style: "",
            input_region_tag_style: "",
        }
    }

    onBlockElIDRevealerClicked = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this.state.block_element_id_visible == false) {
            var revealed_text: string = "<span class='blockElementId'>" + this.state.block_element_id + "</span>" + this.state.input_region_text;
            console.log("REVEALED TEXT ", revealed_text);
            this.setState({
                block_element_id_visible: true,
                input_region_html: revealed_text,
            })
        }

    }


    handleBlockElementIDChange = (event: ContentEditableEvent) => {
    }

    handleBlockElementIDKeyPresses = (event: React.KeyboardEvent<HTMLElement>) => {
    }

    handleInputRegionFocus = (event: React.FocusEvent<HTMLDivElement>) => {
        // We don't want the block element id component to be visible whenever input 
        // region has focus
    }

    hasBlockElementIdentifier = (text: string) => {
        // Index position of ' ' character
        var space_index: number = 0;
        console.log("HAS BLOCK EL TEXT|", text, "|");
        // Checks to see if text has a block element identifier at the beginning

        for (let idx = 0; idx < text.length; idx++) {
            console.log("HAS BLK ID -> |", text[idx], "| idx(", idx, ")");
            // This less straightforward way of checking for whitespace is needed because
            // using text[idx] == " ", does not work in all cases. Possibly due to variability in whitespace because 
            // its a user input field.
            // Approach to check if current char is a space " " :
            // If current character is " " trim function will return "" (stripped whitespace version)
            // length of "" is 0
            if (text[idx].trim().length == 0) {
                console.log("SPACEEEE", text[idx].trim());
                space_index = idx;
                break;
            }
        }

        // At the moment we don't know for sure if text before first space is a block element identifier
        // Hence we're labelling it as potential
        var potential_block_element_id: string = text.substring(0, space_index);
        if (space_index == 0) {
            // There are no spaces in text, so all of it could potentially be a block element
            // identifier
            potential_block_element_id = text;
        }
        console.log("Has block element space index->", space_index);
        console.log("Has block element blk id->", text.substring(0, space_index));
        // We want to check if all the characters upto the first occurence of ' ' 
        // is a block element identifier
        return isBlockElement(potential_block_element_id);
    }

    handleInputRegionChange = (event: ContentEditableEvent) => {
        var curr_text: string = event.currentTarget.textContent;
        // If the text in our input region hasn't changed we don't need to do anything
        // the onChange event was probably called because of extraneous reasons like pressing shift etc.

        if (this.state.block_element_id_visible == true) {
            if (this.state.block_element_id + this.state.input_region_text != curr_text) {
                console.log("Curr text |", curr_text, "|");
                this.hasBlockElementIdentifier(curr_text);

                var [text_is_block, new_block_element_id, new_input_region_tag_style] = this.hasBlockElementIdentifier(curr_text);
                var input_region_raw_text: string = curr_text.substr(new_block_element_id.length, curr_text.length);
                var new_input_region_html: string = "";
                // Text in input region has a block element identifier
                if (text_is_block == true) {
                    new_input_region_html = "<span class='blockElementId'>" + new_block_element_id + "</span>" + input_region_raw_text;
                } else {
                    new_input_region_html = curr_text
                }

                this.setState({
                    is_block_element: text_is_block,
                    block_element_id: new_block_element_id,
                    input_region_text: input_region_raw_text,
                    input_region_html: new_input_region_html,
                    input_region_tag_style: new_input_region_tag_style,
                })
            }
        } else {
            console.log("INV |", curr_text, "|");
            this.setState({
                input_region_text: curr_text,
                input_region_html: curr_text,
            })
        }
    }

    handleInputRegionKeyPresses = (event: React.KeyboardEvent<HTMLDivElement>) => {

        if (this.state.block_element_id_visible == true) {
            if (this.state.is_block_element == true) {
                // If space bar pressed
                if (event.keyCode == 32) {
                    //event.preventDefault();
                    //this.inputRegionRef.current?.updateCaretPos();
                    this.setState({
                        block_element_id_visible: false,
                        input_region_html: this.state.input_region_text,
                    })
                }
            }
        } else {
            // Handle ctrl-a i.e. select all event.key == "a" also works (keycode 65)
            if (event.ctrlKey && event.key == "a") {
                console.log("SELECT ALL")
                var revealed_text: string = "<span class='blockElementId'>" + this.state.block_element_id + "</span>" + this.state.input_region_text;
                console.log("REVEALED TEXT ", revealed_text);
                this.setState({
                    block_element_id_visible: true,
                    input_region_html: revealed_text,
                })
            }
        }

        if (event.keyCode == 8) {
            console.log("POSITION HERE!!!!", this.props.position);
        }
    }

    render() {
        return (
            <Grid container direction="row" spacing={0} alignItems="center">
                <Grid item>
                    {/* Workaround to have an empty button */}
                    <Box onClick={this.onBlockElIDRevealerClicked} p={1}><h1></h1></Box>
                </Grid>
                <Grid item>
                    <InputRegion
                        ref={this.inputRegionRef}
                        html={this.state.input_region_html}
                        input_region_tag_style={this.state.input_region_tag_style}
                        handleChange={this.handleInputRegionChange}
                        handleKeyPresses={this.handleInputRegionKeyPresses}
                        handleFocus={this.handleInputRegionFocus} />

                </Grid>
            </Grid >
        );
    }
};

type LarkEditorProps = {};
type LarkEditorState = {};
class LarkEditor extends React.Component<LarkEditorProps, LarkEditorState> { };

const mapStateToProps = (state: any) => {
    return { position: state.currentCaretPos };
};

export default connect(mapStateToProps, null)(LarkInputLine);