export function youtubeParser(url){
    // eslint-disable-next-line no-useless-escape
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length===11)? match[1] : '';
};

export function getImageUrl(img){
    if(!img) return null;
    
    var imgArrByte= Uint8Array.from(Buffer.from(img.data))
    let image = new Blob([imgArrByte], { type: img.contentType });
    let url = URL.createObjectURL(image);
    return url;
}

export function getImageBase64(img){
    if(!img) return null;

    let buff = new Buffer(img.data);
    let base64=buff.toString('base64');
    return base64;;
}

export function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export function textEllipsis(str, maxLength, { side = "end", ellipsis = "..." } = {}) {
    if (str.length > maxLength) {
      switch (side) {
        case "start":
          return ellipsis + str.slice(-(maxLength - ellipsis.length));
        case "end":
        default:
          return str.slice(0, maxLength - ellipsis.length) + ellipsis;
      }
    }
    return str;
  }