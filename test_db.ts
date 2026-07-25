import 'dotenv/config';
import { ListingRepository } from './src/backend/repositories/listing.repository';

async function test() {
  try {
    await ListingRepository.findAll({});
    console.log("Success");
  } catch (err) {
    console.error("Caught error:");
    console.error(err);
  }
}

test();
