import generateData from "./utils/generateStaticData.js";
import { staticDataCM } from "../../src/validation/ws/staticData.js"

const staticData = generateData();
console.log(JSON.stringify(staticData))
