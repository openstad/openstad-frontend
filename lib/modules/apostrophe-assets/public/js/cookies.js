function openstadSetCookie(name, value, days, path) {

  if ( typeof name != 'string' ) return;

  if ( typeof value == 'undefined' ) value = "";
  if ( typeof value == 'object' ) {
    try {
      value = JSON.stringify(value);
    } catch(err) {}
  };


  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "expires=" + date.toUTCString();
  }

  path = path ? "path= " + path : ""

  document.cookie = name + "=" + value + "; " + expires + "; " + path;

}

function openstadGetCookie(name) {

  var match = document.cookie.match(new RegExp("(?:^|;\\s*)\\s*" + name +"=([^;]+)\\s*(?:;|$)"));

  var value;
  if (match) {
    value = match[1];
  }

  try {
    value = JSON.parse(value);
  } catch(err) {}

  return value;

}

function openstadEraseCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
