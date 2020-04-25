export function youtubeParser(url){
    // eslint-disable-next-line no-useless-escape
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length===11)? match[1] : false;
};

export function getImageUrl(img){
    if(!img) return null;
    
    var imgArrByte= Uint8Array.from(Buffer.from(img.data))
    let image = new Blob([imgArrByte], { type: img.contentType });
    let url = URL.createObjectURL(image);
    debugger;
    return url;
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