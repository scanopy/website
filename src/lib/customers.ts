/**
 * Customer reference data.
 * Single source of truth for how a customer is named and described across the site.
 */

import customersData from '$lib/fixtures/customers.json';
import type { Customer } from '$lib/types';

export const customers = customersData as Customer[];

export function getCustomer(id: string): Customer | undefined {
	return customers.find((c) => c.id === id);
}

/**
 * The one-line description shown wherever a customer appears. The logo carries the name,
 * so the descriptor never repeats it.
 */
export function customerDescriptor(customer: Customer): string {
	return `${customer.sector} - ${customer.country}`;
}
