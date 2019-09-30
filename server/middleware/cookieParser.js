const parseCookies = (req, res, next) => {
  const cookiesObj = {};
  if (req.headers.cookie) {
    // Split incoming cookies
    const cookiesString = req.headers.cookie;
    const cookiesArr = cookiesString.split('; ');
    // Loop through cookies array to build cookies Obj
    for (let i = 0; i < cookiesArr.length; i++) {
      const splitCookie = cookiesArr[i].split('=');
      cookiesObj[splitCookie[0]] = splitCookie[1];
    }
    req.cookies = cookiesObj;
  }
  if (req.cookies === undefined) {
    req.cookies = cookiesObj;
  }
  next();
};

module.exports = parseCookies;