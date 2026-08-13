export function convertToPalette(data) {

   for (let j = 0; j < data.length; j += 4) {
      if (data[j + 3] === 0) continue;

      const brightness = (data[j] + data[j + 1] + data[j + 2]) / 3;

      if (brightness < 64) {
         data[j] = 0;
         data[j + 1] = 0;
         data[j + 2] = 0;
         data[j + 3] = 255;
      } else if (brightness < 128) {
         data[j] = 85;
         data[j + 1] = 85;
         data[j + 2] = 85;
         data[j + 3] = 255;
      } else if (brightness < 192) {
         data[j] = 170;
         data[j + 1] = 170;
         data[j + 2] = 170;
         data[j + 3] = 255;
      } else {
         data[j + 3] = 0;
      }
   }
   return data
}
