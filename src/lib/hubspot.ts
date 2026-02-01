interface HubSpotFormData {
	email: string;
	firstname?: string;
	lastname?: string;
	company?: string;
	numemployees?: string;
	message?: string;
	scanopy_inquiry_plan_type_for_company?: string;
	scanopy_inquiry_urgency_for_company?: string;
	network_count?: string;
	lifecyclestage?: 'subscriber' | 'lead';
	[key: string]: string | undefined;
}

interface HubSpotContext {
	pageUri: string;
	pageName: string;
	hutk?: string;
	formName?: string;
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
