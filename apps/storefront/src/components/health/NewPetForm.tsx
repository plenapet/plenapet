"use client";

import { useState } from "react";
import { Button } from "@plenapet/ui";
import { breedsForSpecies, type PetSpecies } from "@plenapet/database";
import { createPetAction } from "@/lib/actions/pets";

export function NewPetForm() {
  const [species, setSpecies] = useState<PetSpecies>("perro");
  const [breed, setBreed] = useState("");
  const breeds = breedsForSpecies(species);

  return (
    <form
      action={createPetAction}
      className="mt-6 space-y-4 rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card"
    >
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Nombre
        </label>
        <input
          name="name"
          required
          className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
            Especie
          </label>
          <select
            name="species"
            value={species}
            onChange={(e) => {
              setSpecies(e.target.value as PetSpecies);
              setBreed("");
            }}
            className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          >
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
            Sexo
          </label>
          <select
            name="sex"
            className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          >
            <option value="">Sin especificar</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Raza
        </label>
        <select
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        >
          <option value="">Selecciona una raza</option>
          {breeds.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {breed === "Otra" ? (
          <input
            name="breed"
            placeholder="Escribe la raza"
            required
            className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
        ) : (
          <input type="hidden" name="breed" value={breed} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            name="birthDate"
            className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
            Peso (kg)
          </label>
          <input
            type="number"
            step="0.1"
            name="weightKg"
            className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gris-pizarra">
        <input type="checkbox" name="sterilized" className="rounded" />
        Está esterilizado/a
      </label>

      <Button type="submit" className="w-full">
        Guardar mascota
      </Button>
    </form>
  );
}
