<script>
import jsonData from "../../../db.json";

export function useData() {
  try {
    const data = jsonData;
    const atmosphere = data.atmosphere;
    const colonyAllegiance = data.colonyAllegiance;
    const colonyFactions = data.colonyFactions;
    const colonyMission = data.colonyMission;
    const colonySize = data.colonySize;
    const geosphere = data.geosphere;
    const icePlanetTerrain = data.icePlanetTerrain;
    const numberOfFactions = data.numberOfFactions;
    const orbit = data.orbit;
    const planetSize = data.planetSize;
    const planetaryTerrain = data.planetaryTerrain;
    const scenarioHooks = data.scenarioHooks;
    const temperature = data.temperature;
    return {
      data,
      atmosphere,
      colonyAllegiance,
      colonyFactions,
      colonyMission,
      colonySize,
      geosphere,
      icePlanetTerrain,
      numberOfFactions,
      orbit,
      planetSize,
      planetaryTerrain,
      scenarioHooks,
      temperature,
    };
  } catch {
    console.error("Error fetching data");
  }
}
</script>
