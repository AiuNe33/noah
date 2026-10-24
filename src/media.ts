export type Photo = {src: string; alt: string; label: string};
const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;
export const media: Record<string, Photo[]> = {
 violin: [
 {src:asset('violin/violin-1.jpg'),alt:'Violin performance with a chamber ensemble on stage',label:'A shared rhythm'},
 {src:asset('violin/violin-2.png'),alt:'Violin accompanying a choir on stage',label:'Together, on stage'}],
 travel: [
 {src:asset('travel/travel-1.jpg'),alt:'Glass staircase and suspended sculpture beside a sea view',label:'A different perspective'},
 {src:asset('travel/travel-2.jpg'),alt:'A city at night beneath the moon',label:'After the city lights up'},
 {src:asset('travel/travel-3.jpg'),alt:'Tall illuminated bookshelves and escalators in a library',label:'Between the pages'},
 {src:asset('travel/travel-4.jpg'),alt:'Relaxing on a sandy beach beside turquoise water',label:'A little room to breathe'},
 {src:asset('travel/travel-5.jpg'),alt:'A street leading downhill toward the sea beneath a blue sky',label:'Following the sea breeze'}],
 nabi: [{src:asset('music/nabi-1.jpg'),alt:'Nabi playing cello with piano accompaniment',label:'Nabi'}],
 joker: [{src:asset('music/joker-xue-1.jpg'),alt:'A glowing light stick at a Joker Xue concert',label:'Joker Xue'}, {src:asset('music/joker-xue-2.jpg'),alt:'Joker Xue performing on a brightly lit stage',label:'Joker Xue'}]
};
