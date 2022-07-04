import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std@0.145.0/io/bufio.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import * as _ from "https://raw.githubusercontent.com/lodash/lodash/es/lodash.js";

interface Planet {
  [key: string]: string;
}

async function loadPlanetsData() {
  const path = join(".", "kepler_exoplanets_nasa.csv");
  const result = await parse(await Deno.readTextFile(path), {
    comment: "#",
    skipFirstRow: true,
  });
  const planets = (result as Array<Planet>).filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);
    return planet["koi_disposition"] === "CONFIRMED" &&
      planetaryRadius > 0.5 &&
      planetaryRadius < 1.5 &&
      stellarMass > 0.78 &&
      stellarMass < 1.04 &&
      stellarRadius > 0.99 &&
      stellarRadius < 1.01;
  });
  return planets.map((planet) => {
    return _.pick(planet, [
        "koi_prad",
        "koi_smass",
        "koi_srad",
        "kepler_name"
    ])
  });
}

const newEarth = await loadPlanetsData();
for (const planet of newEarth){
    console.log(planet);
}
console.log(`${newEarth.length} habitable planets found!`);
