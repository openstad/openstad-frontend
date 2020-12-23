module.exports = function (text) {
  if(!text || !text.valueOf() === "string"){
    return false;
  }

  return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
    text.replace(/"(\\.|[^"\\])*"/g, ''))) &&
    eval('(' + text + ')');
}
