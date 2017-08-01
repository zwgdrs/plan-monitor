/**
 * keyboardKey.js
 *
 * @Author: jruif
 * @Date: 2017/7/10 下午3:27
 */
import isType from './isType';

const codes = {
    // ----------------------------------------
    // By Code
    // ----------------------------------------
    3: 'Cancel',
    6: 'Help',
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    27: 'Escape',
    28: 'Convert',
    29: 'NonConvert',
    30: 'Accept',
    31: 'ModeChange',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    41: 'Select',
    42: 'Print',
    43: 'Execute',
    44: 'PrintScreen',
    45: 'Insert',
    46: 'Delete',
    48: ['0', ')'],
    49: ['1', '!'],
    50: ['2', '@'],
    51: ['3', '#'],
    52: ['4', '$'],
    53: ['5', '%'],
    54: ['6', '^'],
    55: ['7', '&'],
    56: ['8', '*'],
    57: ['9', '('],
    91: 'OS',
    93: 'ContextMenu',
    144: 'NumLock',
    145: 'ScrollLock',
    181: 'VolumeMute',
    182: 'VolumeDown',
    183: 'VolumeUp',
    186: [';', ':'],
    187: ['=', '+'],
    188: [',', '<'],
    189: ['-', '_'],
    190: ['.', '>'],
    191: ['/', '?'],
    192: ['`', '~'],
    219: ['[', '{'],
    220: ['\\', '|'],
    221: [']', '}'],
    222: ["'", '"'],
    224: 'Meta',
    225: 'AltGraph',
    246: 'Attn',
    247: 'CrSel',
    248: 'ExSel',
    249: 'EraseEof',
    250: 'Play',
    251: 'ZoomOut',
};

const keyboardKey = {
    codes,
    name: {
        Cancel: 3,
        Help: 6,
        Backspace: 8,
        Tab: 9,
        Clear: 12,
        Enter: 13,
        Shift: 16,
        Control: 17,
        Alt: 18,
        Pause: 19,
        CapsLock: 20,
        Escape: 27,
        Convert: 28,
        NonConvert: 29,
        Accept: 30,
        ModeChange: 31,
        ' ': 32,
        PageUp: 33,
        PageDown: 34,
        End: 35,
        Home: 36,
        ArrowLeft: 37,
        ArrowUp: 38,
        ArrowRight: 39,
        ArrowDown: 40,
        Select: 41,
        Print: 42,
        Execute: 43,
        PrintScreen: 44,
        Insert: 45,
        Delete: 46,
        // todo
    },

    getCode(name) {
        if (isType.isObject(name)) {
            return name.keyCode || name.which || this[name.key];
        }
        // todo: 键值反转
        return this.name[name];
    },

    getName(code) {
        const isEvent = isType.isObject(code);
        let name = codes[isEvent ? code.keyCode || code.which : code];

        if (Array.isArray(name)) {
            if (isEvent) {
                name = name[code.shiftKey ? 1 : 0]
            } else {
                name = name[0]
            }
        }

        return name;
    },
};

export default keyboardKey;
