interface HubSpotFormData {
	email: string;
	firstname?: string;
	lastname?: string;
	company?: string;
	numemployees?: string;
	message?: string;
	plan_type?: string;
	scanopy_urgency?: string;
	network_count?: string;
	lifecyclestage?: 'subscriber' | 'lead';
	[key: string]: string | undefined;
}

interface HubSpotContext {
	pageUri: string;
	pageName: string;
	hutk?: string;
}

export async function submitToHubSpot(
	portalId: string,
	formGuid: string,
	data: HubSpotFormData,
	context?: HubSpotContext
): Promise<boolean> {
	const fields = Object.entries(data)
		.filter(([, value]) => value !== undefined && value !== '')
		.map(([name, value]) => ({ name, value }));

	const response = await fetch(
		`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				fields,
				...(context && { context })
			})
		}
	);

	return response.ok;
}
