import  _  from 'lodash';

export function youtubeParser(url){
    // eslint-disable-next-line no-useless-escape
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length===11)? match[1] : '';
};

export function getSeasonsList() {
  let seasons=[];
  seasons.push({ key: 1, text: 'Jar', value: 1 });
  seasons.push({ key: 2, text: 'Leto', value: 2 }); 
  seasons.push({ key: 3, text: 'Jeseň', value: 3 }); 
  seasons.push({ key: 4, text: 'Zima', value: 4 });   
  return seasons;
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

      if(result.user){
        return result.user;
      } else{
        return null;
      }
    }catch(err){
      console.log(err.message);
    }
  };

  export async function createTag(selectedTag){
    let reqOption=getRequestOptions('GET');

    var customTags=selectedTag.filter(x=>x.customOption);
    _.forEach(customTags, async(obj)=>{
        debugger;

        const resp = await fetch("/api/tags/byname/"+obj.label, reqOption);
        let tag = await resp.json();

        if(tag === null) {
            const newTag = {name: obj.label};

            const newTagRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('rcp_token') },
                body: JSON.stringify(newTag)
            };

            fetch('/api/tags', newTagRequestOptions)
                .then(resp=>resp.json())
                .then((err)=>{
                })
                .catch(err=>{
                    debugger;
                });
        }
    });
  };

export function parseTags(tags){
    debugger;
    if(tags==null)return [];

    let splittedTags = tags.split(';');
    let recipeTags = [];
    _.forEach(splittedTags, (obj)=>{
      recipeTags.push({label:obj});
    });

    return recipeTags;
};