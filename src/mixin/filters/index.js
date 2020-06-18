/*
mixin下filters模块
*/


export default {
    formatByte(value) {
        const size = value;
        if (size != null) {
            if (size < 1024) {
                return `${parseInt((size / 1024))}KB`;
            } else if (size > 1024 && size < 1024 * 1024) {
                return `${((size / 1024)).toFixed(2)}KB`;
            } else if (size > 1024 * 1024 && size < 1024 * 1024 * 1024) {
                return `${(size / (1024 * 1024)).toFixed(2)}MB`;
            } else {
                return `${(size / (1024 * 1024 * 1024)).toFixed(2)}GB`;
            } 
        } else {
            return null;
        }
    }
};
