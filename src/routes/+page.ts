import { getSoftwareApplicationSchema } from '$lib/schemas';

export async function load() {
	const softwareApplicationSchema = await getSoftwareApplicationSchema();
	return { softwareApplicationSchema };
}
