import _ from 'lodash';
import {Buffer} from 'buffer';

export function youtubeParser(url){
    // eslint-disable-next-line no-useless-escape
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length===11)? match[1] : '';
}

export function getSeasonsList() {
  let seasons=[];
  seasons.push({ key: 1, text: 'Jar', value: 1 });
  seasons.push({ key: 2, text: 'Leto', value: 2 }); 
  seasons.push({ key: 3, text: 'Jeseň', value: 3 }); 
  seasons.push({ key: 4, text: 'Zima', value: 4 });   
  return seasons;
}

export function getImageUrl(img){

    if(!img)return;
    
    debugger;
    if( typeof(img.data)=='object') {
      var arr= Buffer.from(img.data);
      let image = new Blob([arr], { type: img.contentType });
      let url = URL.createObjectURL(image);
  
      return url;
    } else {
    var binary_string = window.atob(img.data);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    var imgArrByte= Uint8Array.from(Buffer.from(bytes.buffer));
    
    // var imgArrByte= Uint8Array.from(Buffer.from(img.data))

    let image = new Blob([imgArrByte], { type: img.contentType });
    let url = URL.createObjectURL(image);

    return url;
  }
}

export function getImageBase64(img){
    if(!img) return null;

    let buff = new Buffer.from(img.data);
    let base64=buff.toString('base64');
    return base64;
}

export function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result);
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
  }

  export async function createTags(selectedTag){

    let tags=[];
    var customTags = selectedTag.filter(x=>x.customOption);
    var existingTags = selectedTag.filter(x=>!x.customOption);

    existingTags.forEach(obj=>{
      tags.push({id:obj.key, name:obj.label});
    });

    await Promise.all(customTags.map(async (obj)=>{
      try{
        const newTag = {name: obj.label};

        const newTagRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('rcp_token') },
            body: JSON.stringify(newTag)
        };

        const resp=await fetch('/api/tags', newTagRequestOptions);
        let createdTag=await resp.json();

        tags.push({id:createdTag, name:obj.label});
      } catch (error) {
        console.log('error'+ error);
      }
    }));

    return tags;
  }

export function parseTags(tags){
    if(tags==null||tags==="")return null;

    var parsedTags = JSON.parse(tags);

     let recipeTags = [];
    _.forEach(parsedTags, (obj)=>{
      recipeTags.push({key:obj.id, label:obj.name});
    });

    return recipeTags;
}