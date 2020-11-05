export default function GetLocation() {
  return new Promise((resolve, reject) => {
    
    if(navigator.geolocation) {
    
      function error() {
        reject('無法取得你的位置');
      }
    
      function success(position: any) {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        // console.log(position.coords.latitude, position.coords.longitude);
        resolve({
          lat, lng
        })
      }
    
      navigator.geolocation.getCurrentPosition(success, error);
    
    } else {
      reject('Sorry, 你的裝置不支援地理位置功能。')
    }
  })
}