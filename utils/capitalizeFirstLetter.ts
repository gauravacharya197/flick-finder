export const capitalizeFirstLetter = (text:string) =>{
    if(!text) return '';
    if(text.length<=2) return text.toUpperCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
}