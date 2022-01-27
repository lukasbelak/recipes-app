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

  export function getRequestOptions(method) {
    return {
      method: method,
      headers: { 'Authorization': localStorage.getItem('rcp_token') }
    };
}

  export async function getLoggedUser() {
    try{
      const userName=localStorage.getItem('rcp_userName');
      if(!userName) {
        return null;
      }

      const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': localStorage.getItem('rcp_token') }
      };

      const resp = await fetch('/api/users/byUserName/'+userName,requestOptions);
      let result=await resp.json();

debugger;

      if(result.user){
        return result.user;
      } else{
        return null;
      }
    }catch(err){
      console.log(err.message);
    }
  };