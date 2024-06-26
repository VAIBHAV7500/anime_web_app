import { detectAnyAdblocker, detectDomAdblocker, detectBraveShields, detectOperaAdblocker } from 'just-detect-adblock';

const createPromise = (tempFun) => {
  return new Promise((res,rej)=>{
    tempFun().then(result => res(result)).catch(err => rej(err));
  });
}

const checkAdBlocker = async () => {
  if(window.adBlocker){
    return true;
  }else{
    const promiseArray = [];
    promiseArray.push(createPromise(detectAnyAdblocker));
    promiseArray.push(createPromise(detectDomAdblocker));
    promiseArray.push(createPromise(detectBraveShields));
    promiseArray.push(createPromise(detectOperaAdblocker));
    const result = await Promise.all(promiseArray);
    return result.some(x => x === true);
  }
}


export default checkAdBlocker;
