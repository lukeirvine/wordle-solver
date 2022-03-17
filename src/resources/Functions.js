export const copyStringToClipboard = str => {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}

/*
    function: toMili 
    ================================================
    str: should be time of format "hh:mm"
    return: int of the time converted to miliseconds
*/
export const toMili = str => {
    var hours = parseInt(str.replace(/(\d+):(\d+)/g, '$1'));
    var minutes = parseInt(str.replace(/(\d+):(\d+)/g, '$2'));
    return (hours * 60 + minutes) * 60 * 1000;
}

export const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}