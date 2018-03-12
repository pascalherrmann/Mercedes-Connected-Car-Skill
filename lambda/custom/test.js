const str = "2,984 km";

console.log(str.indexOf(" "))
const distanceComma = str.substring(0, str.indexOf(" "));
const distanceString = distanceComma.replace(",","");
const distanceInt = parseInt(distanceString);
console.log(distanceInt)
