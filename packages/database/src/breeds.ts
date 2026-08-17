/**
 * Catálogo de razas comunes para el formulario de registro de mascota — se
 * usa un select en vez de texto libre para evitar errores de escritura del
 * propietario. No es exhaustivo (hay cientos de razas reconocidas); cubre
 * las más comunes en Colombia/LatAm + "Otra" como salida para lo que falte.
 */

export const DOG_BREEDS: string[] = [
  "Mestizo/Criollo",
  "Beagle",
  "Bichón Frisé",
  "Border Collie",
  "Boxer",
  "Bulldog Francés",
  "Bulldog Inglés",
  "Caniche (Poodle)",
  "Chihuahua",
  "Cocker Spaniel",
  "Dálmata",
  "Dóberman",
  "Dogo Argentino",
  "Golden Retriever",
  "Gran Danés",
  "Husky Siberiano",
  "Jack Russell Terrier",
  "Labrador Retriever",
  "Pastor Alemán",
  "Pastor Belga",
  "Pekinés",
  "Pinscher Miniatura",
  "Pitbull",
  "Pug",
  "Rottweiler",
  "Salchicha (Dachshund)",
  "Schnauzer",
  "Shih Tzu",
  "Terrier",
  "Yorkshire Terrier",
  "Otra",
];

export const CAT_BREEDS: string[] = [
  "Mestizo/Criollo",
  "Angora",
  "Bengalí",
  "Bosque de Noruega",
  "British Shorthair",
  "Esfinge (Sphynx)",
  "Himalayo",
  "Maine Coon",
  "Persa",
  "Ragdoll",
  "Siamés",
  "Siberiano",
  "Otra",
];

export function breedsForSpecies(species: "perro" | "gato"): string[] {
  return species === "gato" ? CAT_BREEDS : DOG_BREEDS;
}
