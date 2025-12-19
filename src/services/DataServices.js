import axios from 'axios';

export default async function fetchLocalJson(db) {
    try {
      const response = await axios.get(db);
      console.log("Success");
      return response.data;
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      return null;
    }
}